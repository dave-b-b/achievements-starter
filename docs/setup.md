# Run LearnQuest

## Public experience: no accounts required

Use Node.js 24 and npm 11. The repository pins React Achievements 6.0.0, Engine 2.1.0, Next.js 16.4.3, and React 19.3.1. TypeScript 6.0.3 retains the compiler API used to verify exported code.

```sh
git clone https://github.com/dave-b-b/achievements-starter.git
cd achievements-starter
npm ci
npm run dev
```

Open **http://127.0.0.1:3417**. The landing demo, playground, public lessons, setup, and architecture pages work without environment variables. The account card explains when saved progress is unavailable; it never pretends a guest preview was persisted.

## Minimal integration

For just the SDK integration:

```sh
cd examples/minimal
npm ci
npm run dev
```

Open the URL Vite prints. Replace `src/App.tsx` with an export from the playground. This example has an independent manifest and lockfile and uses published packages only.

## Enable saved progress

1. Create or select a dedicated **Supabase Free** project in a Free organization. See the [free deployment guide](deployment.md) before choosing provider options.
2. Copy `.env.example` to `.env.local`. Fill in the Supabase project URL and publishable key, the server-only Postgres transaction-pooler URL, and `APP_ORIGIN=http://127.0.0.1:3417`. Never commit `.env.local` or the database password.
3. Use the direct or session-pooler connection for `MIGRATION_DATABASE_URL` if needed for migrations. Use the transaction-pooler connection for serverless runtime operations. Both URLs must address the same database. Passwords containing reserved URL characters must be URL encoded.
4. Run `npm run db:migrate`. Migrations are atomic, ordered, and checksum checked. Add a new migration when the schema changes; do not edit an already applied file.
5. In GitHub developer settings, configure an OAuth application with the callback URL supplied by Supabase: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`. Configure that application's client ID and secret in Supabase Auth's GitHub provider settings. Keep the secret out of the repository and public browser variables.
6. In Supabase Auth URL configuration, allow `http://127.0.0.1:3417/auth/callback` and use the corresponding local site origin during local-only setup. When production is enabled, set the production Site URL and retain the explicit local redirect as appropriate. Avoid broad redirect wildcards.
7. Restart the application, sign in from `/learn`, and complete a lesson. Refresh and sign in again to verify persistence. Use a second test account to verify isolation.

The server connects as a table-owning database role (or a deliberately provisioned equivalent). Browser-facing `anon` and `authenticated` roles cannot directly access the progress or analytics tables. Every progress route validates the authenticated identity and accepts no client-supplied subject ID.

Supabase Auth owns its own user data. This app stores UUID subject IDs and progress, without copying profile or email data. To remove an account's app data, delete its row from `public.learners` using the authenticated administrative environment; related progress rows cascade. Handle removal from Supabase Auth separately. Verify the intended account privately before removal.

## Verification commands

```sh
npm run typecheck
npm test
npm run build
npm ci --prefix examples/minimal
npm run verify:examples
npx playwright install chromium
npm run test:e2e
```

The browser suite uses the dedicated port 3417. It checks both desktop and mobile Chrome, core public interactions, accessibility rules, and horizontal overflow. It captures current overview screenshots. Do not run an unrelated app on that port when verifying.

### Real database tests

Use a disposable database whose name contains `test`. Never point these tests at a production or shared development database: they create test roles, a temporary fault-injection trigger, and synthetic progress records. Apply migrations first:

```sh
DATABASE_URL=postgres://USER@127.0.0.1:55439/learnquest_test npm run db:migrate
DATABASE_TEST_URL=postgres://USER@127.0.0.1:55439/learnquest_test npm run test:db
```

A local PostgreSQL installation or isolated Postgres container works. The test administrator must be allowed to create `anon` and `authenticated` roles. Tests use separate connections to verify isolation, concurrent duplicates, concurrent distinct completions, rollback, and lost-response retries. They also verify direct table access is denied under browser-facing roles. The deployed Supabase Data API and actual OAuth flow require additional smoke checks against the selected provider project; local role tests do not establish those provider-level outcomes.

## Troubleshooting

- **Sign-in is unavailable:** all three Supabase URL/key/database variables must be configured. A paused Free project must be resumed in Supabase.
- **Completion returns a retry message:** confirm migrations, database connectivity, the runtime pooler URL, and the server role. Retries count an existing lesson once.
- **A mutation is rejected:** `APP_ORIGIN` must match the browser's exact origin, including scheme and port. Use the canonical deployment URL.
- **TLS validation fails:** download the root certificate from Supabase Database Settings. Supply its PEM with real newlines through `DATABASE_CA_CERT` in the hosting environment, or point `DATABASE_CA_FILE` at the downloaded file locally. The Supabase pooler uses this certificate authority; the default Node trust store is insufficient. Keep certificate verification enabled. The migration command supports both settings as well.
- **Exported code fails:** install the documented SDK versions, use a `.tsx` file, and retain the complete provider wrapper. Reproduce with `npm run verify:examples` before opening a bug.
