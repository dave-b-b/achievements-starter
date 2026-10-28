export const WIDTH = 720;
export const HEIGHT = 640;
export type Phase = 'ready' | 'running' | 'paused' | 'lost' | 'won';
type Body = { x: number; y: number };
type Shot = Body & { dx: number; dy: number };
type Enemy = Body & { age: number; fireIn: number; originX: number };
export type GameEvent =
  | { type: 'kill'; score: number; combo: number }
  | { type: 'wave'; wave: number }
  | { type: 'victory' };
export type Game = {
  phase: Phase;
  ship: Body;
  shots: Shot[];
  hazards: Shot[];
  enemies: Enemy[];
  wave: number;
  spawned: number;
  score: number;
  lives: number;
  combo: number;
  lastKill: number;
  elapsed: number;
  fireIn: number;
  spawnIn: number;
  immuneFor: number;
};
export type Controls = { left: boolean; right: boolean; up: boolean; down: boolean; target?: Body };
export function createGame(autoStart = false): Game {
  return {
    phase: autoStart ? 'running' : 'ready',
    ship: { x: WIDTH / 2, y: HEIGHT - 100 },
    shots: [],
    hazards: [],
    enemies: [],
    wave: 1,
    spawned: 0,
    score: 0,
    lives: 3,
    combo: 0,
    lastKill: -10,
    elapsed: 0,
    fireIn: 0,
    spawnIn: 0,
    immuneFor: 0,
  };
}
export const waveSize = (wave: number) => 3 + wave * 2;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const near = (a: Body, b: Body, radius: number) => Math.hypot(a.x - b.x, a.y - b.y) < radius;

// Bounded simulation steps keep collision and scoring behavior independent of React.
export function advanceGame(game: Game, delta: number, controls: Controls): GameEvent[] {
  if (game.phase !== 'running') return [];
  const dt = clamp(delta, 0, 0.032);
  const events: GameEvent[] = [];
  game.elapsed += dt;
  game.immuneFor = Math.max(0, game.immuneFor - dt);
  const directionX = Number(controls.right) - Number(controls.left);
  const directionY = Number(controls.down) - Number(controls.up);
  if (directionX || directionY) {
    const length = Math.hypot(directionX, directionY);
    game.ship.x += (directionX / length) * 460 * dt;
    game.ship.y += (directionY / length) * 460 * dt;
  } else if (controls.target) {
    const distance = Math.hypot(controls.target.x - game.ship.x, controls.target.y - game.ship.y);
    const fraction = distance ? Math.min(1, (650 * dt) / distance) : 0;
    game.ship.x += (controls.target.x - game.ship.x) * fraction;
    game.ship.y += (controls.target.y - game.ship.y) * fraction;
  }
  game.ship.x = clamp(game.ship.x, 28, WIDTH - 28);
  game.ship.y = clamp(game.ship.y, HEIGHT * 0.38, HEIGHT - 38);
  game.fireIn -= dt;
  if (game.fireIn <= 0) {
    game.shots.push({ x: game.ship.x, y: game.ship.y - 30, dx: 0, dy: -670 });
    game.fireIn = 0.19;
  }
  game.spawnIn -= dt;
  if (game.spawned < waveSize(game.wave) && game.spawnIn <= 0) {
    const lanes = [360, 160, 560, 280, 440, 90, 630, 220, 500];
    const x = lanes[game.spawned % lanes.length];
    game.enemies.push({ x, originX: x, y: -32, age: 0, fireIn: 1.8 });
    game.spawned++;
    game.spawnIn = Math.max(0.6, 1.25 - game.wave * 0.12);
  }
  for (const shot of [...game.shots, ...game.hazards]) {
    shot.x += shot.dx * dt;
    shot.y += shot.dy * dt;
  }
  let damaged = false;
  function hit() {
    if (game.immuneFor > 0 || damaged) return;
    damaged = true;
    game.lives--;
    game.combo = 0;
    game.immuneFor = 1.4;
    if (game.lives <= 0) game.phase = 'lost';
  }
  const survivors: Enemy[] = [];
  for (const enemy of game.enemies) {
    enemy.age += dt;
    enemy.y += (58 + game.wave * 13) * dt;
    enemy.x = enemy.originX + Math.sin(enemy.age * 1.4) * 18;
    const shotIndex = game.shots.findIndex((shot) => near(shot, enemy, 27));
    if (shotIndex !== -1) {
      game.shots.splice(shotIndex, 1);
      game.score += 100;
      game.combo = game.elapsed - game.lastKill < 3 ? game.combo + 1 : 1;
      game.lastKill = game.elapsed;
      events.push({ type: 'kill', score: game.score, combo: game.combo });
      continue;
    }
    if (near(enemy, game.ship, 35) || enemy.y > HEIGHT + 24) {
      hit();
      continue;
    }
    enemy.fireIn -= dt;
    if (enemy.fireIn <= 0 && enemy.y > 10) {
      const dx = game.ship.x - enemy.x,
        dy = game.ship.y - enemy.y;
      const distance = Math.hypot(dx, dy) || 1;
      const speed = 145 + game.wave * 24;
      game.hazards.push({
        x: enemy.x,
        y: enemy.y + 16,
        dx: (dx / distance) * speed,
        dy: (dy / distance) * speed,
      });
      enemy.fireIn = Math.max(0.9, 2.2 - game.wave * 0.25);
    }
    survivors.push(enemy);
  }
  game.enemies = survivors;
  game.shots = game.shots.filter((shot) => shot.y > -30);
  game.hazards = game.hazards.filter((shot) => {
    if (near(shot, game.ship, 20)) {
      hit();
      return false;
    }
    return shot.y > -30 && shot.y < HEIGHT + 30 && shot.x > -30 && shot.x < WIDTH + 30;
  });
  if (
    game.phase === 'running' &&
    game.spawned === waveSize(game.wave) &&
    game.enemies.length === 0
  ) {
    if (game.wave === 3) {
      game.phase = 'won';
      events.push({ type: 'victory' });
    } else {
      game.wave++;
      game.spawned = 0;
      game.spawnIn = 1.2;
      game.hazards = [];
      events.push({ type: 'wave', wave: game.wave });
    }
  }
  return events;
}

