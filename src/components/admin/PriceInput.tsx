import { useEffect, useState } from "react";
import { CURRENCY } from "../../lib/plants";
import { Check } from "../Icons";

interface Props {
  value: number;
  onSave: (value: number) => Promise<void>;
  label: string;
  /** Optional inputs treat an empty box as 0 (= not set) */
  optional?: boolean;
  placeholder?: string;
}

export default function PriceInput({ value, onSave, label, optional = false, placeholder }: Props) {
  const show = (v: number) => (optional && !v ? "" : String(v));
  const [draft, setDraft] = useState(show(value));
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => setDraft(show(value)), [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const commit = async () => {
    const empty = draft.trim() === "";
    const next = empty && optional ? 0 : Number(draft);
    if ((empty && !optional) || Number.isNaN(next) || next < 0) {
      setDraft(show(value));
      return;
    }
    if (next === value) return;
    setState("saving");
    try {
      await onSave(next);
      setState("saved");
      setTimeout(() => setState("idle"), 1500);
    } catch (e) {
      console.error(e);
      setState("error");
      setDraft(show(value));
    }
  };

  return (
    <div className="relative flex items-center">
      <span className="pointer-events-none absolute left-3 font-mono text-[10px] text-fog">{CURRENCY}</span>
      <input
        aria-label={label}
        placeholder={placeholder}
        inputMode="decimal"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
        className={`w-full border bg-night py-2 pl-12 pr-8 font-mono text-sm text-bone focus:border-amber focus:outline-none ${
          state === "error" ? "border-fang" : "border-line"
        }`}
      />
      <span className="absolute right-2.5 text-sm" aria-live="polite">
        {state === "saving" && <span className="font-mono text-[10px] text-fog">…</span>}
        {state === "saved" && <Check className="text-leaf" aria-label="Saved" />}
      </span>
    </div>
  );
}
