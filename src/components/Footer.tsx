import { Link } from "react-router-dom";
import { InlineEdit } from "./InlineEdit";
import { useSiteContent } from "../contexts/SiteContentContext";
import Wordmark from "./Wordmark";

export default function Footer() {
  const { content } = useSiteContent();
  return (
    <footer className="border-t border-line/60 bg-night">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <Wordmark className="text-3xl" />
          <InlineEdit contentKey="footer_tagline" label="Footer — tagline" multiline as="p"
            className="mt-2 max-w-sm text-sm text-fog" />
        </div>
        <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-fog">
          <Link to="/predatory" className="hover:text-fang">Predatory</Link>
          <Link to="/non-predatory" className="hover:text-leaf">Non-Predatory</Link>
          <Link to="/about" className="hover:text-bone">About</Link>
          <Link to="/admin" className="hover:text-bone">Seller login</Link>
          <span>© {new Date().getFullYear()} {content.brand_first}{content.brand_second}</span>
        </div>
      </div>
    </footer>
  );
}
