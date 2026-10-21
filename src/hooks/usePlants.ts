import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import type { Category, Plant } from "../lib/types";

export function usePlants(category?: Category) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const filter = category
      ? pb.filter("published = true && category = {:c}", { c: category })
      : "published = true";
    pb.collection("plants")
      .getFullList<Plant>({ filter, sort: "-created", requestKey: null })
      .then((items) => active && setPlants(items))
      .catch((e: Error) => {
        console.error(e);
        if (active) setError("We couldn't load the plants right now.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [category]);

  return { plants, loading, error };
}
