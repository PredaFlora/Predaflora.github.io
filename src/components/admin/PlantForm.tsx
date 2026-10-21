import { useEffect, useState, type FormEvent } from "react";
import { CATEGORIES, CURRENCY, plantImage } from "../../lib/plants";
import type { Category, Plant } from "../../lib/types";
import { Close } from "../Icons";
import ImagePicker from "./ImagePicker";

interface Props {
  plant: Plant | null;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
}

const input = "mt-1 w-full border border-line bg-night px-3 py-2.5 text-bone focus:border-amber focus:outline-none";
const lbl = "font-mono text-[10px] uppercase tracking-[0.18em] text-fog";

export default function PlantForm({ plant, onClose, onSave }: Props) {
  const [category, setCategory] = useState<Category>(plant?.category ?? "predatory");
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("category", category);
    if (!String(fd.get("price_max") || "").trim()) fd.set("price_max", "0");
    fd.set("published", fd.get("published") ? "true" : "false");
    fd.delete("image");
    if (file) fd.set("image", file);
    else if (removeImage && plant?.image) fd.set("image-", plant.image);
    setBusy(true);
    setError("");
    try {
      await onSave(fd);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Couldn't save this plant. Check the fields and try again.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-night/70 backdrop-blur-sm animate-fade" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="plant-form-title" className="flex h-full w-full max-w-xl flex-col border-l border-line bg-moss">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 id="plant-form-title" className="font-display text-2xl">{plant ? "Edit plant" : "Add a new plant"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl text-fog hover:text-bone"><Close /></button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <fieldset>
            <legend className={lbl}>Side</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(Object.keys(CATEGORIES) as Category[]).map((c) => (
                <button key={c} type="button" onClick={() => setCategory(c)} aria-pressed={category === c}
                  className={`border px-3 py-3 font-mono text-[11px] uppercase tracking-[0.16em] transition ${category === c ? `${CATEGORIES[c].border} ${CATEGORIES[c].text} bg-night` : "border-line text-fog hover:text-bone"}`}>
                  {CATEGORIES[c].label}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <ImagePicker
              current={plant && !removeImage ? plantImage(plant, "600x750") : null}
              file={file}
              onChange={(f) => {
                setFile(f);
                if (f) setRemoveImage(false);
              }}
            />
            {plant?.image && !file && (
              <label className="mt-2 flex items-center gap-2 text-xs text-fog">
                <input type="checkbox" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} className="h-3.5 w-3.5 accent-[oklch(0.68_0.19_24)]" />
                Remove my photo (show a stock picture instead)
              </label>
            )}
          </div>

          <label className="block"><span className={lbl}>Name *</span>
            <input name="name" required defaultValue={plant?.name} className={input} placeholder="Venus Flytrap 'Red Dragon'" autoFocus />
          </label>
          <label className="block"><span className={lbl}>Latin name</span>
            <input name="latin_name" defaultValue={plant?.latin_name} className={`${input} font-display italic`} placeholder="Dionaea muscipula" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block"><span className={lbl}>Price ({CURRENCY}) *</span>
              <input name="price" type="number" min="0" step="0.01" required defaultValue={plant?.price ?? ""} className={`${input} font-mono`} />
            </label>
            <label className="block"><span className={lbl}>Max price ({CURRENCY}) for a range</span>
              <input name="price_max" type="number" min="0" step="0.01" defaultValue={plant?.price_max || ""} className={`${input} font-mono`} placeholder="Optional" />
            </label>
            <label className="block"><span className={lbl}>Status</span>
              <select name="status" defaultValue={plant?.status ?? "available"} className={input}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </label>
            <label className="block"><span className={lbl}>Pot size</span>
              <input name="pot_size" defaultValue={plant?.pot_size} className={input} placeholder="9 cm pot" />
            </label>
            <label className="block"><span className={lbl}>Care level</span>
              <input name="care_level" defaultValue={plant?.care_level} className={input} placeholder="Beginner" list="care-levels" />
              <datalist id="care-levels"><option value="Beginner" /><option value="Intermediate" /><option value="Advanced" /></datalist>
            </label>
          </div>
          <label className="block"><span className={lbl}>Plant type (groups similar plants together)</span>
            <input name="type" defaultValue={plant?.type} className={input} placeholder="Venus flytrap" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block"><span className={lbl}>In stock</span>
              <input name="quantity" type="number" min="0" step="1" defaultValue={plant?.quantity ?? 0} className={`${input} font-mono`} />
            </label>
            <label className="block"><span className={lbl}>Full batch size</span>
              <input name="quantity_total" type="number" min="0" step="1" defaultValue={plant?.quantity_total ?? 0} className={`${input} font-mono`} />
            </label>
          </div>
          <p className="-mt-3 text-xs text-fog">The stock meter on the site fills based on in stock out of full batch. Leave both at 0 to hide it.</p>
          <label className="block"><span className={lbl}>Description</span>
            <textarea name="description" rows={5} defaultValue={plant?.description} className={`${input} resize-y`} placeholder="Size, growing conditions, what makes this specimen special…" />
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="published" defaultChecked={plant?.published ?? true} className="h-4 w-4 accent-[oklch(0.84_0.16_128)]" />
            <span className="text-sm">Show on the website</span>
          </label>
          {error && <p className="text-sm text-fang" role="alert">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-full px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">Cancel</button>
          <button disabled={busy} className="rounded-full bg-bone px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber disabled:opacity-60">
            {busy ? "Saving…" : plant ? "Save changes" : "Add plant"}
          </button>
        </div>
      </form>
    </div>
  );
}
