export const SITE = {
  name: "ZeroD Farms",
  tagline: "Healthy food for everyone.",
  founder: "Kazi Bahalul Arfin",
  established: "2019",
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
  parentUrl: "https://zerod.vercel.app",
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
      "Raising Sonali birds from day-old chicks to market weight in controlled shed environments.",
  },
  {
    title: "Batch Tracking",
    icon: "chart",
    description:
      "Every batch tracked from placement to harvest — feed conversion, mortality, weight gain logged daily.",
  },
  {
    title: "Local Supply",
    icon: "truck",
    description:
      "Direct supply to local buyers and wholesalers across Naogaon and surrounding districts.",
  },
] as const;

export const FARM_ABOUT =
  "ZeroD Farms started on 31 December 2019, when Kazi Bahalul Arfin set up the first shed in Naogaon with 2,500 Sonali birds. Six years on, we run five sheds with capacity for 10,000 birds and produce around 5,000 birds a month for local buyers and wholesalers, on Leader Feed. We're building our own tools — a farm dashboard, an employee app for daily shed work, and PoultryScale — to run a farm that's more digital, more efficient, and lighter on the environment. The goal hasn't moved since day one: healthy food, for everyone.";

export const TIMELINE = [
  {
    year: "2019",
    event: "Founded by Kazi Bahalul Arfin — first shed, 2,500 Sonali birds",
  },
  {
    year: "2026",
    event: "5 sheds, 10,000-bird capacity, ~5,000 birds per month",
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
