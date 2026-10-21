import { Link } from "react-router-dom";
import { useSiteContent } from "../contexts/SiteContentContext";
import Wordmark from "./Wordmark";
import Removable from "./Removable";
import HeaderPhotos from "./HeaderPhotos";
import NavMenu from "./NavMenu";

export default function Header() {
  const { isEditing, styles, saveStyle } = useSiteContent();
  // Bar thickness is the top/bottom padding in px; 0 means the default. Saved separately for mobile and desktop.
  const pad = styles.header_bar?.offset_y || 0;
  const mobileView = typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;
  const shown = pad || (mobileView ? 6 : 16);
  const setPad = (n: number) => saveStyle("header_bar", { offset_y: Math.min(80, Math.max(1, n)) }).catch(console.error);
  const tb = "grid h-7 min-w-7 place-items-center bg-night px-2 font-mono text-[11px] text-bone hover:bg-amber hover:text-night";
  const btn = "shrink-0 rounded-full border border-bone/30 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition hover:border-bone hover:bg-bone hover:text-night sm:px-4 sm:py-2 sm:text-[15px]";
  return (
    <header className="relative border-b border-line/60 bg-night/90 backdrop-blur">
      {isEditing && (
        <div className="absolute left-3 top-full z-50 mt-1 flex items-center gap-px border border-amber/60 shadow-lg">
          <span className="grid h-7 place-items-center bg-night px-2 font-mono text-[10px] uppercase tracking-wider text-amber">Bar thickness</span>
          <button type="button" aria-label="Thinner bar" onClick={() => setPad(shown - 2)} className={tb}>−</button>
          <span className={`${tb} hover:bg-night hover:text-bone`}>{shown}px</span>
          <button type="button" aria-label="Thicker bar" onClick={() => setPad(shown + 2)} className={tb}>+</button>
          {pad > 0 && <button type="button" onClick={() => saveStyle("header_bar", { offset_y: 0 }).catch(console.error)} className={tb}>Reset</button>}
        </div>
      )}
      <div
        className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-1.5 sm:gap-4 sm:whitespace-nowrap sm:px-8 sm:py-4"
        style={pad ? { paddingTop: pad, paddingBottom: pad } : undefined}
      >
        <NavMenu />
        <div className="flex min-w-0 flex-1 flex-col-reverse items-start gap-1 sm:contents">
          <Removable id="header_logo" label="logo">
            {isEditing ? (
              <div><Wordmark suffix /></div>
            ) : (
              <Link to="/" aria-label="Home"><Wordmark suffix /></Link>
            )}
          </Removable>
          <HeaderPhotos side="left" />
        </div>
        <HeaderPhotos side="right" />
        <Removable id="header_inquire" label="Inquire button" movable>
          {isEditing ? <span className={btn}>Inquire</span> : <Link to="/#inquire" className={btn}>Inquire</Link>}
        </Removable>
      </div>
    </header>
  );
}
