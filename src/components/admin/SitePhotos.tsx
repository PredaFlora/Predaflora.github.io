import { useSiteImages } from "../../hooks/useSiteImages";
import { SITE_IMAGES, type SiteImageKey } from "../../lib/siteImages";
import SitePhotoTile from "./SitePhotoTile";

export default function SitePhotos({ onMessage }: { onMessage: (msg: string) => void }) {
  const { records, ready, url, upload, reset } = useSiteImages();

  const handleUpload = async (key: SiteImageKey, file: File) => {
    try {
      await upload(key, file);
      onMessage("Photo updated");
    } catch (e) {
      console.error(e);
      onMessage("Couldn't upload that photo");
    }
  };

  const handleReset = async (key: SiteImageKey) => {
    if (!window.confirm("Go back to the original stock picture?")) return;
    try {
      await reset(key);
      onMessage("Original picture restored");
    } catch (e) {
      console.error(e);
      onMessage("Couldn't reset that photo");
    }
  };

  if (!ready) return <p className="py-12 text-fog">Loading…</p>;

  return (
    <div className="mt-8">
      <p className="max-w-2xl text-sm text-fog">
        These are the large pictures around your website. Upload your own to replace them, or reset to go back to the original.
        Plant pictures are changed from the Plants tab.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(SITE_IMAGES) as SiteImageKey[]).map((key) => (
          <SitePhotoTile
            key={key}
            imageKey={key}
            src={url(key)}
            custom={Boolean(records[key])}
            onUpload={(f) => handleUpload(key, f)}
            onReset={() => handleReset(key)}
          />
        ))}
      </div>
    </div>
  );
}
