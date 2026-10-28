'use client';
import {
  AchievementsList,
  AchievementsWidget,
  type AchievementWithStatus,
  type ModalProps,
} from 'react-achievements';
import { useEffect, useRef } from 'react';
import { Check, LockKeyhole, Trophy, ArrowUpRight, X } from 'lucide-react';

export function AchievementDialog({ onClose, achievements, icons }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previousFocus instanceof HTMLElement)
        requestAnimationFrame(() => {
          if (previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
        });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="achievement-dialog"
      aria-labelledby="collection-title"
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          event.preventDefault();
          closeButton.current?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="section-line">
        <div>
          <span className="eyebrow">EVERY SMALL WIN, IN ONE PLACE</span>
          <h2 id="collection-title">Your achievements</h2>
        </div>
        <button
          ref={closeButton}
          className="collection-close"
          onClick={onClose}
          aria-label="Close achievements"
        >
          <X size={20} />
        </button>
      </div>
      <p className="collection-description">See what you have earned and what to try next.</p>
      <AchievementsList
        achievements={achievements}
        icons={icons}
        showLocked
        styles={{
          achievementList: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 12,
          },
        }}
        renderAchievement={({ achievement, icon }) => (
          <AchievementCard achievement={achievement} icon={icon} />
        )}
      />
    </dialog>
  );
}

export function AchievementCard({
  achievement,
  icon,
}: {
  achievement: AchievementWithStatus;
  icon?: string;
}) {
  return (
    <div className={`badge-card ${achievement.isUnlocked ? 'earned' : ''}`}>
      <div className="medal" aria-hidden="true">
        {icon || achievement.achievementIconKey || '✦'}
        <span className="medal-dot">
          {achievement.isUnlocked ? <Check size={10} /> : <LockKeyhole size={9} />}
        </span>
      </div>
      <strong>{achievement.achievementTitle}</strong>
      <span>{achievement.achievementDescription}</span>
      <small>{achievement.isUnlocked ? 'Unlocked' : 'Locked'}</small>
      {!achievement.isUnlocked && achievement.progress && (
        <div className="badge-progress">
          <progress
            value={achievement.progress.current}
            max={achievement.progress.target}
            aria-label={`${achievement.achievementTitle} progress`}
          />
          <span>
            {achievement.progress.current} / {achievement.progress.target}
          </span>
        </div>
      )}
    </div>
  );
}

export function AchievementCollection({
  theme = 'minimal',
  onOpen,
}: {
  theme?: string;
  onOpen?: () => void;
}) {
  return (
    <AchievementsWidget
      placement="inline"
      theme={theme}
      label="View all achievements"
      showAllAchievements
      modalTitle="Your achievements"
      modalBackdropBlur={4}
      renderAchievement={({ achievement, icon }) => (
        <AchievementCard achievement={achievement} icon={icon} />
      )}
      renderTrigger={({ buttonProps, unlockedCount, totalCount }) => (
        <button
          {...buttonProps}
          className="collection-button"
          style={undefined}
          onClick={(event) => {
            onOpen?.();
            buttonProps.onClick?.(event);
          }}
        >
          <Trophy size={18} />
          <span>View all achievements</span>
          <strong>
            {unlockedCount} / {totalCount}
          </strong>
          <ArrowUpRight size={16} />
        </button>
      )}
    />
  );
}
