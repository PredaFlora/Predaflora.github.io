import type { RecordModel } from "pocketbase";

export interface Testimonial extends RecordModel {
  customer_name: string;
  quote: string;
  plant_bought: string;
  rating: number;
  published: boolean;
  submitted?: boolean;
}
