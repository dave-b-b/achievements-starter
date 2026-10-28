import { NextResponse } from 'next/server';
import { authClient } from '@/src/server/auth';
import { appOrigin, failure, requireSameOrigin } from '@/src/server/http';
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const client = await authClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
    return NextResponse.redirect(new URL('/learn', appOrigin()), 303);
  } catch (error) {
    return failure(error);
  }
}
