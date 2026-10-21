import { useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSiteContent } from "../../contexts/SiteContentContext";
import { useAdminPlants } from "../../hooks/useAdminPlants";
import { CATEGORIES } from "../../lib/plants";
import type { Category, Plant } from "../../lib/types";
import { LogOut, Plus } from "../Icons";
import PlantRow from "./PlantRow";
import PlantForm from "./PlantForm";
import SubscribersList from "./SubscribersList";
import TestimonialsAdmin from "./TestimonialsAdmin";
import WaitlistPanel from "./WaitlistPanel";
import FaqAdmin from "./FaqAdmin";
import CareAdmin from "./CareAdmin";

type Filter = "all" | Category;
type View = "plants" | "subscribers" | "reviews" | "faqs" | "care";

const TABS: [View, string][] = [
  ["plants", "Plants"],
  ["care", "Care guides"],
  ["subscribers", "Subscribers"],
  ["reviews", "Reviews"],
  ["faqs", "FAQs"],
];

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { setIsEditing } = useSiteContent();
  const navigate = useNavigate();
  const { plants, loading, error, save, remove } = useAdminPlants();
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<Plant | null | "new">(null);
  const [waitlistPlant, setWaitlistPlant] = useState<Plant | null>(null);
  const [toast, setToast] = useState("");
  const [view, setView] = useState<View>("plants");
  const deleting = useRef(new Set<string>());

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };
  const close = useCallback(() => setEditing(null), []);

  const shown = filter === "all" ? plants : plants.filter((p) => p.category === filter);
  const categoryTabs: [Filter, string][] = [
    ["all", "All"],
    ["predatory", CATEGORIES.predatory.label],
    ["non_predatory", CATEGORIES.non_predatory.label],
  ];

  const update = async (id: string, data: Partial<Plant> | FormData) => {
    try {
      await save(data, id);
      flash("Saved");
    } catch (e) {
      console.error(e);
      flash("Couldn't save that change");
      throw e;
    }
  };

  const del = async (p: Plant) => {
    if (deleting.current.has(p.id)) return;
    if (!window.confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    deleting.current.add(p.id);
    try {
      await remove(p.id);
      flash("Plant deleted");
    } catch (e) {
      console.error(e);
      flash("Couldn't delete that plant");
    } finally {
      deleting.current.delete(p.id);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">Seller desk</p>
          <h1 className="mt-2 font-display text-5xl font-light tracking-tight">Your plants</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLogout} className="inline-flex items-center gap-2 px-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">
            <LogOut /> Sign out
          </button>
          <button
            onClick={() => { setIsEditing(true); navigate("/"); }}
            className="inline-flex items-center gap-2 rounded-full border border-amber/50 bg-amber/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-amber transition hover:bg-amber hover:text-night"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Mode
          </button>
          {view === "plants" && (
            <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber">
              <Plus /> Add plant
            </button>
          )}
        </div>
      </div>

      {/* Main tab bar */}
      <div className="mt-10 flex flex-wrap gap-1 border border-line p-1" role="tablist" aria-label="Admin sections">
        {TABS.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={view === key} onClick={() => setView(key)}
            className={`px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] transition ${view === key ? "bg-bone text-night" : "text-fog hover:text-bone"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Views */}
      {view === "subscribers" && <SubscribersList />}
      {view === "reviews" && <TestimonialsAdmin onMessage={flash} />}
      {view === "faqs" && <FaqAdmin onMessage={flash} />}
      {view === "care" && <CareAdmin plants={plants} onMessage={flash} />}

      {view === "plants" && (
        <>
          <p className="mt-4 text-sm text-fog">
            Click a plant's status pill to quickly toggle between <span className="text-leaf">Available</span> and <span className="text-fog">Sold</span>.
            Sold plants show greyed-out on your site with a waitlist form.
          </p>

          {/* Category filter */}
          <div className="mt-6 flex gap-6 border-b border-line/60" role="tablist">
            {categoryTabs.map(([key, label]) => (
              <button key={key} role="tab" aria-selected={filter === key} onClick={() => setFilter(key)}
                className={`-mb-px border-b-2 pb-3 font-mono text-[11px] uppercase tracking-[0.18em] transition ${filter === key ? "border-amber text-bone" : "border-transparent text-fog hover:text-bone"}`}>
                {label} <span className="text-fog">({key === "all" ? plants.length : plants.filter((p) => p.category === key).length})</span>
              </button>
            ))}
          </div>

          {loading && <p className="py-12 text-fog">Loading…</p>}
          {error && <p className="py-12 text-fang">{error}</p>}
          {!loading && !error && !shown.length && (
            <p className="py-16 text-center font-display text-xl italic text-fog">No plants yet. Add your first one.</p>
          )}
          <ul className="divide-y divide-line/60">
            {shown.map((p) => (
              <PlantRow
                key={p.id}
                plant={p}
                onUpdate={(d) => update(p.id, d)}
                onEdit={() => setEditing(p)}
                onDelete={() => del(p)}
                onWaitlist={() => setWaitlistPlant(p)}
              />
            ))}
          </ul>
        </>
      )}

      <p className="mt-10 text-sm text-fog">
        <Link to="/" className="text-amber hover:underline">View the live site</Link> to see your changes.
      </p>

      {/* Drawers */}
      {editing && (
        <PlantForm
          plant={editing === "new" ? null : editing}
          onClose={close}
          onSave={async (fd) => {
            await save(fd, editing === "new" ? undefined : editing.id);
            flash(editing === "new" ? "Plant added" : "Changes saved");
          }}
        />
      )}

      {waitlistPlant && (
        <WaitlistPanel plant={waitlistPlant} onClose={() => setWaitlistPlant(null)} />
      )}

      {/* Toast */}
      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-rise border border-line bg-moss-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
