import type { RecordModel } from "pocketbase";

export type SiteImageKey =
  | "hero"
  | "predatory_panel"
  | "non_predatory_panel"
  | "predatory_banner"
  | "non_predatory_banner"
  | "about_photo";

export interface SiteImage extends RecordModel {
  key: SiteImageKey;
  image: string;
}

export const SITE_IMAGES: Record<SiteImageKey, { label: string; where: string; fallback: string; aspect: string }> = {
  hero: {
    label: "Homepage banner",
    where: "Large picture at the top of the homepage. Wide (landscape) photos work best.",
    fallback: "/generated_063ef0c9.webp",
    aspect: "aspect-video",
  },
  predatory_panel: {
    label: "Predatory side panel",
    where: "The Predatory half of the split section on the homepage.",
    fallback: "/generated_c70762f9.webp",
    aspect: "aspect-[4/5]",
  },
  non_predatory_panel: {
    label: "Non-Predatory side panel",
    where: "The Non-Predatory half of the split section on the homepage.",
    fallback: "/generated_03463af0.webp",
    aspect: "aspect-[4/5]",
  },
  predatory_banner: {
    label: "Predatory page banner",
    where: "Background picture at the top of the Predatory page.",
    fallback: "/generated_95048209.webp",
    aspect: "aspect-[4/5]",
  },
  non_predatory_banner: {
    label: "Non-Predatory page banner",
    where: "Background picture at the top of the Non-Predatory page.",
    fallback: "/generated_534785b6.webp",
    aspect: "aspect-[4/5]",
  },
  about_photo: {
    label: "About Me — portrait",
    where: "Your photo on the About Me page. Portrait or square photos work best.",
    fallback: "",
    aspect: "aspect-[3/4]",
  },
};
