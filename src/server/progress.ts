import {
  AchievementService,
  type AchievementRepository,
  type StoredAchievementState,
} from 'achievements-engine';
import type { Sql } from 'postgres';
import { courseAchievements } from '../achievements/course';
import { isLessonId } from '../course/lessons';
import { HttpError } from './http';

type Connection = Pick<Sql, 'unsafe'>;
function repository(connection: Connection, subject: string): AchievementRepository {
  const check = (id: string) => {
    if (id !== subject) throw new Error('Subject mismatch.');
  };
  return {
    async getState(id) {
      check(id);
      const [row] = await connection.unsafe<
        { state: StoredAchievementState; schema_version: number }[]
      >('select state, schema_version from public.achievement_states where user_id = $1', [id]);
      if (row && row.schema_version !== 1) throw new Error('Unsupported achievement-state schema.');
      return row?.state;
    },
    async saveState(id, state) {
      check(id);
      await connection.unsafe(
        'insert into public.achievement_states (user_id, state) values ($1, $2::text::jsonb) on conflict (user_id) do update set state = excluded.state, updated_at = now()',
        [id, JSON.stringify(state)],
      );
    },
    // The caller already owns the transaction and per-subject database lock.
    withTransaction: async (id, run) => {
      check(id);
      return run();
    },
  };
}
export async function readProgress(sql: Sql, subject: string) {
  return new AchievementService({
    achievements: courseAchievements,
    repository: repository(sql, subject),
  }).getSnapshot(subject);
}
export async function completeLesson(sql: Sql, subject: string, lessonId: unknown) {
  if (!isLessonId(lessonId)) throw new HttpError(400, 'Choose a known lesson.');
  return sql.begin(async (connection) => {
    await connection`insert into public.learners (user_id) values (${subject}) on conflict do nothing`;
    await connection`select user_id from public.learners where user_id = ${subject} for update`;
    await connection`insert into public.lesson_completions (user_id, lesson_id) values (${subject}, ${lessonId}) on conflict do nothing`;
    const rows = await connection<
      { lesson_id: string }[]
    >`select lesson_id from public.lesson_completions where user_id = ${subject} order by lesson_id`;
    const service = new AchievementService({
      achievements: courseAchievements,
      repository: repository(connection, subject),
    });
    return service.track(subject, {
      metrics: {
        lessonsCompleted: rows.length,
        firstLessonCompleted: rows.length >= 1,
        twoLessonsCompleted: rows.length >= 2,
        completedLessonIds: rows.map((row) => row.lesson_id),
        courseCompleted: rows.length === 3,
      },
    });
  });
}
