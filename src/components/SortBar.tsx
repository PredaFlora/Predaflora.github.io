export type SortKey = "newest" | "price_asc" | "price_desc";

interface Props {
  count: number;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  onlyAvailable: boolean;
  onToggle: () => void;
}

export default function SortBar({ count, sort, onSort, onlyAvailable, onToggle }: Props) {
  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line/60 pb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-fog">
      <span>{count} {count === 1 ? "specimen" : "specimens"}</span>
      <div className="flex flex-wrap items-center gap-5">
        <label className="flex cursor-pointer items-center gap-2 hover:text-bone">
          <input type="checkbox" checked={onlyAvailable} onChange={onToggle} className="h-4 w-4 accent-[oklch(0.84_0.16_128)]" />
          Available only
        </label>
        <label className="flex items-center gap-2">
          <span className="sr-only sm:not-sr-only">Sort</span>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="rounded-none border border-line bg-night px-3 py-2 uppercase tracking-[0.12em] text-bone focus:border-amber focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </label>
      </div>
    </div>
  );
}
