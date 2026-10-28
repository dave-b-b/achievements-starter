import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Learning } from '../src/components/learning';

describe('learning page with the published React SDK', () => {
  it('renders a signed-in learner using the server-backed provider', () => {
    const html = renderToString(
      createElement(Learning, {
        userId: '00000000-0000-4000-8000-000000000001',
        configured: true,
        authFailed: false,
      }),
    );
    expect(html).toContain('Define a small win');
    expect(html).toContain('Sign out');
    expect(html).not.toContain('Continue with GitHub');
  });

  it('keeps the lessons readable before sign-in', () => {
    const html = renderToString(
      createElement(Learning, { userId: null, configured: true, authFailed: false }),
    );
    expect(html).toContain('Define a small win');
    expect(html).toContain('Continue with GitHub');
    expect(html).not.toContain('Sign out');
  });
});
