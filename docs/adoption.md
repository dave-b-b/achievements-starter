# Adoption measurements and beta protocol

Status: implementation available; developer beta and observed external integrations pending.

## Measurement definitions

Site analytics is optional and off by default. Enable `NEXT_PUBLIC_ENABLE_ANALYTICS=true` only for the intended production release. The browser respects Do Not Track and sends only one fixed event name. The server accepts that allowlist and increments a `(day, event)` aggregate. No identifier, email, IP address, copied source, or lesson payload is written to the analytics table.

| Event             | Definition                                                               | Deduplication                                                |
| ----------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `playground_view` | The playground component mounts.                                         | At most once per browser tab session.                        |
| `first_unlock`    | The playground's real engine first reports an unlocked achievement.      | At most once per browser tab session, across resets/presets. |
| `copy_code`       | A clipboard copy succeeds or the user requests a source download.        | At most once per browser tab session.                        |
| `starter_open`    | The user follows the runnable example or setup link from the playground. | At most once per browser tab session.                        |

These are approximate event/session counts, not identified people or confirmed integrations. A returning tab, blocked analytics, changed browser storage, bots, or direct traffic to another page can affect the funnel. Daily event totals can be viewed privately:

```sql
select day, event, count from public.daily_events order by day desc, event;
```

Daily counts are capped at 100,000 per event. Preview analytics stays off. Keep known maintainer verification traffic out of production collection. Do not turn analytics failures into product failures.

## Package baseline

The maintainer reported approximately 100 weekly downloads when the plan was created. A fresh pre-launch API check on 2026-10-28 at 17:14 UTC returned the following for 2026-10-21 through 2026-10-27:

| Package             | Weekly downloads |
| ------------------- | ---------------- |
| achievements-engine | 98               |
| react-achievements  | 125              |

These are package download counts and may include automation; they are not a measured audience size or a result of this unreleased app. Record fresh per-package numbers, the returned date range, and the retrieval time using the [npm download-count API](https://github.com/npm/registry/blob/main/docs/download-counts.md). Compare a rolling four-week average; downloads are not unique users.

## Beta review

Recruit 5–10 developers who did not implement the app. Outreach and scheduling require the maintainer's own contacts and authorization; no invitations have been sent by this implementation.

Give participants these tasks without coaching:

1. Find and unlock an achievement in the playground.
2. Change a rule and explain what the change does.
3. Run the minimal integration in their own environment.
4. Locate the persistence example and explain how it differs from the local preview.

Record anonymized participant labels, observed time to first unlock, unaided integration success, confusion, and the next change to try. Keep contact details and raw recordings outside this public repository. Ask separately and voluntarily whether a participant has used the package in a real project and whether they are comfortable sharing a public link.

Initial targets: 8 of 10 unaided integrations, then 3 confirmed external integrations. These are targets; do not fill in success numbers until observed. Track follow-up friction in issues and classify material launch blockers explicitly.
