import { useState } from "react";
import { Link } from "react-router-dom";
import { useTestimonials } from "../hooks/useTestimonials";
import { OverallRating, ReviewCard } from "../components/home/Testimonials";
import ReviewModal from "../components/home/ReviewModal";

export default function Reviews() {
  const { testimonials, loading } = useTestimonials();
  const [writing, setWriting] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <Link to="/#reviews" className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">
        Back to home
      </Link>
      <h1 className="mt-4 font-display text-5xl font-light tracking-tight sm:text-6xl">All reviews</h1>

      <div className="my-10 flex flex-wrap items-center justify-between gap-6 border-y border-line/60 py-6">
        {!loading && <OverallRating list={testimonials} />}
        <button
          onClick={() => setWriting(true)}
          className="rounded-full border border-bone/30 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition hover:border-amber hover:text-amber"
        >
          Leave a review
        </button>
      </div>

      {!loading && !testimonials.length && (
        <p className="py-12 text-center font-display text-2xl italic text-fog">No reviews yet.</p>
      )}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <ReviewCard key={t.id} t={t} />
        ))}
      </div>
      {writing && <ReviewModal onClose={() => setWriting(false)} />}
    </section>
  );
}
