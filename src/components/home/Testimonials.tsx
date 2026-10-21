import { useState } from "react";
import { Link } from "react-router-dom";
import { useTestimonials } from "../../hooks/useTestimonials";
import { InlineEdit } from "../InlineEdit";
import { StarRow } from "../Stars";
import ReviewModal from "./ReviewModal";
import type { Testimonial } from "../../lib/testimonial";

const QUOTE_MARK = (
  <svg viewBox="0 0 44 32" fill="currentColor" aria-hidden="true" className="h-6 w-8 text-fang opacity-60">
    <path d="M0 32V19.2C0 8.533 5.76 2.453 17.28 0L19.2 3.52C13.76 4.907 10.453 7.68 9.28 11.84h6.72V32H0zm24 0V19.2C24 8.533 29.76 2.453 41.28 0L43.2 3.52C37.76 4.907 34.453 7.68 33.28 11.84H40V32H24z" />
  </svg>
);

export function ReviewCard({ t, style }: { t: Testimonial; style?: React.CSSProperties }) {
  return (
    <article style={style} className="animate-rise flex min-w-[min(22rem,85vw)] flex-col border border-line/60 bg-moss/40 p-6 md:min-w-0">
      {QUOTE_MARK}
      <blockquote className="mt-4 flex-1 font-display text-xl font-light italic leading-relaxed text-bone/90">
        "{t.quote}"
      </blockquote>
      <footer className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-sans font-medium text-bone">{t.customer_name}</p>
          {t.plant_bought && (
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
              Bought: {t.plant_bought}
            </p>
          )}
        </div>
        <StarRow value={t.rating || 5} />
      </footer>
    </article>
  );
}

export function OverallRating({ list }: { list: Testimonial[] }) {
  const rated = list.filter((t) => t.rating > 0);
  const avg = rated.length ? rated.reduce((s, t) => s + t.rating, 0) / rated.length : 0;
  if (!rated.length) return <p className="text-fog">No ratings yet. Be the first to leave one.</p>;
  return (
    <div className="flex items-center gap-5">
      <span className="font-display text-6xl font-light leading-none text-bone">{avg.toFixed(1)}</span>
      <div>
        <StarRow value={avg} size={22} />
        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fog">
          Overall rating · {rated.length} {rated.length === 1 ? "review" : "reviews"}
        </p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { testimonials, loading } = useTestimonials();
  const [writing, setWriting] = useState(false);

  if (loading) return null;

  const shown = testimonials.slice(0, 3);

  return (
    <section id="reviews" className="scroll-mt-20 border-t border-line/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8">
          <InlineEdit contentKey="testimonials_label" label="Testimonials — label" as="p"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber" />
          <h2 className="mt-3 font-display text-4xl font-light tracking-tight sm:text-5xl">
            <InlineEdit contentKey="testimonials_heading" label="Testimonials — heading first part" />{" "}
            <InlineEdit as="em" contentKey="testimonials_heading_em" label="Testimonials — heading italic word" />
          </h2>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-between gap-6 border-y border-line/60 py-6">
          <OverallRating list={testimonials} />
          <div className="flex items-center gap-5">
            {testimonials.length > 0 && (
              <Link
                to="/reviews"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber underline-offset-4 hover:underline"
              >
                View all reviews
              </Link>
            )}
            <button
              onClick={() => setWriting(true)}
              className="rounded-full border border-bone/30 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition hover:border-amber hover:text-amber"
            >
              Leave a review
            </button>
          </div>
        </div>

        {shown.length > 0 && (
          <div
            className="flex gap-5 overflow-x-auto pb-4 md:grid md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
            style={{ gridTemplateColumns: `repeat(${shown.length}, 1fr)` }}
          >
            {shown.map((t, i) => (
              <ReviewCard key={t.id} t={t} style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        )}
      </div>
      {writing && <ReviewModal onClose={() => setWriting(false)} />}
    </section>
  );
}
