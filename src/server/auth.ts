import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { HttpError } from './http';
export function authConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    process.env.DATABASE_URL,
  );
}
export async function authClient() {
  if (!authConfigured())
    throw new HttpError(
      503,
      'Saved progress is not configured yet. The playground and lessons are available without signing in.',
    );
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll(values) {
          // Server components are read-only; proxy and route handlers persist refresh cookies.
          try {
            values.forEach(({ name, value, options }) => jar.set(name, value, options));
          } catch {
            /* Read-only render. */
          }
        },
      },
    },
  );
}
export async function requireUser() {
  const client = await authClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new HttpError(401, 'Sign in to save your course progress.');
  return data.user;
}
export async function currentUser() {
  if (!authConfigured()) return null;
  try {
    return await requireUser();
  } catch {
    return null;
  }
}
