import { describe, it, expect } from 'vitest';
import { AchievementEngine, StorageType } from 'achievements-engine';
import ts from 'typescript';
import {
  achievementConfig,
  defaultConfig,
  generateCode,
  presets,
  validateConfig,
  type PresetId,
} from '../src/playground/config';

describe('real published SDK definitions and exports', () => {
  for (const id of Object.keys(presets) as PresetId[]) {
    it(`${id} unlocks only at its configured milestone`, () => {
      const config = defaultConfig(id);
      const preset = presets[id];
      const engine = new AchievementEngine({
        achievements: achievementConfig(config),
        storage: StorageType.Memory,
      });
      expect(engine.getSnapshot().unlockedCount).toBe(0);
      if (preset.boolean) engine.update({ [preset.metric]: true });
      else {
        engine.update({ [preset.metric]: config.target - 1 });
        expect(engine.getSnapshot().unlockedCount).toBe(0);
        engine.update({ [preset.metric]: config.target });
      }
      expect(engine.getSnapshot().unlockedCount).toBe(1);
      engine.reset();
      expect(engine.getSnapshot().unlockedCount).toBe(0);
      engine.destroy();
    });
    it(`${id} exports complete TSX with the actual definitions`, () => {
      const config = defaultConfig(id);
      const code = generateCode(config);
      const result = ts.transpileModule(code, {
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
        reportDiagnostics: true,
      });
      expect(result.diagnostics).toEqual([]);
      expect(code).toContain('AchievementBuilder');
      expect(code).toContain('.withAward(');
      expect(code).toContain('AchievementProvider');
      expect(code).toContain('AchievementsWidget');
      expect(code).toContain(JSON.stringify(presets[id].metric));
      expect(code).not.toContain('eval(');
    });
  }
  it('serializes potentially executable labels as string data', () => {
    const title = '</script>\n"}; throw new Error("injected"); //';
    const code = generateCode({ ...defaultConfig(), title });
    expect(code).not.toContain('</script>');
    const result = ts.transpileModule(code, {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX },
      reportDiagnostics: true,
    });
    expect(result.diagnostics).toEqual([]);
  });
  it('rejects unbounded and unsupported configurations', () => {
    for (const target of [0, 21, NaN, Infinity, 1.5])
      expect(() => validateConfig({ ...defaultConfig(), target })).toThrow();
    expect(() => validateConfig({ ...defaultConfig(), title: ' ' })).toThrow();
    expect(() => validateConfig({ ...defaultConfig(), title: 'x'.repeat(65) })).toThrow();
  });
});
