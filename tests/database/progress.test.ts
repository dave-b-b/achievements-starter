import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import postgres from 'postgres';
import { randomUUID } from 'node:crypto';
import { completeLesson, readProgress } from '../../src/server/progress';
const url = process.env.DATABASE_TEST_URL;
if (!url || !new URL(url).pathname.includes('test'))
  throw new Error(
    'Set DATABASE_TEST_URL to an isolated database with test in its name. Never use production.',
  );
const first = postgres(url, { max: 5, prepare: false });
const second = postgres(url, { max: 5, prepare: false });
const users: string[] = [];
const user = () => {
  const id = randomUUID();
  users.push(id);
  return id;
};
beforeAll(async () => {
  await first`do $$ begin
    if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
    if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  end $$`;
});
afterAll(async () => {
  await first`delete from public.learners where user_id in ${first(users)}`;
  await Promise.all([first.end(), second.end()]);
});
describe('transactional progress in real Postgres', () => {
  it('isolates two users and persists across database clients', async () => {
    const a = user(),
      b = user();
    const result = await completeLesson(first, a, 'define');
    expect(result.snapshot.unlockedCount).toBe(1);
    expect((await readProgress(second, a)).metrics?.lessonsCompleted).toBe(1);
    expect((await readProgress(second, b)).unlockedCount).toBe(0);
  });
  it('concurrent duplicate completions count once across clients', async () => {
    const id = user();
    const results = await Promise.all(
      Array.from({ length: 12 }, (_, index) =>
        completeLesson(index % 2 ? first : second, id, 'define'),
      ),
    );
    expect(results.reduce((sum, result) => sum + result.newlyUnlocked.length, 0)).toBe(1);
    const snapshot = await readProgress(second, id);
    expect(snapshot.metrics?.lessonsCompleted).toBe(1);
    expect(snapshot.unlockedCount).toBe(1);
  });
  it('concurrent different lessons preserve every completion', async () => {
    const id = user();
    await Promise.all([
      completeLesson(first, id, 'define'),
      completeLesson(second, id, 'track'),
      completeLesson(first, id, 'render'),
    ]);
    const snapshot = await readProgress(second, id);
    expect(snapshot.metrics?.lessonsCompleted).toBe(3);
    expect(snapshot.unlockedCount).toBe(3);
    expect(snapshot.metrics?.completedLessonIds).toEqual(['define', 'render', 'track']);
  });
  it('rolls completion back if the achievement save fails, then permits retry', async () => {
    const id = user();
    await first`create or replace function public.test_reject_state() returns trigger language plpgsql as $$ begin if new.user_id::text = current_setting('learnquest.reject_user',true) then raise exception 'injected save failure'; end if; return new; end $$`;
    await first`create trigger test_reject_state before insert or update on public.achievement_states for each row execute function public.test_reject_state()`;
    const failing = postgres(url!, {
      max: 1,
      prepare: false,
      connection: { 'learnquest.reject_user': id },
    });
    try {
      await expect(completeLesson(failing, id, 'define')).rejects.toThrow('injected save failure');
      const rows = await second`select * from public.lesson_completions where user_id = ${id}`;
      expect(rows).toHaveLength(0);
      expect((await readProgress(second, id)).unlockedCount).toBe(0);
    } finally {
      await failing.end();
      await first`drop trigger test_reject_state on public.achievement_states`;
      await first`drop function public.test_reject_state()`;
    }
    expect((await completeLesson(second, id, 'define')).snapshot.unlockedCount).toBe(1);
  });
  it('retry after a committed but lost response does not repeat the unlock', async () => {
    const id = user();
    await completeLesson(first, id, 'define');
    const retry = await completeLesson(second, id, 'define');
    expect(retry.newlyUnlocked).toEqual([]);
    expect(retry.snapshot.unlockedCount).toBe(1);
    expect(retry.snapshot.metrics?.lessonsCompleted).toBe(1);
  });
  it('rejects unknown lessons before writing', async () => {
    const id = user();
    await expect(completeLesson(first, id, 'unknown')).rejects.toThrow('known lesson');
    expect(await first`select * from public.learners where user_id = ${id}`).toHaveLength(0);
  });
  for (const role of ['anon', 'authenticated'])
    it(`denies ${role} direct table reads and writes`, async () => {
      await expect(
        first.begin(async (tx) => {
          await tx.unsafe(`set local role ${role}`);
          await tx`select * from public.achievement_states`;
        }),
      ).rejects.toThrow(/permission denied/);
      await expect(
        first.begin(async (tx) => {
          await tx.unsafe(`set local role ${role}`);
          await tx`insert into public.learners (user_id) values (${randomUUID()})`;
        }),
      ).rejects.toThrow(/permission denied/);
    });
});
