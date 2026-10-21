import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { HomeBlock } from "../../lib/homeBlocks";

interface Props {
  block: HomeBlock;
  onSave: (data: Partial<HomeBlock> | FormData) => Promise<void>;
  onClose: () => void;
}

const input = "mt-1 w-full border border-line bg-night px-3 py-2.5 text-bone focus:border-amber focus:outline-none";
const lbl = "font-mono text-[10px] uppercase tracking-[0.18em] text-fog";

export default function BlockEditor({ block, onSave, onClose }: Props) {
  const photo = block.kind === "photo";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const file = fileRef.current?.files?.[0];
    setBusy(true);
    setError("");
    try {
      if (file) {
        const fd = new FormData();
        fd.set("heading", String(f.get("heading") || ""));
        fd.set("image", file);
        await onSave(fd);
      } else {
        await onSave({ heading: String(f.get("heading") || ""), ...(photo ? {} : { body: String(f.get("body") || "") }) });
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError("Couldn't save. Please try again.");
      setBusy(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-night/75 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={submit} className="w-full max-w-lg border border-amber bg-night p-6 shadow-2xl animate-rise">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber">Editing</p>
        <h2 className="mb-4 font-display text-2xl font-light">{photo ? "Photo" : "Text box"}</h2>
        <div className="space-y-4">
          <label className="block"><span className={lbl}>{photo ? "Caption (optional)" : "Heading (optional)"}</span>
            <input name="heading" defaultValue={block.heading} className={input} autoFocus />
          </label>
          {photo ? (
            <label className="block"><span className={lbl}>Replace photo</span>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-1 block w-full text-sm text-fog file:mr-3 file:border-0 file:bg-bone file:px-4 file:py-2 file:font-mono file:text-[11px] file:uppercase file:text-night" />
            </label>
          ) : (
            <label className="block"><span className={lbl}>Text</span>
              <textarea name="body" rows={7} defaultValue={block.body} className={`${input} resize-y`} />
            </label>
          )}
        </div>
        {error && <p className="mt-3 text-sm text-fang" role="alert">{error}</p>}
        <div className="mt-5 flex items-center gap-3">
          <button disabled={busy} className="rounded-full bg-amber px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-night hover:bg-bone disabled:opacity-60">
            {busy ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={onClose} className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">Cancel</button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
