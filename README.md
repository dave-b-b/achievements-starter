# Achievements Starter

A Next.js reference application and interactive playground for [achievements-engine](https://github.com/dave-b-b/achievements-engine) and [react-achievements](https://github.com/dave-b-b/react-achievements).

**[Try the live demo](https://achievements-starter.vercel.app)** — deployed on Vercel Hobby. The public demo, builder playground, lessons, and optional guided tours work without accounts. Production sign-in and saved progress are not configured yet; see [verification status](docs/verification.md).

![LearnQuest overview](public/screenshots/overview-desktop.png)

## Run locally

Use Node.js 24:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:3417**. No credentials are needed to explore. See the [full setup guide](docs/setup.md) for authentication and persistence, the [free deployment guide](docs/deployment.md), and [verification status](docs/verification.md).

## What we're building

**LearnQuest** is the example application: a short course that teaches developers to add achievements to an app while demonstrating saved progress and achievement unlocks.

| Experience    | Behavior                                                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `/playground` | Try three presets without signing in, change thresholds and appearance, trigger achievements, and copy a complete working integration. |
| `/learn`      | Read three short lessons, sign in to save completion, unlock three milestones, and return to persistent progress.                      |

The demo and exported examples use `AchievementBuilder` throughout. Optional guided tours help visitors reach a first unlock and follow the setup path.

The starter consumes published SDK releases. It demonstrates authentication, database persistence, accessible UI, and safe retries without copying the SDK implementations into this repository.

## Start here

- [Product plan](docs/product-plan.md): audience, scope, flows, acceptance criteria, and adoption goals.
- [Architecture](docs/architecture.md): ownership, data flow, authentication, transaction boundaries, and verification.
- [Roadmap](docs/roadmap.md): implementation order and milestone issues.
- [Contributing](CONTRIBUTING.md): how to contribute during planning and implementation.
- [Issues](https://github.com/dave-b-b/achievements-starter/issues): implementation tasks and acceptance criteria.

## Stack

Next.js 16.4.3, React 19.3.1, TypeScript 6.0.3, Supabase Auth/Postgres, and Vercel Hobby. SDK versions are pinned at Engine 2.0.2 and React Achievements 5.0.2, with a committed lockfile.

The server-backed journey is: **sign in → complete one lesson → save progress and achievement state together → reload and see the result preserved**.

## Project boundaries

| Repository                                                             | Owns                                                                                                                           |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [achievements-engine](https://github.com/dave-b-b/achievements-engine) | Rule evaluation, achievement state, persistence contracts, and shared server contracts.                                        |
| [react-achievements](https://github.com/dave-b-b/react-achievements)   | React providers, hooks, widgets, and presentation.                                                                             |
| This repository                                                        | Lessons, authentication, database adapter and migrations, application routes, playground, deployment, and onboarding examples. |

SDK changes should be made in their owning repositories and linked from the issue that needs them. This application should use their published versions after those changes are released.

## License

[MIT](LICENSE).
