import { useState } from "react";
import { Link } from "react-router-dom";
import { useFaqs } from "../../hooks/useFaqs";
import { InlineEdit } from "../InlineEdit";
import type { Faq } from "../../lib/faq";
import FaqSubmitModal from "./FaqSubmitModal";

export function FaqItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line/60 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-6 py-6 text-left"
      >
        <span className="font-display text-xl leading-snug">{faq.question}</span>
        <span className={`mt-1 shrink-0 text-amber transition-transform duration-300 ${open ? "rotate-45" : ""}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-out ${open ? "max-h-96 pb-6" : "max-h-0"}`}>
        <p className="max-w-2xl leading-relaxed text-fog">{faq.answer}</p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const { faqs, loading } = useFaqs();
  const [showSubmit, setShowSubmit] = useState(false);
  if (loading || !faqs.length) return null;

  return (
    <section className="border-t border-line/60">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <InlineEdit contentKey="faq_label" label="FAQ — label" as="p"
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber" />
            <InlineEdit contentKey="faq_heading" label="FAQ — heading" as="h2"
              className="mt-4 font-display text-5xl font-light leading-tight tracking-tight" />
            <p className="mt-5 text-fog">
              <InlineEdit contentKey="faq_subtext" label="FAQ — 'can't find answer' text" />{" "}
              <a href="/#inquire" className="text-amber underline-offset-2 hover:underline">
                Send me a message.
              </a>
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                to="/faq"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber underline-offset-4 hover:underline"
              >
                View all FAQs
              </Link>
              <button
                onClick={() => setShowSubmit(true)}
                className="inline-flex items-center gap-2 rounded-full border border-bone/30 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition hover:border-amber hover:text-amber"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                Ask a question
              </button>
            </div>
          </div>
          <div className="border-t border-line/60">
            {faqs.slice(0, 3).map((faq) => (
              <FaqItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      </div>
      {showSubmit && <FaqSubmitModal onClose={() => setShowSubmit(false)} />}
    </section>
  );
}
