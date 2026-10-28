import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  Layers,
  Gamepad2,
  MousePointer2,
  Sparkles,
} from 'lucide-react';
import { HomeDemo } from '@/src/components/home-demo';
export default function Home() {
  return (
    <div className="page overview-page">
      <div className="eyebrow">
        <span className="tiny-spark">✦</span> A LITTLE ENCOURAGEMENT GOES A LONG WAY
      </div>
      <section className="hero-grid">
        <div className="hero-copy">
          <h1>
            Small wins.
            <br />
            <span>Lasting progress.</span>
          </h1>
          <p className="lede">
            Make the moments that matter feel like something.
            <br className="desktop-break" /> Explore achievements, celebrate progress, and bring
            <br className="desktop-break" /> a little momentum to your own app.
          </p>
          <div className="button-row">
            <Link href="/playground" className="button button-primary">
              Try the playground <ArrowRight size={17} />
            </Link>
            <Link href="/learn" className="button button-quiet">
              Take the short course <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="hero-note">
            <span className="status-dot" /> No account needed to explore{' '}
            <span className="note-divider">·</span> Open source, always
          </div>
        </div>
        <HomeDemo />
      </section>
      <div className="package-strip">
        <span>ONE EXPERIENCE. TWO SMALL PACKAGES.</span>
        <a href="https://www.npmjs.com/package/achievements-engine">
          <Layers size={17} /> achievements-engine <span>2.1.0</span>
        </a>
        <span className="strip-plus">+</span>
        <a href="https://www.npmjs.com/package/react-achievements">
          <Code2 size={17} /> react-achievements <span>6.0.0</span>
        </a>
      </div>
      <Link href="/arcade" className="arcade-promo">
        <div className="arcade-promo-symbol" aria-hidden="true">
          <Gamepad2 size={32} />
        </div>
        <div>
          <span className="eyebrow">NOW PLAYING · STARFALL</span>
          <h2>Real gameplay. Real achievements.</h2>
          <p>
            A space shooter with three waves, five badges, and a little confetti. No sign-in needed.
          </p>
        </div>
        <span className="button button-light">
          Play the arcade <ArrowRight size={17} />
        </span>
      </Link>
      <section className="journeys">
        <div className="section-line">
          <div>
            <div className="eyebrow">FROM “WHAT IF” TO “I BUILT THAT”</div>
            <h2>Find your next small win.</h2>
          </div>
          <span className="subtle">A few minutes is all it takes.</span>
        </div>
        <div className="journey-grid">
          <Link className="journey-card" href="/playground">
            <div className="card-icon purple">
              <MousePointer2 size={23} />
            </div>
            <span className="card-step">01 / EXPLORE</span>
            <h3>Make it your own</h3>
            <p>
              Change a rule, pick a style, and see a real achievement come to life. Then take the
              code with you.
            </p>
            <span className="card-link">
              Open the playground <ArrowRight size={16} />
            </span>
          </Link>
          <Link className="journey-card" href="/learn">
            <div className="card-icon green">
              <BookOpen size={23} />
            </div>
            <span className="card-step">02 / LEARN</span>
            <h3>Learn by doing</h3>
            <p>
              Three short lessons. Three little milestones. Discover how definitions, actions, and
              feedback fit together.
            </p>
            <span className="card-link">
              Start your first lesson <ArrowRight size={16} />
            </span>
          </Link>
          <Link className="journey-card" href="/setup">
            <div className="card-icon orange">
              <Code2 size={23} />
            </div>
            <span className="card-step">03 / BUILD</span>
            <h3>A head start, included</h3>
            <p>
              Take the complete starter: a thoughtful UI, saved progress, and a server that keeps
              achievements honest.
            </p>
            <span className="card-link">
              Build something good <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>
      <div className="bottom-note">
        <Sparkles size={18} />
        <p>
          Thoughtful feedback. Meaningful milestones.{' '}
          <strong>A little more “I can do this.”</strong>
        </p>
        <Link href="/architecture">
          See how it works <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
