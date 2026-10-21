import { useEffect, useState } from "react";
import pb from "../../lib/pocketbase";
import type { WaitlistEntry } from "../../lib/faq";
import type { Plant } from "../../lib/types";
import { Close } from "../Icons";

interface Props {
  plant: Plant;
  onClose: () => void;
}

export default function WaitlistPanel({ plant, onClose }: Props) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    pb.collection("waitlist")
      .getFullList<WaitlistEntry>({ filter: pb.filter("plant = {:id}", { id: plant.id }), sort: "created", requestKey: null })
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [plant.id]);

  const copyEmails = async () => {
    const text = entries.map((e) => (e.name ? `${e.name} <${e.email}>` : e.email)).join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const remove = async (id: string) => {
    await pb.collection("waitlist").delete(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-night/70 backdrop-blur-sm animate-fade" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="waitlist-title" className="flex h-full w-full max-w-lg flex-col border-l border-line bg-moss">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 id="waitlist-title" className="font-display text-2xl">Waitlist</h2>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">{plant.name}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-fog hover:text-bone"><Close /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading && <p className="text-fog">Loading…</p>}

          {!loading && !entries.length && (
            <p className="font-display text-xl italic text-fog">Nobody on the waitlist yet.</p>
          )}

          {entries.length > 0 && (
            <>
              <p className="mb-4 text-sm text-fog">{entries.length} {entries.length === 1 ? "person" : "people"} waiting for this plant.</p>
              <button onClick={copyEmails} className="mb-6 inline-flex items-center gap-2 rounded-full bg-bone px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-night hover:bg-amber">
                {copied ? "Copied!" : "Copy all emails"}
              </button>
              <ul className="divide-y divide-line/60">
                {entries.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-sans text-sm font-medium">{e.name || <span className="italic text-fog">No name</span>}</p>
                      <p className="font-mono text-[11px] text-fog">{e.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-fog/60">
                        {new Date(e.created).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                      </span>
                      <button onClick={() => remove(e.id)} aria-label="Remove from waitlist" className="text-fog/60 hover:text-fang">
                        <Close className="text-sm" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="border-t border-line px-6 py-4">
          <p className="text-xs text-fog/60">Email these customers when you have a new {plant.name} available.</p>
        </div>
      </div>
    </div>
  );
}
