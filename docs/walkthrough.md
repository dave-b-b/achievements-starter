# Walkthrough and case study outline

Status: recording plan; not a claim that a video or deployed release already exists.

## 60–90 second demonstration

- 0–15 seconds: explain the developer problem and trigger the landing page's real achievement.
- 15–35 seconds: open the playground, change a threshold and title, unlock the customized achievement, and copy the complete code.
- 35–55 seconds: open the learning course, sign in, complete a lesson, and refresh to show saved progress. Record this only after the actual provider setup is verified.
- 55–75 seconds: show the starter and explain the package boundaries: engine, React UI, and application-owned auth/persistence.
- 75–90 seconds: show the transaction verification evidence and describe a duplicate request and a partial failure. Link the source and setup guide.

## Case study

The problem: developers need a fast path from seeing an achievement to integrating one, and a trustworthy example for saved server-owned progress.

The product response: a no-registration playground, complete export, and a small authenticated learning application using the published SDKs.

The engineering decisions: retain the engine/React split; keep the first SQL adapter in the app; derive absolute metrics from persisted completions; commit progress and achievement state in one transaction; isolate previews from production data; keep deployment on free service plans.

The evidence: report only completed checks in verification.md. Include observed developer feedback and package download windows when available. Keep targets and estimates separate from results.

The tradeoffs: a short fixed course limits content scope; serialized UI mutations avoid unnecessary synchronization complexity; Supabase Free can pause after inactivity; exact-once visual celebration is not guaranteed across a lost response, while saved state remains idempotent.
