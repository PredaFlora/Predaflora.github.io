import { useRef, useState } from "react";
import pb from "../lib/pocketbase";
import { useHomeBlocks } from "../contexts/HomeBlocksContext";
import { useSiteContent } from "../contexts/SiteContentContext";
import type { HomeBlock } from "../lib/homeBlocks";

export const HEADER_SLOT = "header";
const tb = "grid h-6 min-w-6 place-items-center bg-night px-1.5 font-mono text-[10px] text-bone hover:bg-amber hover:text-night disabled:opacity-30";
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const sideOf = (b: HomeBlock) => (b.align === "right" ? "right" : "left");

function HeaderPhoto({ block, list }: { block: HomeBlock; list: HomeBlock[] }) {
  const { isEditing } = useSiteContent();
  const { update, remove, move } = useHomeBlocks();
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const start = useRef({ px: 0, py: 0, x: 0, y: 0, minDx: -2000, maxDx: 2000 });
  const scale = block.scale || 100;
  const x = drag?.x ?? block.offset_x ?? 0;
  const y = drag?.y ?? block.offset_y ?? 0;
  const moved = x !== 0 || y !== 0;
  // Position/size are saved separately for mobile and desktop (see HomeBlocksContext)
  const posStyle = { left: `${x}px`, top: `${y}px`, zIndex: moved ? 10 : undefined } as React.CSSProperties;
  const pos = "relative";
  const run = (p: Promise<unknown>) => p.catch(console.error);
  const img = (
    <img
      src={pb.files.getURL(block, block.image)}
      alt={block.heading || ""}
      style={{ height: `${(44 * scale) / 100}px` }}
      className="w-auto max-w-none shrink-0 object-contain"
      draggable={false}
    />
  );
  if (!isEditing) return <span className={`inline-flex ${pos}`} style={posStyle}>{img}</span>;

  const onDown = (e: React.PointerEvent<HTMLElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = (e.currentTarget.parentElement?.parentElement ?? e.currentTarget).getBoundingClientRect();
    start.current = {
      px: e.clientX, py: e.clientY, x: block.offset_x || 0, y: block.offset_y || 0,
      minDx: -r.left, maxDx: window.innerWidth - r.right,
    };
    setDrag({ x: start.current.x, y: start.current.y });
  };
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag) return;
    const s = start.current;
    // keep the picture fully on screen so it can never be dragged out of sight
    setDrag({ x: Math.round(s.x + clamp(e.clientX - s.px, s.minDx, Math.max(s.minDx, s.maxDx))), y: Math.round(clamp(s.y + e.clientY - s.py, -120, 160)) });
  };
  const onUp = () => {
    if (!drag) return;
    const d = drag;
    setDrag(null);
    if (d.x !== (block.offset_x || 0) || d.y !== (block.offset_y || 0)) run(update(block.id, { offset_x: d.x, offset_y: d.y }));
  };

  const idx = list.findIndex((b) => b.id === block.id);
  return (
    <span className={`group/hp inline-flex ring-2 ring-amber/40 hover:ring-amber/90 ${pos}`} style={posStyle}>
      {img}
      <span className={`absolute left-0 top-full z-50 mt-1 flex items-center gap-px whitespace-nowrap border border-amber/60 shadow-lg group-hover/hp:opacity-100 [@media(hover:none)]:opacity-100 ${drag ? "opacity-100" : "opacity-0"}`}>
        <span
          role="button"
          aria-label="Drag to move anywhere"
          title="Drag to move anywhere"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className={`${tb} cursor-grab touch-none select-none px-2.5 active:cursor-grabbing`}
        >
          Move
        </span>
        {moved && <button type="button" className={tb} title="Snap back" onClick={() => run(update(block.id, { offset_x: 0, offset_y: 0 }))}>Reset</button>}
        <button type="button" className={tb} disabled={idx === 0} aria-label="Move left" title="Move left"
          onClick={() => run(move(block.id, HEADER_SLOT, list[idx - 1].id))}>←</button>
        <button type="button" className={tb} disabled={idx === list.length - 1} aria-label="Move right" title="Move right"
          onClick={() => run(move(block.id, HEADER_SLOT, list[idx + 2]?.id ?? null))}>→</button>
        <button type="button" className={tb} title="Switch to the other side of the bar"
          onClick={() => run(update(block.id, { align: sideOf(block) === "left" ? "right" : "left" }))}>
          {sideOf(block) === "left" ? "To right" : "To left"}
        </button>
        <button type="button" className={tb} aria-label="Smaller" onClick={() => run(update(block.id, { scale: clamp(scale - 10, 40, 200) }))}>A−</button>
        <span className={tb}>{scale}%</span>
        <button type="button" className={tb} aria-label="Larger" onClick={() => run(update(block.id, { scale: clamp(scale + 10, 40, 200) }))}>A+</button>
        <button type="button" className={`${tb} hover:!bg-fang`}
          onClick={() => window.confirm("Delete this picture?") && run(remove(block.id))}>Delete</button>
      </span>
    </span>
  );
}

export default function HeaderPhotos({ side }: { side: "left" | "right" }) {
  const { isEditing } = useSiteContent();
  const { forSlot, add } = useHomeBlocks();
  const fileRef = useRef<HTMLInputElement>(null);
  const list = forSlot(HEADER_SLOT).filter((b) => b.image && sideOf(b) === side);

  return (
    <div className={`flex items-center gap-3 ${side === "left" ? "sm:flex-1" : "shrink-0"}`}>
      {list.map((b) => <HeaderPhoto key={b.id} block={b} list={list} />)}
      {isEditing && side === "right" && (
        <>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute right-3 top-full z-50 mt-1 whitespace-nowrap rounded-full border border-dashed border-amber/60 bg-night px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-amber hover:bg-amber hover:text-night"
          >
            + Picture
          </button>
          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) add("photo", HEADER_SLOT, f).catch(console.error);
            }}
          />
        </>
      )}
    </div>
  );
}
