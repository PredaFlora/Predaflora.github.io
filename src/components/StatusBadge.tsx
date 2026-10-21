import { STATUS_LABEL } from "../lib/plants";
import type { Status } from "../lib/types";

const styles: Record<Status, string> = {
  available: "border-leaf/50 text-leaf",
  reserved: "border-amber/50 text-amber",
  sold: "border-fog/40 text-fog",
};

const dots: Record<Status, string> = {
  available: "bg-leaf",
  reserved: "bg-amber",
  sold: "bg-transparent border border-fog",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
