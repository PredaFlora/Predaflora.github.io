import { InlineEdit } from "../InlineEdit";

export default function HowItWorks() {
  const stepKeys = [
    ["how_step_1_title", "how_step_1_text", "Step 1 title", "Step 1 description"],
    ["how_step_2_title", "how_step_2_text", "Step 2 title", "Step 2 description"],
    ["how_step_3_title", "how_step_3_text", "Step 3 title", "Step 3 description"],
  ] as const;

  return (
    <section className="border-y border-line/60 bg-moss/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1fr_2fr]">
        <h2 className="font-display text-4xl font-light leading-tight">
          <InlineEdit contentKey="how_title" label="How It Works — heading first part" />{" "}
          <InlineEdit as="em" contentKey="how_title_em" label="How It Works — heading italic word" />
        </h2>
        <ol className="divide-y divide-line/60">
          {stepKeys.map(([titleKey, textKey, titleLabel, textLabel], i) => (
            <li key={i} className="grid grid-cols-[3rem_1fr] gap-4 py-5 first:pt-0 last:pb-0">
              <span className="font-mono text-sm text-amber">0{i + 1}</span>
              <div>
                <InlineEdit contentKey={titleKey} label={titleLabel} as="h3" className="font-display text-xl" />
                <InlineEdit contentKey={textKey} label={textLabel} multiline as="p" className="mt-1 text-fog" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
