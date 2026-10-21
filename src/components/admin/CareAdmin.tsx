import { useEffect, useState } from "react";
import pb from "../../lib/pocketbase";
import type { Plant } from "../../lib/types";
import { plantImage } from "../../lib/plants";
import { CARE_FIELDS, type CareGuide } from "../../lib/care";
import { Close, Pencil } from "../Icons";

const inp = "mt-1 w-full border border-line bg-night px-3 py-2.5 text-bone focus:border-amber focus:outline-none";
const lbl = "font-mono text-[10px] uppercase tracking-[0.18em] text-fog";

function GuideForm({ plant, guide, onSaved, onClose }: {
  plant: Plant;
  guide: CareGuide | undefined;
  onSaved: (g: CareGuide) => void;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = { plant: plant.id, summary: String(fd.get("summary") ?? "") };
    for (const f of CARE_FIELDS) data[f.key] = String(fd.get(f.key) ?? "");
    setBusy(true); setError("");
    try {
      const rec = guide
        ? await pb.collection("care_guides").update<CareGuide>(guide.id, data, { requestKey: null })
        : await pb.collection("care_guides").create<CareGuide>(data, { requestKey: null });
      onSaved(rec);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Couldn't save. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-night/70 backdrop-blur-sm animate-fade" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={submit} role="dialog" aria-modal="true" className="flex h-full w-full max-w-xl flex-col border-l border-line bg-moss">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber">Care guide</p>
            <h2 className="font-display text-2xl">{plant.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-fog hover:text-bone" aria-label="Close"><Close /></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <label className="block"><span className={lbl}>Short summary</span>
            <textarea name="summary" rows={2} defaultValue={guide?.summary} className={`${inp} resize-y`} placeholder="One or two lines that sum up this plant's needs" />
          </label>
          {CARE_FIELDS.map((f) => (
            <label key={f.key} className="block"><span className={lbl}>{f.label}</span>
              <textarea name={f.key} rows={4} defaultValue={guide?.[f.key]} className={`${inp} resize-y`} placeholder={f.hint} />
            </label>
          ))}
          <p className="text-xs text-fog/70">Leave a section empty to hide it on the website.</p>
          {error && <p className="text-sm text-fang">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
          <button type="button" onClick={onClose} className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">Cancel</button>
          <button disabled={busy} className="rounded-full bg-bone px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night hover:bg-amber disabled:opacity-60">
            {busy ? "Saving…" : "Save guide"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CareAdmin({ plants, onMessage }: { plants: Plant[]; onMessage: (m: string) => void }) {
  const [guides, setGuides] = useState<CareGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Plant | null>(null);

  useEffect(() => {
    pb.collection("care_guides").getFullList<CareGuide>({ requestKey: null })
      .then(setGuides).catch(console.error).finally(() => setLoading(false));
  }, []);

  const byPlant = (id: string) => guides.find((g) => g.plant === id);
  const filled = (g?: CareGuide) => !!g && CARE_FIELDS.some((f) => g[f.key]?.trim());

  return (
    <div className="mt-8">
      <p className="text-sm text-fog">Write how to look after each plant. Guides show on the Care guides page of your site.</p>
      {loading && <p className="py-12 text-fog">Loading…</p>}
      {!loading && !plants.length && <p className="py-16 text-center font-display text-xl italic text-fog">Add a plant first.</p>}
      <ul className="mt-6 divide-y divide-line/60">
        {plants.map((p) => {
          const g = byPlant(p.id);
          return (
            <li key={p.id} className="flex items-center gap-4 py-4">
              <div className="h-14 w-12 shrink-0 overflow-hidden bg-moss">
<img src={plantImage(p, "100x100")} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.name}</p>
                <p className={`font-mono text-[10px] uppercase tracking-[0.16em] ${filled(g) ? "text-leaf" : "text-fog"}`}>
                  {filled(g) ? "Guide written" : "No guide yet"}
                </p>
              </div>
              <button
                onClick={() => setEditing(p)}
                className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fog transition hover:border-bone hover:text-bone"
              >
                <Pencil /> {filled(g) ? "Edit" : "Write"}
              </button>
            </li>
          );
        })}
      </ul>
      {editing && (
        <GuideForm
          plant={editing}
          guide={byPlant(editing.id)}
          onClose={() => setEditing(null)}
          onSaved={(rec) => {
            setGuides((prev) => (prev.some((x) => x.id === rec.id) ? prev.map((x) => (x.id === rec.id ? rec : x)) : [...prev, rec]));
            onMessage("Care guide saved");
          }}
        />
      )}
    </div>
  );
}
