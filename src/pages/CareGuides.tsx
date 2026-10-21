import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pb from "../lib/pocketbase";
import { usePlants } from "../hooks/usePlants";
import { CATEGORIES, plantImage } from "../lib/plants";
import type { CareGuide } from "../lib/care";
import { ArrowRight } from "../components/Icons";

export default function CareGuides() {
  const { plants, loading, error } = usePlants();
  const [ready, setReady] = useState<Set<string>>(new Set());

  useEffect(() => {
    pb.collection("care_guides")
      .getFullList<CareGuide>({ fields: "id,plant", requestKey: null })
      .then((g) => setReady(new Set(g.map((x) => x.plant))))
      .catch(console.error);
  }, []);

  return (
    <>
      <section className="border-b border-line/60 bg-gradient-to-br from-leaf/10 via-night to-fang/10">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="animate-rise font-mono text-[11px] uppercase tracking-[0.24em] text-leaf">Care guides</p>
          <h1 className="mt-3 animate-rise font-display text-5xl font-light leading-[0.98] tracking-tight [animation-delay:60ms] sm:text-7xl">
            How to keep yours alive
          </h1>
          <p className="mt-5 max-w-lg animate-rise text-lg text-fog [animation-delay:120ms]">
            Pick a plant to see exactly how to look after it: light, water, soil and everything in between.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {error && <p className="py-12 text-center text-fog">{error}</p>}
        {loading && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse bg-moss/60" />)}
          </div>
        )}
        {!loading && !error && !plants.length && (
          <p className="py-20 text-center font-display text-2xl italic text-fog">No plants yet.</p>
        )}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {plants.map((p) => {
            const cat = CATEGORIES[p.category];
            return (
              <Link
                key={p.id}
                to={`/care/${p.id}`}
                className={`group flex flex-col border-2 bg-moss/30 transition hover:bg-moss/60 ${p.category === "predatory" ? "border-fang/50 hover:border-fang" : "border-leaf/50 hover:border-leaf"}`}
              >
                <div className="aspect-[4/5] overflow-hidden bg-moss">
                  <img
                    src={plantImage(p, "600x750")}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${cat.text}`}>{cat.label}</p>
                  <h2 className="font-display text-xl leading-tight">{p.name}</h2>
                  {p.latin_name && <p className="text-sm italic text-fog">{p.latin_name}</p>}
                  <span className="mt-auto inline-flex items-center gap-2 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-amber">
                    {ready.has(p.id) ? "Care guide" : "Guide coming soon"} <ArrowRight className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
