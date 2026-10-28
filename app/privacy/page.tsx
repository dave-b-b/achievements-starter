export const metadata = { title: 'Privacy' };
export default function Page() {
  return (
    <div className="page reading-page">
      <div className="eyebrow">A CLEAR VIEW OF YOUR DATA</div>
      <div className="page-heading">
        <h1>Your progress. A small footprint.</h1>
        <p>What this application stores, and why.</p>
      </div>
      <article className="panel prose">
        <h2>Exploring without an account</h2>
        <p>
          The playground and Starfall arcade run in browser memory. Its configurations and progress
          are not saved to your course account. Reloading or resetting starts the preview or game
          again. Starfall scores and achievements are not uploaded to the learning database.
        </p>
        <p>
          Your browser also remembers whether you finished or dismissed each guided tour, so it does
          not automatically repeat. These preferences stay in local storage and are not sent to the
          server. The guide buttons let you replay the tours.
        </p>
        <h2>Saved course progress</h2>
        <p>
          Signing in uses GitHub through Supabase Auth. Supabase handles authentication and session
          cookies. The application database stores your Supabase user ID, completed lesson IDs and
          timestamps, and achievement state. It does not store an additional copy of your email
          address or GitHub profile.
        </p>
        <h2>Optional aggregate analytics</h2>
        <p>
          Analytics is off by default. When the operator enables it, the site counts playground
          views, first unlocks, code copies, and starter opens by day. Requests contain only a fixed
          event name; the application analytics table stores no account identifier, email, IP
          address, copied code, or lesson payload. Session storage prevents repeating each event
          within a browser tab session. Do Not Track is respected. No telemetry is added to either
          SDK.
        </p>
        <h2>Hosting and account removal</h2>
        <p>
          Vercel, GitHub, and Supabase process requests under their own policies and may retain
          operational logs. This application does not add request bodies or user details to logs.
          For account and saved-progress removal, contact the maintainer through the GitHub profile
          linked below; do not post identifying account information in a public issue.
        </p>
        <p>
          <a href="https://github.com/dave-b-b">Maintainer profile</a> ·{' '}
          <a href="https://supabase.com/privacy">Supabase privacy policy</a> ·{' '}
          <a href="https://vercel.com/legal/privacy-policy">Vercel privacy policy</a>
        </p>
      </article>
    </div>
  );
}
