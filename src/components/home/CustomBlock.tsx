import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import pb from "../../lib/pocketbase";
import { useHomeBlocks } from "../../contexts/HomeBlocksContext";
import { useSiteContent } from "../../contexts/SiteContentContext";
import { FONTS, SLOTS, type HomeBlock } from "../../lib/homeBlocks";
import BlockEditor from "./BlockEditor";

const WIDTH = { small: "max-w-sm", medium: "max-w-xl", large: "max-w-3xl", full: "max-w-none" } as const;
const ALIGN = { left: "mr-auto text-left", center: "mx-auto text-center", right: "ml-auto text-right" } as const;

const tool = "grid h-7 min-w-7 place-items-center bg-night px-1.5 font-mono text-[11px] text-bone transition hover:bg-amber hover:text-night disabled:opacity-30 disabled:hover:bg-night disabled:hover:text-bone";
const sel = "h-7 border-0 bg-night px-1 font-mono text-[10px] uppercase text-bone focus:outline-none";
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export default function CustomBlock({ block }: { block: HomeBlock }) {
  const { isEditing } = useSiteContent();
  const { forSlot, update, remove, move } = useHomeBlocks();
  const [editing, setEditing] = useState(false);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const start = useRef({ px: 0, py: 0, x: 0, y: 0, w: 1 });
  const wrapRef = useRef<HTMLDivElement>(null);

  const photo = block.kind === "photo";
  const width = WIDTH[block.width || (photo ? "medium" : "large")];
  const align = ALIGN[block.align || (photo ? "center" : "left")];
  const scale = (block.scale || 100) / 100;
  const x = drag?.x ?? block.offset_x ?? 0;
  const y = drag?.y ?? block.offset_y ?? 0;
  const moved = x !== 0 || y !== 0;
  const posStyle = { position: "relative" as const, left: `${x}%`, top: `${y}px`, zIndex: moved ? 10 : undefined };

  const fontCss = FONTS.find((f) => f.id === block.font_family)?.css;
  const fontStyle = fontCss ? { fontFamily: fontCss } : undefined;

  const content = photo ? (
    <figure>
      {block.image && <img src={pb.files.getURL(block, block.image)} alt={block.heading || ""} className="h-auto w-full" draggable={false} />}
      {block.heading && <figcaption className="mt-3 font-display italic text-fog" style={{ ...fontStyle, fontSize: `${1.125 * scale}rem` }}>{block.heading}</figcaption>}
    </figure>
  ) : (
    <div>
      {block.heading && <h2 className="font-display font-light tracking-tight break-words" style={{ ...fontStyle, fontSize: `${2.25 * scale}rem`, lineHeight: 1.15 }}>{block.heading}</h2>}
      {block.body && <p className="mt-4 whitespace-pre-line leading-relaxed text-bone/85 break-words" style={{ ...fontStyle, fontSize: `${1.125 * scale}rem` }}>{block.body}</p>}
    </div>
  );

  if (!isEditing) {
    return (
      <section className="mx-auto max-w-7xl overflow-x-clip px-5 py-10 sm:px-8">
        <div className={`${width} ${align}`} style={posStyle}>{content}</div>
      </section>
    );
  }

  const list = forSlot(block.slot);
  const idx = list.findIndex((b) => b.id === block.id);
  const slotIdx = SLOTS.findIndex((s) => s.id === block.slot);
  const first = idx === 0 && slotIdx === 0;
  const last = idx === list.length - 1 && slotIdx === SLOTS.length - 1;
  const run = (p?: Promise<unknown>) => p?.catch(console.error);

  const up = () => {
    if (idx > 0) return move(block.id, block.slot, list[idx - 1].id);
    if (slotIdx > 0) return move(block.id, SLOTS[slotIdx - 1].id, null);
  };
  const down = () => {
    if (idx < list.length - 1) return move(block.id, block.slot, list[idx + 2]?.id ?? null);
    if (slotIdx < SLOTS.length - 1) {
      const next = SLOTS[slotIdx + 1].id;
      return move(block.id, next, forSlot(next)[0]?.id ?? null);
    }
  };
  const del = () => {
    if (window.confirm("Delete this block? This can't be undone.")) run(remove(block.id));
  };
  const step = (d: number) => run(update(block.id, { scale: clamp(Math.round((block.scale || 100) + d), 40, 400) }));

  const onDown = (e: RPointerEvent<HTMLElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const w = wrapRef.current?.parentElement?.clientWidth || 1;
    start.current = { px: e.clientX, py: e.clientY, x: block.offset_x || 0, y: block.offset_y || 0, w };
    setDrag({ x: start.current.x, y: start.current.y });
  };
  const onMove = (e: RPointerEvent<HTMLElement>) => {
    if (!drag) return;
    const s = start.current;
    setDrag({
      x: Math.round(clamp(s.x + ((e.clientX - s.px) / s.w) * 100, -100, 100) * 10) / 10,
      y: Math.round(clamp(s.y + (e.clientY - s.py), -2000, 4000)),
    });
  };
  const onUp = () => {
    if (!drag) return;
    const d = drag;
    setDrag(null);
    if (d.x !== (block.offset_x || 0) || d.y !== (block.offset_y || 0)) run(update(block.id, { offset_x: d.x, offset_y: d.y }));
  };

  return (
    <section className="mx-auto max-w-7xl overflow-x-clip px-5 py-10 sm:px-8">
      <div ref={wrapRef} className={`${width} ${align}`} style={posStyle}>
        <div className={`relative outline-1 outline-dashed outline-offset-8 ${drag ? "bg-amber/5 outline-amber" : "outline-amber/60"}`}>
          <div className="absolute -top-4 right-2 z-10 flex flex-wrap items-center gap-px border border-amber/60 shadow-lg">
            <span
              role="button"
              tabIndex={0}
              aria-label="Drag to move anywhere"
              title="Drag to move anywhere"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              className={`${tool} cursor-grab touch-none select-none px-3 active:cursor-grabbing`}
            >
              Move
            </span>
            {moved && <button type="button" onClick={() => run(update(block.id, { offset_x: 0, offset_y: 0 }))} className={tool} title="Snap back to its spot">Reset</button>}
            <button type="button" onClick={() => run(up())} disabled={first} className={tool} aria-label="Move up a section" title="Move up a section">↑</button>
            <button type="button" onClick={() => run(down())} disabled={last} className={tool} aria-label="Move down a section" title="Move down a section">↓</button>
            <button type="button" onClick={() => step(-10)} className={tool} aria-label="Smaller text" title="Smaller text">A−</button>
            <span className={`${tool} px-2`} aria-label="Text size">{Math.round(scale * 100)}%</span>
            <button type="button" onClick={() => step(10)} className={tool} aria-label="Larger text" title="Larger text">A+</button>
            <select aria-label="Font" value={block.font_family || ""} onChange={(e) => run(update(block.id, { font_family: e.target.value }))} className={`${sel} max-w-28 normal-case`}>
              {FONTS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
            <select aria-label="Width" value={block.width || (photo ? "medium" : "large")} onChange={(e) => run(update(block.id, { width: e.target.value as HomeBlock["width"] }))} className={sel}>
              <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option><option value="full">Full</option>
            </select>
            <select aria-label="Alignment" value={block.align || (photo ? "center" : "left")} onChange={(e) => run(update(block.id, { align: e.target.value as HomeBlock["align"] }))} className={sel}>
              <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
            </select>
            <button type="button" onClick={() => setEditing(true)} className={tool}>Edit</button>
            <button type="button" onClick={del} className={`${tool} hover:!bg-fang`}>Delete</button>
          </div>
          {content}
        </div>
      </div>
      {editing && <BlockEditor block={block} onSave={(d) => update(block.id, d)} onClose={() => setEditing(false)} />}
    </section>
  );
}
