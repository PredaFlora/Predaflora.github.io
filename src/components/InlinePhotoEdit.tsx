import { useRef, useState, type ReactNode } from "react";
import { useSiteContent } from "../contexts/SiteContentContext";
import { useSiteImagesCtx } from "../contexts/SiteImagesContext";
import type { SiteImageKey } from "../lib/siteImages";
import type { ContentKey } from "../lib/siteContent";

const POSITIONS = [
  { label: "Top left",     value: "top left" },
  { label: "Top center",   value: "top center" },
  { label: "Top right",    value: "top right" },
  { label: "Mid left",     value: "center left" },
  { label: "Center",       value: "center center" },
  { label: "Mid right",    value: "center right" },
  { label: "Bottom left",  value: "bottom left" },
  { label: "Bottom center",value: "bottom center" },
  { label: "Bottom right", value: "bottom right" },
];

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

interface Props {
  imageKey: SiteImageKey;
  /** When provided a 3×3 position grid is shown so the user can reframe the image */
  positionKey?: ContentKey;
  children: ReactNode;
  className?: string;
}

export function InlinePhotoEdit({ imageKey, positionKey, children, className = "" }: Props) {
  const { isEditing, content, saveContent } = useSiteContent();
  const { upload } = useSiteImagesCtx();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { await upload(imageKey, file); }
    catch (err) { console.error(err); }
    finally { setUploading(false); e.target.value = ""; }
  };

  if (!isEditing) return <div className={`relative ${className}`}>{children}</div>;

  const currentPos = positionKey ? (content[positionKey] || "center center") : "center center";

  return (
    <div className={`group/photo relative ${className}`}>
      {children}

      {/* Dim overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-night/40 opacity-0 transition-opacity group-hover/photo:opacity-100" />

      {/* Change photo button — top left */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-amber px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-night opacity-0 transition-opacity group-hover/photo:opacity-100 hover:bg-bone"
      >
        <CameraIcon />
        {uploading ? "Uploading…" : "Change photo"}
      </button>

      {/* Position picker — bottom right, only when positionKey is given */}
      {positionKey && (
        <div className="absolute bottom-3 right-3 z-10 opacity-0 transition-opacity group-hover/photo:opacity-100">
          <p className="mb-1 text-right font-mono text-[9px] uppercase tracking-widest text-bone/70">
            Reframe
          </p>
          <div className="grid grid-cols-3 gap-1 rounded-md bg-night/85 p-2 backdrop-blur-sm">
            {POSITIONS.map(({ label, value }) => (
              <button
                key={value}
                title={label}
                aria-label={label}
                onClick={() => saveContent(positionKey, value)}
                className={`h-5 w-5 rounded-sm transition-colors ${
                  currentPos === value
                    ? "bg-amber ring-1 ring-amber/60"
                    : "bg-fog/25 hover:bg-fog/55"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleChange} />
    </div>
  );
}
