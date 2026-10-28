'use client';
import { AchievementsWidget, useSimpleAchievements } from 'react-achievements';
import { Check, LockKeyhole } from 'lucide-react';
export function AchievementBoard({ compact = false }: { compact?: boolean }) {
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
        {allAchievements.map((achievement, index) => (
          <div
            className={`badge-card ${achievement.isUnlocked ? 'earned' : ''}`}
            key={achievement.achievementId}
          >
            <div className={`medal medal-${index % 3}`} aria-hidden="true">
              {achievement.achievementIconKey || '✦'}
              <span className="medal-dot">
                {achievement.isUnlocked ? <Check size={10} /> : <LockKeyhole size={9} />}
              </span>
            </div>
            <strong>{achievement.achievementTitle}</strong>
            <span>{achievement.achievementDescription}</span>
            <small>{achievement.isUnlocked ? 'Unlocked' : 'In progress'}</small>
          </div>
        ))}
      </div>
      <div className="widget-row">
        <AchievementsWidget
          placement="inline"
          theme="minimal"
          label="View achievements"
          density="compact"
        />
      </div>
    </div>
  );
}
