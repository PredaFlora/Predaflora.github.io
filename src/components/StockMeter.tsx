interface Props {
  quantity: number;
  total: number;
  className?: string;
}

/** Small stock gauge. Renders nothing when stock isn't being tracked. */
export default function StockMeter({ quantity, total, className = "" }: Props) {
  if (quantity <= 0 && total <= 0) return null;
  const max = Math.max(total, quantity, 1);
  const pct = Math.round((quantity / max) * 100);
  const out = quantity <= 0;
  const low = !out && (quantity <= 3 || pct <= 25);
  const tone = out ? "bg-fog" : low ? "bg-amber" : "bg-leaf";
  const label = out ? "Out of stock" : low ? `Only ${quantity} left` : `${quantity} in stock`;

  return (
    <div className={className} role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={quantity}>
      <div className="h-1 w-full overflow-hidden bg-line/70">
        <div className={`h-full ${tone} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <p className={`mt-1 font-mono text-[10px] uppercase tracking-[0.16em] ${out ? "text-fog" : low ? "text-amber" : "text-fog"}`}>
        {label}
      </p>
    </div>
  );
}
