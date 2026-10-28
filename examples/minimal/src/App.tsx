'use client';

import {
  AchievementBuilder,
  AchievementProvider,
  AchievementsWidget,
  useSimpleAchievements,
} from 'react-achievements';

const achievements = AchievementBuilder.create()
  .withMetric('lessonsCompleted')
  .withCondition((metrics) => Number(metrics['lessonsCompleted'] ?? 0) >= 3)
  .withAward({
    title: 'Curious mind',
    description: 'Keep learning, one lesson at a time.',
    icon: '✦',
  })
  .build();

function Demo() {
  const { track, increment, unlockedCount } = useSimpleAchievements();
  return (
    <main>
      <h1>{'Curious mind'}</h1>
      <button onClick={() => increment('lessonsCompleted')}>Complete a lesson</button>
      <p aria-live="polite">{unlockedCount} achievement unlocked</p>
      <AchievementsWidget placement="inline" theme="minimal" />
    </main>
  );
}

export default function App() {
  return (
    <AchievementProvider
      achievements={achievements}
      ui={{ enableConfetti: true, enableNotifications: true }}
    >
      <Demo />
    </AchievementProvider>
  );
}
