import { useCallback, useEffect, useState } from "react";
import pb from "../../lib/pocketbase";
import type { Testimonial } from "../../lib/testimonial";

const iconBtn = "grid h-9 w-9 place-items-center border border-line text-fog transition hover:border-bone hover:text-bone";

const PENCIL = <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" /></svg>;
const TRASH = <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
const EYE = <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>;
const EYE_OFF = <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.6 8.4 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>;

function Stars({ count }: { count: number }) {
  return (
    <span className="font-mono text-[10px] text-amber">{"★".repeat(count)}{"☆".repeat(5 - count)}</span>
  );
}

function TestimonialForm({ item, onSave, onClose }: {
  item: Testimonial | null;
  onSave: (data: Partial<Testimonial>) => Promise<void>;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true); setError("");
    try {
      await onSave({
        customer_name: String(fd.get("customer_name")),
        quote: String(fd.get("quote")),
        plant_bought: String(fd.get("plant_bought")),
        rating: Number(fd.get("rating")),
        published: fd.get("published") === "on",
      });
      onClose();
    } catch (err) { console.error(err); setError("Couldn't save. Please try again."); setBusy(false); }
  };

  const inp = "mt-1 w-full border border-line bg-night px-3 py-2.5 text-bone focus:border-amber focus:outline-none";
  const lbl = "font-mono text-[10px] uppercase tracking-[0.18em] text-fog";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-night/70 backdrop-blur-sm animate-fade" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={submit} role="dialog" aria-modal="true" className="flex h-full w-full max-w-lg flex-col border-l border-line bg-moss">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl">{item ? "Edit review" : "Add a review"}</h2>
          <button type="button" onClick={onClose} className="text-fog hover:text-bone">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <label className="block"><span className={lbl}>Customer name *</span>
            <input name="customer_name" required defaultValue={item?.customer_name} className={inp} placeholder="Sarah M." />
          </label>
          <label className="block"><span className={lbl}>Their review *</span>
            <textarea name="quote" required rows={5} defaultValue={item?.quote} className={`${inp} resize-y`} placeholder="What did they say about their plant?" />
          </label>
          <label className="block"><span className={lbl}>Plant they bought</span>
            <input name="plant_bought" defaultValue={item?.plant_bought} className={inp} placeholder="Venus Flytrap 'B52'" />
          </label>
          <label className="block"><span className={lbl}>Rating (1–5)</span>
            <select name="rating" defaultValue={item?.rating ?? 5} className={inp}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} star{n !== 1 ? "s" : ""}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="published" defaultChecked={item?.published ?? true} className="h-4 w-4 accent-[oklch(0.84_0.16_128)]" />
            <span className="text-sm">Show on the website</span>
          </label>
          {error && <p className="text-sm text-fang">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
          <button type="button" onClick={onClose} className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">Cancel</button>
          <button disabled={busy} className="rounded-full bg-bone px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night hover:bg-amber disabled:opacity-60">
            {busy ? "Saving…" : item ? "Save changes" : "Add review"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function TestimonialsAdmin({ onMessage }: { onMessage: (msg: string) => void }) {
  const [list, setList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null | "new">(null);

  useEffect(() => {
    pb.collection("testimonials").getFullList<Testimonial>({ sort: "-created", requestKey: null })
      .then(setList).catch(console.error).finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (data: Partial<Testimonial>, id?: string) => {
    const rec = id
      ? await pb.collection("testimonials").update<Testimonial>(id, data)
      : await pb.collection("testimonials").create<Testimonial>(data);
    setList(prev => id ? prev.map(t => t.id === id ? rec : t) : [rec, ...prev]);
  }, []);

  const remove = async (t: Testimonial) => {
    if (!window.confirm(`Delete ${t.customer_name}'s review? This can't be undone.`)) return;
    await pb.collection("testimonials").delete(t.id);
    setList(prev => prev.filter(x => x.id !== t.id));
    onMessage("Review deleted");
  };

  const toggle = async (t: Testimonial) => {
    const rec = await pb.collection("testimonials").update<Testimonial>(t.id, { published: !t.published });
    setList(prev => prev.map(x => x.id === t.id ? rec : x));
    onMessage(rec.published ? "Review shown" : "Review hidden");
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-light">Customer reviews</h2>
          <p className="mt-1 text-sm text-fog">Add real reviews from happy customers to build trust.</p>
        </div>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber">
          + Add review
        </button>
      </div>

      {loading && <p className="py-12 text-fog">Loading…</p>}
      {!loading && !list.length && (
        <p className="py-16 text-center font-display text-xl italic text-fog">No reviews yet. Add your first one.</p>
      )}
      <ul className="mt-6 divide-y divide-line/60">
        {list.map(t => (
          <li key={t.id} className={`flex gap-4 py-5 ${t.published || t.submitted ? "" : "opacity-50"}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-sans font-medium">{t.customer_name}</span>
                <Stars count={t.rating || 5} />
                {t.plant_bought && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">{t.plant_bought}</span>}
                {!t.published && t.submitted && (
                  <span className="rounded-full border border-amber/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-amber">Awaiting approval</span>
                )}
                {!t.published && !t.submitted && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">· Hidden</span>}
              </div>
              <p className="mt-2 line-clamp-2 font-display italic text-fog">"{t.quote}"</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!t.published && t.submitted && (
                <button onClick={() => toggle(t)} className="rounded-full bg-leaf px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-night hover:bg-bone">
                  Approve
                </button>
              )}
              <button onClick={() => toggle(t)} className={iconBtn} title={t.published ? "Hide" : "Show"} aria-label={t.published ? "Hide review" : "Show review"}>
                {t.published ? EYE : EYE_OFF}
              </button>
              <button onClick={() => setEditing(t)} className={iconBtn} title="Edit" aria-label="Edit review">
                {PENCIL}
              </button>
              <button onClick={() => remove(t)} className={`${iconBtn} hover:border-fang hover:text-fang`} title="Delete" aria-label="Delete review">
                {TRASH}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <TestimonialForm
          item={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (data) => {
            await save(data, editing === "new" ? undefined : editing.id);
            onMessage(editing === "new" ? "Review added" : "Review saved");
          }}
        />
      )}
    </div>
  );
}
