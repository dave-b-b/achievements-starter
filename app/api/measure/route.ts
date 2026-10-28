import { getDatabase } from '@/src/server/database';
import { HttpError, failure, requireSameOrigin } from '@/src/server/http';
const events = ['playground_view', 'first_unlock', 'copy_code', 'starter_open'];
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    if (
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'true' ||
      !process.env.DATABASE_URL ||
      request.headers.get('dnt') === '1'
    )
      return new Response(null, { status: 204 });
    const text = await request.text();
    if (text.length > 100) throw new HttpError(400, 'Unsupported event.');
    let value: unknown;
    try {
      value = JSON.parse(text);
    } catch {
      throw new HttpError(400, 'Unsupported event.');
    }
    if (
      !value ||
      typeof value !== 'object' ||
      Array.isArray(value) ||
      Object.keys(value).length !== 1 ||
      !('event' in value) ||
      typeof value.event !== 'string' ||
      !events.includes(value.event)
    )
      throw new HttpError(400, 'Unsupported event.');
    const sql = getDatabase();
    await sql`insert into public.daily_events (event) values (${value.event}) on conflict (day, event) do update set count = least(public.daily_events.count + 1, 100000)`;
    return new Response(null, { status: 204 });
  } catch (error) {
    return failure(error);
  }
}
