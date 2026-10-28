'use client';
import { useSimpleAchievements } from 'react-achievements';
import { AchievementCard, AchievementCollection } from './achievement-collection';
export function AchievementBoard({
  compact = false,
  onOpenCollection,
}: {
  compact?: boolean;
  onOpenCollection?: () => void;
}) {
  const { allAchievements, unlockedCount, totalCount, isLoading } = useSimpleAchievements();
  return (
    <div className={compact ? 'achievement-board compact' : 'achievement-board'}>
      <div className="section-line">
        <h3>Your achievements</h3>
        <span className="subtle">
          {isLoading ? 'Loading…' : `${unlockedCount} / ${totalCount}`}
        </span>
      </div>
      <div className="badge-grid">
        {allAchievements.map((achievement) => (
          <AchievementCard key={achievement.achievementId} achievement={achievement} />
        ))}
      </div>
      <div className="widget-row">
        <AchievementCollection onOpen={onOpenCollection} />
      </div>
    </div>
  );
}
