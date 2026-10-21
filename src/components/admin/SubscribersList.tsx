import { useEffect, useState } from "react";
import pb from "../../lib/pocketbase";
import type { Subscriber } from "../../lib/subscriber";

const EXTERNAL_ICON = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6H6V7h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const COPY_ICON = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export default function SubscribersList() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    pb.collection("subscribers")
      .getFullList<Subscriber>({ sort: "-created", requestKey: null })
      .then(setSubs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const copyEmails = async () => {
    const text = subs.map((s) => (s.name ? `${s.name} <${s.email}>` : s.email)).join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const serviceBtn = "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fog transition hover:border-bone hover:text-bone";

  return (
    <div className="mt-8">
      {/* How to send newsletters */}
      <div className="mb-8 border border-amber/30 bg-amber/5 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber">How to send newsletters</p>
        <p className="mt-2 text-sm text-fog">
          Copy your subscriber list below and paste it into a free email tool to send your newsletter.
          Both services below have a free plan that's more than enough for a plant shop.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://mailchimp.com"
            target="_blank"
            rel="noopener noreferrer"
            className={serviceBtn}
          >
            Mailchimp {EXTERNAL_ICON}
          </a>
          <a
            href="https://brevo.com"
            target="_blank"
            rel="noopener noreferrer"
            className={serviceBtn}
          >
            Brevo {EXTERNAL_ICON}
          </a>
        </div>
      </div>

      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-light">Subscribers</h2>
          {!loading && (
            <p className="mt-1 text-sm text-fog">{subs.length} {subs.length === 1 ? "person" : "people"} on your list</p>
          )}
        </div>
        {subs.length > 0 && (
          <button
            onClick={copyEmails}
            className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber"
          >
            {COPY_ICON}
            {copied ? "Copied!" : "Copy all emails"}
          </button>
        )}
      </div>

      {loading && <p className="py-12 text-fog">Loading…</p>}

      {!loading && subs.length === 0 && (
        <p className="py-16 text-center font-display text-xl italic text-fog">
          No subscribers yet. Share your site and they'll start rolling in.
        </p>
      )}

      {subs.length > 0 && (
        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line/60">
              <th className="py-3 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Name</th>
              <th className="py-3 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Email</th>
              <th className="py-3 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/40">
            {subs.map((s) => (
              <tr key={s.id} className="hover:bg-moss/30">
                <td className="py-3 pr-4 text-fog">{s.name || <span className="italic text-fog/50">—</span>}</td>
                <td className="py-3 pr-4 font-mono text-[12px]">{s.email}</td>
                <td className="py-3 text-right font-mono text-[11px] text-fog">
                  {new Date(s.created).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="mt-8 text-xs text-fog/60">
        To import into Mailchimp or Brevo, copy the emails above then use the "Import contacts" feature in either service.
      </p>
    </div>
  );
}
