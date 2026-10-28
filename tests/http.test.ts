import { afterEach, describe, expect, it, vi } from 'vitest';
import { appOrigin, failure, HttpError, requireSameOrigin } from '../src/server/http';
import { createLearningClient } from '../src/achievements/client';
describe('request boundaries', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
  it('rejects cross-origin and missing-origin mutations', () => {
    vi.stubEnv('APP_ORIGIN', 'https://learn.example');
    expect(appOrigin()).toBe('https://learn.example');
    expect(() => requireSameOrigin(new Request('https://learn.example/api/complete'))).toThrow(
      HttpError,
    );
    expect(() =>
      requireSameOrigin(
        new Request('https://learn.example/api/complete', {
          headers: { origin: 'https://attacker.example' },
        }),
      ),
    ).toThrow(HttpError);
    expect(() =>
      requireSameOrigin(
        new Request('https://learn.example/api/complete', {
          headers: { origin: 'https://learn.example' },
        }),
      ),
    ).not.toThrow();
  });
  it('does not disclose database or provider errors', async () => {
    const response = failure(new Error('secret connection details'));
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain('secret');
    expect(response.headers.get('cache-control')).toContain('no-store');
  });
  it('client supports only lesson completion and never sends a subject ID', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ snapshot: {}, newlyUnlocked: [] }) });
    vi.stubGlobal('fetch', fetcher);
    const client = createLearningClient();
    await expect(client.track('lessonsCompleted', 99)).rejects.toThrow();
    await expect(client.increment('lessonsCompleted')).rejects.toThrow();
    await expect(client.event('unknown', 'define')).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
    await client.event('lesson.completed', 'define');
    expect(fetcher.mock.calls[0][1].body).toBe('{"lessonId":"define"}');
  });
});

it('orders focus refreshes and mutations and recovers after a failed request', async () => {
  const resolvers: Array<(value: unknown) => void> = [];
  const fetcher = vi.fn(() => new Promise((resolve) => resolvers.push(resolve)));
  vi.stubGlobal('fetch', fetcher);
  try {
    const client = createLearningClient();
    const refresh = client.getSnapshot();
    const mutation = client.event('lesson.completed', 'define');
    const failed = refresh.catch(() => undefined);
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
    expect(fetcher.mock.calls[0]).toHaveLength(2);
    resolvers[0]({ ok: false, json: async () => ({ error: 'Temporary failure' }) });
    await failed;
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
    resolvers[1]({
      ok: true,
      json: async () => ({ snapshot: { unlockedCount: 1 }, newlyUnlocked: [] }),
    });
    expect((await mutation).snapshot.unlockedCount).toBe(1);
  } finally {
    vi.unstubAllGlobals();
  }
});
