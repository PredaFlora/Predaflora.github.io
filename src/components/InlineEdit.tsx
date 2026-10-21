import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSiteContent } from "../contexts/SiteContentContext";
import type { ContentKey } from "../lib/siteContent";

// ─── Edit popover ─────────────────────────────────────────────────────────────
function EditPopover({ label, value: initial, multiline, onSave, onClose }: {
  label: string;
  value: string;
  multiline?: boolean;
  onSave: (v: string) => Promise<void>;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);

  const commit = async () => {
    if (!draft.trim() || draft.trim() === initial) { onClose(); return; }
    setSaving(true);
    await onSave(draft.trim());
    setSaving(false);
    onClose();
  };

  const base = "w-full border border-line bg-night/80 px-3 py-2.5 text-bone placeholder:text-fog/40 focus:border-amber focus:outline-none";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-night/75 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg border border-amber bg-night p-6 shadow-2xl animate-rise">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-amber">Editing</p>
        <p className="mb-4 font-display text-xl font-light">{label}</p>
        {multiline ? (
          <textarea
            autoFocus rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) commit();
            }}
            className={`${base} resize-y`}
          />
        ) : (
          <textarea
            autoFocus rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) commit();
            }}
            className={`${base} resize-y`}
          />
        )}
        <p className="mt-2 text-xs text-fog/70">Press Enter for a new line. Lines stack on phones and run together on desktop.</p>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={commit} disabled={saving}
            className="rounded-full bg-amber px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-night hover:bg-bone disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={onClose}
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── InlineEdit ───────────────────────────────────────────────────────────────
interface InlineEditProps {
  contentKey: ContentKey;
  as?: React.ElementType;
  className?: string;
  multiline?: boolean;
  label?: string;
  fixedOnMobile?: boolean;
  children?: never; // content comes from context, not children
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Line breaks stack on phones and stay on one flat line from sm up. */
function Lines({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <>
              <br className="sm:hidden" />
              <span className="max-sm:hidden"> </span>
            </>
          )}
          {p}
        </React.Fragment>
      ))}
    </>
  );
}
const tb = "grid h-6 min-w-6 place-items-center bg-night px-1.5 font-mono text-[10px] normal-case tracking-normal text-bone hover:bg-amber hover:text-night";

export function InlineEdit({ contentKey, as: Tag = "span", className = "", multiline, label }: InlineEditProps) {
  const { content, saveContent, isEditing, styles, saveStyle } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const start = useRef({ px: 0, py: 0, x: 0, y: 0, w: 1 });
  const text = content[contentKey];

  const st = styles[contentKey];
  const scale = st?.scale || 100;
  const x = drag?.x ?? st?.offset_x ?? 0;
  const y = drag?.y ?? st?.offset_y ?? 0;
  const style: React.CSSProperties | undefined =
    scale !== 100 || x || y
      ? { ...(scale !== 100 && { zoom: scale / 100 }), ...((x || y) && { position: "relative", left: `${x}%`, top: `${y}px`, zIndex: 10 }) }
      : undefined;
  // Size and position are saved separately for mobile and desktop (see SiteContentContext)
  const fixedCls = "";

  if (st?.hidden && !isEditing) return null;
  if (!isEditing) return <Tag className={`${className} ${fixedCls}`} style={style}>{<Lines text={text} />}</Tag>;

  const run = (p: Promise<void>) => p.catch(console.error);
  if (st?.hidden) {
    return (
      <button
        type="button"
        onClick={() => run(saveStyle(contentKey, { hidden: false }))}
        className="absolute z-50 whitespace-nowrap border border-dashed border-amber/60 bg-night px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-amber hover:bg-amber hover:text-night"
      >
        Restore: {label ?? contentKey.replaceAll("_", " ")}
      </button>
    );
  }
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  const onDown = (e: React.PointerEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const host = e.currentTarget.closest("[data-ie]")?.parentElement;
    start.current = { px: e.clientX, py: e.clientY, x: st?.offset_x ?? 0, y: st?.offset_y ?? 0, w: host?.clientWidth || window.innerWidth };
    setDrag({ x: start.current.x, y: start.current.y });
  };
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag) return;
    const s = start.current;
    setDrag({
      x: Math.round(clamp(s.x + ((e.clientX - s.px) / s.w) * 100, -100, 100) * 10) / 10,
      y: Math.round(clamp(s.y + (e.clientY - s.py), -2000, 4000)),
    });
  };
  const onUp = (e: React.PointerEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!drag) return;
    const d = drag;
    setDrag(null);
    if (d.x !== (st?.offset_x ?? 0) || d.y !== (st?.offset_y ?? 0)) run(saveStyle(contentKey, { offset_x: d.x, offset_y: d.y }));
  };
  const step = (d: number) => run(saveStyle(contentKey, { scale: clamp(scale + d, 40, 400) }));

  return (
    <>
      <Tag
        data-ie
        style={style}
        className={`${className} ${fixedCls} group/ie relative cursor-text ring-2 ring-amber/40 hover:ring-amber/90 transition-all`}
        onClick={() => setOpen(true)}
        title="Click to edit"
      >
        {<Lines text={text} />}
        <span
          onClick={stop}
          className={`absolute -bottom-7 left-0 z-20 flex items-center gap-px whitespace-nowrap border border-amber/60 font-normal not-italic shadow-lg transition-opacity [@media(hover:none)]:opacity-100 group-hover/ie:opacity-100 ${drag ? "opacity-100" : "opacity-0"}`}
        >
          <span
            role="button"
            aria-label="Drag to move"
            title="Drag to move"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className={`${tb} cursor-grab touch-none select-none px-2.5 active:cursor-grabbing`}
          >
            Move
          </span>
          <span role="button" aria-label="Smaller text" title="Smaller text" onClick={() => step(-10)} className={`${tb} cursor-pointer`}>A−</span>
          <span className={`${tb} px-1.5`}>{scale}%</span>
          <span role="button" aria-label="Larger text" title="Larger text" onClick={() => step(10)} className={`${tb} cursor-pointer`}>A+</span>
          {(x !== 0 || y !== 0 || scale !== 100) && (
            <span role="button" aria-label="Reset" title="Reset size and position" onClick={() => run(saveStyle(contentKey, { scale: 100, offset_x: 0, offset_y: 0 }))} className={`${tb} cursor-pointer`}>Reset</span>
          )}
          <span role="button" aria-label="Delete" title="Delete this text" onClick={() => run(saveStyle(contentKey, { hidden: true }))} className={`${tb} cursor-pointer hover:!bg-fang`}>Delete</span>
        </span>
      </Tag>
      {open && createPortal(
        <EditPopover
          label={label ?? contentKey.replaceAll("_", " ")}
          value={text}
          multiline={multiline}
          onSave={(v) => saveContent(contentKey, v)}
          onClose={() => setOpen(false)}
        />,
        document.body
      )}
    </>
  );
}