export function drawGame(ctx: CanvasRenderingContext2D, game: Game, reducedMotion: boolean) {
  ctx.fillStyle = '#121326';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  const glow = ctx.createRadialGradient(550, 170, 10, 360, 300, 620);
  glow.addColorStop(0, '#473b652e');
  glow.addColorStop(1, '#121326');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  for (let i = 0; i < 70; i++) {
    const x = (i * 137 + 51) % WIDTH;
    const y = (i * 97 + (reducedMotion ? 0 : game.elapsed * (12 + (i % 3) * 8))) % HEIGHT;
    ctx.fillStyle = i % 3 ? '#a5a0c855' : '#e9def3aa';
    ctx.fillRect(x, y, i % 3 ? 2 : 3, i % 3 ? 2 : 3);
  }
  ctx.strokeStyle = '#bfc0e30a';
  ctx.lineWidth = 1;
  for (let x = 0; x < WIDTH; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  ctx.fillStyle = '#e9d7a0';
  for (const shot of game.shots) {
    ctx.fillRect(shot.x - 2, shot.y - 12, 4, 20);
  }
  ctx.fillStyle = '#f6a18c';
  for (const shot of game.hazards) {
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const enemy of game.enemies) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.fillStyle = game.wave === 3 ? '#e1b85f' : '#d8877d';
    ctx.beginPath();
    ctx.moveTo(0, 22);
    ctx.lineTo(-25, -15);
    ctx.lineTo(-10, -7);
    ctx.lineTo(0, -20);
    ctx.lineTo(10, -7);
    ctx.lineTo(25, -15);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#35283f';
    ctx.fillRect(-5, -5, 10, 12);
    ctx.restore();
  }
  ctx.save();
  ctx.translate(game.ship.x, game.ship.y);
  if (game.immuneFor > 0) {
    ctx.strokeStyle = '#c5b3ed';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 35, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#b8a0ec';
  ctx.beginPath();
  ctx.moveTo(0, -29);
  ctx.lineTo(24, 20);
  ctx.lineTo(0, 9);
  ctx.lineTo(-24, 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#eee6ff';
  ctx.beginPath();
  ctx.moveTo(0, -15);
  ctx.lineTo(6, 6);
  ctx.lineTo(-6, 6);
  ctx.closePath();
  ctx.fill();
  if (game.phase === 'running') {
    ctx.fillStyle = '#f3cf80';
    ctx.beginPath();
    ctx.moveTo(-7, 17);
    ctx.lineTo(0, reducedMotion ? 30 : 30 + Math.sin(game.elapsed * 20) * 5);
    ctx.lineTo(7, 17);
    ctx.fill();
  }
  ctx.restore();
}
