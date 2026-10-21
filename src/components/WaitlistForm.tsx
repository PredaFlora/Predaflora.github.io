import { useState, type FormEvent } from "react";
import pb from "../lib/pocketbase";
import type { Plant } from "../lib/types";
import { Check } from "./Icons";

type State = "idle" | "sending" | "sent" | "error" | "duplicate";

const fieldCls = "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-bone placeholder:text-fog/60 focus:border-amber focus:outline-none transition-colors";

export default function WaitlistForm({ plant }: { plant: Plant }) {
  const [state, setState] = useState<State>("idle");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    try {
      await pb.collection("waitlist").create({
        plant: plant.id,
        email: String(fd.get("email")).trim(),
        name: String(fd.get("name")).trim(),
      }, { requestKey: null });
      setState("sent");
    } catch (err: unknown) {
      const msg = String(err);
      if (msg.includes("unique") || msg.includes("already exists") || msg.includes("validation")) {
        setState("duplicate");
      } else {
        console.error(err);
        setState("error");
      }
    }
  };

  if (state === "sent") {
    return (
      <div className="animate-fade border border-leaf/40 p-6" role="status">
        <Check className="text-2xl text-leaf" />
        <p className="mt-3 font-display text-2xl">You're on the waitlist.</p>
        <p className="mt-1 text-sm text-fog">
          I'll contact you by email if another <em>{plant.name}</em> becomes available.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-line/60 bg-moss/30 p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber">Join the waitlist</p>
      <p className="mt-2 text-sm text-fog">
        This plant has found a home. Leave your details and I'll let you know when another one is ready.
      </p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Your name</span>
            <input name="name" autoComplete="name" className={fieldCls} placeholder="Jane Doe" />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Email *</span>
            <input name="email" type="email" required autoComplete="email" className={fieldCls} placeholder="jane@example.com" />
          </label>
        </div>
        {state === "duplicate" && (
          <p className="text-sm text-amber" role="alert">You're already on this waitlist.</p>
        )}
        {state === "error" && (
          <p className="text-sm text-fang" role="alert">Something went wrong. Please try again.</p>
        )}
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber disabled:opacity-60"
        >
          {state === "sending" ? "Joining…" : "Notify me"}
        </button>
      </form>
    </div>
  );
}
