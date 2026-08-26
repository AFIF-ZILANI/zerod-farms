export const SITE = {
  name: "ZeroD Farms",
  tagline: "Healthy food for everyone.",
  founder: "Kazi Bahalul Arfin",
  established: "2019",
  breed: "Pakistani Sonali Classic",
  feed: "Leader Feed",
  phone: "+8801341570410",
  phoneDisplay: "+880 1341-570410",
  whatsapp: "https://wa.me/8801341570410",
  email: "zerodfarms@gmail.com",
  address:
    "West Kazipara, Kundona, Fotepur Madrasa Road, Mahadebpur, Naogaon – 6530",
  // Broken into lines for the location plate in Contact.
  addressLines: [
    "West Kazipara, Kundona",
    "Fotepur Madrasa Road",
    "Mahadebpur, Naogaon – 6530",
    "Bangladesh",
  ],
  locality: "Mahadebpur, Naogaon",
  parentBrand: "ZeroD",
  parentUrl: "https://zerod.bd",
} as const;

export const NAV_LINKS = [
  { label: "Production", href: "#production" },
  { label: "Gallery", href: "#gallery" },
  { label: "Our Farm", href: "#farm" },
  { label: "Contact", href: "#contact" },
] as const;

export const PRODUCTION_CARDS = [
  {
    title: "Broiler Rearing",
    icon: "shed",
    description:
      "We raise Pakistani Sonali Classic birds from day-old chicks to market weight in controlled sheds.",
    spec: "Day-old → market weight",
  },
  {
    title: "Batch Tracking",
    icon: "chart",
    description:
      "Every batch is tracked from placement to harvest — feed conversion, mortality, and weight gain logged daily.",
    spec: "Logged daily, every shed",
  },
  {
    title: "Local Supply",
    icon: "truck",
    description:
      "We supply local buyers and wholesalers direct, across Naogaon and the surrounding districts.",
    spec: "Naogaon & nearby districts",
  },
] as const;

// Our Farm — split into a lead + mission so the section can breathe.
export const FARM_LEAD =
  "ZeroD Farms started on 31 December 2019, when Kazi Bahalul Arfin raised the first shed in Naogaon with 2,500 Pakistani Sonali Classic birds. Six years on, we run five sheds with capacity for 10,000 birds and produce around 5,000 birds a month for local buyers and wholesalers, on Leader Feed.";

export const FARM_MISSION =
  "We're building the farm to be more digital, more efficient, and lighter on the land — running it on tools we build ourselves.";

// The farm as a spec sheet — every value here is confirmed, none invented.
export const FARM_FACTS = [
  { label: "Founded", value: "31 Dec 2019" },
  { label: "Founder", value: "Kazi Bahalul Arfin" },
  { label: "Breed", value: "Pakistani Sonali Classic" },
  { label: "Feed", value: "Leader Feed" },
  { label: "Active sheds", value: "5" },
  { label: "Capacity", value: "10,000 birds" },
  { label: "Output", value: "~5,000 / month" },
  { label: "Supply area", value: "Naogaon & nearby" },
] as const;

// Tools the farm is building in-house (still in progress — present as such).
export const FARM_TOOLS = [
  {
    name: "Farm dashboard",
    description: "One place for every shed's numbers.",
  },
  {
    name: "Employee app",
    description: "Daily shed work, logged from the floor.",
  },
  {
    name: "PoultryScale",
    description: "Open weighing and production data.",
  },
] as const;

export const TIMELINE = [
  {
    year: "2019",
    event:
      "Founded by Kazi Bahalul Arfin — first shed, 2,500 Pakistani Sonali Classic birds.",
  },
  {
    year: "2026",
    event:
      "Five sheds, 10,000-bird capacity, ~5,000 birds produced every month.",
  },
] as const;

export const DATASET_COPY =
  "We're building a live, public poultry dataset through PoultryScale — real weighing and production data from farms across Bangladesh, made open for research and better decision-making. Coming soon.";

export const CONTACT_LINKS = [
  { label: "Call", href: `tel:${SITE.phone}`, icon: "phone", value: SITE.phoneDisplay },
  { label: "WhatsApp", href: SITE.whatsapp, icon: "whatsapp", value: SITE.phoneDisplay },
  { label: "Email", href: `mailto:${SITE.email}`, icon: "email", value: SITE.email },
] as const;

// Operational figures — surfaced as the farm's credibility at a glance.
export const STATS = [
  { value: "2019", label: "Established" },
  { value: "5", label: "Active sheds" },
  { value: "10,000", label: "Bird capacity" },
  { value: "~5,000", label: "Birds / month" },
] as const;
