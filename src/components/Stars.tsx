import { useState } from "react";

const PATH = "M6 1l1.4 2.8 3.1.45-2.25 2.2.53 3.1L6 8.1l-2.78 1.45.53-3.1L1.5 4.25l3.1-.45z";

function Star({ size, filled }: { size: number; filled: boolean }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <path d={PATH} />
    </svg>
  );
}

/** Read-only star row. Supports fractional values (e.g. 4.6). */
export function StarRow({ value, size = 12 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(5, value)) * 20;
  const row = (filled: boolean) => (
    <div className="flex w-max gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={size} filled={filled} />)}
    </div>
  );
  return (
    <div className="relative inline-block" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      <div className="text-line">{row(false)}</div>
      <div className="absolute left-0 top-0 overflow-hidden text-amber" style={{ width: `${pct}%` }}>{row(true)}</div>
    </div>
  );
}

/** Interactive 1-5 star picker. */
export function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className={`transition-transform hover:scale-110 ${n <= shown ? "text-amber" : "text-line"}`}
        >
          <Star size={32} filled={n <= shown} />
        </button>
      ))}
    </div>
  );
}
