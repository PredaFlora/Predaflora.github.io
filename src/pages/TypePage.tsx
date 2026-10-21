import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { usePlants } from "../hooks/usePlants";
import { CATEGORIES } from "../lib/plants";
import PlantGrid from "../components/PlantGrid";
import StockMeter from "../components/StockMeter";
import { ArrowLeft } from "../components/Icons";

export default function TypePage() {
  const { type = "" } = useParams();
  const name = decodeURIComponent(type);
  const { plants, loading, error } = usePlants();

  const matches = useMemo(() => {
    const list = plants.filter((p) => (p.type || "").trim().toLowerCase() === name.trim().toLowerCase());
    const rank = { available: 0, reserved: 1, sold: 2 } as const;
    return list.sort((a, b) => rank[a.status] - rank[b.status]);
  }, [plants, name]);

  const cat = matches[0] ? CATEGORIES[matches[0].category] : null;
  const live = matches.filter((p) => p.status !== "sold");
  const stock = live.reduce((n, p) => n + (p.quantity || 0), 0);
  const total = live.reduce((n, p) => n + Math.max(p.quantity_total || 0, p.quantity || 0), 0);

  return (
    <>
      <section className="border-b border-line/60">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">
            <ArrowLeft /> Back home
          </Link>
          <p className={`mt-8 font-mono text-[11px] uppercase tracking-[0.24em] ${cat?.text ?? "text-amber"}`}>
            {cat ? cat.label : "Plant type"}
          </p>
          <h1 className="mt-3 animate-rise break-words font-display text-4xl font-light tracking-tight sm:text-7xl">{name}</h1>
          <p className="mt-4 text-fog">
            {loading ? "Loading…" : `${matches.length} ${matches.length === 1 ? "plant" : "plants"} of this type`}
          </p>
          <StockMeter quantity={stock} total={total} className="mt-5 max-w-xs" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <PlantGrid plants={matches} loading={loading} error={error} empty="No plants of this type right now. Check back soon." />
      </section>
    </>
  );
}
