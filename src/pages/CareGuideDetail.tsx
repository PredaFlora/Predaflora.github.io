import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import pb from "../lib/pocketbase";
import { usePlant } from "../hooks/usePlant";
import { CATEGORIES, plantImage } from "../lib/plants";
import { CARE_FIELDS, type CareGuide } from "../lib/care";

export default function CareGuideDetail() {
  const { id } = useParams();
  const { plant, loading } = usePlant(id);
  const [guide, setGuide] = useState<CareGuide | null>(null);
  const [guideLoading, setGuideLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let active = true;
    pb.collection("care_guides")
      .getFirstListItem<CareGuide>(pb.filter("plant = {:id}", { id }), { requestKey: null })
      .then((g) => active && setGuide(g))
      .catch(() => active && setGuide(null))
      .finally(() => active && setGuideLoading(false));
    return () => { active = false; };
  }, [id]);

  if (loading || guideLoading) return <div className="mx-auto max-w-4xl px-5 py-24 text-fog sm:px-8">Loading…</div>;

  if (!plant) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
        <p className="font-display text-3xl italic text-fog">We couldn't find that plant.</p>
        <Link to="/care" className="mt-6 inline-block text-amber hover:underline">Back to all care guides</Link>
      </div>
    );
  }

  const cat = CATEGORIES[plant.category];
  const sections = guide ? CARE_FIELDS.filter((f) => guide[f.key]?.trim()) : [];

  return (
    <article className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <Link to="/care" className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">← All care guides</Link>

      <header className="mt-8 grid gap-8 md:grid-cols-[260px_1fr] md:items-end">
        <img
          src={plantImage(plant, "600x750")}
          alt={plant.name}
          className={`aspect-[4/5] w-full max-w-[260px] border-2 object-cover ${plant.category === "predatory" ? "border-fang/60" : "border-leaf/60"}`}
        />
        <div>
          <p className={`font-mono text-[11px] uppercase tracking-[0.22em] ${cat.text}`}>{cat.label} · care guide</p>
          <h1 className="mt-3 font-display text-5xl font-light leading-tight tracking-tight sm:text-6xl">{plant.name}</h1>
          {plant.latin_name && <p className="mt-2 text-lg italic text-fog">{plant.latin_name}</p>}
          {guide?.summary && <p className="mt-5 max-w-xl text-lg leading-relaxed text-bone/85">{guide.summary}</p>}
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
            {plant.care_level && <span>Care level: <span className="text-bone">{plant.care_level}</span></span>}
            {plant.pot_size && <span>Pot: <span className="text-bone">{plant.pot_size}</span></span>}
          </div>
        </div>
      </header>

      {sections.length === 0 ? (
        <div className="mt-14 border border-dashed border-line p-10 text-center">
          <p className="font-display text-2xl italic text-fog">This care guide is still being written.</p>
          <p className="mt-2 text-sm text-fog/70">
            In the meantime, <Link to="/#inquire" className="text-amber hover:underline">send a message</Link> and we'll happily help.
          </p>
        </div>
      ) : (
        <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2">
          {sections.map((s) => (
            <section key={s.key} className={`bg-night p-6 sm:p-8 ${s.key === "tips" ? "sm:col-span-2" : ""}`}>
              <h2 className={`font-mono text-[11px] uppercase tracking-[0.22em] ${cat.text}`}>{s.label}</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-bone/85">{guide?.[s.key]}</p>
            </section>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link to={`/plant/${plant.id}`} className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber hover:underline">
          View {plant.name} in the shop →
        </Link>
      </div>
    </article>
  );
}
