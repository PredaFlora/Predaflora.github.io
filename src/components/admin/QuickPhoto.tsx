import { useRef, useState } from "react";
import { plantImage } from "../../lib/plants";
import type { Plant } from "../../lib/types";
import { Camera } from "../Icons";

interface Props {
  plant: Plant;
  onUpload: (file: File) => Promise<void>;
}

export default function QuickPhoto({ plant, onUpload }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      await onUpload(file);
    } catch {
      // error is already shown as a toast by the dashboard
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <button
      type="button"
      onClick={() => input.current?.click()}
      disabled={busy}
      aria-label={`Upload a photo for ${plant.name}`}
      title={plant.image ? "Replace photo" : "Upload your photo"}
      className="group relative h-16 w-14 overflow-hidden bg-night"
    >
      <img src={plantImage(plant, "600x750")} alt="" className={`h-full w-full object-cover ${busy ? "opacity-30" : ""}`} />
      <span
        className={`absolute inset-0 grid place-items-center bg-night/60 text-xl text-bone transition-opacity ${
          busy ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        }`}
      >
        {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-bone border-t-transparent" /> : <Camera />}
      </span>
      {!plant.image && !busy && (
        <span className="absolute bottom-0 inset-x-0 bg-amber py-px text-center font-mono text-[8px] uppercase tracking-wider text-night">
          Stock
        </span>
      )}
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </button>
  );
}
