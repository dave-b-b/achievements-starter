import { AchievementBuilder, type SimpleAchievementConfig } from 'achievements-engine';
export const presets = {
  learning: {
    label: 'Learning',
    metric: 'lessonsCompleted',
    action: 'Complete a lesson',
    unit: 'lessons',
    title: 'Curious mind',
    description: 'Keep learning, one lesson at a time.',
    target: 3,
    icon: '✦',
    boolean: false,
  },
  onboarding: {
    label: 'Onboarding',
    metric: 'profileCompleted',
    action: 'Complete your profile',
    unit: 'profile',
    title: 'Hello, world',
    description: 'A great beginning starts with you.',
    target: 1,
    icon: '◆',
    boolean: true,
  },
  tasks: {
    label: 'Task completion',
    metric: 'tasksCompleted',
    action: 'Finish a task',
    unit: 'tasks',
    title: 'On a roll',
    description: 'Small steps add up to great things.',
    target: 5,
    icon: '✓',
    boolean: false,
  },
} as const;
export type PresetId = keyof typeof presets;
export const icons = ['✦', '◆', '✓', '★'] as const;
export const themes = ['minimal', 'modern', 'gamified'] as const;
export type PlaygroundConfig = {
  preset: PresetId;
  title: string;
  target: number;
  icon: (typeof icons)[number];
  theme: (typeof themes)[number];
};
export function defaultConfig(preset: PresetId = 'learning'): PlaygroundConfig {
  return {
    preset,
    title: presets[preset].title,
    target: presets[preset].target,
    icon: presets[preset].icon,
    theme: 'minimal',
  };
}
export function validateConfig(value: PlaygroundConfig): PlaygroundConfig {
  if (
    !Object.hasOwn(presets, value.preset) ||
    !themes.includes(value.theme) ||
    !icons.includes(value.icon) ||
    !Number.isInteger(value.target) ||
    value.target < 1 ||
    value.target > 20 ||
    !value.title.trim() ||
    value.title.length > 64
  ) {
    throw new Error(
      'Choose a preset, a title of 1–64 characters, and a whole-number target from 1 to 20.',
    );
  }
  return value;
}
export function achievementConfig(value: PlaygroundConfig): SimpleAchievementConfig {
  const config = validateConfig(value);
  const preset = presets[config.preset];
  const award = { title: config.title, description: preset.description, icon: config.icon };
  if (preset.boolean) {
    return AchievementBuilder.createBooleanAchievement(preset.metric).withAward(award).toConfig();
  }
  return AchievementBuilder.create()
    .withMetric(preset.metric)
    .withCondition((metrics) => Number(metrics[preset.metric] ?? 0) >= config.target)
    .withAward(award)
    .build();
}

function quote(value: string): string {
  // Serialize string values safely while exporting the builder API, never a JSON rule definition.
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function generateCode(value: PlaygroundConfig): string {
  const config = validateConfig(value);
  const preset = presets[config.preset];
  const builder = preset.boolean
    ? `AchievementBuilder.createBooleanAchievement(${quote(preset.metric)})`
    : `AchievementBuilder.create()\n  .withMetric(${quote(preset.metric)})\n  .withCondition((metrics) => Number(metrics[${quote(preset.metric)}] ?? 0) >= ${config.target})`;
  const definition = `${builder}\n  .withAward({\n    title: ${quote(config.title)},\n    description: ${quote(preset.description)},\n    icon: ${quote(config.icon)},\n  })\n  .${preset.boolean ? 'toConfig' : 'build'}()`;
  const action = preset.boolean
    ? `track(${quote(preset.metric)}, true)`
    : `increment(${quote(preset.metric)})`;
  return `'use client';\n\nimport { AchievementBuilder, AchievementProvider, AchievementsWidget, useSimpleAchievements } from 'react-achievements';\n\nconst achievements = ${definition};\n\nfunction Demo() {\n  const { track, increment, unlockedCount } = useSimpleAchievements();\n  return (\n    <main>\n      <h1>{${quote(config.title)}}</h1>\n      <button onClick={() => ${action}}>${preset.action}</button>\n      <p aria-live="polite">{unlockedCount} achievement unlocked</p>\n      <AchievementsWidget placement="inline" theme=${quote(config.theme)} />\n    </main>\n  );\n}\n\nexport default function App() {\n  return (\n    <AchievementProvider achievements={achievements} ui={{ enableConfetti: false }}>\n      <Demo />\n    </AchievementProvider>\n  );\n}\n`;
}
