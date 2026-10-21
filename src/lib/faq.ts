import type { RecordModel } from "pocketbase";

export interface Faq extends RecordModel {
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
}

export interface WaitlistEntry extends RecordModel {
  plant: string;
  email: string;
  name: string;
  created: string;
}
