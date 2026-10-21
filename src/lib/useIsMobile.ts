import { useSyncExternalStore } from "react";

const query = "(max-width: 639.98px)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** True below Tailwind's sm breakpoint. Layout edits are saved separately for mobile and desktop. */
export function useIsMobile() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
