import { useCallback, useEffect, useState } from "react";
import { ClientResponseError } from "pocketbase";
import pb from "../lib/pocketbase";
import type { Plant } from "../lib/types";

export function useAdminPlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    pb.collection("plants")
      .getFullList<Plant>({ sort: "-created", requestKey: null })
      .then(setPlants)
      .catch((e: Error) => {
        console.error(e);
        setError("Couldn't load your plants. Try signing in again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (data: FormData | Partial<Plant>, id?: string) => {
    const rec = id
      ? await pb.collection("plants").update<Plant>(id, data)
      : await pb.collection("plants").create<Plant>(data);
    setPlants((prev) => (id ? prev.map((p) => (p.id === id ? rec : p)) : [rec, ...prev]));
    return rec;
  }, []);

  const remove = useCallback(async (id: string) => {
    try {
      await pb.collection("plants").delete(id, { requestKey: null });
    } catch (e) {
      // 404 means the plant is already gone (e.g. a repeated click) — treat as deleted.
      if (!(e instanceof ClientResponseError && e.status === 404)) throw e;
    }
    setPlants((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { plants, loading, error, save, remove };
}
