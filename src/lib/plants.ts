import pb from "./pocketbase";
import type { Category, Plant, Status } from "./types";

/** Change this to your local currency code (e.g. "EUR", "GBP"). */
export const CURRENCY = "USD";

export const CATEGORIES: Record<Category, {
  label: string;
  path: string;
  numeral: string;
  tagline: string;
  images: string[];
  text: string;
  bg: string;
  border: string;
}> = {
  predatory: {
    label: "Predatory",
    path: "/predatory",
    numeral: "I",
    tagline: "Flytraps, sundews and pitchers. Plants that hunt.",
    images: ["/generated_c70762f9.webp", "/generated_95048209.webp"],
    text: "text-fang",
    bg: "bg-fang",
    border: "border-fang",
  },
  non_predatory: {
    label: "Non-Predatory",
    path: "/non-predatory",
    numeral: "II",
    tagline: "Rare foliage, aroids and ferns. Perfectly harmless.",
    images: ["/generated_03463af0.webp", "/generated_534785b6.webp"],
    text: "text-leaf",
    bg: "bg-leaf",
    border: "border-leaf",
  },
};

export const STATUS_LABEL: Record<Status, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

function hash(id: string) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export function plantImage(plant: Plant, thumb?: string) {
  if (plant.image) return pb.files.getURL(plant, plant.image, thumb ? { thumb } : {});
  const imgs = CATEGORIES[plant.category].images;
  return imgs[hash(plant.id) % imgs.length];
}

export function specimenNo(plant: Plant) {
  return `No. ${String(hash(plant.id) % 1000).padStart(3, "0")}`;
}

/** "$20" for a fixed price, "$20 – $35" when a max price is set. */
export function formatPlantPrice(plant: Plant) {
  const max = plant.price_max || 0;
  if (max > plant.price) return `${formatPrice(plant.price)} – ${formatPrice(max)}`;
  return formatPrice(plant.price);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value || 0);
}
