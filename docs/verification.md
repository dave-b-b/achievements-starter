# Verification and delivery status

Date: 2026-10-28. This file distinguishes implemented behavior from provider setup and external validation.

## Implemented

- Next.js application consuming published Engine 2.1.0 and React Achievements 6.0.0 releases.
- Builder-based definitions across the landing demo, playground, course, copied code, and independent minimal React example.
- Automatic first-visit React Joyride 3.2.0 tours for playground discovery and starter setup, including a real preview unlock, remembered completion/dismissal, and manual replay.
- Safe three-preset playground, customization/reset, code export/download, and independent minimal React example.
- Visible complete achievement collections and real unlock confetti/notifications across the demos, including a guest course collection.
- Starfall arcade: three waves, player shields, collision-based scoring, keyboard/touch controls, auto-fire, pause/replay, and five builder-defined SDK achievements. Game progress is memory-only and separate from saved course progress.
- Three public lessons, server-backed React client, authenticated completion and snapshot routes, and saved-progress UI.
- Cookie-based Supabase OAuth flow, request origin checks, server-derived subject IDs, and server-only database wiring.
- Real Postgres transaction-bound persistence, per-user locking, unique completion constraints, versioned state, and migrations.
- Optional aggregate analytics, off by default, plus setup and free deployment guides.

## Local evidence

- Twelve unit scenarios cover real engine unlocks, generated TSX syntax, bounded configuration, safe string serialization, origin checks, safe errors, and the restricted application client.
- Eight real Postgres scenarios cover isolated users, multiple database clients, duplicate and distinct concurrent requests, injected save-failure rollback, lost-response retry, unknown lesson rejection, and denied reads/writes under browser-facing roles.
- Export verification type-checks and production-builds all three generated presets in the independent minimal project.
- Twenty-eight desktop and mobile browser scenarios passed, covering public journeys, accessibility rules, keyboard-scrollable code, horizontal overflow, screenshot capture, guided-tour completion/skip/replay, Escape dismissal, and tour-driven real unlocks.
- The automatic first-visit update passed fourteen focused desktop/mobile scenarios: initial start, completion and dismissal remembered across reloads, manual replay, separate setup/playground preferences, blocked storage, live preview actions, and accessibility on both guided pages.
- The first real-account check exposed an authenticated-render failure: the client-backed provider was also given local achievement definitions. The learning page now uses only its server client; server-side rendering tests exercise both signed-in and guest branches against the published React SDK. All fourteen unit scenarios pass.

- The app and independent minimal example now pin published Engine 2.1.0 and React Achievements 6.0.0. Both registry lockfiles match the published SHA-512 integrities, and clean locked installs passed for both projects. The upgrade passed fourteen unit scenarios, eight real Postgres scenarios, type checking, formatting, the production build, all three generated builder-example builds, and all thirty desktop/mobile browser scenarios. Repository screenshots were refreshed and inspected. The published-SDK update was subsequently deployed through PR #16 and passed all twenty-eight public production browser scenarios.

The Starfall and visible-celebrations update adds simulation and SDK award tests plus desktop/mobile checks for real confetti, notifications, complete collections, keyboard focus, paused gameplay, fresh runs, and expired-sign-in recovery. All twenty-one unit scenarios, forty-four desktop/mobile browser scenarios, type checking, formatting, all three generated builder-example builds, and the production build passed locally. The full simulation can defeat all twenty-one scouts and unlock all five real SDK achievements. Desktop/mobile product screenshots were refreshed and inspected; hosted and deployment results are recorded on the delivery pull request.

The first database run exposed doubly serialized JSON state. The adapter now sends serialized state as text before the JSONB cast; the rollback, retry, and concurrency scenarios pass with the real SDK.

## Production evidence

- Public app: https://achievements-starter.vercel.app, deployed on 2026-10-28 from commit `f6650f8` through [implementation PR #13](https://github.com/dave-b-b/achievements-starter/pull/13).
- Vercel account plan verified as Hobby. Framework preset corrected to Next.js, Node.js 24, with the production origin set to the verified free domain. No paid service or upgrade was enabled.
- The selected Supabase organization was independently checked through its Management API and reports the Free plan. The dedicated `react-achievements-demo` project is reachable and had no application tables before setup.
- Both committed migrations were applied to that project. The production login owns the four LearnQuest tables and has no schema CREATE permission. A real connection passed certificate-verified TLS, table access, and transactional rollback checks. Anonymous Data API requests were denied for all four tables. GitHub sign-in is enabled in the provider.
- Twenty-six desktop and mobile scenarios passed against the public production URL: actual unlock/reset, all playground presets, generated builder code, public lessons, origin rejection, accessibility/overflow, optional tours, and keyboard dismissal. Screenshot-only scenarios were excluded from this production run.
- GitHub verification passed on the implementation, including a fresh locked install, real Postgres scenarios, generated-example builds, production build, and desktop/mobile browser scenarios.
- The automatic-tour and verified-TLS update was deployed from commit `c0b2e62` through [PR #14](https://github.com/dave-b-b/achievements-starter/pull/14). The production backend values, provider CA, site origin, and exact auth callback are configured; Preview deployments have no production backend values.
- The deployed sign-in route returns a 303 to Supabase, then a 302 to GitHub with the generated client ID and correct Supabase callback. The subsequent real-account check is recorded below.
- The updated production suite passed all twenty-eight desktop/mobile public scenarios, including automatic first-visit tours, remembered dismissal/completion, replay, and blocked storage. The first run caught the contrast scan during the tooltip's opacity transition; the check now waits for full opacity before scanning. The affected scenario also passed six repeated desktop/mobile runs.
- The authenticated-provider fix was deployed from `ce570c7` through [PR #15](https://github.com/dave-b-b/achievements-starter/pull/15). The owner confirmed successful GitHub sign-in, lesson completion, and progress preserved after reload. An independent read-only database check confirmed one learner, one saved lesson completion, and one persisted achievement-state record. This verifies the first-lesson journey; all-three-lesson and account-switching provider checks remain below.

## Remaining external checks

- Exercise all three milestones, sign-out/account switching, and provider session refresh through the deployed app. The first-lesson GitHub sign-in, completion, and reload journey is verified.
- Verify authenticated direct Data API access to progress tables is denied. Anonymous direct requests are already denied in production; local authenticated SQL role coverage is not a substitute for this remaining provider-level check.
- Complete a fresh-developer setup review and the 5–10 developer beta; no external integration or adoption gains are claimed.
- Record the final walkthrough, including the verified authenticated first-lesson journey.

## Commands

See [setup](setup.md) for reproducible commands and the [roadmap](roadmap.md) for the corresponding issue dependencies. Test output is verification evidence only for the environment actually exercised. No paid service, background keep-alive, or production account mutation is required for the local suite.
