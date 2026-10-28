import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { defaultConfig, generateCode, presets } from '../src/playground/config.ts';
const path = 'examples/minimal/src/App.tsx';
const original = await readFile(path, 'utf8');
try {
  for (const preset of Object.keys(presets)) {
    await writeFile(path, generateCode(defaultConfig(preset)));
    const result = spawnSync('npm', ['run', 'build'], {
      cwd: 'examples/minimal',
      stdio: 'inherit',
    });
    if (result.status !== 0)
      throw new Error(`Generated ${preset} example failed its real type-check/build.`);
    console.log(`Verified generated example: ${preset}`);
  }
} finally {
  await writeFile(path, original);
}
