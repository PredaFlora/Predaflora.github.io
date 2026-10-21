import { useRef, useState } from "react";
import { useHomeBlocks } from "../../contexts/HomeBlocksContext";
import { useSiteContent } from "../../contexts/SiteContentContext";
import { SLOTS } from "../../lib/homeBlocks";
import CustomBlock from "./CustomBlock";

/** Renders custom blocks that sit after a given homescreen section, plus add controls in edit mode. */
export default function BlockSlot({ slot }: { slot: string }) {
  const { isEditing } = useSiteContent();
  const { forSlot, add } = useHomeBlocks();
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const blocks = forSlot(slot);
  const label = SLOTS.find((s) => s.id === slot)?.label ?? slot;

  if (!isEditing) return <>{blocks.map((b) => <CustomBlock key={b.id} block={b} />)}</>;

  const run = (p: Promise<unknown>) => {
    setBusy(true);
    p.catch(console.error).finally(() => setBusy(false));
  };
  const btn = "rounded-full border border-amber/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-amber transition hover:bg-amber hover:text-night disabled:opacity-50";

  return (
    <>
      {blocks.map((b) => <CustomBlock key={b.id} block={b} />)}
      <div className="relative z-30 h-0">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto flex max-w-7xl -translate-y-1/2 items-center justify-between gap-3 px-5 sm:px-8">
          <span className="pointer-events-auto bg-night/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber/80">{label}</span>
          <div className="pointer-events-auto flex gap-2">
            <button type="button" disabled={busy} onClick={() => run(add("text", slot))} className={`${btn} bg-night`}>+ Text box</button>
            <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className={`${btn} bg-night`}>+ Photo</button>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) run(add("photo", slot, file));
          }}
        />
      </div>
    </>
  );
}
