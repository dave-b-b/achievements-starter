import type { Metadata } from 'next';
import { Arcade } from '@/src/components/arcade';
export const metadata: Metadata = { title: 'Starfall arcade' };
export default function Page() {
  return (
    <div className="page arcade-page">
      <div className="eyebrow">THE SDK, IN PLAY</div>
      <div className="page-heading">
        <h1>
          Starfall<span className="purple-text">.</span>
        </h1>
        <p>
          A little space shooter with a real achievement engine. Fly, dodge, and find your next
          small win.
        </p>
      </div>
      <Arcade />
    </div>
  );
}
