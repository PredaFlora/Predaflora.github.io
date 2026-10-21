import type { RecordModel } from "pocketbase";

export interface CareGuide extends RecordModel {
  plant: string;
  summary: string;
  light: string;
  water: string;
  humidity: string;
  temperature: string;
  soil: string;
  feeding: string;
  dormancy: string;
  tips: string;
}

export type CareField = "light" | "water" | "humidity" | "temperature" | "soil" | "feeding" | "dormancy" | "tips";

/** The care topics shown on a guide, in display order. */
export const CARE_FIELDS: { key: CareField; label: string; hint: string }[] = [
  { key: "light", label: "Light", hint: "How much sun, and what kind (direct, bright, grow lights)" },
  { key: "water", label: "Water", hint: "What water to use, how often, and how to water" },
  { key: "humidity", label: "Humidity", hint: "Ideal humidity and how to keep it there" },
  { key: "temperature", label: "Temperature", hint: "Day and night range, and anything it can't tolerate" },
  { key: "soil", label: "Soil & pot", hint: "Soil mix, pot type and repotting" },
  { key: "feeding", label: "Feeding", hint: "What to feed, how often, and what to avoid" },
  { key: "dormancy", label: "Dormancy", hint: "Winter rest: when it happens and what to change" },
  { key: "tips", label: "Extra tips", hint: "Common mistakes, troubleshooting, anything else" },
];
