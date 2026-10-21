import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center px-5 py-20 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-fang">Error 404</p>
      <h1 className="mt-4 font-display text-6xl font-light tracking-tight sm:text-7xl">
        Something <em className="text-fang">ate</em> this page.
      </h1>
      <p className="mt-4 text-fog">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="mt-8 rounded-full bg-bone px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber">
        Back to the greenhouse
      </Link>
    </section>
  );
}
