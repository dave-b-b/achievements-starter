import Link from 'next/link';
import { ArrowRight, Database, Layers, LayoutTemplate, ShieldCheck } from 'lucide-react';
export const metadata = { title: 'Under the hood' };
export default function Page() {
  return (
    <div className="page reading-page">
      <div className="eyebrow">THOUGHTFUL ON THE INSIDE, TOO</div>
      <div className="page-heading">
        <h1>Small packages. Clear boundaries.</h1>
        <p>A working example of the libraries, with the application decisions out in the open.</p>
      </div>
      <div className="architecture-cards">
        {[
          {
            icon: Layers,
            title: 'The engine',
            text: 'achievements-engine evaluates definitions and produces achievement state. It works in the browser and on the server.',
          },
          {
            icon: LayoutTemplate,
            title: 'The React layer',
            text: 'react-achievements turns that state into hooks, progress, and an achievement widget. This app uses the published package.',
          },
          {
            icon: Database,
            title: 'This application',
            text: 'Next.js owns lessons and routes. Supabase provides identity and Postgres. The database adapter lives here.',
          },
        ].map(({ icon: Icon, title, text }) => (
          <section className="panel" key={title}>
            <div className="card-icon purple">
              <Icon size={22} />
            </div>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </div>
      <article className="panel prose">
        <h2>One action. One consistent result.</h2>
        <ol className="flow-list">
          <li>
            <strong>Validate the request</strong>
            <p>
              The server verifies the signed-in user and known lesson ID. The browser never chooses
              who earns a reward.
            </p>
          </li>
          <li>
            <strong>Lock and record</strong>
            <p>
              A database transaction locks the learner row and records a unique lesson completion.
              Repeated requests count once.
            </p>
          </li>
          <li>
            <strong>Derive and evaluate</strong>
            <p>
              The server calculates the completion total and passes absolute metrics to the engine
              using a repository bound to that same transaction.
            </p>
          </li>
          <li>
            <strong>Commit, then display</strong>
            <p>
              Lesson completion and achievement state commit together. A failure rolls both back.
              The UI displays the committed snapshot.
            </p>
          </li>
        </ol>
        <div className="takeaway">
          <ShieldCheck size={22} />
          <p>
            Consistency comes from the database transaction. A retry may miss a celebration, but it
            cannot duplicate completed progress.
          </p>
        </div>
        <h2>A playground with its own sandbox</h2>
        <p>
          The preview runs locally in memory. Safe configuration controls produce real definitions
          and complete code exports. Resetting the preview never touches saved learning progress.
        </p>
        <a
          className="button button-secondary"
          href="https://github.com/dave-b-b/achievements-starter/blob/main/docs/architecture.md"
        >
          Read the technical architecture <ArrowRight size={15} />
        </a>
      </article>
      <div className="callout">
        <div>
          <strong>Take a closer look.</strong>
          <p>Every route, migration, and design decision is available in the source.</p>
        </div>
        <Link className="button button-primary" href="/setup">
          Start building <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
