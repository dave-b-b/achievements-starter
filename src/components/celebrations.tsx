'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { NotificationProps, UIConfig } from 'react-achievements';
import { AchievementDialog } from './achievement-collection';

function AchievementNotice({
  achievement,
  onClose,
  duration = 4500,
  stackIndex = 0,
  theme,
}: NotificationProps) {
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const timer = setTimeout(() => close.current?.(), duration);
    return () => clearTimeout(timer);
  }, [duration]);
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
