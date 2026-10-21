export type ContentKey =
  | "brand_first"
  | "brand_second"
  | "brand_suffix"
  | "brand_dash"
  | "hero_label"
  | "hero_line1"
  | "hero_line2"
  | "hero_subtext"
  | "hero_cta"
  | "hero_img_position"
  | "predatory_tagline"
  | "non_predatory_tagline"
  | "diptych_cta"
  | "browse_all_title"
  | "care_card_text"
  | "browse_all_tagline"
  | "predatory_img_position"
  | "non_predatory_img_position"
  | "new_arrivals_label"
  | "new_arrivals_heading"
  | "new_arrivals_link"
  | "how_title"
  | "how_title_em"
  | "how_step_1_title" | "how_step_1_text"
  | "how_step_2_title" | "how_step_2_text"
  | "how_step_3_title" | "how_step_3_text"
  | "testimonials_label"
  | "testimonials_heading"
  | "testimonials_heading_em"
  | "inquire_label"
  | "inquire_heading"
  | "inquire_heading_em"
  | "inquire_subtext"
  | "faq_label"
  | "faq_heading"
  | "faq_subtext"
  | "newsletter_label"
  | "newsletter_headline"
  | "newsletter_subtext"
  | "footer_tagline"
  | "meet_label"
  | "meet_heading"
  | "meet_text_1"
  | "meet_text_2"
  | "site_tagline"
  | "about_headline"
  | "about_name"
  | "about_tagline"
  | "about_bio_1"
  | "about_bio_2"
  | "about_bio_3"
  | "about_location"
  | "about_years"
  | "about_specialty"
  | "about_img_position";

export const CONTENT_DEFAULTS: Record<ContentKey, string> = {
  brand_first: "Preda",
  brand_second: "Flora",
  brand_suffix: "Kidpreneur",
  brand_dash: "–",
  hero_label: "A greenhouse after dark",
  hero_line1: "Some of them bite.",
  hero_line2: "Most of them don't.",
  hero_subtext: "Carnivorous plants and rare foliage, grown by hand and sold one specimen at a time.",
  hero_cta: "Choose your side",
  hero_img_position: "center center",
  predatory_tagline: "Flytraps, sundews and pitchers. Plants that hunt.",
  non_predatory_tagline: "Rare foliage, aroids and ferns. Perfectly harmless.",
  diptych_cta: "Browse",
  browse_all_title: "Browse all",
  care_card_text: "Learn exactly how to look after every plant.",
  browse_all_tagline: "Every plant in the collection, predatory and otherwise, in one place.",
  predatory_img_position: "center center",
  non_predatory_img_position: "center center",
  new_arrivals_label: "Recently potted",
  new_arrivals_heading: "New arrivals",
  new_arrivals_link: "See everything",
  how_title: "How buying",
  how_title_em: "works",
  how_step_1_title: "Pick a specimen",
  how_step_1_text: "Every plant listed is the exact one you'll receive. What you see is what you get.",
  how_step_2_title: "Send an inquiry",
  how_step_2_text: "Use the form on any plant page. I'll confirm availability and hold it for you.",
  how_step_3_title: "Collect or ship",
  how_step_3_text: "We arrange payment together, then you pick it up or I pack it carefully and ship it.",
  testimonials_label: "From the greenhouse to their homes",
  testimonials_heading: "What customers",
  testimonials_heading_em: "say",
  inquire_label: "Inquire",
  inquire_heading: "Looking for something",
  inquire_heading_em: "particular?",
  inquire_subtext: "Ask about a plant, request a species I don't have listed yet, or check shipping to your area. I usually reply within a day.",
  faq_label: "Got questions?",
  faq_heading: "Frequently asked.",
  faq_subtext: "Can't find your answer?",
  newsletter_label: "Newsletter",
  newsletter_headline: "Stay in the loop.",
  newsletter_subtext: "New plants, seasonal rarities and restocks — straight to your inbox. No spam, unsubscribe any time.",
  footer_tagline: "Carnivorous plants and rare foliage, grown by hand and sold one specimen at a time.",
  site_tagline: "Grown by hand · Shipped with care",
  meet_label: "Meet the grower",
  meet_heading: "A little about me",
  meet_text_1: "Tell visitors who you are and how your love of plants began. Click here in Edit Mode to write your own story.",
  meet_text_2: "Share what makes your plants special, what you are growing now, or anything else you would like customers to know.",
  about_headline: "About the grower",
  about_name: "Your Name",
  about_tagline: "Obsessed with plants that don't follow the rules.",
  about_bio_1: "I've been growing carnivorous plants and rare foliage for over a decade. What started as a single Venus flytrap on a windowsill turned into a full greenhouse and an obsession I wouldn't trade for anything.",
  about_bio_2: "Every plant I sell, I've grown and cared for myself. I don't resell — if it's on the site, it's been in my collection, sometimes for years. That means you know exactly what you're getting.",
  about_bio_3: "When I'm not in the greenhouse, I'm reading about botany, experimenting with new growing conditions, or searching for the next weird thing to propagate. This shop is how I fund that obsession — and share it.",
  about_location: "Your location",
  about_years: "10+",
  about_specialty: "Carnivorous plants & rare aroids",
  about_img_position: "center center",
};

export interface ContentRecord {
  id: string;
  key: ContentKey;
  value: string;
}
