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

## Remaining external checks

- Confirm Vercel Hobby and Supabase Free destinations, set provider environment values, and apply migrations to the chosen project.
- Exercise actual GitHub OAuth, sign-out/account switching, provider session refresh, and persistence through the deployed app.
- Verify the selected Supabase Data API denies anonymous and authenticated direct access to progress tables. Local SQL role coverage is not a substitute for this provider-level check.
- Complete a fresh-developer setup review and the 5–10 developer beta; no external integration or adoption gains are claimed.
- Add the verified public URL and record the final walkthrough after deployment.

## Commands

See [setup](setup.md) for reproducible commands and the [roadmap](roadmap.md) for the corresponding issue dependencies. Test output is verification evidence only for the environment actually exercised. No paid service, background keep-alive, or production account mutation is required for the local suite.
