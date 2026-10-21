import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import type { Faq } from "../lib/faq";

export function useFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection("faqs")
      .getFullList<Faq>({ filter: "published = true", sort: "sort_order,created", requestKey: null })
      .then(setFaqs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { faqs, loading };
}
