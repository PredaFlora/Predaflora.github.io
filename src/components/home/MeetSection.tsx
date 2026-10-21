import { Link } from "react-router-dom";
import { InlineEdit } from "../InlineEdit";
import { ArrowRight } from "../Icons";

export default function MeetSection() {
  return (
    <section className="border-t border-line/60 bg-moss/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-[1fr_2fr]">
        <div>
          <InlineEdit contentKey="meet_label" label="About me — label" as="p"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber" />
          <InlineEdit contentKey="meet_heading" label="About me — heading" as="h2"
            className="mt-4 font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl" />
        </div>
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-fog">
          <InlineEdit contentKey="meet_text_1" label="About me — first paragraph" multiline as="p" />
          <InlineEdit contentKey="meet_text_2" label="About me — second paragraph" multiline as="p" />
          <Link to="/about" className="inline-flex items-center gap-2 pt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone hover:text-amber">
            Read my full story <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
