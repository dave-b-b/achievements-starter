# Deploy for zero service cost

Target: **Vercel Hobby + Supabase Free**, using the included `vercel.app` and `supabase.co` URLs. No paid domain, paid database plan, trial, paid add-on, cron service, or automatic upgrade is required. Deployment is not complete until the selected account plans, settings, and public journeys are verified.

## Free-plan boundaries

Checked against provider documentation on 2026-10-28:

| Service  | Plan and use                                       | Relevant boundary                                                                                                                                                                                          |
| -------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vercel   | Hobby, for a personal non-commercial demonstration | Free-plan quotas can restrict or pause features until the usage window resets. Keep this project on Hobby; do not start a Pro trial.                                                                       |
| Supabase | Free organization and Free project                 | Up to two active free projects across relevant owner/admin organizations; 500 MB database and 50,000 monthly active users in the advertised allowance. Free projects may pause after a week of inactivity. |
| GitHub   | Public source and workflow checks                  | Use public repository workflows and the included source hosting. No paid hosting add-on is needed.                                                                                                         |

Free quotas and terms can change. Review the [Vercel Hobby documentation](https://vercel.com/docs/plans/hobby), [Supabase pricing](https://supabase.com/pricing), and [organization billing model](https://supabase.com/docs/guides/platform/billing-on-supabase) before deployment. A project in a paid Supabase organization is not a Free project simply because its usage is small.

The public playground runs without the database. If Supabase pauses, saved-progress requests may fail until the operator resumes it; public lessons and the playground can still be used. Do not add artificial keep-alive traffic to bypass provider inactivity policies.

## First deployment

1. Confirm the Vercel destination is Hobby and the Supabase organization is Free. Reuse a dedicated existing Free project if one is available; do not create an additional billed project.
2. Import this GitHub repository into Vercel. Framework: Next.js. Root: repository root. Node.js: 24.x. Build command: `npm run build`. Install command: `npm ci`. Keep the provider's default Next.js output configuration.
3. The public app can deploy without secrets. It clearly explains that saved progress is not configured. Verify the landing demo, all playground presets, and public lessons first.
4. In the Supabase Free project, apply the committed migrations using the migration command from the setup guide. Keep database credentials in the local ignored environment or provider secret store.
5. Add these variables to Vercel **Production**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `DATABASE_URL` (server-only; Supabase transaction pooler)
   - `APP_ORIGIN` (the canonical `https://YOUR_PROJECT.vercel.app` origin)
6. Configure GitHub OAuth in Supabase and add the exact production `/auth/callback` URL to Supabase's redirect allowlist. The GitHub application's callback points to Supabase, as described in [setup](setup.md).
7. Redeploy because public environment variables are included at build time. Smoke-test sign-in, completion, reload, sign-out, and another account. Verify the database API cannot directly read or write progress with browser-facing credentials.
8. Add the verified URL to the README. Record the release commit and test results in [verification](verification.md).

## Preview isolation

Leave backend variables unset for Preview deployments by default. Preview builds then expose the fully functional playground and public lessons without connecting to production data. If authenticated preview testing is needed, use a separate Free Supabase project within the account's free project allowance and exact preview redirect URLs. Never copy production database credentials into preview settings.

## Cost controls and operations

- Retain Hobby and Free plans. Decline trials and upgrades; exceeding quota should limit availability rather than authorize spending.
- Keep analytics disabled initially. Enable aggregate analytics only after the preview/test environment is separated and event definitions are reviewed.
- Use the provider URLs; custom domains and managed email are optional future choices.
- Check usage and inactivity notifications before sharing the app in an interview or launch.
- Resume an inactive Supabase project manually when needed; no background scheduling service is part of this design.
- Export migrations and source from Git; any backup of real user progress must be stored privately. Free-plan backup guarantees are not assumed.
