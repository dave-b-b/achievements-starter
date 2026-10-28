import Link from 'next/link';
import { ArrowRight, Code2, Gamepad2, Layers, MousePointer2 } from 'lucide-react';
import { HomeDemo } from '@/src/components/home-demo';

const nextSteps = [
  {
    href: '/playground',
    title: 'Make it your own',
    description: 'Change a rule, try a style, and copy the working code.',
    action: 'Open playground',
    icon: MousePointer2,
    color: 'purple',
  },
  {
    href: '/arcade',
    title: 'Play Starfall',
    description: 'Fly through three waves and earn five achievements.',
    action: 'Play the game',
    icon: Gamepad2,
    color: 'green',
  },
  {
    href: '/setup',
    title: 'Add it to your app',
    description: 'Start with a small example or use the complete starter.',
    action: 'Get started',
    icon: Code2,
    color: 'orange',
  },
];

export default function Home() {
  return (
    <div className="page overview-page">
      <section className="hero-grid" aria-labelledby="overview-title">
        <div className="hero-copy">
          <div className="eyebrow">START HERE · NO ACCOUNT NEEDED</div>
          <h1 id="overview-title">
            Small wins.
            <br />
            <span>Try one now.</span>
          </h1>
          <p className="lede">
            Click the demo to unlock your first achievement—with a badge, a notification, and a
            little confetti.
          </p>
          <a href="#next-steps" className="text-button overview-next">
            Then choose your next step <ArrowRight size={16} />
          </a>
        </div>
        <HomeDemo />
      </section>
      <section className="overview-paths" id="next-steps" aria-labelledby="next-steps-title">
        <div className="section-line">
          <h2 id="next-steps-title">Where next?</h2>
          <span className="subtle">Pick what interests you.</span>
        </div>
        <div className="next-step-grid">
          {nextSteps.map(({ href, title, description, action, icon: Icon, color }) => (
            <Link className="next-step-card" href={href} key={href}>
              <div className={`card-icon ${color}`} aria-hidden="true">
                <Icon size={22} />
              </div>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="card-link">
                  {action} <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <details className="overview-packages">
        <summary>Built with two open-source packages</summary>
        <div className="package-strip">
          <a href="https://www.npmjs.com/package/achievements-engine">
            <Layers size={17} /> achievements-engine <span>2.1.0</span>
          </a>
          <a href="https://www.npmjs.com/package/react-achievements">
            <Code2 size={17} /> react-achievements <span>6.0.0</span>
          </a>
        </div>
      </details>
    </div>
  );
}
