import { NextResponse } from 'next/server';
import { authClient } from '@/src/server/auth';
import { appOrigin } from '@/src/server/http';
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code');
  if (code) {
    try {
      const client = await authClient();
      const { error } = await client.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL('/learn', appOrigin()), 303);
    } catch {
      /* Display a safe retry message without provider error details. */
    }
  }
  return NextResponse.redirect(new URL('/learn?auth=failed#account', appOrigin()), 303);
}
