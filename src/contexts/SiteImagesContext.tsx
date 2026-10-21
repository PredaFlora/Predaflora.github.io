import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import pb from "../lib/pocketbase";
import { SITE_IMAGES, type SiteImage, type SiteImageKey } from "../lib/siteImages";

interface Ctx {
  records: Partial<Record<SiteImageKey, SiteImage>>;
  ready: boolean;
  url: (key: SiteImageKey, thumb?: string) => string;
  upload: (key: SiteImageKey, file: File) => Promise<void>;
  reset: (key: SiteImageKey) => Promise<void>;
}

const SiteImagesContext = createContext<Ctx>({
  records: {},
  ready: false,
  url: (key) => SITE_IMAGES[key].fallback,
  upload: async () => {},
  reset: async () => {},
});

export function SiteImagesProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<Partial<Record<SiteImageKey, SiteImage>>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    pb.collection("site_images")
      .getFullList<SiteImage>({ requestKey: null })
      .then((items) => setRecords(Object.fromEntries(items.map((r) => [r.key, r]))))
      .catch(console.error)
      .finally(() => setReady(true));
  }, []);

  const url = useCallback(
    (key: SiteImageKey, thumb?: string) => {
      const rec = records[key];
      if (rec?.image) return pb.files.getURL(rec, rec.image, thumb ? { thumb } : {});
      return SITE_IMAGES[key].fallback;
    },
    [records],
  );

  const upload = useCallback(async (key: SiteImageKey, file: File) => {
    const existing = records[key];
    const rec = existing
      ? await pb.collection("site_images").update<SiteImage>(existing.id, { image: file })
      : await pb.collection("site_images").create<SiteImage>({ key, image: file });
    setRecords((prev) => ({ ...prev, [key]: rec }));
  }, [records]);

  const reset = useCallback(async (key: SiteImageKey) => {
    const existing = records[key];
    if (!existing) return;
    await pb.collection("site_images").delete(existing.id);
    setRecords((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, [records]);

  return (
    <SiteImagesContext.Provider value={{ records, ready, url, upload, reset }}>
      {children}
    </SiteImagesContext.Provider>
  );
}

export const useSiteImagesCtx = () => useContext(SiteImagesContext);
