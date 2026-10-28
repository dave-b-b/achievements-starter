import type {
  AchievementClient,
  AchievementMutationResult,
  AchievementApiSnapshot,
} from 'achievements-engine';
async function response<T>(url: string, init?: RequestInit): Promise<T> {
  const result = await fetch(url, { ...init, cache: 'no-store', credentials: 'same-origin' });
  const value = await result.json();
  if (!result.ok)
    throw new Error(
      typeof value.error === 'string' ? value.error : 'Unable to load saved progress.',
    );
  return value as T;
}
export function createLearningClient(): AchievementClient {
  // Focus refreshes and mutations share one queue so an older response cannot replace newer state.
  let tail: Promise<unknown> = Promise.resolve();
  function queued<T>(run: () => Promise<T>): Promise<T> {
    const next = tail.then(run, run);
    tail = next.catch(() => undefined);
    return next;
  }
  const unsupported = async (): Promise<never> => {
    throw new Error('Course progress accepts lesson completion only.');
  };
  return {
    getSnapshot: () => queued(() => response<AchievementApiSnapshot>('/api/progress')),
    track: unsupported,
    trackMany: unsupported,
    increment: unsupported,
    async event(name, payload) {
      if (name !== 'lesson.completed' || typeof payload !== 'string') return unsupported();
      return queued(() =>
        response<AchievementMutationResult>('/api/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId: payload }),
        }),
      );
    },
  };
}
