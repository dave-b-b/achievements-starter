'use client';
import { useEffect, useRef, useState } from 'react';
import { AchievementProvider, StorageType, useSimpleAchievements } from 'react-achievements';
import { ArrowRight, Pause, Play, RotateCcw, Shield, Trophy } from 'lucide-react';
import { arcadeAchievements } from '../game/achievements';
import {
  advanceGame,
  createGame,
  drawGame,
  WIDTH,
  HEIGHT,
  type Controls,
  type Game,
  type GameEvent,
} from '../game/engine';
import { AchievementBoard } from './achievement-board';
import { celebrationUI } from './celebrations';

const view = (game: Game) => ({
  phase: game.phase,
  score: game.score,
  wave: game.wave,
  lives: game.lives,
  combo: game.combo,
});

function Mission({ autoStart, onReplay }: { autoStart: boolean; onReplay: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const game = useRef(createGame(autoStart));
  const controls = useRef<Controls>({ left: false, right: false, up: false, down: false });
  const [hud, setHud] = useState(() => view(game.current));
  const { track, trackMultiple, unlockedCount } = useSimpleAchievements();
  const reward = useRef((event: GameEvent) => {});
  reward.current = (event) => {
    if (event.type === 'kill') trackMultiple({ score: event.score, comboThree: event.combo >= 3 });
    else if (event.type === 'wave') track('level', event.wave);
    else track('missionComplete', true);
  };

  function pause() {
    if (game.current.phase !== 'running') return;
    game.current.phase = 'paused';
    controls.current = { left: false, right: false, up: false, down: false };
    setHud(view(game.current));
  }
  function play() {
    if (game.current.phase !== 'ready' && game.current.phase !== 'paused') return;
    if (game.current.phase === 'ready') reward.current({ type: 'wave', wave: 1 });
    game.current.phase = 'running';
    setHud(view(game.current));
    canvas.current
      ?.closest('.arcade-machine')
      ?.scrollIntoView({ block: 'start', behavior: 'instant' });
    canvas.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (autoStart) {
      reward.current({ type: 'wave', wave: 1 });
      canvas.current?.focus({ preventScroll: true });
    }
    const hidden = () => {
      if (document.hidden) pause();
    };
    window.addEventListener('blur', pause);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      window.removeEventListener('blur', pause);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, [autoStart]);

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previous = 0;
    let lastHud = 0;
    function tick(now: number) {
      const events = advanceGame(
        game.current,
        previous ? (now - previous) / 1000 : 0,
        controls.current,
      );
      previous = now;
      events.forEach((event) => reward.current(event));
      drawGame(ctx!, game.current, motion.matches);
      if (now - lastHud > 100 || events.length || game.current.phase !== 'running') {
        setHud(view(game.current));
        lastHud = now;
      }
      if (game.current.phase === 'running') frame = requestAnimationFrame(tick);
    }
    drawGame(ctx, game.current, motion.matches);
    if (game.current.phase === 'running') frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hud.phase]);

  const ended = hud.phase === 'lost' || hud.phase === 'won';
  const keys: Record<string, keyof Omit<Controls, 'target'>> = {
    ArrowLeft: 'left',
    a: 'left',
    ArrowRight: 'right',
    d: 'right',
    ArrowUp: 'up',
    w: 'up',
    ArrowDown: 'down',
    s: 'down',
  };
  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    if (game.current.phase !== 'running') return;
    const rect = event.currentTarget.getBoundingClientRect();
    controls.current.target = {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    };
  }
  return (
    <div className="arcade-grid">
      <section
        className="arcade-machine"
        aria-label="Starfall mission"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) pause();
        }}
      >
        <div className="arcade-hud">
          <dl>
            <dt>Score</dt>
            <dd data-testid="arcade-score">{hud.score.toLocaleString()}</dd>
          </dl>
          <dl>
            <dt>Wave</dt>
            <dd>
              {hud.wave}
              <span> / 3</span>
            </dd>
          </dl>
          <dl>
            <dt>Shields</dt>
            <dd>
              <Shield size={17} /> <span data-testid="arcade-shields">{hud.lives}</span>
            </dd>
          </dl>
          <dl>
            <dt>Badges</dt>
            <dd>
              <Trophy size={16} /> {unlockedCount}
              <span> / 5</span>
            </dd>
          </dl>
        </div>
        <div className="arcade-stage">
          <canvas
            ref={canvas}
            width={WIDTH}
            height={HEIGHT}
            tabIndex={0}
            role="application"
            aria-label="Starfall game area"
            aria-describedby="arcade-controls"
            onKeyDown={(event) => {
              if (event.key === ' ') {
                event.preventDefault();
                if (event.repeat) return;
                if (game.current.phase === 'running') pause();
                else play();
                return;
              }
              const key = keys[event.key.length === 1 ? event.key.toLowerCase() : event.key];
              if (key) {
                event.preventDefault();
                controls.current[key] = true;
                controls.current.target = undefined;
              }
            }}
            onKeyUp={(event) => {
              const key = keys[event.key.length === 1 ? event.key.toLowerCase() : event.key];
              if (key) {
                event.preventDefault();
                controls.current[key] = false;
              }
            }}
            onPointerDown={(event) => {
              event.currentTarget.focus({ preventScroll: true });
              event.currentTarget.setPointerCapture(event.pointerId);
              point(event);
            }}
            onPointerMove={(event) => {
              if (event.pointerType === 'mouse' || event.buttons) point(event);
            }}
            onPointerUp={() => {
              controls.current.target = undefined;
            }}
            onPointerCancel={() => {
              controls.current.target = undefined;
              pause();
            }}
          >
            Move with arrows or WASD, or drag your ship on touch. Firing is automatic. Space pauses
            the mission.
          </canvas>
          {hud.phase !== 'running' && (
            <div className="arcade-overlay">
              <span className="arcade-emblem" aria-hidden="true">
                {hud.phase === 'won' ? '★' : '✦'}
              </span>
              <span className="arcade-kicker">
                {hud.phase === 'won'
                  ? 'MISSION COMPLETE'
                  : hud.phase === 'lost'
                    ? 'ONE MORE TRY?'
                    : hud.phase === 'paused'
                      ? 'TAKE A BREATHER'
                      : 'YOUR SHIP IS READY'}
              </span>
              <h2>
                {hud.phase === 'won'
                  ? 'A star pilot, indeed.'
                  : hud.phase === 'lost'
                    ? 'Every pilot starts somewhere.'
                    : hud.phase === 'paused'
                      ? 'Mission paused.'
                      : 'A small ship. A big little adventure.'}
              </h2>
              <p>
                {ended
                  ? `${hud.score.toLocaleString()} points. ${unlockedCount} achievements earned this run.`
                  : 'Dodge scout fire, clear three waves, and collect five real achievements. Your ship fires automatically.'}
              </p>
              <button className="button button-light" onClick={ended ? onReplay : play}>
                <Play size={16} />{' '}
                {ended ? 'Fly again' : hud.phase === 'paused' ? 'Resume mission' : 'Start mission'}{' '}
                <ArrowRight size={16} />
              </button>
              {!ended && <small>No account. No download. Just play.</small>}
            </div>
          )}
        </div>
        <div className="arcade-toolbar">
          <p id="arcade-controls">
            Arrows / WASD to move · drag on touch · auto-fire · Space to pause
          </p>
          <div>
            <button
              className="text-button"
              onClick={hud.phase === 'running' ? pause : play}
              disabled={hud.phase === 'ready' || ended}
            >
              {hud.phase === 'paused' ? <Play size={15} /> : <Pause size={15} />}
              {hud.phase === 'paused' ? 'Resume run' : 'Pause run'}
            </button>
            <button className="text-button" onClick={onReplay}>
              <RotateCcw size={14} /> New run
            </button>
          </div>
        </div>
      </section>
      <aside className="arcade-sidebar">
        <div className="arcade-mission-note">
          <span className="eyebrow">THE LITTLE WINS ARE REAL</span>
          <h2>Your mission board</h2>
          <p>
            Every badge comes from the published SDK. Score, wave progress, unlocks, notifications,
            and confetti all work together.
          </p>
        </div>
        <AchievementBoard compact onOpenCollection={pause} />
        <p className="arcade-local-note">
          A fresh collection for every run. Game progress stays in this browser session; your saved
          course progress is separate.
        </p>
        <a
          className="text-button"
          href="https://github.com/dave-b-b/achievements-starter/tree/main/src/game"
        >
          See the game and builder definitions <ArrowRight size={14} />
        </a>
      </aside>
    </div>
  );
}

export function Arcade() {
  const [run, setRun] = useState(0);
  return (
    <AchievementProvider
      key={run}
      achievements={arcadeAchievements}
      storage={StorageType.Memory}
      ui={{ ...celebrationUI, theme: 'gamified' }}
    >
      <Mission autoStart={run > 0} onReplay={() => setRun((value) => value + 1)} />
    </AchievementProvider>
  );
}
