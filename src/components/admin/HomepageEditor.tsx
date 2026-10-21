import { useState } from "react";
import { useSiteContent } from "../../contexts/SiteContentContext";
import { CONTENT_DEFAULTS, type ContentKey } from "../../lib/siteContent";
import SitePhotos from "./SitePhotos";
import { Check } from "../Icons";

interface FieldProps {
  label: string;
  value: string;
  multiline?: boolean;
  onSave: (v: string) => Promise<void>;
  hint?: string;
}

function ContentField({ label, value: initial, multiline, onSave, hint }: FieldProps) {
  const [draft, setDraft] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // keep in sync when context updates externally
  if (draft === initial && state === "idle") {
    // noop — already in sync
  }

  const commit = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === initial) return;
    setState("saving");
    try {
      await onSave(trimmed);
      setState("saved");
      setTimeout(() => setState("idle"), 1500);
    } catch (e) {
      console.error(e);
      setState("error");
      setDraft(initial);
    }
  };

  const baseCls = "mt-1 w-full border bg-night px-3 py-2.5 text-bone focus:border-amber focus:outline-none transition-colors " +
    (state === "error" ? "border-fang" : "border-line");

  return (
    <div className="relative">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">{label}</span>
        {multiline ? (
          <textarea
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            className={`${baseCls} resize-y`}
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
            className={baseCls}
          />
        )}
      </label>
      {hint && <p className="mt-1 text-xs text-fog/60">{hint}</p>}
      <span className="absolute right-3 top-7 text-sm" aria-live="polite">
        {state === "saving" && <span className="font-mono text-[10px] text-fog">…</span>}
        {state === "saved" && <Check className="text-leaf" />}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-line/60 bg-moss/20 p-6">
      <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-amber">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function HomepageEditor({ onMessage }: { onMessage: (msg: string) => void }) {
  const { content, saveContent } = useSiteContent();

  const field = (key: ContentKey, label: string, opts?: { multiline?: boolean; hint?: string }) => (
    <ContentField
      key={key}
      label={label}
      value={content[key]}
      multiline={opts?.multiline}
      hint={opts?.hint}
      onSave={async (v) => {
        await saveContent(key, v);
        onMessage("Saved");
      }}
    />
  );

  return (
    <div className="mt-8 space-y-8">
      <p className="max-w-2xl text-sm text-fog">
        Edit any text field below — changes save automatically when you click away or press Enter.
        The live site updates straight away.
      </p>

      <Section title="Hero banner (top of homepage)">
        {field("hero_label", "Label above headline", { hint: 'Small caps text, e.g. "A greenhouse after dark"' })}
        {field("hero_line1", "Headline — line 1 (shown in red italic)", { hint: 'e.g. "Some of them bite."' })}
        {field("hero_line2", "Headline — line 2 (shown in green italic)", { hint: 'e.g. "Most of them don\'t."' })}
        {field("hero_subtext", "Subtitle paragraph", { multiline: true })}
        {field("hero_cta", "Call-to-action link text", { hint: 'e.g. "Choose your side"' })}
      </Section>

      <Section title="Split panels (Predatory & Non-Predatory)">
        {field("predatory_tagline", "Predatory tagline", { multiline: true })}
        {field("non_predatory_tagline", "Non-Predatory tagline", { multiline: true })}
      </Section>

      <Section title="How buying works">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("how_step_1_title", "Step 1 — title")}
          {field("how_step_1_text", "Step 1 — description", { multiline: true })}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("how_step_2_title", "Step 2 — title")}
          {field("how_step_2_text", "Step 2 — description", { multiline: true })}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("how_step_3_title", "Step 3 — title")}
          {field("how_step_3_text", "Step 3 — description", { multiline: true })}
        </div>
      </Section>

      <Section title="Newsletter section">
        {field("newsletter_headline", "Headline", { hint: 'e.g. "Stay in the loop."' })}
        {field("newsletter_subtext", "Subtitle paragraph", { multiline: true })}
      </Section>

      <Section title="Site-wide">
        {field("site_tagline", "Menu tagline (bottom of the side menu)", { hint: 'e.g. "Grown by hand · Shipped with care"' })}
      </Section>

      <div className="border-t border-line/60 pt-8">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-amber">Site photos</p>
        <SitePhotos onMessage={onMessage} />
      </div>

      <div className="border border-amber/20 bg-amber/5 p-4 text-sm text-fog">
        <strong className="text-amber">Tip:</strong> To reset any text back to the original wording, clear the field and type the default text, or ask in chat and I'll reset it.
      </div>
    </div>
  );
}
