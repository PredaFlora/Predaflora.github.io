import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import type { Plant } from "../lib/types";

export function usePlant(id: string | undefined) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    pb.collection("plants")
      .getFirstListItem<Plant>(pb.filter("id = {:id} && published = true", { id }), { requestKey: null })
      .then((p) => active && setPlant(p))
      .catch(() => active && setPlant(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  return { plant, loading };
}
