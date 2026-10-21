import { useRef, useState } from "react";
import { SITE_IMAGES, type SiteImageKey } from "../../lib/siteImages";
import { Camera, Reset } from "../Icons";

interface Props {
  imageKey: SiteImageKey;
  src: string;
  custom: boolean;
  onUpload: (file: File) => Promise<void>;
  onReset: () => Promise<void>;
}

export default function SitePhotoTile({ imageKey, src, custom, onUpload, onReset }: Props) {
  const meta = SITE_IMAGES[imageKey];
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    await fn();
    setBusy(false);
    if (input.current) input.current.value = "";
  };

  return (
    <div className={`flex flex-col border border-line/60 bg-moss/40 ${imageKey === "hero" ? "sm:col-span-2 lg:col-span-3" : ""}`}>
      <div className={`relative overflow-hidden bg-night ${imageKey === "hero" ? "aspect-[21/9]" : "aspect-[4/3]"}`}>
        <img src={src} alt={meta.label} className={`h-full w-full object-cover ${busy ? "opacity-30" : ""}`} />
        <span className={`absolute left-3 top-3 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] ${custom ? "bg-leaf text-night" : "bg-amber text-night"}`}>
          {custom ? "Your photo" : "Stock"}
        </span>
        {busy && (
          <span className="absolute inset-0 grid place-items-center">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-bone border-t-transparent" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl">{meta.label}</h3>
        <p className="mt-1 flex-1 text-sm text-fog">{meta.where}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="inline-flex items-center gap-2 rounded-full bg-bone px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-night transition hover:bg-amber disabled:opacity-60"
          >
            <Camera /> {custom ? "Replace" : "Upload photo"}
          </button>
          {custom && (
            <button
              type="button"
              disabled={busy}
              onClick={() => run(onReset)}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-fog transition hover:border-bone hover:text-bone disabled:opacity-60"
            >
              <Reset /> Reset
            </button>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) run(() => onUpload(f));
          }}
        />
      </div>
    </div>
  );
}
