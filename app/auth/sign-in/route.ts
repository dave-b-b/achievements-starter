import { NextResponse } from 'next/server';
import { authClient } from '@/src/server/auth';
import { appOrigin, requireSameOrigin } from '@/src/server/http';
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const client = await authClient();
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${appOrigin()}/auth/callback`, scopes: 'read:user' },
    });
    if (error || !data.url) throw new Error('Sign-in unavailable.');
    return NextResponse.redirect(data.url, 303);
  } catch {
    return NextResponse.redirect(new URL('/learn?auth=failed#account', appOrigin()), 303);
  }
}
