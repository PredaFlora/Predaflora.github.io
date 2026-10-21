import { useEffect, useState, type FormEvent } from "react";
import pb from "../../lib/pocketbase";
import { Check, Close } from "../Icons";

type State = "idle" | "sending" | "sent" | "error";

export default function FaqSubmitModal({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    try {
      await pb.collection("faq_submissions").create({
        question: String(fd.get("question")).trim(),
        email: String(fd.get("email")).trim(),
        status: "pending",
      }, { requestKey: null });
      setState("sent");
    } catch (err) {
      console.error(err);
      setState("error");
    }
  };

  const inp = "mt-1 w-full border-0 border-b border-line bg-transparent px-0 py-3 text-bone placeholder:text-fog/60 focus:border-amber focus:outline-none transition-colors";
  const lbl = "font-mono text-[10px] uppercase tracking-[0.18em] text-fog";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-night/80 backdrop-blur-sm animate-fade sm:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-submit-title"
        className="w-full max-w-lg border border-line bg-moss p-7 animate-rise sm:rounded-none"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber">Ask away</p>
            <h2 id="faq-submit-title" className="mt-2 font-display text-3xl font-light">
              Submit a question
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="mt-1 text-fog hover:text-bone">
            <Close />
          </button>
        </div>

        {state === "sent" ? (
          <div className="mt-8 animate-fade" role="status">
            <Check className="text-2xl text-leaf" />
            <p className="mt-3 font-display text-2xl">Question received.</p>
            <p className="mt-1 text-sm text-fog">
              I'll add an answer to the FAQ page when I can. If you left your email, I'll reply directly.
            </p>
            <button onClick={onClose} className="mt-6 rounded-full bg-bone px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-night hover:bg-amber">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-5">
            <label className="block">
              <span className={lbl}>Your question *</span>
              <textarea
                name="question"
                required
                rows={3}
                className={`${inp} resize-none`}
                placeholder="What compost do you use for carnivorous plants?"
                autoFocus
              />
            </label>
            <label className="block">
              <span className={lbl}>Your email (optional — for a direct reply)</span>
              <input name="email" type="email" autoComplete="email" className={inp} placeholder="jane@example.com" />
            </label>
            {state === "error" && (
              <p className="text-sm text-fang" role="alert">Something went wrong. Please try again.</p>
            )}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={state === "sending"}
                className="rounded-full bg-bone px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber disabled:opacity-60"
              >
                {state === "sending" ? "Sending…" : "Send question"}
              </button>
              <button type="button" onClick={onClose} className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
