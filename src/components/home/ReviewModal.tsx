import { useEffect, useState, type FormEvent } from "react";
import pb from "../../lib/pocketbase";
import { StarPicker } from "../Stars";
import { Check, Close } from "../Icons";

const field = "mt-1 w-full border border-line bg-night px-3 py-2.5 text-bone placeholder:text-fog/60 focus:border-amber focus:outline-none";
const lbl = "font-mono text-[10px] uppercase tracking-[0.18em] text-fog";

export default function ReviewModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [needStars, setNeedStars] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rating) return setNeedStars(true);
    const fd = new FormData(e.currentTarget);
    setState("sending");
    try {
      await pb.collection("testimonials").create({
        customer_name: String(fd.get("name")).trim(),
        quote: String(fd.get("quote")).trim(),
        plant_bought: String(fd.get("plant")).trim(),
        rating,
        submitted: true,
      }, { requestKey: null });
      setState("sent");
    } catch (err) {
      console.error(err);
      setState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-night/80 p-0 backdrop-blur-sm animate-fade sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="review-title" className="max-h-full w-full max-w-lg overflow-y-auto border border-line bg-moss">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 id="review-title" className="font-display text-2xl">Leave a review</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl text-fog hover:text-bone"><Close /></button>
        </div>

        {state === "sent" ? (
          <div className="px-6 py-10 text-center" role="status">
            <Check className="mx-auto text-3xl text-leaf" />
            <p className="mt-4 font-display text-2xl">Thank you!</p>
            <p className="mt-2 text-sm text-fog">Your review has been sent. It will appear on the site once I have approved it.</p>
            <button onClick={onClose} className="mt-6 rounded-full bg-bone px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night hover:bg-amber">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5 px-6 py-6">
            <div>
              <span className={lbl}>Your rating *</span>
              <div className="mt-2"><StarPicker value={rating} onChange={(n) => { setRating(n); setNeedStars(false); }} /></div>
              {needStars && <p className="mt-2 text-sm text-fang" role="alert">Please choose a star rating.</p>}
            </div>
            <label className="block"><span className={lbl}>Your name *</span>
              <input name="name" required maxLength={100} autoComplete="name" className={field} placeholder="Sarah M." />
            </label>
            <label className="block"><span className={lbl}>Plant you bought (optional)</span>
              <input name="plant" maxLength={120} className={field} placeholder="Venus Flytrap 'B52'" />
            </label>
            <label className="block"><span className={lbl}>Your review *</span>
              <textarea name="quote" required rows={4} maxLength={600} className={`${field} resize-none`} placeholder="How is your plant doing? How was the experience?" />
            </label>
            {state === "error" && <p className="text-sm text-fang" role="alert">Something went wrong. Please try again.</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fog hover:text-bone">Cancel</button>
              <button disabled={state === "sending"} className="rounded-full bg-bone px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber disabled:opacity-60">
                {state === "sending" ? "Sending…" : "Submit review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
