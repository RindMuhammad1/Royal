export type ServiceDetail = {
  slug: string;
  title: string;
  short: string;
  hero: string;
  intro: string;
  highlights: string[];
  pricing: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
};

export const services: ServiceDetail[] = [
  {
    slug: "airport-transfer",
    title: "UAE Airport Transfer With Chauffeur",
    short:
      "DXB & DWC arrivals and departures with live flight tracking, meet-and-greet, and 60 minutes of free wait time.",
    hero: "Airport Transfers In The UAE",
    intro:
      "Land in Dubai to a professional chauffeur waiting at the kerb, name-board ready. We track your flight in real time, adjust for delays, and get you to your hotel or home in a chilled, quiet cabin — no ride-hail queues, no surge pricing.",
    highlights: [
      "Meet & greet at DXB Terminals 1, 2, 3 and DWC (Al Maktoum)",
      "Live flight tracking — we wait for delays at no extra cost",
      "60 minutes of complimentary wait time on arrivals",
      "Chilled bottled water, phone chargers and Wi-Fi on request",
      "Child seats and booster seats available on request",
    ],
    pricing: [
      { label: "DXB → Downtown / Business Bay", value: "From AED 120" },
      { label: "DXB → Dubai Marina / JBR", value: "From AED 150" },
      { label: "DXB → Palm Jumeirah", value: "From AED 170" },
      { label: "DWC → Downtown Dubai", value: "From AED 220" },
      { label: "DXB → Abu Dhabi (any hotel)", value: "From AED 450" },
    ],
    faqs: [
      { q: "What if my flight is delayed?", a: "We track your flight from wheels-up. If it's delayed, we adjust automatically — no extra charge, no need to message us." },
      { q: "Where do we meet inside the airport?", a: "At DXB, your chauffeur waits at the arrivals hall with a name-board just after customs. Send your flight number on WhatsApp when you book." },
    ],
  },
  {
    slug: "school-run",
    title: "Daily School Pickup & Drop-Off In The UAE",
    short:
      "A trusted, familiar chauffeur for the morning drop-off and afternoon pickup — five days a week, same face, same car.",
    hero: "School Pickup & Drop-Off",
    intro:
      "Mornings are hard enough. Our daily school-run chauffeurs are hand-picked for patience, safe driving and being genuinely good with kids. Same driver every day, so your child knows exactly who's picking them up — and you get real peace of mind.",
    highlights: [
      "Same chauffeur every day — kids build familiarity",
      "Booster seats and child seats available",
      "Locked-in pickup and drop-off times",
      "Coverage across all major Dubai schools — GEMS, JESS, Repton, DAA, DESS, Kings, Nord Anglia and more",
      "Backup driver arranged on any sick day",
    ],
    pricing: [
      { label: "One school run (single trip)", value: "On request" },
      { label: "Weekly school-run package", value: "On request" },
      { label: "Monthly school-run package", value: "On request" },
    ],
    faqs: [
      { q: "Do you cover all Dubai schools?", a: "Yes — Downtown, Marina, Al Barsha, Arabian Ranches, Meadows, Mirdif, DIFC and every major school zone." },
      { q: "Can the same driver do afternoons too?", a: "Yes. Most families use the same chauffeur for both morning and afternoon — it's how kids build trust with the driver." },
    ],
  },
  {
    slug: "monthly-driver",
    title: "Monthly Personal Driver In The UAE",
    short:
      "Your own chauffeur, assigned exclusively to you and your car, month after month — from AED 2,500.",
    hero: "Monthly Personal Chauffeur",
    intro:
      "A dedicated personal driver is the calmest way to move around Dubai. One chauffeur is assigned to you — they learn your schedule, your school runs, your gym timings, your Friday brunch spot — and they drive your car (or ours). Zero HR, zero visa hassle, zero long-term commitment.",
    highlights: [
      "One dedicated chauffeur assigned to you",
      "Drives your own car — or book one of ours",
      "Six-day rota with backup driver on their day off",
      "No visa, insurance or HR headaches — we handle everything",
      "Contract by the month, cancel with 30 days' notice",
    ],
    pricing: [
      { label: "Monthly driver (your car)", value: "From AED 2,500" },
      { label: "Monthly driver + our sedan", value: "From AED 6,500" },
      { label: "Monthly driver + our SUV", value: "From AED 8,500" },
    ],
    faqs: [
      { q: "How many hours per day is included?", a: "Standard package is up to 10 hours a day, 6 days a week. Longer plans are available on request." },
      { q: "What if my driver is sick?", a: "We send a backup chauffeur the same day so your schedule never breaks." },
    ],
  },
  {
    slug: "dubai-to-abu-dhabi",
    title: "Dubai To Abu Dhabi Car With Driver",
    short:
      "Fixed-fare chauffeured runs between Dubai and Abu Dhabi — meetings, hotel transfers, or day trips to Yas Island.",
    hero: "Dubai ↔ Abu Dhabi Chauffeur",
    intro:
      "Skip the traffic stress and the taxi surcharge. Our chauffeurs run the Sheikh Zayed Road corridor dozens of times a week — book a fixed one-way transfer, a return, or a full day with wait time in Abu Dhabi.",
    highlights: [
      "Fixed one-way and return fares",
      "Meet-and-greet at any Abu Dhabi hotel, DIFC or ADGM building",
      "Wait time included on return trips (up to 3 hours)",
      "Ideal for Yas Island, Ferrari World, Louvre Abu Dhabi day trips",
      "Sedans, SUVs and 7-seater options available",
    ],
    pricing: [
      { label: "Dubai → Abu Dhabi (sedan, one-way)", value: "From AED 450" },
      { label: "Dubai → Abu Dhabi (SUV, one-way)", value: "From AED 650" },
      { label: "Return same-day (sedan, 3h wait)", value: "From AED 850" },
      { label: "Full day in Abu Dhabi (10h)", value: "From AED 1,200" },
    ],
    faqs: [
      { q: "Is Salik and fuel included?", a: "Yes — the fare is all-in. No hidden Salik, fuel or parking charges." },
      { q: "Can I stop on the way?", a: "Absolutely. Short stops (fuel, coffee, a quick meeting) are included. Longer stops just message us and we'll adjust." },
    ],
  },
];

export function getService(slug: string): ServiceDetail | undefined {
  return services.find((s) => s.slug === slug);
}
