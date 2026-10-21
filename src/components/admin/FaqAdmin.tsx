import { useCallback, useEffect, useState } from "react";
import pb from "../../lib/pocketbase";
import type { Faq } from "../../lib/faq";
import { Close, Eye, EyeOff, Pencil, Trash } from "../Icons";
import FaqSubmissions from "./FaqSubmissions";

function FaqForm({ item, prefillQuestion = "", onSave, onClose }: {
  item: Faq | null;
  prefillQuestion?: string;
  onSave: (data: Partial<Faq>) => Promise<void>;
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
        question: String(fd.get("question")),
        answer: String(fd.get("answer")),
        sort_order: Number(fd.get("sort_order")) || 0,
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
          <h2 className="font-display text-2xl">{item ? "Edit FAQ" : "Add a FAQ"}</h2>
          <button type="button" onClick={onClose} className="text-fog hover:text-bone"><Close /></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <label className="block"><span className={lbl}>Question *</span>
            <input name="question" required defaultValue={item?.question ?? prefillQuestion} className={inp} placeholder="Do you ship live plants?" />
          </label>
          <label className="block"><span className={lbl}>Answer *</span>
            <textarea name="answer" required rows={6} defaultValue={item?.answer} className={`${inp} resize-y`} placeholder="Yes! I ship carefully…" />
          </label>
          <label className="block"><span className={lbl}>Display order (lower = first)</span>
            <input name="sort_order" type="number" defaultValue={item?.sort_order ?? 99} className={`${inp} font-mono`} />
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="published" defaultChecked={item?.published ?? true} className="h-4 w-4 accent-[oklch(0.82_0.13_80)]" />
            <span className="text-sm">Show on the website</span>
          </label>
          {error && <p className="text-sm text-fang">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
          <button type="button" onClick={onClose} className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">Cancel</button>
          <button disabled={busy} className="rounded-full bg-bone px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night hover:bg-amber disabled:opacity-60">
            {busy ? "Saving…" : item ? "Save changes" : "Add FAQ"}
          </button>
        </div>
      </form>
    </div>
  );
}

const iconBtn = "grid h-9 w-9 place-items-center border border-line text-fog transition hover:border-bone hover:text-bone";

export default function FaqAdmin({ onMessage }: { onMessage: (msg: string) => void }) {
  const [list, setList] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Faq | null | "new">(null);
  const [subTab, setSubTab] = useState<"faqs" | "submitted">("faqs");
  const [prefillQuestion, setPrefillQuestion] = useState("");

  useEffect(() => {
    pb.collection("faqs").getFullList<Faq>({ sort: "sort_order,created", requestKey: null })
      .then(setList).catch(console.error).finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (data: Partial<Faq>, id?: string) => {
    const rec = id
      ? await pb.collection("faqs").update<Faq>(id, data)
      : await pb.collection("faqs").create<Faq>(data);
    setList(prev => id ? prev.map(f => f.id === id ? rec : f) : [...prev, rec]);
  }, []);

  const remove = async (f: Faq) => {
    if (!window.confirm("Delete this FAQ?")) return;
    await pb.collection("faqs").delete(f.id);
    setList(prev => prev.filter(x => x.id !== f.id));
    onMessage("FAQ deleted");
  };

  const toggle = async (f: Faq) => {
    const rec = await pb.collection("faqs").update<Faq>(f.id, { published: !f.published });
    setList(prev => prev.map(x => x.id === f.id ? rec : x));
    onMessage(rec.published ? "FAQ shown" : "FAQ hidden");
  };

  return (
    <div className="mt-8">
      {/* Sub-tabs */}
      <div className="mb-6 flex gap-1 border border-line p-1 w-fit">
        {([["faqs", "Published FAQs"], ["submitted", "Submitted questions"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setSubTab(key)} aria-selected={subTab === key}
            className={`px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition ${subTab === key ? "bg-bone text-night" : "text-fog hover:text-bone"}`}>
            {label}
          </button>
        ))}
      </div>

      {subTab === "submitted" && (
        <FaqSubmissions
          onMessage={onMessage}
          onCreateFaq={(question) => {
            setPrefillQuestion(question);
            setEditing("new");
            setSubTab("faqs");
          }}
        />
      )}

      {subTab === "faqs" && (
        <>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-fog">These appear in the FAQ section on your homepage.</p>
            <button onClick={() => { setPrefillQuestion(""); setEditing("new"); }} className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber">
              + Add FAQ
            </button>
          </div>
          {loading && <p className="py-12 text-fog">Loading…</p>}
          {!loading && !list.length && (
            <p className="py-16 text-center font-display text-xl italic text-fog">No FAQs yet.</p>
          )}
          <ul className="mt-6 divide-y divide-line/60">
            {list.map(f => (
              <li key={f.id} className={`flex items-start gap-4 py-5 ${f.published ? "" : "opacity-50"}`}>
                <span className="shrink-0 pt-1 font-mono text-[11px] text-amber">#{f.sort_order}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-medium">{f.question}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-fog">{f.answer}</p>
                  {!f.published && <span className="font-mono text-[10px] uppercase text-fog">Hidden</span>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => toggle(f)} className={iconBtn} title={f.published ? "Hide" : "Show"} aria-label={f.published ? "Hide FAQ" : "Show FAQ"}>
                    {f.published ? <Eye /> : <EyeOff />}
                  </button>
                  <button onClick={() => { setPrefillQuestion(""); setEditing(f); }} className={iconBtn} title="Edit" aria-label="Edit FAQ"><Pencil /></button>
                  <button onClick={() => remove(f)} className={`${iconBtn} hover:border-fang hover:text-fang`} title="Delete" aria-label="Delete FAQ"><Trash /></button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {editing && (
        <FaqForm
          item={editing === "new" ? null : editing}
          prefillQuestion={editing === "new" ? prefillQuestion : undefined}
          onClose={() => setEditing(null)}
          onSave={async (data) => {
            await save(data, editing === "new" ? undefined : editing.id);
            onMessage(editing === "new" ? "FAQ added" : "FAQ saved");
          }}
        />
      )}
    </div>
  );
}
