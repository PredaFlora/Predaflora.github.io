import { useCallback, useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import { SITE_IMAGES, type SiteImage, type SiteImageKey } from "../lib/siteImages";

export function useSiteImages() {
  const [records, setRecords] = useState<Partial<Record<SiteImageKey, SiteImage>>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    pb.collection("site_images")
      .getFullList<SiteImage>({ requestKey: null })
      .then((items) => setRecords(Object.fromEntries(items.map((r) => [r.key, r]))))
      .catch((e) => console.error(e))
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

  const upload = useCallback(
    async (key: SiteImageKey, file: File) => {
      const existing = records[key];
      const rec = existing
        ? await pb.collection("site_images").update<SiteImage>(existing.id, { image: file })
        : await pb.collection("site_images").create<SiteImage>({ key, image: file });
      setRecords((prev) => ({ ...prev, [key]: rec }));
    },
    [records],
  );

  const reset = useCallback(
    async (key: SiteImageKey) => {
      const existing = records[key];
      if (!existing) return;
      await pb.collection("site_images").delete(existing.id);
      setRecords((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [records],
  );

  return { records, ready, url, upload, reset };
}
