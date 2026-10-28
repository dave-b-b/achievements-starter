'use client';

import { useEffect, useMemo } from 'react';
import { useJoyride, type Step } from 'react-joyride';
import { Compass } from 'lucide-react';

type GuidedTourProps = { kind: 'playground'; onTry: () => void } | { kind: 'setup' };

export function GuidedTour(props: GuidedTourProps) {
  const kind = props.kind;
  const onTry = props.kind === 'playground' ? props.onTry : undefined;
  const steps = useMemo<Step[]>(
    () =>
      kind === 'playground'
        ? [
            {
              target: '[data-tour="presets"]',
              title: 'Start with a familiar moment',
              content:
                'Choose learning, onboarding, or tasks. Each preset is a working example you can change.',
            },
            {
              target: '[data-tour="preview-action"]',
              spotlightTarget: '[data-tour="preview"]',
              title: 'See a real achievement unlock',
              content: (
                <div className="tour-content">
                  <p>
                    Try the button below to simulate the activity needed for this achievement. Watch
                    the real preview change.
                  </p>
                  <button className="button button-primary" onClick={onTry}>
                    Preview an unlock
                  </button>
                </div>
              ),
            },
            {
              target: '[data-tour="customize"]',
              title: 'Give it your personality',
              content:
                'Change the name, symbol, rule, or style. The preview restarts so you can try the updated achievement from the beginning.',
            },
            {
              target: '[data-tour="copy"]',
              title: 'Take the working code with you',
              content:
                'Copy the complete builder-based example, then follow “Run this in your app” for installation. You can also open the runnable browser example below.',
            },
          ]
        : [
            {
              target: '[data-tour="minimal-setup"]',
              title: 'Get your first unlock quickly',
              content:
                'Start with the minimal example. Install the two packages and paste the complete code from the playground. No backend is needed for this first step.',
            },
            {
              target: '[data-tour="full-setup"]',
              title: 'Add saved progress when you need it',
              content:
                'Clone the full starter and follow the setup guide. It covers the database, GitHub sign-in, migrations, and verification in order.',
            },
            {
              target: '[data-tour="free-hosting"]',
              title: 'Put it online on the free plans',
              content:
                'Use Vercel Hobby for the personal demo and Supabase Free for accounts and progress. The deployment guide explains their limits and the exact settings.',
            },
          ],
    [kind, onTry],
  );

  const { controls, state, Tour } = useJoyride({
    steps,
    continuous: true,
    scrollToFirstStep: true,
    options: {
      skipBeacon: true,
      showProgress: true,
      buttons: ['back', 'skip', 'primary', 'close'],
      closeButtonAction: 'skip',
      dismissKeyAction: false,
      overlayClickAction: false,
      scrollDuration: 0,
      scrollOffset: 24,
      spotlightRadius: 10,
      primaryColor: '#7051bd',
      textColor: '#362b40',
      backgroundColor: '#ffffff',
      width: 'min(360px, calc(100vw - 32px))',
      zIndex: 2000,
    },
    locale: { skip: 'Skip tour', last: 'Got it', nextWithProgress: 'Next ({current} of {total})' },
    styles: {
      tooltip: { borderRadius: 14, boxShadow: '0 14px 50px #20132933' },
      tooltipTitle: { fontSize: 19, lineHeight: 1.35, textAlign: 'left' },
      tooltipContent: { fontSize: 13, lineHeight: 1.8, textAlign: 'left', padding: '14px 0' },
      buttonPrimary: { borderRadius: 7, fontSize: 12, padding: '10px 14px' },
      buttonSkip: { color: '#6d6076', fontSize: 11 },
      buttonBack: { color: '#6d6076', fontSize: 11 },
    },
  });

  useEffect(() => {
    if (state.status !== 'running') return;
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        controls.skip();
      }
    }
    document.addEventListener('keydown', escape, true);
    return () => document.removeEventListener('keydown', escape, true);
  }, [controls, state.status]);

  return (
    <div className="tour-invitation">
      <div>
        <Compass size={18} />
        <span>
          {kind === 'playground'
            ? 'A first unlock in four small steps.'
            : 'A clear path from preview to your own app.'}
        </span>
      </div>
      <button className="button button-secondary" onClick={() => controls.reset(true)}>
        <Compass size={15} />
        {kind === 'playground' ? 'Show me around' : 'Guide me through setup'}
      </button>
      {Tour}
    </div>
  );
}
