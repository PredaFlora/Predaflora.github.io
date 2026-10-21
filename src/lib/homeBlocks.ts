import type { RecordModel } from "pocketbase";

export interface HomeBlock extends RecordModel {
  kind: "text" | "photo";
  heading: string;
  body: string;
  image: string;
  slot: string;
  sort_order: number;
  width: "small" | "medium" | "large" | "full" | "";
  align: "left" | "center" | "right" | "";
  /** Free-drag offset: x in % of the page content width, y in px. */
  offset_x: number;
  offset_y: number;
  /** Text size in percent; 0 means 100. */
  scale: number;
  font_family: string;
  /** Same three values, saved separately for phones. */
  m_offset_x: number;
  m_offset_y: number;
  m_scale: number;
}

/** Fonts a block can use. The empty id means the site default. */
export const FONTS: { id: string; label: string; css: string }[] = [
  { id: "", label: "Site default", css: "" },
  { id: "fraunces", label: "Fraunces", css: '"Fraunces", Georgia, serif' },
  { id: "playfair", label: "Playfair", css: '"Playfair Display", Georgia, serif' },
  { id: "lora", label: "Lora", css: '"Lora", Georgia, serif' },
  { id: "montserrat", label: "Montserrat", css: '"Montserrat", system-ui, sans-serif' },
  { id: "instrument", label: "Instrument Sans", css: '"Instrument Sans", system-ui, sans-serif' },
  { id: "oswald", label: "Oswald", css: '"Oswald", Impact, sans-serif' },
  { id: "bebas", label: "Bebas Neue", css: '"Bebas Neue", Impact, sans-serif' },
  { id: "caveat", label: "Caveat (handwritten)", css: '"Caveat", cursive' },
  { id: "pacifico", label: "Pacifico (script)", css: '"Pacifico", cursive' },
  { id: "elite", label: "Special Elite (typewriter)", css: '"Special Elite", monospace' },
  { id: "mono", label: "JetBrains Mono", css: '"JetBrains Mono", ui-monospace, monospace' },
];

/** Places on the homescreen where a block can sit ("after this section"), in page order. */
export const SLOTS: { id: string; label: string }[] = [
  { id: "hero", label: "Under the top photo" },
  { id: "diptych", label: "Under Predatory / Non-Predatory" },
  { id: "arrivals", label: "Under New arrivals" },
  { id: "reviews", label: "Under Reviews" },
  { id: "how", label: "Under How buying works" },
  { id: "faq", label: "Under the FAQ" },
  { id: "subscribe", label: "Under the Newsletter" },
  { id: "inquire", label: "Under the Inquire form" },
  { id: "meet", label: "Bottom of the page" },
];
