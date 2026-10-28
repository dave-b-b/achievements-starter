# Implementation roadmap

Application implementation has not started. The repository setup is complete; every issue below is open work.

The [product plan](product-plan.md) defines the scope and release acceptance. The [architecture](architecture.md) defines ownership and consistency boundaries. GitHub issues hold task acceptance and progress; this page is their dependency index.

## Milestones

### [M1: Published package integration](https://github.com/dave-b-b/achievements-starter/milestone/1)

A runnable Next.js baseline consumes published SDKs and demonstrates a real local unlock.

- [#1: Create the runnable Next.js baseline with published SDKs](https://github.com/dave-b-b/achievements-starter/issues/1) — dependencies: none.

### [M2: Authenticated persistence](https://github.com/dave-b-b/achievements-starter/milestone/2)

One lesson completion commits progress and achievement state together; authentication, retries, isolation, and rollback are verified.

- [#2: Add authenticated learner identity and Postgres migrations](https://github.com/dave-b-b/achievements-starter/issues/2) — dependencies: #1.
- [#3: Complete one lesson and persist achievement state atomically](https://github.com/dave-b-b/achievements-starter/issues/3) — dependencies: #2.
- [#4: Verify isolation, concurrency, rollback, and lost-response retries](https://github.com/dave-b-b/achievements-starter/issues/4) — dependencies: #3.

### [M3: Complete learning experience](https://github.com/dave-b-b/achievements-starter/milestone/3)

Three lessons, three milestones, persistent progress, and accessible recovery states form a complete course.

- [#5: Finish the three-lesson course and accessible progress experience](https://github.com/dave-b-b/achievements-starter/issues/5) — dependencies: #3.

### [M4: Interactive playground](https://github.com/dave-b-b/achievements-starter/milestone/4)

Guests can preview safe configurations and export complete, runnable integrations.

- [#6: Build the no-login playground with safe presets and live preview](https://github.com/dave-b-b/achievements-starter/issues/6) — dependencies: #1.
- [#7: Export complete integration code and ship a browser-runnable example](https://github.com/dave-b-b/achievements-starter/issues/7) — dependencies: #6.

### [M5: Developer onboarding](https://github.com/dave-b-b/achievements-starter/milestone/5)

Fresh developers can run the minimal example and full starter using accurate published-package guidance.

- [#8: Document and verify full starter setup from a fresh clone](https://github.com/dave-b-b/achievements-starter/issues/8) — dependencies: #4, #5.
- [#9: Align SDK onboarding links and examples with the verified starter](https://github.com/dave-b-b/achievements-starter/issues/9) — dependencies: #7, #8.

### [M6: Launch and adoption feedback](https://github.com/dave-b-b/achievements-starter/milestone/6)

A verified public deployment, aggregate funnel measurements, beta feedback, and an evidence-based walkthrough are available.

- [#10: Measure the onboarding funnel and run the developer beta](https://github.com/dave-b-b/achievements-starter/issues/10) — dependencies: #5, #7, #8.
- [#11: Deploy the verified demo and publish the walkthrough and case study](https://github.com/dave-b-b/achievements-starter/issues/11) — dependencies: #4, #5, #7, #8, #9, #10.

## Execution order

Begin with #1, then build the authenticated one-lesson journey through #2–#4. Complete the course in #5. The playground (#6–#7) can proceed after #1 if contributor capacity allows. Finish setup and upstream onboarding work (#8–#9), then beta feedback and launch (#10–#11). Follow each issue’s explicit dependencies before starting it.

No due dates are assigned. Re-estimate after the first authenticated transaction is verified. The initial 3–5 focused week estimate is provisional.

## Cross-repository work

SDK issues and pull requests belong in their owning repositories. Issue #9 coordinates the documentation audit and links verified upstream changes. Any implementation gap found earlier should be linked from its consuming issue, released upstream, and consumed here through published versions.

## Current next action

Implement #1: establish the runtime and package scripts, install a verified published SDK pair, and demonstrate one local unlock. No hosting credentials are needed to complete that first task.
