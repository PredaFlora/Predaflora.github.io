import { useState, type FormEvent } from "react";
import pb from "../../lib/pocketbase";
import { InlineEdit } from "../InlineEdit";
import { Check } from "../Icons";

type State = "idle" | "sending" | "sent" | "error" | "duplicate";

const EMAIL_ICON = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

export default function SubscribeSection() {
  const [state, setState] = useState<State>("idle");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    try {
      await pb.collection("subscribers").create({ email: String(fd.get("email")).trim(), name: String(fd.get("name")).trim() }, { requestKey: null });
      setState("sent");
    } catch (err: unknown) {
      const msg = String(err);
      setState(msg.includes("unique") || msg.includes("already exists") || msg.includes("validation") ? "duplicate" : "error");
      if (!msg.includes("unique")) console.error(err);
    }
  };

  const inputCls = "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-bone placeholder:text-fog/60 focus:border-amber focus:outline-none transition-colors";

  return (
    <section id="subscribe" className="border-t border-line/60 bg-moss/30">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 text-amber">
            {EMAIL_ICON}
            <InlineEdit contentKey="newsletter_label" label="Newsletter — badge text" as="span"
              className="font-mono text-[11px] uppercase tracking-[0.22em]" />
          </div>
          <InlineEdit contentKey="newsletter_headline" label="Newsletter — headline" as="h2"
            className="mt-4 font-display text-5xl font-light leading-[1.02] tracking-tight" />
          <InlineEdit contentKey="newsletter_subtext" label="Newsletter — subtitle" multiline as="p"
            className="mt-5 max-w-md text-fog" />
        </div>
        {state === "sent" ? (
          <div className="animate-fade flex flex-col justify-center border border-leaf/40 p-6" role="status">
            <Check className="text-2xl text-leaf" />
            <p className="mt-3 font-display text-2xl">You're on the list.</p>
            <p className="mt-1 text-sm text-fog">I'll be in touch whenever something special arrives.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col justify-center space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Your name</span>
                <input name="name" autoComplete="name" className={inputCls} placeholder="Jane Doe" />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Email *</span>
                <input name="email" type="email" required autoComplete="email" className={inputCls} placeholder="jane@example.com" />
              </label>
            </div>
            {state === "duplicate" && <p className="text-sm text-amber" role="alert">That email is already subscribed.</p>}
            {state === "error" && <p className="text-sm text-fang" role="alert">Something went wrong. Please try again.</p>}
            <button type="submit" disabled={state === "sending"} className="inline-flex w-fit items-center gap-2 rounded-full bg-bone px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber disabled:opacity-60">
              {state === "sending" ? "Subscribing…" : "Subscribe"} {EMAIL_ICON}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
