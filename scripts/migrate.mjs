import postgres from 'postgres';
import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const url = process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL;
if (!url) throw new Error('Set MIGRATION_DATABASE_URL or DATABASE_URL in your environment.');
const local = ['localhost', '127.0.0.1', '[::1]'].includes(new URL(url).hostname);
const ca = process.env.DATABASE_CA_FILE
  ? await readFile(process.env.DATABASE_CA_FILE, 'utf8')
  : undefined;
const sql = postgres(url, {
  max: 1,
  prepare: false,
  ssl: local ? false : { rejectUnauthorized: true, ...(ca ? { ca } : {}) },
});
try {
  await sql.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(72610828)`;
    await tx`create table if not exists public.learnquest_migrations (name text primary key, sha256 text not null, applied_at timestamptz not null default now())`;
    await tx`revoke all on public.learnquest_migrations from public`;
    for (const name of (await readdir('supabase/migrations'))
      .filter((name) => name.endsWith('.sql'))
      .sort()) {
      const text = await readFile(`supabase/migrations/${name}`, 'utf8');
      const digest = createHash('sha256').update(text).digest('hex');
      const [applied] =
        await tx`select sha256 from public.learnquest_migrations where name = ${name}`;
      if (applied && applied.sha256 !== digest)
        throw new Error('An applied migration changed. Add a new migration instead.');
      if (!applied) {
        await tx.unsafe(text);
        await tx`insert into public.learnquest_migrations (name, sha256) values (${name}, ${digest})`;
        console.log(`Applied ${name}`);
      }
    }
  });
  console.log('Database migrations are current.');
} finally {
  await sql.end();
}
