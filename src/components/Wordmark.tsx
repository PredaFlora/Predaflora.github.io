import { InlineEdit } from "./InlineEdit";
import { useSiteContent } from "../contexts/SiteContentContext";

export default function Wordmark({ className = "text-2xl", suffix = false }: { className?: string; suffix?: boolean }) {
  const { styles, isEditing } = useSiteContent();
  const showSuffix = suffix && (isEditing || !styles.brand_suffix?.hidden);
  return (
    <span className={`inline-flex items-start gap-2 font-display leading-tight tracking-tight sm:inline ${className}`}>
      <span className="inline-flex whitespace-nowrap">
        <InlineEdit fixedOnMobile contentKey="brand_first" label="Site name — first part (italic, red)" className="italic text-fang" />
        <InlineEdit fixedOnMobile contentKey="brand_second" label="Site name — second part (green)" className="text-leaf" />
      </span>
      {showSuffix && (
        <span className="inline-flex items-start whitespace-normal max-sm:w-[calc(100vw-12rem)] max-sm:shrink-0 max-sm:text-[14px] sm:ml-2 sm:whitespace-nowrap">
          <InlineEdit fixedOnMobile contentKey="brand_dash" label="Site name — dash" className="mr-1.5 text-bone" />
          <InlineEdit fixedOnMobile contentKey="brand_suffix" label="Site name — text after the dash (white)" className="text-bone" />
        </span>
      )}
    </span>
  );
}
