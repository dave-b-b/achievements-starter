# Contributing

Thanks for helping make achievement integrations easier to understand and reuse.

## Current status

The application and automated verification suites are implemented. Use the [setup guide](docs/setup.md) for runtime, database, browser, and verification commands. Provider setup and the external developer beta remain separate checks in [verification status](docs/verification.md).

Start with the [product plan](docs/product-plan.md), [architecture](docs/architecture.md), and [roadmap](docs/roadmap.md). Select an issue whose dependencies are complete, and discuss material scope or architecture changes on that issue before implementing them.

## Development boundaries

- Install the two SDKs from published packages through their public exports.
- Keep app-specific authentication, lesson validation, and Postgres integration in this repository.
- Open SDK changes in the repository that owns the behavior and link the issue or pull request here. Consume the published fix after release.
- Keep example code complete and consistent with the dependency versions this repository verifies.
- Never commit credentials, user data, production database dumps, or local environment files. Commit only safe environment variable templates.
- No private development tooling is required to contribute.

## Pull requests

Link the implementation issue. Describe the visible outcome, relevant design decisions, verification performed, and any remaining limitations. Include screenshots or a short recording for UI changes, with loading and failure states where relevant.

Verification should match the behavior changed. Persistence and authorization changes need real database coverage; exported examples need to build and exercise an unlock. Do not claim checks that were unavailable or not run.

Update setup and architecture documentation when the implementation changes their instructions. Mark roadmap work complete only when its issue acceptance criteria are met.
