import type { RecordModel } from "pocketbase";

export type Category = "predatory" | "non_predatory";
export type Status = "available" | "reserved" | "sold";

export interface Plant extends RecordModel {
  name: string;
  latin_name: string;
  category: Category;
  type: string;
  quantity: number;
  quantity_total: number;
  price: number;
  price_max?: number;
  status: Status;
  description: string;
  pot_size: string;
  care_level: string;
  image: string;
  published: boolean;
  created: string;
  updated: string;
}
