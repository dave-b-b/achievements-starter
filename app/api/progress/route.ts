import { requireUser } from '@/src/server/auth';
import { getDatabase } from '@/src/server/database';
import { failure, json } from '@/src/server/http';
import { readProgress } from '@/src/server/progress';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const user = await requireUser();
    return json(await readProgress(getDatabase(), user.id));
  } catch (error) {
    return failure(error);
  }
}
