import type { Plant } from "../lib/types";
import PlantCard from "./PlantCard";

interface Props {
  plants: Plant[];
  loading: boolean;
  error?: string | null;
  empty?: string;
  /** Optional: choose where each card links */
  linkTo?: (plant: Plant) => string | undefined;
}

export default function PlantGrid({ plants, loading, error, empty = "No plants here yet.", linkTo }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] bg-moss" />
            <div className="mt-3 h-4 w-2/3 bg-moss" />
            <div className="mt-2 h-3 w-1/3 bg-moss" />
          </div>
        ))}
      </div>
    );
  }
  if (error) return <p className="py-16 text-center text-fang">{error}</p>;
  if (!plants.length) {
    return <p className="py-16 text-center font-display text-xl italic text-fog">{empty}</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
      {plants.map((p, i) => (
        <PlantCard key={p.id} plant={p} index={i} to={linkTo?.(p)} />
      ))}
    </div>
  );
}
