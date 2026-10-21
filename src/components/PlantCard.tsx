import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES, formatPlantPrice, plantImage, specimenNo } from "../lib/plants";
import type { Plant } from "../lib/types";
import StatusBadge from "./StatusBadge";
import StockMeter from "./StockMeter";

interface Props {
  plant: Plant;
  index?: number;
  outline?: boolean;   // draws a full-card coloured border (used on Browse All)
  to?: string;         // where the card itself links (defaults to the plant page)
}

export default function PlantCard({ plant, index = 0, outline = false, to }: Props) {
  const navigate = useNavigate();
  const cat = CATEGORIES[plant.category];
  const sold = plant.status === "sold";
  const borderCls = outline
    ? sold
      ? "border border-line/60"
      : `border-2 ${cat.border}`
    : "border border-transparent";

  const buy = () => navigate("/", { state: { buyPlant: plant, at: Date.now() } });

  return (
    <div
      className={`animate-rise ${borderCls} transition-colors`}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link to={to ?? `/plant/${plant.id}`} state={outline ? { from: "browse-all" } : undefined} className={`group block ${sold ? "opacity-60" : ""}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-moss">
          <img
            src={plantImage(plant, "600x750")}
            alt={plant.name}
            loading="lazy"
            className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] ${
              sold ? "grayscale" : ""
            }`}
          />
          {sold && (
            <div className="absolute inset-0 flex items-center justify-center bg-night/40">
              <span className="rotate-[-20deg] border border-fog/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-fog/80">
                Sold
              </span>
            </div>
          )}
          <div className="absolute left-3 top-3">
            <StatusBadge status={plant.status} />
          </div>
        </div>

        <div className={`relative mt-3 min-w-0 border-l-2 pl-3 ${outline ? "mb-3 pr-3" : ""} ${sold ? "border-line" : cat.border}`}>
          <div className="flex flex-wrap items-center justify-between gap-x-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fog">
            <span>{specimenNo(plant)}</span>
            <span className={`break-words ${sold ? "text-fog" : cat.text}`}>{plant.type || cat.label}</span>
          </div>
          <div className="mt-1.5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
            <h3 className={`min-w-0 break-words font-display text-lg leading-tight transition-colors sm:text-xl ${sold ? "text-fog" : "text-bone group-hover:text-amber"}`}>
              {plant.name}
            </h3>
            {sold ? (
              <span className="font-mono text-sm text-fog line-through sm:shrink-0">{formatPlantPrice(plant)}</span>
            ) : (
              <span className="font-mono text-sm text-bone sm:shrink-0">{formatPlantPrice(plant)}</span>
            )}
          </div>
          {plant.latin_name && (
            <p className="mt-0.5 break-words font-display text-sm italic text-fog">{plant.latin_name}</p>
          )}
          {!sold && <StockMeter quantity={plant.quantity} total={plant.quantity_total} className="mt-3" />}
        </div>
      </Link>

      {!sold && (
        <div className="px-3 pb-3 pt-3">
          <button
            type="button"
            onClick={buy}
            className="w-full rounded-full bg-bone px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber"
          >
            Buy
          </button>
        </div>
      )}
    </div>
  );
}
