import { requireUser } from '@/src/server/auth';
import { getDatabase } from '@/src/server/database';
import { failure, HttpError, json, requireSameOrigin } from '@/src/server/http';
import { completeLesson } from '@/src/server/progress';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const user = await requireUser();
    if (!request.headers.get('content-type')?.startsWith('application/json'))
      throw new HttpError(415, 'Send a JSON lesson completion.');
    const text = await request.text();
    if (text.length > 1024) throw new HttpError(413, 'The request is too large.');
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new HttpError(400, 'Send a valid lesson completion.');
    }
    if (
      !data ||
      typeof data !== 'object' ||
      Array.isArray(data) ||
      Object.keys(data).length !== 1 ||
      !('lessonId' in data)
    )
      throw new HttpError(400, 'Only a lesson ID is accepted.');
    return json(await completeLesson(getDatabase(), user.id, data.lessonId));
  } catch (error) {
    return failure(error);
  }
}
