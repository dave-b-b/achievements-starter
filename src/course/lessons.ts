export const lessons = [
  {
    id: 'define',
    number: '01',
    title: 'Define a small win',
    duration: '3 min',
    tag: 'THE FOUNDATION',
    summary: 'Turn a meaningful moment into your first achievement.',
    paragraphs: [
      'The best achievements celebrate a real step forward. Start with a moment your users already care about: finishing a lesson, completing onboarding, or shipping a task.',
      'The builder connects a metric to an award in a readable chain. When firstLessonCompleted becomes true, the engine unlocks First spark. Keep the built definitions in one shared module so your UI and server use the same rules.',
      'Use readable titles and explain what the user did. The engine handles evaluation; your application decides which actions should count.',
    ],
    code: `import { AchievementBuilder } from 'react-achievements';

export const achievements = AchievementBuilder
  .createBooleanAchievement('firstLessonCompleted')
  .withAward({
    title: 'First spark',
    description: 'Finish your first lesson.',
    icon: '✦',
  })
  .toConfig()`,
    takeaway:
      'A good achievement makes progress visible. One builder, one meaningful condition, and one clear award are enough to begin.',
  },
  {
    id: 'track',
    number: '02',
    title: 'Connect an action',
    duration: '4 min',
    tag: 'THE CONNECTION',
    summary: 'Give the engine a real event to celebrate.',
    paragraphs: [
      'For local interactions, wrap your UI in AchievementProvider and use useSimpleAchievements. Calling track with a value replaces that metric; increment adds to it.',
      'For saved learning progress, this app sends a lesson ID to the server. The server validates your identity, records the completion once, and derives the absolute completion count.',
      'Completion and achievement state are saved in one transaction. Retrying a request cannot count the same lesson twice. That matters when a connection drops after a successful save.',
    ],
    code: `function CompleteLesson() {\n  const { track } = useSimpleAchievements();\n\n  return (\n    <button onClick={() => track('firstLessonCompleted', true)}>\n      Complete lesson\n    </button>\n  );\n}`,
    takeaway:
      'Local previews can track directly. Authoritative rewards should be derived from validated server-side activity.',
  },
  {
    id: 'render',
    number: '03',
    title: 'Make progress feel good',
    duration: '3 min',
    tag: 'THE EXPERIENCE',
    summary: 'Build a clear, accessible loop from action to achievement.',
    paragraphs: [
      'Use the React package to read unlocked achievements and show what comes next. AchievementsWidget provides a ready-made overview; the hooks also support your own presentation.',
      'Pair the celebration with useful context: what changed, how far the user has come, and the next meaningful step. A visible progress bar works even when animation is reduced.',
      'Keep loading and retry states honest. This app waits for a committed server snapshot before displaying saved progress. Your data should remain correct even if a notification is missed.',
    ],
    code: `function Progress() {\n  const { unlockedCount, totalCount } = useSimpleAchievements();\n\n  return (\n    <>\n      <p>{unlockedCount} of {totalCount} unlocked</p>\n      <AchievementsWidget placement="inline" />\n    </>\n  );\n}`,
    takeaway:
      'Celebrate the outcome, explain the next step, and respect keyboard navigation and reduced-motion preferences.',
  },
] as const;
export type LessonId = (typeof lessons)[number]['id'];
export function isLessonId(value: unknown): value is LessonId {
  return typeof value === 'string' && lessons.some((lesson) => lesson.id === value);
}
