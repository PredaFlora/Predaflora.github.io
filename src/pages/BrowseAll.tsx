import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePlants } from "../hooks/usePlants";
import { CATEGORIES } from "../lib/plants";
import type { Category, Plant } from "../lib/types";
import PlantCard from "../components/PlantCard";
import { type SortKey } from "../components/SortBar";
import { Trap, Leaf } from "../components/Icons";

// ─── Legend pill ──────────────────────────────────────────────────────────────
function LegendPill({ category, active, onClick }: {
  category: Category;
  active: boolean;
  onClick: () => void;
}) {
  const cat = CATEGORIES[category];
  const Icon = category === "predatory" ? Trap : Leaf;
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group flex items-center gap-2.5 border-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-all ${
        active
          ? category === "predatory"
            ? "border-fang bg-fang/10 text-fang"
            : "border-leaf bg-leaf/10 text-leaf"
          : "border-line text-fog hover:border-bone hover:text-bone"
      }`}
    >
      <Icon className="text-base" />
      <span>{cat.label}</span>
      <span className={`ml-0.5 rounded-sm px-1.5 py-0.5 text-[9px] tracking-wider ${
        active
          ? category === "predatory" ? "bg-fang/20" : "bg-leaf/20"
          : "bg-line/40"
      }`}>
        {category === "predatory" ? "Red outline" : "Green outline"}
      </span>
    </button>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function Empty() {
  return (
    <div className="py-28 text-center">
      <p className="font-display text-3xl italic text-fog">Nothing matches your filters.</p>
      <p className="mt-2 text-sm text-fog/60">Try adjusting the filters above.</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BrowseAll() {
  const { plants, loading, error } = usePlants(); // no category = all plants
  const [sort, setSort] = useState<SortKey>("newest");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [categories, setCategories] = useState<Set<Category>>(new Set(["predatory", "non_predatory"]));

  const toggleCategory = (c: Category) =>
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(c) && next.size > 1) next.delete(c);
      else next.add(c);
      return next;
    });

  const shown = useMemo(() => {
    let list: Plant[] = plants.filter((p) => categories.has(p.category));
    if (onlyAvailable) list = list.filter((p) => p.status === "available");
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "newest") list = [...list].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    return list;
  }, [plants, categories, sort, onlyAvailable]);

  const predCount = plants.filter((p) => p.category === "predatory").length;
  const nonCount = plants.filter((p) => p.category === "non_predatory").length;

  return (
    <>
      {/* ── Header ── */}
      <section className="relative isolate border-b border-line/60 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-fang/10 via-night to-leaf/10" />
          <div className="absolute inset-0 bg-night/70" />
        </div>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="animate-rise font-mono text-[11px] uppercase tracking-[0.24em] text-fog">
            The full collection
          </p>
          <h1 className="mt-3 animate-rise font-display text-6xl font-light leading-[0.95] tracking-tight [animation-delay:60ms] sm:text-8xl">
            <em className="text-fang">Preda</em>
            <span className="text-leaf">Flora</span>
          </h1>
          <p className="mt-5 max-w-md animate-rise text-lg text-fog [animation-delay:120ms]">
            Every plant, both sides — {predCount + nonCount} specimens and counting.
          </p>

          {/* Legend */}
          <div className="mt-8 animate-rise flex flex-wrap gap-3 [animation-delay:180ms]">
            <LegendPill category="predatory" active={categories.has("predatory")} onClick={() => toggleCategory("predatory")} />
            <LegendPill category="non_predatory" active={categories.has("non_predatory")} onClick={() => toggleCategory("non_predatory")} />
          </div>
        </div>
      </section>

      {/* ── Controls ── */}
      <section className="sticky top-[var(--nav-height,80px)] z-30 border-b border-line/60 bg-night/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog">
            {loading ? "Loading…" : `${shown.length} specimen${shown.length === 1 ? "" : "s"}`}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fog hover:text-bone">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="accent-amber"
              />
              Available only
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-line bg-transparent font-mono text-[11px] uppercase tracking-[0.14em] text-fog focus:outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="price_asc">Price: low → high</option>
              <option value="price_desc">Price: high → low</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {error && <p className="py-12 text-center text-fog">{error}</p>}
        {loading && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse bg-moss/60" />
            ))}
          </div>
        )}
        {!loading && !error && (
          shown.length === 0 ? <Empty /> : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {shown.map((plant, i) => (
                <PlantCard key={plant.id} plant={plant} index={i} outline />
              ))}
            </div>
          )
        )}
      </section>

      {/* ── Footer links ── */}
      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-0 divide-x divide-line/60 sm:divide-x">
          {(["predatory", "non_predatory"] as Category[]).map((cat) => (
            <Link
              key={cat}
              to={CATEGORIES[cat].path}
              className={`group flex flex-1 items-center justify-between gap-4 px-5 py-8 transition hover:bg-moss/30 sm:px-8 ${CATEGORIES[cat].text}`}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Browse {CATEGORIES[cat].label} only</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
