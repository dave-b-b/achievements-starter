'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="page reading-page">
      <div className="page-heading">
        <h1>Let’s try that again.</h1>
        <p>This page could not load. Your saved progress is kept on the server.</p>
      </div>
      <button className="button button-primary" onClick={reset}>
        Retry page
      </button>
    </div>
  );
}
