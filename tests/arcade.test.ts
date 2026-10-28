import { describe, expect, it } from 'vitest';
import { AchievementEngine, StorageType } from 'achievements-engine';
import { arcadeAchievements } from '../src/game/achievements';
import {
  advanceGame,
  createGame,
  waveSize,
  WIDTH,
  HEIGHT,
  type Controls,
} from '../src/game/engine';
const idle: Controls = { left: false, right: false, up: false, down: false };

describe('Starfall simulation and real SDK awards', () => {
  it('never advances ready or paused missions', () => {
    const game = createGame();
    expect(advanceGame(game, 1, idle)).toEqual([]);
    expect(game.elapsed).toBe(0);
    game.phase = 'paused';
    const before = structuredClone(game);
    expect(advanceGame(game, 1, { ...idle, right: true })).toEqual([]);
    expect(game).toEqual(before);
  });
  it('bounds movement and time steps after a slow frame', () => {
    const game = createGame(true);
    game.ship = { x: WIDTH - 28, y: HEIGHT - 38 };
    advanceGame(game, 30, { ...idle, right: true, down: true });
    expect(game.ship).toEqual({ x: WIDTH - 28, y: HEIGHT - 38 });
    expect(game.elapsed).toBe(0.032);
    advanceGame(game, 0.032, { ...idle, target: { x: -100, y: -100 } });
    expect(game.ship.x).toBeLessThan(WIDTH - 28);
    expect(game.ship.y).toBeLessThan(HEIGHT - 38);
  });
  it('turns actual projectile collisions and a combo into SDK unlocks', () => {
    const game = createGame(true);
    game.spawnIn = 10;
    game.enemies = [160, 360, 560].map((x) => ({ x, originX: x, y: 300, age: 0, fireIn: 10 }));
    game.shots = [160, 360, 560].map((x) => ({ x, y: 300, dx: 0, dy: -670 }));
    const events = advanceGame(game, 0, idle);
    expect(events).toEqual([
      { type: 'kill', score: 100, combo: 1 },
      { type: 'kill', score: 200, combo: 2 },
      { type: 'kill', score: 300, combo: 3 },
    ]);
    const engine = new AchievementEngine({
      achievements: arcadeAchievements,
      storage: StorageType.Memory,
    });
    for (const event of events)
      if (event.type === 'kill')
        engine.update({ score: event.score, comboThree: event.combo >= 3 });
    expect(
      engine.getSnapshot().unlockedAchievements.map((award) => award.achievementTitle),
    ).toEqual(expect.arrayContaining(['First contact', 'Hot streak']));
    expect(engine.getSnapshot().unlockedCount).toBe(2);
    engine.destroy();
  });
  it('takes one shield per hit and protects against simultaneous damage', () => {
    const game = createGame(true);
    const shot = { ...game.ship, dx: 0, dy: 0 };
    game.hazards = [{ ...shot }, { ...shot }];
    advanceGame(game, 0, idle);
    expect(game.lives).toBe(2);
    expect(game.immuneFor).toBeGreaterThan(0);
    game.hazards.push({ ...shot });
    advanceGame(game, 0.016, idle);
    expect(game.lives).toBe(2);
    game.immuneFor = 0;
    game.lives = 1;
    game.hazards.push({ ...shot });
    advanceGame(game, 0, idle);
    expect(game.phase).toBe('lost');
  });
  it('advances cleared waves and rewards survival of all three', () => {
    const game = createGame(true);
    const engine = new AchievementEngine({
      achievements: arcadeAchievements,
      storage: StorageType.Memory,
    });
    game.spawned = waveSize(1);
    expect(advanceGame(game, 0, idle)).toEqual([{ type: 'wave', wave: 2 }]);
    engine.update({ level: game.wave });
    expect(
      engine.getSnapshot().unlockedAchievements.map((award) => award.achievementTitle),
    ).toContain('Wave rider');
    game.wave = 3;
    game.spawned = waveSize(3);
    expect(advanceGame(game, 0, idle)).toEqual([{ type: 'victory' }]);
    engine.update({ missionComplete: true });
    expect(
      engine.getSnapshot().unlockedAchievements.map((award) => award.achievementTitle),
    ).toContain('Star pilot');
    expect(game.phase).toBe('won');
    engine.destroy();
  });
  it('does not award a victory on a lethal last frame', () => {
    const game = createGame(true);
    game.wave = 3;
    game.spawned = waveSize(3);
    game.lives = 1;
    game.hazards = [{ ...game.ship, dx: 0, dy: 0 }];
    expect(advanceGame(game, 0, idle)).toEqual([]);
    expect(game.phase).toBe('lost');
  });
  it('can finish a real three-wave run and earn all five SDK achievements', () => {
    const game = createGame(true);
    const engine = new AchievementEngine({
      achievements: arcadeAchievements,
      storage: StorageType.Memory,
    });
    engine.update({ level: 1 });
    for (let frame = 0; frame < 6000 && game.phase === 'running'; frame++) {
      const events = advanceGame(game, 0.016, {
        ...idle,
        target: { x: game.enemies[0]?.x ?? WIDTH / 2, y: HEIGHT - 100 },
      });
      for (const event of events) {
        if (event.type === 'kill')
          engine.update({ score: event.score, comboThree: event.combo >= 3 });
        else if (event.type === 'wave') engine.update({ level: event.wave });
        else engine.update({ missionComplete: true });
      }
    }
    expect(game.phase).toBe('won');
    expect(game.score).toBe(2100);
    expect(game.lives).toBeGreaterThan(0);
    expect(engine.getSnapshot().unlockedCount).toBe(5);
    engine.destroy();
  });
});
