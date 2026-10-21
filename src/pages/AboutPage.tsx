import { Link } from "react-router-dom";
import { useSiteImagesCtx } from "../contexts/SiteImagesContext";
import { InlineEdit } from "../components/InlineEdit";
import { InlinePhotoEdit } from "../components/InlinePhotoEdit";
import { ArrowRight } from "../components/Icons";

const PlantIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="text-fog/40">
    <path d="M12 22V12M12 12C12 12 7 10 7 5a5 5 0 0 1 10 0c0 5-5 7-5 7z"/>
  </svg>
);

export default function AboutPage() {
  const { url, ready } = useSiteImagesCtx();
  const photoSrc = ready ? url("about_photo") : "";

  return (
    <>
      {/* ── Header ── */}
      <section className="border-b border-line/60 bg-moss/20">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <InlineEdit contentKey="about_headline" label="Page label" as="p"
            className="animate-rise font-mono text-[11px] uppercase tracking-[0.24em] text-amber" />
          <InlineEdit contentKey="about_name" label="Your name" as="h1"
            className="mt-4 animate-rise font-display text-6xl font-light leading-[0.95] tracking-tight [animation-delay:60ms] sm:text-8xl" />
          <InlineEdit contentKey="about_tagline" label="Personal tagline" multiline as="p"
            className="mt-5 max-w-xl animate-rise font-display text-2xl font-light italic text-fog [animation-delay:120ms] sm:text-3xl" />
        </div>
      </section>

      {/* ── Body ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-16 lg:grid-cols-[2fr_1.2fr] lg:gap-24">

          {/* Text column */}
          <div className="order-2 lg:order-1">
            <InlineEdit contentKey="about_bio_1" label="Bio paragraph 1" multiline as="p"
              className="font-display text-xl leading-relaxed text-fog/90 sm:text-2xl sm:leading-relaxed" />
            <InlineEdit contentKey="about_bio_2" label="Bio paragraph 2" multiline as="p"
              className="mt-8 text-lg leading-relaxed text-fog" />
            <InlineEdit contentKey="about_bio_3" label="Bio paragraph 3" multiline as="p"
              className="mt-6 text-lg leading-relaxed text-fog" />

            {/* Stats */}
            <div className="mt-14 grid grid-cols-3 divide-x divide-line/60 border border-line/60">
              <div className="p-5">
                <InlineEdit contentKey="about_years" label="Years growing" as="p"
                  className="font-display text-4xl font-light text-amber" />
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Years growing</p>
              </div>
              <div className="p-5">
                <InlineEdit contentKey="about_location" label="Your location" as="p"
                  className="font-display text-2xl font-light text-amber" />
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Based in</p>
              </div>
              <div className="p-5">
                <InlineEdit contentKey="about_specialty" label="Your specialty" as="p"
                  className="font-display text-xl font-light leading-snug text-amber" />
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Focus</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-12 flex flex-wrap gap-4">
              <Link to="/browse-all" className="inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-night transition hover:bg-amber">
                Browse the collection <ArrowRight />
              </Link>
              <Link to="/#inquire" className="inline-flex items-center gap-3 rounded-full border border-bone/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition hover:border-bone">
                Get in touch
              </Link>
            </div>
          </div>

          {/* Portrait */}
          <div className="order-1 lg:order-2">
            <InlinePhotoEdit imageKey="about_photo" positionKey="about_img_position" className="w-full max-w-sm overflow-hidden lg:max-w-none">
              {photoSrc ? (
                <img src={photoSrc} alt="Portrait" className="aspect-[3/4] h-full w-full animate-fade object-cover" />
              ) : (
                <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 bg-moss/40 text-center">
                  <PlantIcon />
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog">Your portrait goes here</p>
                  <p className="max-w-[180px] text-sm text-fog/50">Go to Admin → Edit Mode and hover this area to upload a photo</p>
                </div>
              )}
            </InlinePhotoEdit>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-fog/60">
              PredaFlora ·{" "}
              <InlineEdit contentKey="about_location" label="Your location" />
            </p>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-10 sm:px-8">
          <div className="h-px flex-1 bg-line/60" />
          <span className="font-display text-2xl italic text-fog/40">PredaFlora</span>
          <div className="h-px flex-1 bg-line/60" />
        </div>
      </div>
    </>
  );
}
