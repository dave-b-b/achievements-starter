export type MeasureEvent = 'playground_view' | 'first_unlock' | 'copy_code' | 'starter_open';
export function measure(event: MeasureEvent) {
  if (
    typeof window === 'undefined' ||
    navigator.doNotTrack === '1' ||
    process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'true'
  )
    return;
  try {
    const key = `learnquest:${event}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    void fetch('/api/measure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* Analytics must never block product behavior. */
  }
}
