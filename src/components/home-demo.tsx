'use client';
import { useState } from 'react';
import { AchievementBuilder } from 'achievements-engine';
import { AchievementProvider, useSimpleAchievements, StorageType } from 'react-achievements';
import { ArrowRight, Check, RotateCcw } from 'lucide-react';
const achievements = AchievementBuilder.combine([
  AchievementBuilder.createScoreAchievement(1).withAward({
    title: 'A little momentum',
    description: 'Take your first step.',
    icon: '✦',
  }),
  AchievementBuilder.createScoreAchievement(3).withAward({
    title: 'Look at you go',
    description: 'Celebrate three small wins.',
    icon: '◆',
  }),
]);
function Preview() {
  const { increment, unlockedCount, metrics, nextAchievement } = useSimpleAchievements();
  const count = Number(metrics.score?.at(-1) || 0);
  return (
    <>
      <div className="demo-eyebrow">
        <span className="status-dot" />
        LIVE, NOT A SCREENSHOT
      </div>
      <div className="hero-medal" aria-hidden="true">
        ✦
      </div>
      <h2>{unlockedCount ? 'A little momentum.' : 'Your first win awaits.'}</h2>
      <p>
        {unlockedCount
          ? 'That feeling? You can build it into your app.'
          : 'One click. A real achievement. Give it a try.'}
      </p>
      <div className="demo-progress">
        <span>Small wins</span>
        <span>{Math.min(count, 3)} / 3</span>
      </div>
      <progress value={Math.min(count, 3)} max={3} aria-label="Small wins" />
      <button
        className="button button-light"
        disabled={count >= 3}
        onClick={() => increment('score')}
      >
        {count >= 3 ? (
          <>
            <Check size={16} /> All wins unlocked
          </>
        ) : (
          <>
            Make a little progress <ArrowRight size={16} />
          </>
        )}
      </button>
      <div className="demo-status" role="status">
        {unlockedCount} of 2 achievements unlocked
        {nextAchievement ? ` · Next: ${nextAchievement.achievementTitle}` : ' · You did it!'}
      </div>
    </>
  );
}
export function HomeDemo() {
  const [revision, setRevision] = useState(0);
  return (
    <div className="home-demo">
      <button
        className="demo-reset"
        onClick={() => setRevision((value) => value + 1)}
        aria-label="Reset live demo"
      >
        <RotateCcw size={15} />
      </button>
      <AchievementProvider
        key={revision}
        achievements={achievements}
        storage={StorageType.Memory}
        ui={{ enableConfetti: false, enableNotifications: false }}
      >
        <Preview />
      </AchievementProvider>
    </div>
  );
}
