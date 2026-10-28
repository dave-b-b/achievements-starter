'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Boxes,
  Code2,
  Gamepad2,
  GitFork as Github,
  Sparkles,
  Menu,
  Terminal,
  X,
} from 'lucide-react';
const navigationGroups = [
  { label: 'Start here', links: [{ href: '/', label: 'Overview', icon: Boxes }] },
  {
    label: 'Try it',
    links: [
      { href: '/playground', label: 'Playground', icon: Sparkles },
      { href: '/arcade', label: 'Play Starfall', icon: Gamepad2 },
      { href: '/learn', label: 'Short course', icon: BookOpen },
    ],
  },
  {
    label: 'Build with it',
    links: [
      { href: '/setup', label: 'Get started', icon: Terminal },
      { href: '/architecture', label: 'How it works', icon: Code2 },
    ],
  },
];
const links = navigationGroups.flatMap((group) => group.links);
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => setMenuOpen(false), [path]);
  const [expiredSignIn, setExpiredSignIn] = useState(false);
  useEffect(() => {
    setExpiredSignIn(
      new URLSearchParams(window.location.search).get('error_code') === 'bad_oauth_state',
    );
  }, [path]);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside
        className="sidebar"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            setMenuOpen(false);
            menuButton.current?.focus();
          }
        }}
      >
        <div className="sidebar-heading">
          <Link className="brand" href="/" aria-label="LearnQuest home">
            <span className="brand-mark">
              <Sparkles size={22} />
            </span>{' '}
            learnquest<span className="brand-dot">.</span>
          </Link>
          <button
            ref={menuButton}
            className="mobile-menu-button"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
        <nav id="main-navigation" aria-label="Main navigation" data-open={menuOpen}>
          {navigationGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              {group.links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={path === href ? 'nav-link active' : 'nav-link'}
                  aria-current={path === href ? 'page' : undefined}
                  onClick={() => {
                    setMenuOpen(false);
                    if (menuOpen) menuButton.current?.focus();
                  }}
                >
                  <Icon size={18} />
                  {label}
                  {path === href && <span className="nav-dot" />}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="open-source">
            <span className="status-dot" />
            Built in the open
          </div>
          <p>
            Small wins for your users.
            <br />A head start for your next app.
          </p>
          <a href="https://github.com/dave-b-b/achievements-starter" className="repo-link">
            <Github size={17} /> View source <ArrowUpRight size={14} />
          </a>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>
            THE ACHIEVEMENTS STARTER <span className="topbar-divider">/</span>{' '}
            <span className="topbar-page">
              {links.find((l) => l.href === path)?.label || 'LearnQuest'}
            </span>
          </span>
          <a className="topbar-source" href="https://github.com/dave-b-b/achievements-starter">
            <Github size={15} /> Open source <ArrowUpRight size={14} />
          </a>
        </header>
        <main id="main" tabIndex={-1}>
          {expiredSignIn && (
            <div className="expired-sign-in" role="alert">
              <p>
                Your sign-in link expired. Open the course to sign in again and load your saved
                progress. The playground and arcade work without an account.
              </p>
              <Link href="/learn#account">
                Open course <ArrowUpRight size={14} />
              </Link>
              <button onClick={() => setExpiredSignIn(false)} aria-label="Dismiss sign-in message">
                <X size={17} />
              </button>
            </div>
          )}
          {children}
        </main>
        <footer className="footer">
          <span>
            Made for those little <span className="purple-text">“I did it.”</span> moments.
          </span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <a href="https://github.com/dave-b-b/achievements-starter/issues/new/choose">
              Feedback <ArrowUpRight size={12} />
            </a>
            <span>MIT licensed</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
