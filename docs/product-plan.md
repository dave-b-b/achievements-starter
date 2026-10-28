# Product plan

Status: proposed implementation baseline. Last updated: 2026-10-28.

## Goal and audience

Help React developers understand, try, and integrate the two achievement SDKs. Provide a complete application whose UI, server behavior, and operational decisions can be inspected and reused.

The primary audience is a developer adding onboarding, learning progress, or task completion achievements to a React application. Secondary readers include maintainers, contributors, and engineers evaluating the implementation.

The existing baseline is approximately 100 weekly package downloads, as reported by the maintainer. The measurement source and package-by-package counts still need to be recorded. A longer-term distribution goal is thousands of weekly downloads; this is a goal, not a forecast or a count of unique users.

## Product deliverables

1. A no-registration playground that turns a working preview into a complete integration example.
2. A production reference application and reusable starter showing authentication, server-owned progress, persistent achievements, and recovery from failures.

Both experiences live in this repository and one deployment. The two SDKs retain their existing repository and publication boundaries.

## Included in the first release

### Learning application: `/learn`

- Three publicly readable lessons: define an achievement, track activity, and render progress.
- One authentication method; GitHub OAuth is the proposed default for this developer audience.
- Sign-in required to retain completion. Reading lessons and using the playground remain available without an account.
- Three achievement milestones: first lesson, two lessons, and course completion.
- Persistent completion and achievement state, visible progress, and a course completion state.
- Responsive layouts, keyboard access, reduced-motion support, and understandable loading, error, and retry states.

### Interactive playground: `/playground`

- Three presets: onboarding, learning, and task completion.
- Builder-based rule definitions and exports, plus optional React Joyride tours for playground discovery and setup.
- Safe numeric and boolean controls for rules, plus supported title, icon, and theme options.
- Action buttons, a live preview using the real SDKs, and a reset action.
- Complete copyable integration code, a browser-runnable minimal example, and a link to the full starter.
- Guest preview state isolated from authenticated course progress.

### Developer experience

- Installation from published packages, with an exact verified dependency pair and committed lockfile.
- A complete minimal example and a separate full application setup guide.
- Database migrations, documented environment variable names, and instructions for development, verification, and deployment.
- Public architecture and behavior evidence that matches the shipped application.

## Deferred scope

CMS authoring, arbitrary JavaScript rule execution, streak calendars, leaderboards, points economies, payments, organizations, guest-progress merging, realtime synchronization, offline synchronization, multiple database adapters, and a general rule inspector.

The application will not depend on an additional adapter package for v1. Its transaction-bound Postgres adapter stays here until demonstrated reuse justifies extraction.

## Core journeys

| Journey   | Steps                                                        | Successful outcome                                                                                 |
| --------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Discover  | Open playground → choose preset → trigger an action          | First achievement is understandable and can be unlocked in about 30 seconds.                       |
| Customize | Edit safe settings → preview → copy code                     | The copied example reproduces the chosen configuration and builds against the documented versions. |
| Integrate | Open minimal example → install packages → follow quick start | A developer reaches a first local unlock without filling in missing implementation.                |
| Learn     | Read lesson → sign in → complete lesson                      | Server validates the request and returns persisted progress and newly unlocked achievements.       |
| Return    | Sign out → sign back in or use a second session              | Previously committed progress is restored for that account.                                        |
| Recover   | Retry a request after a failure or lost response             | A lesson counts once and committed state remains consistent.                                       |

## Release acceptance

- A fresh setup follows documented steps and uses published packages, without sibling source checkouts or private tooling.
- Two users cannot read or modify each other's progress.
- Duplicate completion counts once; concurrent completion of different lessons preserves both.
- Failure while saving achievement state rolls back the lesson completion as well.
- A retry after a lost response preserves one completion and one persisted unlock.
- Guest preview changes and reset never modify saved account progress.
- Exported code builds and demonstrates a real unlock for each supported preset.
- Keyboard users can complete the core journeys, and reduced-motion preferences are honored.
- Public deployment, demo links, screenshots, and setup instructions are added only after verification.

## Adoption and feedback

Recruit 5–10 developers for the initial onboarding review. Record observed steps, time to first unlock, points of confusion, and whether they can complete the minimal integration without maintainer help.

| Measure                                           | Initial use                                               |
| ------------------------------------------------- | --------------------------------------------------------- |
| Playground visits → first unlock                  | Understand whether visitors reach and recognize value.    |
| First unlock → copy example or open starter       | Understand whether the demo creates integration interest. |
| Successful integrations reported voluntarily      | Confirm use beyond the demo.                              |
| Package downloads by package and reporting window | Track distribution over a rolling four-week period.       |

Initial learning targets are eight of ten testers completing the minimal integration without help and three confirmed external integrations. These targets guide iteration; they are not launch claims.

Use aggregate analytics on this site. Define event names and denominators before collecting data; exclude known test traffic where practical. Do not add telemetry to the SDKs or collect copied code, account identifiers, email addresses, or lesson payloads in analytics. Retention feedback can be collected voluntarily after 30 days.

## Delivery and presentation

Follow the [roadmap](roadmap.md). A 3–5 focused week estimate is provisional and should be revised after the first authenticated transaction works. Milestones have acceptance criteria rather than invented calendar deadlines.

Launch material includes a live demo, a 60–90 second walkthrough, and a short case study explaining the product problem, boundaries, transaction decisions, failure behavior, and observed onboarding results. Clearly distinguish measured results from targets.

## Assumptions to validate during implementation

- Next.js, Supabase, and Vercel remain a practical fit after the integration spike.
- Current published Engine 2.x and React 5.x releases provide the required public APIs; verify exact versions and compatibility before pinning.
- A single Node-runtime application can own both lesson completion and achievement persistence in the same Postgres transaction.
- Accounts, OAuth credentials, production URLs, and hosting configuration will be supplied through the appropriate provider settings; none are required to read this planning repository.
