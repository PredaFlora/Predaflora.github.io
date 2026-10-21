import { useEffect, useState } from "react";
import pb from "../../lib/pocketbase";
import type { RecordModel } from "pocketbase";
import { Trash } from "../Icons";

interface Submission extends RecordModel {
  question: string;
  email: string;
  status: "pending" | "answered" | "dismissed";
  created: string;
}

interface Props {
  onMessage: (msg: string) => void;
  onCreateFaq: (question: string) => void;
}

export default function FaqSubmissions({ onMessage, onCreateFaq }: Props) {
  const [list, setList] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection("faq_submissions")
      .getFullList<Submission>({ sort: "-created", requestKey: null })
      .then(setList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const setStatus = async (id: string, status: Submission["status"]) => {
    const rec = await pb.collection("faq_submissions").update<Submission>(id, { status });
    setList((prev) => prev.map((s) => (s.id === id ? rec : s)));
    onMessage(status === "answered" ? "Marked as answered" : "Dismissed");
  };

  const remove = async (id: string) => {
    await pb.collection("faq_submissions").delete(id);
    setList((prev) => prev.filter((s) => s.id !== id));
    onMessage("Deleted");
  };

  const pending = list.filter((s) => s.status === "pending");
  const done = list.filter((s) => s.status !== "pending");

  const STATUS_STYLE: Record<Submission["status"], string> = {
    pending: "text-amber",
    answered: "text-leaf",
    dismissed: "text-fog",
  };

  const Row = ({ s }: { s: Submission }) => (
    <li className={`flex flex-col gap-3 py-4 sm:flex-row sm:items-start ${s.status !== "pending" ? "opacity-50" : ""}`}>
      <div className="flex-1">
        <p className="font-sans font-medium">{s.question}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em]">
          {s.email && <span className="text-fog">{s.email}</span>}
          <span className={STATUS_STYLE[s.status]}>{s.status}</span>
          <span className="text-fog/60">{new Date(s.created).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {s.status === "pending" && (
          <>
            <button
              onClick={() => onCreateFaq(s.question)}
              className="rounded-full bg-bone px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-night hover:bg-amber"
            >
              Answer & publish
            </button>
            <button
              onClick={() => setStatus(s.id, "dismissed")}
              className="rounded-full border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fog hover:text-bone"
            >
              Dismiss
            </button>
          </>
        )}
        <button onClick={() => remove(s.id)} className="grid h-8 w-8 place-items-center border border-line text-fog hover:border-fang hover:text-fang" aria-label="Delete">
          <Trash className="text-sm" />
        </button>
      </div>
    </li>
  );

  if (loading) return <p className="py-8 text-fog">Loading…</p>;

  return (
    <div className="mt-6">
      {!list.length ? (
        <p className="py-10 text-center font-display text-xl italic text-fog">No questions submitted yet.</p>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-6">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-amber">{pending.length} awaiting reply</p>
              <ul className="divide-y divide-line/60">{pending.map((s) => <Row key={s.id} s={s} />)}</ul>
            </div>
          )}
          {done.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.18em] text-fog hover:text-bone">
                {done.length} answered / dismissed
              </summary>
              <ul className="mt-3 divide-y divide-line/60">{done.map((s) => <Row key={s.id} s={s} />)}</ul>
            </details>
          )}
        </>
      )}
    </div>
  );
}
