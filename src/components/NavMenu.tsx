import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useSiteContent } from "../contexts/SiteContentContext";
import { InlineEdit } from "./InlineEdit";
import Removable from "./Removable";

const link = "block py-3 transition-colors";

const ITEMS: { id: string; label: string; node: ReactNode }[] = [
  { id: "nav_home", label: "Home link", node: <Link to="/" className={`${link} hover:text-bone`}>Home</Link> },
  { id: "nav_predatory", label: "Predatory link", node: (
    <Link to="/predatory" className={`${link} hover:text-fang`}><span className="text-fang/70">I.</span> Predatory</Link>
  ) },
  { id: "nav_non_predatory", label: "Non-Predatory link", node: (
    <Link to="/non-predatory" className={`${link} hover:text-leaf`}><span className="text-leaf/70">II.</span> Non-Predatory</Link>
  ) },
  { id: "nav_browse", label: "Browse all link", node: <Link to="/browse-all" className={`${link} hover:text-bone`}>Browse all</Link> },
  { id: "nav_care", label: "Care guides link", node: <Link to="/care" className={`${link} hover:text-leaf`}>Care guides</Link> },
  { id: "nav_about", label: "About link", node: <Link to="/about" className={`${link} hover:text-bone`}>About</Link> },
  { id: "nav_subscribe", label: "Subscribe link", node: <Link to="/#subscribe" className={`${link} hover:text-amber`}>Subscribe</Link> },
];

export default function NavMenu() {
  const { isEditing, styles } = useSiteContent();
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const shown = ITEMS.filter((i) => isEditing || !styles[i.id]?.hidden);

  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Spacer stays in the flow so moving the button never reflows the header */}
      <div className="h-9 w-9 shrink-0 sm:h-11 sm:w-11">
      <Removable id="header_menu" label="menu button" movable>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="grid h-9 w-9 shrink-0 place-items-center border border-bone/30 bg-night text-bone transition hover:border-bone hover:bg-bone hover:text-night sm:h-11 sm:w-11"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </Removable>
      </div>
      {createPortal(
        <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
          <div
            onClick={() => setOpen(false)}
            className={`absolute inset-0 bg-night/70 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          />
          <aside
            role="dialog"
            aria-label="Site menu"
            className={`grain absolute left-0 top-0 flex h-full w-[min(86vw,320px)] flex-col border-r border-line bg-moss shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between border-b border-line/60 px-6 py-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">Menu</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center text-fog hover:text-bone">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <nav
              aria-label="Quick navigation"
              onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
              className="flex-1 overflow-y-auto px-6 py-4 font-mono text-[14px] uppercase tracking-[0.18em] text-fog"
            >
              <ul className="divide-y divide-line/50">
                {shown.map((item) => (
                  <li key={item.id}>
                    <Removable id={item.id} label={item.label} className="w-full" restoreInFlow>{item.node}</Removable>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-line/60 px-6 py-5">
              <InlineEdit contentKey="site_tagline" label="Menu — tagline" as="p"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog/60" />
            </div>
          </aside>
        </div>,
        document.body,
      )}
    </>
  );
}
