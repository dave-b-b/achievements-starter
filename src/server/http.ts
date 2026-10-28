export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function appOrigin(): string {
  return new URL(process.env.APP_ORIGIN || 'http://127.0.0.1:3417').origin;
}
export function requireSameOrigin(request: Request) {
  if (request.headers.get('origin') !== appOrigin())
    throw new HttpError(403, 'Please submit this action from LearnQuest.');
}
export function failure(error: unknown): Response {
  const known = error instanceof HttpError;
  return Response.json(
    {
      error: known
        ? error.message
        : 'Progress could not be saved. Please retry; completed lessons will count only once.',
    },
    {
      status: known ? error.status : 503,
      headers: { 'Cache-Control': 'private, no-store' },
    },
  );
}
export function json(value: unknown): Response {
  return Response.json(value, { headers: { 'Cache-Control': 'private, no-store' } });
}
