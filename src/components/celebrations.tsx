'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { NotificationProps, UIConfig } from 'react-achievements';
import { AchievementDialog } from './achievement-collection';
import { finalArcadeAward } from '../game/achievements';

function AchievementNotice({
  achievement,
  onClose,
  duration = 4500,
  stackIndex = 0,
  theme,
  inGame = false,
}: NotificationProps & { inGame?: boolean }) {
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const timer = setTimeout(() => close.current?.(), duration);
    return () => clearTimeout(timer);
  }, [duration]);
  if (inGame) {
    return (
      <div
        className="achievement-notice arcade-achievement-notice"
        style={{ top: 10 + stackIndex * 38 }}
        role="status"
        aria-label={`Achievement unlocked: ${achievement.achievementTitle}`}
        data-testid="achievement-notice"
      >
        <span className="notice-icon" aria-hidden="true">
          {achievement.achievementIconKey || '✦'}
        </span>
        <strong>{achievement.achievementTitle}</strong>
        <button onClick={onClose} aria-label="Dismiss achievement notification">
          <X size={13} />
        </button>
      </div>
    );
  }
  return (
    <div
      className={`achievement-notice notice-${theme || 'modern'}`}
      style={{ top: 16 + stackIndex * 116 }}
      role="status"
      data-testid="achievement-notice"
    >
      <span className="notice-icon" aria-hidden="true">
        {achievement.achievementIconKey || '✦'}
      </span>
      <div>
        <span className="notice-eyebrow">Achievement unlocked</span>
        <strong>{achievement.achievementTitle}</strong>
        <p>{achievement.achievementDescription}</p>
      </div>
      <button onClick={onClose} aria-label="Dismiss achievement notification">
        <X size={17} />
      </button>
    </div>
  );
}

// The SDK still decides when an achievement unlocks; only its presentation moves
// into the playfield so the reward appears beside the action that earned it.
export function ArcadeAchievementNotice(props: NotificationProps) {
  const [stage, setStage] = useState<HTMLElement | null>(null);
  const close = useRef(props.onClose);
  useEffect(() => setStage(document.getElementById('arcade-stage')), []);
  useEffect(() => {
    close.current = props.onClose;
  }, [props.onClose]);
  useEffect(() => {
    if (props.achievement.achievementTitle !== finalArcadeAward.title) return;
    const timer = setTimeout(() => close.current?.(), props.duration ?? 4500);
    return () => clearTimeout(timer);
  }, [props.achievement.achievementTitle, props.duration]);
  // The victory screen renders the final SDK award at a larger size with the full collection.
  if (!stage || props.achievement.achievementTitle === finalArcadeAward.title) return null;
  return createPortal(<AchievementNotice {...props} duration={2400} inGame />, stage);
}

// The SDK owns unlock detection and confetti; this public UI override matches the starter.
export const celebrationUI: UIConfig = {
  enableConfetti: true,
  enableNotifications: true,
  theme: 'modern',
  notificationDuration: 4500,
  NotificationComponent: AchievementNotice,
  ModalComponent: AchievementDialog,
  confetti: {
    colors: ['#a78bfa', '#f3cf80', '#8fbba0'],
    particleCount: 110,
    duration: 2400,
    zIndex: 2600,
  },
};
