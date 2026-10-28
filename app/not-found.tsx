import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="page reading-page">
      <div className="page-heading">
        <h1>A small detour.</h1>
        <p>That page isn’t here. Your next small win is still waiting.</p>
      </div>
      <Link className="button button-primary" href="/">
        Back to the beginning
      </Link>
    </div>
  );
}
