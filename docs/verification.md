# Verification and delivery status

Date: 2026-10-28. This file distinguishes implemented behavior from provider setup and external validation.

## Implemented

- Next.js application consuming published Engine 2.0.2 and React Achievements 5.0.2 releases.
- Builder-based definitions across the landing demo, playground, course, copied code, and independent minimal React example.
- Optional React Joyride 3.2.0 tours for playground discovery and starter setup, including a real preview unlock.
- Safe three-preset playground, customization/reset, code export/download, and independent minimal React example.
- Three public lessons, server-backed React client, authenticated completion and snapshot routes, and saved-progress UI.
- Cookie-based Supabase OAuth flow, request origin checks, server-derived subject IDs, and server-only database wiring.
- Real Postgres transaction-bound persistence, per-user locking, unique completion constraints, versioned state, and migrations.
- Optional aggregate analytics, off by default, plus setup and free deployment guides.

## Local evidence

- Twelve unit scenarios cover real engine unlocks, generated TSX syntax, bounded configuration, safe string serialization, origin checks, safe errors, and the restricted application client.
- Eight real Postgres scenarios cover isolated users, multiple database clients, duplicate and distinct concurrent requests, injected save-failure rollback, lost-response retry, unknown lesson rejection, and denied reads/writes under browser-facing roles.
- Export verification type-checks and production-builds all three generated presets in the independent minimal project.
- Twenty-eight desktop and mobile browser scenarios passed, covering public journeys, accessibility rules, keyboard-scrollable code, horizontal overflow, screenshot capture, guided-tour completion/skip/replay, Escape dismissal, and tour-driven real unlocks.

The first database run exposed doubly serialized JSON state. The adapter now sends serialized state as text before the JSONB cast; the rollback, retry, and concurrency scenarios pass with the real SDK.

## Production evidence

- Public app: https://achievements-starter.vercel.app, deployed on 2026-10-28 from commit `f6650f8` through [implementation PR #13](https://github.com/dave-b-b/achievements-starter/pull/13).
- Vercel account plan verified as Hobby. Framework preset corrected to Next.js, Node.js 24, with the production origin set to the verified free domain. No paid service or upgrade was enabled.
- The selected Supabase organization was independently checked through its Management API and reports the Free plan. The dedicated `react-achievements-demo` project is reachable and had no application tables before setup.
- Both committed migrations were applied to that project. The production login owns the four LearnQuest tables and has no schema CREATE permission. A real connection passed certificate-verified TLS, table access, and transactional rollback checks. Anonymous Data API requests were denied for all four tables. GitHub sign-in is enabled in the provider.
- Twenty-six desktop and mobile scenarios passed against the public production URL: actual unlock/reset, all playground presets, generated builder code, public lessons, origin rejection, accessibility/overflow, optional tours, and keyboard dismissal. Screenshot-only scenarios were excluded from this production run.
- GitHub verification passed on the implementation, including a fresh locked install, real Postgres scenarios, generated-example builds, production build, and desktop/mobile browser scenarios.
- An isolated copy also passed unit checks and a production build with Engine 2.1.0 and React Achievements 6.0.0 package candidates. Those versions are not published dependencies of this app.

## Remaining external checks

- Finish the production auth callback and backend environment configuration, then deploy the certificate configuration support. Production currently runs the public experience without a backend connection.
- Exercise actual GitHub OAuth, sign-out/account switching, provider session refresh, and persistence through the deployed app.
- Verify the selected Supabase Data API denies anonymous and authenticated direct access to progress tables. Local SQL role coverage is not a substitute for this provider-level check.
- Complete a fresh-developer setup review and the 5–10 developer beta; no external integration or adoption gains are claimed.
- Record the final walkthrough after the authenticated journey is verified.

## Commands

See [setup](setup.md) for reproducible commands and the [roadmap](roadmap.md) for the corresponding issue dependencies. Test output is verification evidence only for the environment actually exercised. No paid service, background keep-alive, or production account mutation is required for the local suite.
