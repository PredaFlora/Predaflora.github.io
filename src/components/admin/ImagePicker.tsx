import { useEffect, useState } from "react";
import { Upload } from "../Icons";

interface Props {
  current: string | null;
  file: File | null;
  onChange: (f: File | null) => void;
}

export default function ImagePicker({ current, file, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const src = preview ?? current;

  return (
    <div>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">Photo</span>
      <label className="group mt-1 flex cursor-pointer items-center gap-4 border border-dashed border-line p-3 transition hover:border-amber">
        <div className="grid h-24 w-20 shrink-0 place-items-center overflow-hidden bg-night">
          {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <Upload className="text-2xl text-fog" />}
        </div>
        <div className="text-sm">
          <p className="text-bone group-hover:text-amber">{src ? "Replace photo" : "Upload a photo"}</p>
          <p className="mt-1 text-xs text-fog">JPG, PNG or WEBP, up to 8 MB. Portrait photos look best.</p>
          {file && <p className="mt-1 truncate font-mono text-[10px] text-leaf">{file.name}</p>}
        </div>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      </label>
    </div>
  );
}
