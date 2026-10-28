'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AchievementProvider, useSimpleAchievements } from 'react-achievements';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCheck,
  Clock3,
  GitFork as Github,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
} from 'lucide-react';
import { lessons } from '../course/lessons';
import { createLearningClient } from '../achievements/client';
import { AchievementBoard } from './achievement-board';

type LearningProps = { userId: string | null; configured: boolean; authFailed: boolean };
export function Learning(props: LearningProps) {
  const [client] = useState(createLearningClient);
  if (!props.userId) return <Course {...props} />;
  return (
    <AchievementProvider
      key={props.userId}
      client={client}
      ui={{ enableConfetti: false, enableNotifications: false }}
    >
      <SavedCourse {...props} />
    </AchievementProvider>
  );
}
function SavedCourse(props: LearningProps) {
  const state = useSimpleAchievements();
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const busy = useRef(false);
  const refreshRef = useRef(state.refresh);
  refreshRef.current = state.refresh;
  useEffect(() => {
    const reload = () => {
      if (!busy.current) void refreshRef.current().catch(() => {});
    };
    window.addEventListener('focus', reload);
    return () => window.removeEventListener('focus', reload);
  }, []);
  const completed = (state.metrics.completedLessonIds || []).filter(
    (id: unknown): id is string => typeof id === 'string',
  );
  async function complete(id: string) {
    if (busy.current) return;
    busy.current = true;
    setPending(id);
    setProblem(null);
    setMessage(null);
    try {
      await state.event('lesson.completed', id);
      setMessage('Lesson saved. Another small win, safely kept.');
    } catch (error) {
      setProblem(error instanceof Error ? error.message : 'Unable to save. Please retry.');
    } finally {
      busy.current = false;
      setPending(null);
    }
  }
  return (
    <Course
      {...props}
      completed={completed}
      loading={state.isLoading}
      pending={pending}
      problem={problem || state.error?.message}
      message={message}
      onComplete={complete}
      onRetry={() => {
        setProblem(null);
        void state.refresh().catch(() => {});
      }}
    >
      <AchievementBoard compact />
    </Course>
  );
}
type CourseProps = LearningProps & {
  completed?: string[];
  loading?: boolean;
  pending?: string | null;
  problem?: string | null;
  message?: string | null;
  onComplete?: (id: string) => void;
  onRetry?: () => void;
  children?: React.ReactNode;
};
function Course({
  userId,
  configured,
  authFailed,
  completed = [],
  loading,
  pending,
  problem,
  message,
  onComplete,
  onRetry,
  children,
}: CourseProps) {
  const [active, setActive] = useState(0);
  const lesson = lessons[active];
  return (
    <div className="learning-grid">
      <div className="course-main">
        <div className="lesson-list" aria-label="Course lessons">
          {lessons.map((item, index) => (
            <button
              key={item.id}
              className={`lesson-tab ${active === index ? 'selected' : ''}`}
              aria-pressed={active === index}
              onClick={() => {
                setActive(index);
              }}
            >
              <span
                className={completed.includes(item.id) ? 'lesson-number done' : 'lesson-number'}
              >
                {completed.includes(item.id) ? <Check size={16} /> : item.number}
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>
                  <Clock3 size={11} /> {item.duration}
                </small>
              </span>
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
        <article className="lesson-article" aria-labelledby="lesson-title">
          <div className="eyebrow">
            LESSON {lesson.number} <span className="note-divider">/</span> {lesson.tag}
          </div>
          <h2 id="lesson-title">{lesson.title}</h2>
          <p className="lesson-summary">{lesson.summary}</p>
          {lesson.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 30)}>{paragraph}</p>
          ))}
          <div className="lesson-code">
            <div>
              YOUR STARTING POINT <span>tsx</span>
            </div>
            <pre tabIndex={0}>
              <code>{lesson.code}</code>
            </pre>
          </div>
          <div className="takeaway">
            <BookOpen size={19} />
            <div>
              <strong>The little takeaway</strong>
              <p>{lesson.takeaway}</p>
            </div>
          </div>
          <div className="lesson-bottom">
            <span>
              {userId
                ? 'Saved to your account when completed.'
                : 'Sign in to keep your milestones.'}
            </span>
            {userId ? (
              <button
                className="button button-primary"
                disabled={Boolean(pending) || loading || completed.includes(lesson.id)}
                onClick={() => onComplete?.(lesson.id)}
              >
                {pending === lesson.id ? (
                  <>
                    <LoaderCircle className="spin" size={16} /> Saving…
                  </>
                ) : completed.includes(lesson.id) ? (
                  <>
                    <CheckCheck size={16} /> Lesson complete
                  </>
                ) : (
                  <>
                    Complete lesson <Check size={16} />
                  </>
                )}
              </button>
            ) : (
              <a className="button button-secondary" href="#account">
                Save your progress <ArrowRight size={15} />
              </a>
            )}
          </div>
          {active < 2 && (
            <button className="text-button next-lesson" onClick={() => setActive(active + 1)}>
              Next: {lessons[active + 1].title} <ArrowRight size={15} />
            </button>
          )}
        </article>
      </div>
      <aside className="course-sidebar">
        <section className="panel progress-card">
          <div className="eyebrow">ONE STEP AT A TIME</div>
          <h2>Your little journey</h2>
          <p>Three lessons. A little more confidence.</p>
          <div className="course-progress-value">
            <strong>
              {completed.length}
              <span> / 3</span>
            </strong>
            <span>{completed.length === 3 ? 'Beautifully done.' : 'lessons complete'}</span>
          </div>
          <progress value={completed.length} max={3} aria-label="Course completion" />
          {loading && <p role="status">Loading your saved progress…</p>}
          {completed.length === 3 && (
            <div className="course-finished" role="status">
              <CheckCheck size={20} />
              <strong>Ready to build.</strong>
              <p>
                All three lessons, all three milestones. Take your next small win into your own app.
              </p>
              <Link href="/setup">
                Use the starter <ArrowRight size={14} />
              </Link>
            </div>
          )}
          {problem && (
            <div className="error-state" role="alert">
              <p>{problem}</p>
              <button
                className="text-button"
                disabled={Boolean(pending) || loading}
                onClick={onRetry}
              >
                <RefreshCw size={14} /> Reload saved progress
              </button>
            </div>
          )}
          {message && (
            <p className="success-message" role="status">
              {message}
            </p>
          )}
        </section>
        {children || (
          <section className="panel guest-achievements">
            <h3>Three milestones to discover</h3>
            {['First spark', 'Making connections', 'Ready to build'].map((name, i) => (
              <div key={name}>
                <span className="small-medal" aria-hidden="true">
                  {['✦', '⌘', '◆'][i]}
                </span>
                <span>
                  <strong>{name}</strong>
                  <small>
                    Complete {i + 1} {i === 0 ? 'lesson' : 'lessons'}
                  </small>
                </span>
                <LockKeyhole size={14} />
              </div>
            ))}
          </section>
        )}
        <section className="panel account-card" id="account">
          <div className="card-icon purple">
            <Github size={21} />
          </div>
          <h3>{userId ? 'Your progress, kept.' : 'Keep your small wins.'}</h3>
          <p>
            {userId
              ? 'You’re signed in. Your completed lessons will be here when you return.'
              : configured
                ? 'Sign in with GitHub to save your lessons and collect your milestones.'
                : 'Read every lesson and try the playground now. Account sign-in will be available once the free backend is connected.'}
          </p>
          {authFailed && (
            <p className="error-text" role="alert">
              Sign-in didn’t complete. Please try again.
            </p>
          )}
          {userId ? (
            <form action="/auth/sign-out" method="post">
              <button className="text-button">Sign out</button>
            </form>
          ) : configured ? (
            <form action="/auth/sign-in" method="post">
              <button className="button button-dark">
                <Github size={16} /> Continue with GitHub
              </button>
            </form>
          ) : (
            <Link className="button button-secondary" href="/playground">
              Try the playground <ArrowRight size={15} />
            </Link>
          )}
        </section>
      </aside>
    </div>
  );
}
