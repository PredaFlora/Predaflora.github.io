import type { RecordModel } from "pocketbase";

export interface Subscriber extends RecordModel {
  email: string;
  name: string;
  created: string;
}
