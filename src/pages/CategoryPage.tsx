import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePlants } from "../hooks/usePlants";
import { useSiteImages } from "../hooks/useSiteImages";
import { CATEGORIES } from "../lib/plants";
import type { Category } from "../lib/types";
import PlantGrid from "../components/PlantGrid";
import SortBar, { type SortKey } from "../components/SortBar";
import { ArrowRight } from "../components/Icons";

export default function CategoryPage({ category }: { category: Category }) {
  const cat = CATEGORIES[category];
  const other = CATEGORIES[category === "predatory" ? "non_predatory" : "predatory"];
  const { plants, loading, error } = usePlants(category);
  const { ready, url } = useSiteImages();
  const [sort, setSort] = useState<SortKey>("newest");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const shown = useMemo(() => {
    const list = onlyAvailable ? plants.filter((p) => p.status === "available") : [...plants];
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [plants, sort, onlyAvailable]);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line/60">
        {ready && (
          <img
            src={url(category === "predatory" ? "predatory_banner" : "non_predatory_banner")}
            alt=""
            className="absolute inset-y-0 right-0 -z-20 h-full w-full animate-fade object-cover opacity-40 md:w-1/2"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/90 to-night/30" />
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <p className={`animate-rise font-mono text-[11px] uppercase tracking-[0.24em] ${cat.text}`}>Side {cat.numeral}</p>
          <h1 className="mt-3 animate-rise font-display text-6xl font-light tracking-tight [animation-delay:80ms] sm:text-8xl">
            {category === "predatory" ? <em>{cat.label}</em> : cat.label}
          </h1>
          <p className="mt-4 max-w-md animate-rise text-lg text-fog [animation-delay:160ms]">{cat.tagline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <SortBar
          count={shown.length}
          sort={sort}
          onSort={setSort}
          onlyAvailable={onlyAvailable}
          onToggle={() => setOnlyAvailable((v) => !v)}
        />
        <PlantGrid plants={shown} loading={loading} error={error} empty="Nothing on this side right now. Check back soon." />
      </section>

      <Link to={other.path} className="group block border-t border-line/60 hover:bg-moss/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-10 sm:px-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">Switch sides</span>
          <span className={`flex items-center gap-3 font-display text-3xl sm:text-4xl ${other.text}`}>
            {other.label} <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </>
  );
}
