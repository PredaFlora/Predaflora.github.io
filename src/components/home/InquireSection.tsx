import { InlineEdit } from "../InlineEdit";
import InquiryForm from "../InquiryForm";
import type { Plant } from "../../lib/types";

export default function InquireSection({ plant }: { plant?: Plant }) {
  return (
    <section id="inquire" className="scroll-mt-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-2">
        <div>
          <InlineEdit contentKey="inquire_label" label="Inquire — label" as="p"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber" />
          <h2 className="mt-4 font-display text-5xl font-light leading-[1.02] tracking-tight">
            <InlineEdit contentKey="inquire_heading" label="Inquire — heading first part" />{" "}
            <InlineEdit as="em" contentKey="inquire_heading_em" label="Inquire — heading italic word" className="text-fang" />
          </h2>
          <InlineEdit contentKey="inquire_subtext" label="Inquire — subtext paragraph" multiline as="p"
            className="mt-5 max-w-md text-fog" />
        </div>
        <InquiryForm key={plant?.id ?? "general"} plant={plant} />
      </div>
    </section>
  );
}
