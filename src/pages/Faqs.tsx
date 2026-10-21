import { useState } from "react";
import { Link } from "react-router-dom";
import { useFaqs } from "../hooks/useFaqs";
import { FaqItem } from "../components/home/FaqSection";
import FaqSubmitModal from "../components/home/FaqSubmitModal";

export default function Faqs() {
  const { faqs, loading } = useFaqs();
  const [query, setQuery] = useState("");
  const [asking, setAsking] = useState(false);

  const q = query.trim().toLowerCase();
  const list = q ? faqs.filter((f) => `${f.question} ${f.answer}`.toLowerCase().includes(q)) : faqs;

  return (
    <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <Link to="/" className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">
        Back to home
      </Link>
      <h1 className="mt-4 font-display text-5xl font-light tracking-tight sm:text-6xl">All FAQs</h1>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions and answers"
          aria-label="Search FAQs"
          className="min-w-0 flex-1 border border-line bg-moss/40 px-4 py-3 text-bone placeholder:text-fog focus:border-amber focus:outline-none"
        />
        <button
          onClick={() => setAsking(true)}
          className="rounded-full border border-bone/30 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition hover:border-amber hover:text-amber"
        >
          Ask a question
        </button>
      </div>

      <div className="mt-8 border-t border-line/60">
        {list.map((faq) => (
          <FaqItem key={faq.id} faq={faq} />
        ))}
      </div>
      {!loading && !list.length && (
        <p className="py-12 text-center font-display text-2xl italic text-fog">
          {q ? "No questions match your search." : "No questions yet."}
        </p>
      )}
      {asking && <FaqSubmitModal onClose={() => setAsking(false)} />}
    </section>
  );
}
