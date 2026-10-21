import { InlineEdit } from "../InlineEdit";
import { InlinePhotoEdit } from "../InlinePhotoEdit";
import { useSiteContent } from "../../contexts/SiteContentContext";
import { ArrowRight } from "../Icons";

export default function Hero({ image }: { image: string | null }) {
  const { content } = useSiteContent();
  return (
    <section className="relative isolate flex min-h-[26rem] items-center overflow-hidden sm:min-h-[32rem]">
      <div className="absolute inset-0 -z-20">
        <InlinePhotoEdit imageKey="hero" positionKey="hero_img_position" className="h-full w-full">
          {image && (
            <img
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full animate-fade object-cover"
              style={{ objectPosition: content.hero_img_position }}
            />
          )}
        </InlinePhotoEdit>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-night/85 via-night/50 to-transparent md:via-night/30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-night to-transparent" />
      <div className="w-full max-w-xl px-5 py-12 sm:px-8 sm:py-16 md:ml-[max(0px,calc((100vw-80rem)/2))] [text-shadow:0_2px_18px_rgb(0_0_0/0.6)]">
        <InlineEdit contentKey="hero_label" label="Label above headline" as="p"
          className="animate-rise font-mono text-[11px] uppercase tracking-[0.24em] text-amber" />
        <h1 className="mt-4 animate-rise font-display text-5xl font-light leading-[0.95] tracking-tight [animation-delay:80ms] sm:text-7xl">
          <InlineEdit contentKey="hero_line1" label="Headline — line 1 (red italic)" as="em"
            className="font-normal text-fang" />
          <br />
          <InlineEdit contentKey="hero_line2" label="Headline — line 2 (green italic)" as="em"
            className="font-normal text-leaf" />
        </h1>
        <InlineEdit contentKey="hero_subtext" label="Subtitle paragraph" multiline as="p"
          className="mt-7 max-w-md animate-rise text-lg text-fog [animation-delay:160ms]" />
        <a href="#sides" className="mt-10 inline-flex animate-rise items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-bone [animation-delay:240ms] hover:text-amber">
          <InlineEdit contentKey="hero_cta" label="Call-to-action text" /> <ArrowRight className="text-base" />
        </a>
      </div>
    </section>
  );
}
