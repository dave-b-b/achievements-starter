'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AchievementProvider,
  AchievementsWidget,
  StorageType,
  useSimpleAchievements,
} from 'react-achievements';
import {
  ArrowRight,
  Check,
  CheckCheck,
  Copy,
  Download,
  ExternalLink,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  achievementConfig,
  defaultConfig,
  generateCode,
  icons,
  presets,
  themes,
  type PlaygroundConfig,
  type PresetId,
} from '../playground/config';
import { measure } from '../measure';
import { GuidedTour } from './guided-tour';
function Preview({
  config,
  onTryReady,
}: {
  config: PlaygroundConfig;
  onTryReady: (run: () => void) => void;
}) {
  const { increment, track, unlockedCount, metrics } = useSimpleAchievements();
  const preset = presets[config.preset];
  const raw = metrics[preset.metric]?.at(-1);
  const current = preset.boolean ? (raw ? 1 : 0) : Number(raw || 0);
  const target = preset.boolean ? 1 : config.target;
  const fired = useRef(false);
  useEffect(() => {
    onTryReady(() => {
      track(preset.metric, preset.boolean ? true : config.target);
    });
    return () => onTryReady(() => {});
  }, [config.target, preset, track, onTryReady]);
  useEffect(() => {
    if (unlockedCount && !fired.current) {
      fired.current = true;
      measure('first_unlock');
    }
  }, [unlockedCount]);
  return (
    <div className={`play-preview theme-${config.theme}`} data-tour="preview">
      <div className="section-line">
        <span className="preview-label">
          <span className="status-dot" /> LIVE PREVIEW
        </span>
        <span className="preview-pill">{unlockedCount ? 'Unlocked' : 'In progress'}</span>
      </div>
      <div className={`preview-medal ${unlockedCount ? 'unlocked' : ''}`} aria-hidden="true">
        {config.icon}
      </div>
      <h2>{config.title || 'Your achievement'}</h2>
      <p>{preset.description}</p>
      <div className="preview-progress">
        <div>
          <span>{preset.boolean ? 'Profile completion' : preset.label}</span>
          <strong>
            {Math.min(current, target)} / {target}
          </strong>
        </div>
        <progress
          value={Math.min(current, target)}
          max={target}
          aria-label="Preview achievement progress"
        />
      </div>
      <button
        className="button button-primary preview-action"
        data-tour="preview-action"
        disabled={current >= target}
        onClick={() => (preset.boolean ? track(preset.metric, true) : increment(preset.metric))}
      >
        {current >= target ? (
          <>
            <CheckCheck size={17} /> Achievement unlocked
          </>
        ) : (
          <>
            {preset.action}
            <ArrowRight size={16} />
          </>
        )}
      </button>
      <p className="preview-status" role="status">
        {unlockedCount
          ? 'A small win worth celebrating. Nicely done!'
          : `${target - current} ${preset.boolean ? 'step' : preset.unit} to your next small win.`}
      </p>
      <AchievementsWidget placement="inline" theme={config.theme} label="View achievement" />
    </div>
  );
}
export function Playground() {
  const [config, setConfig] = useState(defaultConfig());
  const [revision, setRevision] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const codeRef = useRef<HTMLTextAreaElement>(null);
  const previewAction = useRef<() => void>(() => {});
  const registerPreview = useCallback((run: () => void) => {
    previewAction.current = run;
  }, []);
  const tryPreview = useCallback(() => previewAction.current(), []);
  useEffect(() => {
    measure('playground_view');
  }, []);
  const set = (patch: Partial<PlaygroundConfig>) => {
    setConfig((value) => ({ ...value, ...patch }));
    setRevision((value) => value + 1);
    setCopied(false);
  };
  const code = generateCode({
    ...config,
    title: config.title.trim() ? config.title : presets[config.preset].title,
  });
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setCopyError(false);
      measure('copy_code');
    } catch {
      setCopyError(true);
      codeRef.current?.focus();
      codeRef.current?.select();
    }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'App.tsx';
    link.click();
    URL.revokeObjectURL(url);
    measure('copy_code');
  }
  return (
    <>
      <GuidedTour kind="playground" onTry={tryPreview} />
      <div className="preset-tabs" data-tour="presets" role="group" aria-label="Achievement preset">
        {Object.entries(presets).map(([id, preset]) => (
          <button
            key={id}
            aria-pressed={config.preset === id}
            className={config.preset === id ? 'selected' : ''}
            onClick={() => {
              setConfig(defaultConfig(id as PresetId));
              setRevision((value) => value + 1);
              setCopied(false);
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="playground-grid">
        <section className="config-panel panel" data-tour="customize">
          <div className="section-line">
            <h2>
              <SlidersHorizontal size={17} /> Make it yours
            </h2>
            <span className="subtle">01</span>
          </div>
          <p className="subtle">A few details. A little personality.</p>
          <label htmlFor="achievement-title">Achievement name</label>
          <input
            id="achievement-title"
            maxLength={64}
            value={config.title}
            onChange={(e) => set({ title: e.target.value })}
            onBlur={() => {
              if (!config.title.trim()) set({ title: presets[config.preset].title });
            }}
          />
          <fieldset>
            <legend>Choose a symbol</legend>
            <div className="icon-options">
              {icons.map((icon, index) => (
                <button
                  key={icon}
                  className={config.icon === icon ? 'selected' : ''}
                  aria-label={['Spark', 'Diamond', 'Checkmark', 'Star'][index]}
                  aria-pressed={config.icon === icon}
                  onClick={() => set({ icon })}
                >
                  {icon}
                </button>
              ))}
            </div>
          </fieldset>
          {presets[config.preset].boolean ? (
            <div className="boolean-rule">
              <Check size={17} />
              <div>
                <strong>A simple milestone</strong>
                <p>Unlock when the profile is complete.</p>
              </div>
            </div>
          ) : (
            <>
              <label htmlFor="target">
                Unlock after{' '}
                <strong>
                  {config.target} {presets[config.preset].unit}
                </strong>
              </label>
              <input
                id="target"
                aria-label="Unlock threshold"
                type="range"
                min={1}
                max={20}
                value={config.target}
                onChange={(e) => set({ target: Number(e.target.value) })}
              />
              <div className="range-labels">
                <span>1</span>
                <span>20</span>
              </div>
            </>
          )}
          <label htmlFor="theme">Preview style</label>
          <select
            id="theme"
            value={config.theme}
            onChange={(e) => set({ theme: e.target.value as PlaygroundConfig['theme'] })}
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme[0].toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
          <div className="config-footnote">
            Changes restart the preview so you can try your new rule from the beginning.
          </div>
        </section>
        <section className="preview-panel">
          <div className="preview-toolbar">
            <span>YOUR LITTLE MOMENT</span>
            <button className="text-button" onClick={() => setRevision((value) => value + 1)}>
              <RotateCcw size={14} /> Reset preview
            </button>
          </div>
          <AchievementProvider
            key={revision}
            achievements={achievementConfig({
              ...config,
              title: config.title.trim() ? config.title : presets[config.preset].title,
            })}
            storage={StorageType.Memory}
            ui={{ enableConfetti: false, enableNotifications: false }}
          >
            <Preview config={config} onTryReady={registerPreview} />
          </AchievementProvider>
        </section>
      </div>
      <section className="code-panel">
        <div className="code-toolbar">
          <div>
            <span className="code-dot" />
            App.tsx <span className="code-version">React 6.0.0 · Engine 2.1.0</span>
          </div>
          <div className="button-row">
            <button onClick={download} aria-label="Download App.tsx">
              <Download size={15} />
            </button>
            <button onClick={copy} data-tour="copy">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy code'}
            </button>
          </div>
        </div>
        <textarea
          ref={codeRef}
          readOnly
          value={code}
          aria-label="Complete integration code"
          spellCheck={false}
        />
        <div className="code-footer">
          <p role="status">
            {copyError
              ? 'Copy was unavailable. The code is selected; use your keyboard to copy it.'
              : 'Complete, editable code. No missing pieces.'}
          </p>
          <Link href="/setup" onClick={() => measure('starter_open')}>
            Run this in your app <ArrowRight size={14} />
          </Link>
        </div>
      </section>
      <div className="callout">
        <div>
          <strong>Want to skip the setup?</strong>
          <p>Open the minimal example in your browser, or clone the full authenticated starter.</p>
        </div>
        <a
          className="button button-secondary"
          href="https://stackblitz.com/github/dave-b-b/achievements-starter/tree/main/examples/minimal"
          onClick={() => measure('starter_open')}
        >
          Open runnable example <ExternalLink size={15} />
        </a>
      </div>
    </>
  );
}
