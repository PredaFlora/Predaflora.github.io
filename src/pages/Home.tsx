import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { Plant } from "../lib/types";
import { usePlants } from "../hooks/usePlants";
import { useSiteImagesCtx } from "../contexts/SiteImagesContext";
import Hero from "../components/home/Hero";
import Diptych from "../components/home/Diptych";
import HowItWorks from "../components/home/HowItWorks";
import FaqSection from "../components/home/FaqSection";
import InquireSection from "../components/home/InquireSection";
import MeetSection from "../components/home/MeetSection";
import SubscribeSection from "../components/home/SubscribeSection";
import Testimonials from "../components/home/Testimonials";
import BlockSlot from "../components/home/BlockSlot";

function HomeContent() {
  const { plants } = usePlants();
  const { ready, url } = useSiteImagesCtx();
  const location = useLocation();
  const buyPlant = (location.state as { buyPlant?: Plant } | null)?.buyPlant;

  // "Buy" buttons send visitors here: jump straight to the inquiry form
  useEffect(() => {
    if (!buyPlant) return;
    const t = setTimeout(() => document.getElementById("inquire")?.scrollIntoView({ behavior: "smooth" }), 120);
    return () => clearTimeout(t);
  }, [location.key, buyPlant]);

  return (
    <>
      <Hero image={ready ? url("hero") : null} />
      <BlockSlot slot="hero" />
      <Diptych plants={plants} />
      <BlockSlot slot="diptych" />
      <BlockSlot slot="arrivals" />
      <Testimonials />
      <BlockSlot slot="reviews" />
      <HowItWorks />
      <BlockSlot slot="how" />
      <FaqSection />
      <BlockSlot slot="faq" />
      <SubscribeSection />
      <BlockSlot slot="subscribe" />
      <InquireSection plant={buyPlant} />
      <BlockSlot slot="inquire" />
      <MeetSection />
      <BlockSlot slot="meet" />
    </>
  );
}

export default function Home() {
  return <HomeContent />;
}
