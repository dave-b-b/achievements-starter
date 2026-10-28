import 'server-only';
import postgres from 'postgres';
import { readFileSync } from 'node:fs';
let database: ReturnType<typeof postgres> | undefined;
export function getDatabase() {
  if (!process.env.DATABASE_URL) throw new Error('Database is not configured.');
  if (!database) {
    const host = new URL(process.env.DATABASE_URL).hostname;
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(host);
    const ca =
      process.env.DATABASE_CA_CERT ||
      (process.env.DATABASE_CA_FILE
        ? readFileSync(process.env.DATABASE_CA_FILE, 'utf8')
        : undefined);
    database = postgres(process.env.DATABASE_URL, {
      prepare: false,
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: local
        ? false
        : {
            rejectUnauthorized: true,
            ...(ca ? { ca } : {}),
          },
    });
  }
  return database;
}
