import type { Plant } from "../../lib/types";
import StockMeter from "../StockMeter";

interface Props {
  plant: Plant;
  onUpdate: (data: Partial<Plant>) => Promise<void>;
}

const btn = "grid h-6 w-6 place-items-center border border-line font-mono text-sm leading-none text-fog transition hover:border-bone hover:text-bone disabled:opacity-40";

export default function QuantityControl({ plant, onUpdate }: Props) {
  const q = plant.quantity || 0;
  const total = plant.quantity_total || 0;

  const set = (next: number) => {
    const quantity = Math.max(0, next);
    onUpdate({ quantity, quantity_total: Math.max(total, quantity) }).catch(() => undefined);
  };

  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="flex items-center gap-1.5" aria-label={`Stock for ${plant.name}`}>
        <button type="button" onClick={() => set(q - 1)} disabled={q <= 0} className={btn} aria-label="Decrease stock">−</button>
        <span className="min-w-[3.5rem] text-center font-mono text-xs text-bone">
          {q}{total > 0 ? ` / ${total}` : ""}
        </span>
        <button type="button" onClick={() => set(q + 1)} className={btn} aria-label="Increase stock">+</button>
      </div>
      <div className="w-24">
        {q > 0 || total > 0 ? <StockMeter quantity={q} total={total} /> : (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog/70">No meter</span>
        )}
      </div>
    </div>
  );
}
