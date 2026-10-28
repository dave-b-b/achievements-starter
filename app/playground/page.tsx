import type { Metadata } from 'next';
import { Playground } from '@/src/components/playground';
export const metadata: Metadata = { title: 'Playground' };
export default function Page() {
  return (
    <div className="page">
      <div className="eyebrow">A LITTLE SPACE TO EXPERIMENT</div>
      <div className="page-heading">
        <h1>Make a moment your own.</h1>
        <p>Pick a starting point. Change a few things. Take the working code with you.</p>
      </div>
      <Playground />
    </div>
  );
}
