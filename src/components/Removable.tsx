import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useSiteContent } from "../contexts/SiteContentContext";

/** Lets the owner delete (hide) and restore an element that isn't an InlineEdit text. */
export function useHidden(key: string) {
  const { styles, saveStyle } = useSiteContent();
  return {
    hidden: !!styles[key]?.hidden,
    setHidden: (v: boolean) => saveStyle(key, { hidden: v }).catch(console.error),
  };
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round1 = (n: number) => Math.round(n * 10) / 10;

export default function Removable({ id, label, children, className = "", movable, restoreInFlow }: {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
  /** Show the "Restore" button in the normal flow (for lists) instead of floating over the page, so Edit Mode lays out exactly like the live site. */
  restoreInFlow?: boolean;
  /** Allow free dragging. Placed spot is stored as % of the header width + px from its top, so it is identical on every screen size. */
  movable?: boolean;
}) {
  const { isEditing, styles, saveStyle } = useSiteContent();
  const { hidden, setHidden } = useHidden(id);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const start = useRef({ px: 0, py: 0, x: 0, y: 0, w: 1 });

  const st = styles[id];
  const x = movable ? drag?.x ?? st?.offset_x ?? 0 : 0;
  const y = movable ? drag?.y ?? st?.offset_y ?? 0 : 0;
  const placed = x !== 0 || y !== 0;
  const posStyle: CSSProperties | undefined = placed ? { left: `${x}%`, top: `${y}px`, zIndex: 40 } : undefined;
  const posCls = placed ? "absolute" : "relative";

  if (!isEditing) {
    if (hidden) return null;
    if (!placed) return <>{children}</>;
    return <span className="absolute inline-flex" style={posStyle}>{children}</span>;
  }

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => setHidden(false)}
        className={`${restoreInFlow ? "" : "absolute z-50 "}whitespace-nowrap border border-dashed border-amber/60 bg-night px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-amber hover:bg-amber hover:text-night`}
      >
        Restore {label}
      </button>
    );
  }

  const run = (p: Promise<unknown>) => p.catch(console.error);
  const onDown = (e: PointerEvent<HTMLElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const el = e.currentTarget.closest("[data-mv]") as HTMLElement;
    const host = el.closest("header") as HTMLElement;
    const r = el.getBoundingClientRect();
    const h = host.getBoundingClientRect();
    start.current = {
      px: e.clientX, py: e.clientY, w: h.width,
      x: round1(((r.left - h.left) / h.width) * 100),
      y: Math.round(r.top - h.top),
    };
    setDrag({ x: start.current.x, y: start.current.y });
  };
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!drag) return;
    const s = start.current;
    setDrag({
      x: clamp(round1(s.x + ((e.clientX - s.px) / s.w) * 100), 0.1, 95),
      y: clamp(Math.round(s.y + e.clientY - s.py), 1, 240),
    });
  };
  const onUp = () => {
    if (!drag) return;
    const d = drag;
    setDrag(null);
    run(saveStyle(id, { offset_x: d.x, offset_y: d.y }));
  };
  const tb = "grid h-6 place-items-center bg-night px-2 font-mono text-[10px] text-bone hover:bg-amber hover:text-night";

  return (
    <span data-mv className={`group/rm inline-flex ${movable ? posCls : "relative"} ${className}`} style={movable ? posStyle : undefined}>
      {children}
      <button
        type="button"
        aria-label={`Delete ${label}`}
        title={`Delete ${label}`}
        onClick={() => setHidden(true)}
        className="absolute -right-2 -top-2 z-30 grid h-5 w-5 place-items-center rounded-full bg-fang font-mono text-[11px] leading-none text-bone opacity-0 shadow transition-opacity group-hover/rm:opacity-100 [@media(hover:none)]:opacity-100"
      >
        ×
      </button>
      {movable && (
        <span className={`absolute left-0 top-full z-50 mt-1 flex items-center gap-px whitespace-nowrap border border-amber/60 shadow-lg group-hover/rm:opacity-100 [@media(hover:none)]:opacity-100 ${drag ? "opacity-100" : "opacity-0"}`}>
          <span
            role="button"
            title="Drag to move"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className={`${tb} cursor-grab touch-none select-none active:cursor-grabbing`}
          >
            Move
          </span>
          {placed && (
            <button type="button" className={tb} onClick={() => run(saveStyle(id, { offset_x: 0, offset_y: 0 }))}>Reset</button>
          )}
        </span>
      )}
    </span>
  );
}
