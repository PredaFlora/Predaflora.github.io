import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import type { Testimonial } from "../lib/testimonial";

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection("testimonials")
      .getFullList<Testimonial>({ filter: "published = true", sort: "-created", requestKey: null })
      .then(setTestimonials)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { testimonials, loading };
}
