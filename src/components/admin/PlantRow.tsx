import { CATEGORIES } from "../../lib/plants";
import type { Plant, Status } from "../../lib/types";
import { Eye, EyeOff, Pencil, Trash } from "../Icons";
import PriceInput from "./PriceInput";
import QuickPhoto from "./QuickPhoto";
import QuantityControl from "./QuantityControl";

interface Props {
  plant: Plant;
  onUpdate: (data: Partial<Plant> | FormData) => Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
  onWaitlist: () => void;
}

const iconBtn = "grid h-9 w-9 place-items-center border border-line text-fog transition hover:border-bone hover:text-bone";

const STATUS_COLORS: Record<Status, string> = {
  available: "border-leaf/60 text-leaf",
  reserved: "border-amber/60 text-amber",
  sold: "border-fog/40 text-fog",
};

export default function PlantRow({ plant, onUpdate, onEdit, onDelete, onWaitlist }: Props) {
  const cat = CATEGORIES[plant.category];
  const sold = plant.status === "sold";

  const cycleStatus = () => {
    const next: Record<Status, Status> = { available: "sold", sold: "available", reserved: "available" };
    onUpdate({ status: next[plant.status] }).catch(() => undefined);
  };

  return (
    <li className={`grid grid-cols-[3.5rem_1fr] items-center gap-x-4 gap-y-3 py-4 md:grid-cols-[3.5rem_1fr_19rem_8.5rem_auto] ${plant.published ? "" : "opacity-55"}`}>
      <QuickPhoto
        plant={plant}
        onUpload={(file) => {
          const fd = new FormData();
          fd.set("image", file);
          return onUpdate(fd);
        }}
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className={`truncate font-display text-lg leading-tight ${sold ? "text-fog line-through decoration-fog/50" : ""}`}>
            {plant.name}
          </p>
          {/* Quick sold toggle pill */}
          <button
            onClick={cycleStatus}
            title={sold ? "Click to mark as Available" : "Click to mark as Sold"}
            className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] transition hover:opacity-80 ${STATUS_COLORS[plant.status]}`}
          >
            {plant.status}
          </button>
          {sold && (
            <button
              onClick={onWaitlist}
              className="shrink-0 rounded-full border border-amber/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-amber hover:border-amber"
              title="View waitlist"
            >
              Waitlist
            </button>
          )}
        </div>
        <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className={cat.text}>{cat.label}</span>
          {plant.type && <span className="text-fog"> · {plant.type}</span>}
          {!plant.published && <span className="text-fog"> · Hidden</span>}
        </p>
        <QuantityControl plant={plant} onUpdate={onUpdate} />
      </div>

      <div className="col-span-2 grid grid-cols-[1fr_1fr_auto] gap-3 md:col-span-3 md:grid-cols-[19rem_8.5rem_auto]">
        <div className="flex items-center gap-1.5">
          <PriceInput value={plant.price} label={`Price for ${plant.name}`} onSave={(price) => onUpdate({ price })} />
          <span className="text-fog" aria-hidden="true">–</span>
          <PriceInput optional placeholder="max" value={plant.price_max || 0} label={`Max price for ${plant.name} (optional, makes a price range)`} onSave={(price_max) => onUpdate({ price_max })} />
        </div>
        <select
          aria-label={`Status for ${plant.name}`}
          value={plant.status}
          onChange={(e) => onUpdate({ status: e.target.value as Status }).catch(() => undefined)}
          className="border border-line bg-night px-2 py-2 font-mono text-xs uppercase tracking-[0.1em] text-bone focus:border-amber focus:outline-none"
        >
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate({ published: !plant.published }).catch(() => undefined)}
            className={iconBtn}
            aria-label={plant.published ? "Hide from website" : "Show on website"}
            title={plant.published ? "Visible — click to hide" : "Hidden — click to show"}
          >
            {plant.published ? <Eye /> : <EyeOff />}
          </button>
          <button onClick={onEdit} className={iconBtn} aria-label={`Edit ${plant.name}`} title="Edit">
            <Pencil />
          </button>
          <button onClick={onDelete} className={`${iconBtn} hover:border-fang hover:text-fang`} aria-label={`Delete ${plant.name}`} title="Delete">
            <Trash />
          </button>
        </div>
      </div>
    </li>
  );
}
