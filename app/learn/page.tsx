import type { Metadata } from 'next';
import { authConfigured, currentUser } from '@/src/server/auth';
import { Learning } from '@/src/components/learning';
export const metadata: Metadata = { title: 'Learn by doing' };
export const dynamic = 'force-dynamic';
export default async function Page({ searchParams }: { searchParams: Promise<{ auth?: string }> }) {
  const user = await currentUser();
  const query = await searchParams;
  return (
    <div className="page">
      <div className="eyebrow">A SHORT COURSE. A GOOD BEGINNING.</div>
      <div className="page-heading">
        <h1>A little learning goes a long way.</h1>
        <p>Build an achievement loop in three small steps. About ten minutes, at your own pace.</p>
      </div>
      <Learning
        userId={user?.id || null}
        configured={authConfigured()}
        authFailed={query.auth === 'failed'}
      />
    </div>
  );
}
