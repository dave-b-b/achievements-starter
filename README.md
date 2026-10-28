# Achievements Starter

A planned Next.js reference application and interactive playground for [achievements-engine](https://github.com/dave-b-b/achievements-engine) and [react-achievements](https://github.com/dave-b-b/react-achievements).

**Status: planning.** This repository currently contains the product plan, architecture, and implementation roadmap. The application, live demo, screenshots, and runnable setup instructions will be added as the milestones ship.

## What we're building

**LearnQuest** is the example application: a short course that teaches developers to add achievements to an app while demonstrating saved progress and achievement unlocks.

| Experience | Planned behavior |
| --- | --- |
| `/playground` | Try three presets without signing in, change thresholds and appearance, trigger achievements, and copy a complete working integration. |
| `/learn` | Read three short lessons, sign in to save completion, unlock three milestones, and return to persistent progress. |

The starter will consume published SDK releases. It will demonstrate authentication, database persistence, accessible UI, and safe retries without copying the SDK implementations into this repository.

## Start here

- [Product plan](docs/product-plan.md): audience, scope, flows, acceptance criteria, and adoption goals.
- [Architecture](docs/architecture.md): ownership, data flow, authentication, transaction boundaries, and verification.
- [Roadmap](docs/roadmap.md): implementation order and milestone issues.
- [Contributing](CONTRIBUTING.md): how to contribute during planning and implementation.
- [Issues](https://github.com/dave-b-b/achievements-starter/issues): implementation tasks and acceptance criteria.

## Proposed stack

Next.js App Router, TypeScript, Supabase Auth and Postgres, and Vercel. Exact runtime and dependency versions will be selected and locked in the first implementation milestone.

The first technical milestone is one complete journey: **sign in → complete one lesson → save progress and achievement state together → reload and see the result preserved**.

## Project boundaries

| Repository | Owns |
| --- | --- |
| [achievements-engine](https://github.com/dave-b-b/achievements-engine) | Rule evaluation, achievement state, persistence contracts, and shared server contracts. |
| [react-achievements](https://github.com/dave-b-b/react-achievements) | React providers, hooks, widgets, and presentation. |
| This repository | Lessons, authentication, database adapter and migrations, application routes, playground, deployment, and onboarding examples. |

SDK changes should be made in their owning repositories and linked from the issue that needs them. This application should use their published versions after those changes are released.

## License

[MIT](LICENSE).
