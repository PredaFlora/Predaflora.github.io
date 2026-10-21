import { Link } from "react-router-dom";
import { CATEGORIES } from "../../lib/plants";
import type { Category, Plant } from "../../lib/types";
import { InlineEdit } from "../InlineEdit";
import { ArrowRight, Leaf, Trap } from "../Icons";

function Panel({ category, count }: { category: Category; count: number }) {
  const cat = CATEGORIES[category];
  const Icon = category === "predatory" ? Trap : Leaf;
  const taglineKey = category === "predatory" ? "predatory_tagline" as const : "non_predatory_tagline" as const;
  const tint = category === "predatory" ? "from-fang/10" : "from-leaf/10";

  return (
    <Link
      to={cat.path}
      className={`group relative flex flex-1 flex-col justify-end overflow-hidden bg-gradient-to-t ${tint} to-transparent px-6 py-12 transition-[flex-grow] duration-700 ease-out sm:px-8 sm:py-16 md:hover:flex-[1.18]`}
    >
      <div className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] ${cat.text}`}>
        <Icon className="text-lg" />
        <span>Side {cat.numeral}</span>
        <span className="text-fog">· {count} available</span>
      </div>
      <h2 className="mt-3 origin-left font-display text-4xl font-light tracking-tight transition-transform duration-500 ease-out group-hover:scale-[1.05] sm:text-6xl">
        {category === "predatory" ? <em>{cat.label}</em> : cat.label}
      </h2>
      <InlineEdit
        contentKey={taglineKey}
        label={`${cat.label} tagline`}
        multiline
        as="p"
        className="mt-2 max-w-xs text-sm text-fog sm:text-base"
      />
      <span className={`mt-5 inline-flex w-fit items-center gap-2 border-b pb-1 font-mono text-[11px] uppercase tracking-[0.2em] ${cat.border} ${cat.text}`}>
        <InlineEdit contentKey="diptych_cta" label="Panel button text" />
        <ArrowRight className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function BrowseAllPanel({ count }: { count: number }) {
  return (
    <Link
      to="/browse-all"
      className="group relative flex flex-1 flex-col justify-end overflow-hidden bg-gradient-to-t from-amber/10 to-transparent px-6 py-12 transition-[flex-grow] duration-700 ease-out sm:px-8 sm:py-16 md:hover:flex-[1.18]"
    >
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
        <Leaf className="text-lg" />
        <span>Everything</span>
        <span className="text-fog">· {count} available</span>
      </div>
      <InlineEdit
        contentKey="browse_all_title"
        label="Browse all card — title"
        as="h2"
        className="mt-3 origin-left font-display text-4xl font-light tracking-tight transition-transform duration-500 ease-out group-hover:scale-[1.05] sm:text-6xl"
      />
      <InlineEdit
        contentKey="browse_all_tagline"
        label="Browse all card — tagline"
        multiline
        as="p"
        className="mt-2 max-w-xs text-sm text-fog sm:text-base"
      />
      <span className="mt-5 inline-flex w-fit items-center gap-2 border-b border-amber pb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-amber">
        <InlineEdit contentKey="diptych_cta" label="Panel button text" />
        <ArrowRight className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function CareCard() {
  return (
    <Link
      to="/care"
      className="group flex items-center justify-between gap-4 border-t border-line bg-moss/40 px-6 py-5 transition hover:bg-leaf/10 sm:px-8 md:basis-full md:flex-none"
    >
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-leaf">Care guides</p>
        <InlineEdit contentKey="care_card_text" label="Care guides card text" as="p" className="mt-1 text-sm text-fog" />
      </div>
      <ArrowRight className="shrink-0 text-leaf transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export default function Diptych({ plants }: { plants: Plant[] }) {
  const count = (c: Category) => plants.filter((p) => p.category === c && p.status === "available").length;
  const divider = "h-px w-full bg-line md:h-auto md:w-px";
  return (
    <section id="sides" aria-label="Choose a side" className="scroll-mt-16 border-y border-line/60">
      <div className="flex flex-col md:flex-row md:flex-wrap">
        <Panel category="predatory" count={count("predatory")} />
        <div className={divider} />
        <Panel category="non_predatory" count={count("non_predatory")} />
        <div className={divider} />
        <BrowseAllPanel count={plants.filter((p) => p.status === "available").length} />
        <CareCard />
      </div>
    </section>
  );
}
