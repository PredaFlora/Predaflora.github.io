import { useState, type FormEvent } from "react";
import { sendInquiry } from "../lib/inquiry";
import { formatPlantPrice } from "../lib/plants";
import type { Plant } from "../lib/types";
import { Check, Send } from "./Icons";

type State = "idle" | "sending" | "sent" | "error";

const field =
  "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-bone placeholder:text-fog/60 focus:border-amber focus:outline-none focus:ring-0 transition-colors";

export default function InquiryForm({ plant }: { plant?: Plant }) {
  const [state, setState] = useState<State>("idle");
  const defaultMsg = plant
    ? `Hi! I'm interested in the ${plant.name}${plant.latin_name ? ` (${plant.latin_name})` : ""}. Is it still available?`
    : "";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const note = String(data.get("message") || "");
    const message = plant
      ? `Plant: ${plant.name} — ${formatPlantPrice(plant)}\nLink: ${window.location.origin}/plant/${plant.id}\n\n${note}`
      : note;
    setState("sending");
    try {
      await sendInquiry({ name: String(data.get("name")), email: String(data.get("email")), message });
      form.reset();
      setState("sent");
    } catch (err) {
      console.error(err);
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="animate-fade border border-leaf/40 p-6" role="status">
        <Check className="text-2xl text-leaf" />
        <p className="mt-3 font-display text-2xl">Inquiry sent.</p>
        <p className="mt-1 text-sm text-fog">I'll get back to you by email to arrange payment and pickup or shipping.</p>
        <button onClick={() => setState("idle")} className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-amber hover:underline">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Your name</span>
          <input name="name" required autoComplete="name" className={field} placeholder="Jane Doe" />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Email</span>
          <input name="email" type="email" required autoComplete="email" className={field} placeholder="jane@example.com" />
        </label>
      </div>
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Message</span>
        <textarea name="message" required rows={4} defaultValue={defaultMsg} className={`${field} resize-none`} placeholder="Which plant are you after? Pickup or shipping?" />
      </label>
      {state === "error" && (
        <p className="text-sm text-fang" role="alert">Something went wrong sending your inquiry. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center gap-2 rounded-full bg-bone px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send inquiry"}
        <Send />
      </button>
    </form>
  );
}
