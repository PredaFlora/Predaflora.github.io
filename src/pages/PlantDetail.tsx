import { Link, useLocation, useParams } from "react-router-dom";
import { usePlant } from "../hooks/usePlant";
import { CATEGORIES, formatPlantPrice, plantImage, specimenNo } from "../lib/plants";
import StatusBadge from "../components/StatusBadge";
import InquiryForm from "../components/InquiryForm";
import WaitlistForm from "../components/WaitlistForm";
import { ArrowLeft, ArrowRight } from "../components/Icons";
import NotFound from "./NotFound";

export default function PlantDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { plant, loading } = usePlant(id);

  if (loading) return <div className="mx-auto h-[70vh] max-w-7xl animate-pulse px-8 py-16"><div className="h-full bg-moss" /></div>;
  if (!plant) return <NotFound />;

  const cat = CATEGORIES[plant.category];
  const fromBrowse = (location.state as { from?: string } | null)?.from === "browse-all";
  const sold = plant.status === "sold";
  const details = [
    ["Category", cat.label],
    ["Pot size", plant.pot_size],
    ["Care level", plant.care_level],
  ].filter(([, v]) => v);

  return (
    <article className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <Link to={fromBrowse ? "/browse-all" : cat.path} className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">
        <ArrowLeft /> Back to {fromBrowse ? "Browse all" : cat.label}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* Image */}
        <div className="animate-fade lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden bg-moss">
            <img
              src={plantImage(plant)}
              alt={plant.name}
              className={`aspect-[4/5] w-full object-cover ${sold ? "opacity-60 grayscale" : ""}`}
            />
            {sold && (
              <div className="absolute inset-0 flex items-center justify-center bg-night/40">
                <span className="rotate-[-20deg] border border-fog/60 px-6 py-2 font-mono text-sm uppercase tracking-[0.28em] text-fog/80">
                  Sold
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="animate-rise">
          <div className={`border-l-2 ${sold ? "border-line" : cat.border} pl-5`}>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
              <span>{specimenNo(plant)}</span>
              <span className={sold ? "text-fog" : cat.text}>{cat.label}</span>
            </div>
            <h1 className="mt-3 break-words font-display text-4xl font-light leading-[1.02] tracking-tight sm:text-6xl">{plant.name}</h1>
            {plant.latin_name && <p className="mt-2 font-display text-xl italic text-fog">{plant.latin_name}</p>}
          </div>

          <div className="mt-8 flex items-center gap-5">
            <span className={`font-mono text-3xl ${sold ? "text-fog line-through" : ""}`}>{formatPlantPrice(plant)}</span>
            <StatusBadge status={plant.status} />
          </div>
          {plant.description && <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-bone/85">{plant.description}</p>}

          <dl className="mt-8 divide-y divide-line/60 border-y border-line/60">
            {details.map(([k, v]) => (
              <div key={k} className="flex justify-between py-3 text-sm">
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <Link
            to={`/care/${plant.id}`}
            className="mt-12 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-amber underline-offset-4 hover:underline"
          >
            View care guide for {plant.name} <ArrowRight />
          </Link>

          <div className="mt-6 space-y-6">
            {sold ? (
              <WaitlistForm plant={plant} />
            ) : (
              <>
                <h2 className="font-display text-3xl font-light">Interested in this plant?</h2>
                <p className="text-sm text-fog">
                  Send an inquiry and I'll reply by email to arrange payment and pickup or shipping.
                </p>
                <InquiryForm plant={plant} />
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
