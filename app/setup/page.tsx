import { GuidedTour } from '@/src/components/guided-tour';
import { ArrowUpRight, ExternalLink, GitFork as Github, Terminal } from 'lucide-react';
export const metadata = { title: 'Use the starter' };
export default function Page() {
  return (
    <div className="page reading-page">
      <div className="eyebrow">YOUR NEXT SMALL WIN STARTS HERE</div>
      <div className="page-heading">
        <h1>Good things start small.</h1>
        <p>Try the minimal integration first. Take the complete app when you’re ready.</p>
      </div>
      <GuidedTour kind="setup" />
      <div className="setup-grid">
        <section className="panel prose" data-tour="minimal-setup">
          <div className="card-icon purple">
            <Terminal size={22} />
          </div>
          <h2>Just the achievements</h2>
          <p>A tiny React example. No database, no account, and no backend setup.</p>
          <pre tabIndex={0}>
            <code>npm install react-achievements@6.0.0 achievements-engine@2.1.0</code>
          </pre>
          <p>Copy the complete App.tsx from the playground, or open the minimal example.</p>
          <a
            className="button button-primary"
            href="https://stackblitz.com/github/dave-b-b/achievements-starter/tree/main/examples/minimal"
          >
            Open browser example <ExternalLink size={15} />
          </a>
        </section>
        <section className="panel prose" data-tour="full-setup">
          <div className="card-icon green">
            <Github size={22} />
          </div>
          <h2>The whole experience</h2>
          <p>Next.js, sign-in, Postgres, persisted progress, and the playground you’re using.</p>
          <pre tabIndex={0}>
            <code>
              {
                'git clone https://github.com/dave-b-b/achievements-starter.git\ncd achievements-starter\nnpm ci\nnpm run dev'
              }
            </code>
          </pre>
          <p>
            The public experience runs immediately. Connect Supabase when you want saved course
            progress.
          </p>
          <a
            className="button button-secondary"
            href="https://github.com/dave-b-b/achievements-starter/blob/main/docs/setup.md"
          >
            Full setup guide <ArrowUpRight size={15} />
          </a>
        </section>
      </div>
      <section className="panel prose" data-tour="free-hosting">
        <h2>A free place to start</h2>
        <p>
          The deployment target is Vercel Hobby for this personal demo and Supabase Free for
          authentication and Postgres. The app uses included provider URLs and no paid add-ons. Stay
          on the free plans: limits can pause features or require you to wait; an upgrade is a
          separate decision.
        </p>
        <p>
          Supabase Free may pause inactive projects after a week. The browser-only playground
          remains available independently of saved progress.
        </p>
        <a href="https://github.com/dave-b-b/achievements-starter/blob/main/docs/deployment.md">
          Read the free deployment guide <ArrowUpRight size={14} />
        </a>
      </section>
    </div>
  );
}
