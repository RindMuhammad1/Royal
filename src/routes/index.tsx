import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  MapPin,
  Clock,
  Crown,
  Plane,
  GraduationCap,
  Car,
  Check,
  ArrowUpRight,
  Facebook,
  Instagram,
  BadgeCheck,
  ShieldCheck,
  Users,
  Briefcase,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import dubaiSkyline from "@/assets/dubai-skyline.jpg";
import dubaiSzr from "@/assets/dubai-szr.jpg";
import dubaiMarina from "@/assets/dubai-marina.jpg";
import dubaiBurj from "@/assets/dubai-burj.jpg";
import dubaiChauffeur from "@/assets/dubai-chauffeur.jpg";
import { fleet } from "@/lib/fleet";
import logoAsset from "@/assets/royal-chauffeur-logo.jpg";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { FloatingWhatsApp } from "@/components/site-chrome";

const HOME_TITLE = "Royal Chauffeur UAE | Car With Driver, Monthly Chauffeur & Airport Transfers";
const HOME_DESC =
  "Hire a professional chauffeur in the UAE — car with driver, monthly personal driver from AED 2,500, half-day under AED 450, full-day under AED 750. Airport transfers, school pickup and VIP transport, 24/7.";

const HOME_FAQS = [
  {
    q: "How quickly can you send a chauffeur?",
    a: "For same-day rides we usually confirm within 15–20 minutes. For airport, school or monthly bookings we recommend booking at least a day ahead.",
  },
  {
    q: "Do I use my car or one of yours?",
    a: "Both work. Book a car with driver from our fleet, or hire one of our chauffeurs to drive your own vehicle for the day or the month.",
  },
  {
    q: "Which parts of the UAE do you cover?",
    a: "All of Dubai and the wider UAE — Downtown, Marina, JBR, Business Bay, Palm, DIFC, the airports and beyond. We also handle inter-emirate trips to Abu Dhabi, Sharjah and RAK.",
  },
  {
    q: "How does payment work?",
    a: "You pay after the ride. Cash to the driver, card via a secure link, or bank transfer — whatever's easiest for you.",
  },
  {
    q: "Are your chauffeurs comfortable with kids?",
    a: "Yes. Our school-run drivers are specifically chosen for their patience, safe driving and comfort around children. Booster seats available on request.",
  },
];

const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Royal Chauffeur UAE",
  description: HOME_DESC,
  areaServed: "Dubai, United Arab Emirates",
  telephone: "+971551988793",
  priceRange: "AED",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESC },
      {
        name: "keywords",
        content:
          "chauffeur service UAE, car with driver UAE, hire a driver Dubai, monthly driver UAE, personal driver Dubai, airport transfer UAE, school pickup driver Dubai, private chauffeur UAE",
      },
      { property: "og:title", content: "Royal Chauffeur UAE — Luxury Car With Driver Service" },
      {
        property: "og:description",
        content:
          "Trusted UAE chauffeurs by the hour, day or month. Airport pickups, school runs, and executive transfers. Book on WhatsApp in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_JSONLD) },
      { type: "application/ld+json", children: JSON.stringify(FAQ_JSONLD) },
    ],
  }),
  component: Landing,
});

const WHATSAPP = "https://wa.me/971551988793";
const EMAIL = "royalchauffeuruae@gmail.com";
const FACEBOOK = "https://www.facebook.com/share/1MdBvEg6Sh/";
const INSTAGRAM = "https://www.instagram.com/royalchauffeuruae";

/* ------------------------------ DATA ------------------------------ */

const heroSlides = [
  {
    eyebrow: "Chauffeur Service In The UAE",
    title: ["Your Personal", "Chauffeur In", "The UAE"],
    accentIndex: 2,
    image: dubaiSzr,
    alt: "Sheikh Zayed Road at night — Dubai chauffeur service",
  },
  {
    eyebrow: "Car With Driver — Hourly Or Daily",
    title: ["Hire A Driver", "For The Day", "In The UAE"],
    accentIndex: 2,
    image: dubaiSkyline,
    alt: "Dubai skyline with Burj Khalifa — car with driver Dubai",
  },
  {
    eyebrow: "Monthly Personal Driver",
    title: ["A Trusted Driver", "By The", "Month"],
    accentIndex: 2,
    image: dubaiMarina,
    alt: "Dubai Marina skyline — monthly chauffeur Dubai",
  },
  {
    eyebrow: "Airport Transfers · DXB & DWC",
    title: ["Meet-&-Greet", "Airport", "Transfers"],
    accentIndex: 1,
    image: dubaiBurj,
    alt: "Downtown Dubai with Burj Khalifa — luxury airport transfers",
  },
  {
    eyebrow: "School Pickup & Drop-Off",
    title: ["A Familiar Driver", "For The", "School Run"],
    accentIndex: 2,
    image: dubaiChauffeur,
    alt: "Professional chauffeur opening a luxury car door in Dubai",
  },
];

const heroBadges = [
  { icon: BadgeCheck, label: "RTA-Licensed Chauffeurs" },
  { icon: Zap, label: "Confirmed In 2 Minutes" },
  { icon: Sparkles, label: "Flat Fares, No Surge" },
];

const trustStats = [
  { value: "12 yrs", label: "On UAE Roads" },
  { value: "50+", label: "Trusted Chauffeurs" },
  { value: "24/7", label: "Available" },
];

const steps = [
  {
    n: "01",
    title: "Send Us A Message",
    desc: "Ping us on WhatsApp with your pickup point, destination and time. That's the whole form.",
    tags: ["WhatsApp First", "No App Needed"],
  },
  {
    n: "02",
    title: "We Match Your Driver",
    desc: "Within minutes we assign a chauffeur who knows your route, sends his ETA and shares the car details.",
    tags: ["Live ETA", "Named Chauffeur"],
  },
  {
    n: "03",
    title: "Ride, Then Settle Up",
    desc: "Sit back and enjoy the drive. Pay after the ride by cash, card or a quick bank transfer — your choice.",
    tags: ["Pay After", "Cash / Card / Bank"],
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Chauffeurs You Can Trust",
    desc: "Every driver is UAE-licensed, background-checked and trained to handle families, VIPs and late-night runs with total discretion.",
  },
  {
    icon: BadgeCheck,
    title: "One Price, Told Upfront",
    desc: "We quote a flat rate before you book. No meters, no surge, no surprise charges when you step out of the car.",
  },
  {
    icon: Clock,
    title: "Always On UAE Time",
    desc: "Airport landings, school bells, dinner reservations — our chauffeurs plan buffer time so you're never the one running late.",
  },
];

const packages: Array<{
  name: string;
  tagline: string;
  rows: Array<{ label: string; price: string; strong?: boolean }>;
  includes: string[];
  highlight?: boolean;
}> = [
  {
    name: "Daily Chauffeur — Half & Full Day",
    tagline: "Hire a driver for a morning of errands or a full day out.",
    rows: [
      { label: "Half-Day (up to 5 hours)", price: "Under 450 AED" },
      { label: "Full-Day (up to 10 hours)", price: "Under 750 AED", strong: true },
    ],
    includes: [
      "Fuel and Salik included on standard routes",
      "Same chauffeur for your entire booking",
      "Free 15-minute wait time at each stop",
    ],
    highlight: true,
  },
  {
    name: "Monthly Personal Chauffeur",
    tagline: "A dedicated driver assigned to you every day.",
    rows: [{ label: "From", price: "2,500 AED / month", strong: true }],
    includes: [
      "10–12 hours a day, six days a week",
      "The same familiar face every morning",
      "Priority slots for evenings and weekends",
      "Perfect for executives, families and residents",
    ],
  },
  {
    name: "School Run — Kids' Route",
    tagline: "A calm, reliable driver your child sees every school day.",
    rows: [
      { label: "One trip / day (Mon–Fri)", price: "On Request", strong: true },
      { label: "Two trips / day (Mon–Fri)", price: "On Request" },
    ],
    includes: [
      "Chauffeurs trained around kids",
      "Locked-in pickup times and route",
      "Live check-in message at drop-off",
    ],
  },
];

const services = [
  {
    icon: Plane,
    slug: "airport-transfer",
    title: "DXB & DWC Airport Transfers",
    desc: "Meet-and-greet arrivals with live flight tracking — we're at the kerb before your bags reach the belt.",
  },
  {
    icon: GraduationCap,
    slug: "school-run",
    title: "Daily School Run",
    desc: "A friendly, familiar chauffeur for the morning drop-off and afternoon pickup, five days a week.",
  },
  {
    icon: Car,
    slug: null,
    title: "Car With Driver — Hourly",
    desc: "Book a chauffeur-driven car by the hour for meetings, shopping days or a night out in Downtown.",
  },
  {
    icon: Briefcase,
    slug: null,
    title: "Corporate & VIP Transfers",
    desc: "Discreet, well-dressed chauffeurs for executives, delegations and business roadshows around the UAE.",
  },
  {
    icon: CalendarDays,
    slug: "monthly-driver",
    title: "Long-Term Monthly Driver",
    desc: "A single driver assigned to you and your car, month after month — a personal chauffeur without the HR.",
  },
  {
    icon: Users,
    slug: "dubai-to-abu-dhabi",
    title: "Dubai ↔ Abu Dhabi",
    desc: "Fixed-fare chauffeured runs between Dubai and Abu Dhabi — meetings, hotel transfers or day trips to Yas Island.",
  },
];

const areas = [
  "Downtown Dubai",
  "Dubai Marina",
  "JBR",
  "Business Bay",
  "DIFC",
  "Palm Jumeirah",
  "Emirates Hills",
  "Arabian Ranches",
  "The Meadows",
  "Al Barsha",
  "Jumeirah",
  "Mirdif",
  "Dubai Hills",
  "JVC",
  "Silicon Oasis",
  "Dubai Creek Harbour",
  "DXB Airport",
  "DWC Airport",
];

const faqs = HOME_FAQS;

/* ------------------------------ PAGE ------------------------------ */

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pb-20 md:pb-0">
      <TopBar />
      <Header />
      <Hero />
      <Marquee />
      <Fleet />
      <About />
      <HowItWorks />
      <Values />
      <Packages />
      <Services />
      <AreaCoverage />
      <FAQ />
      <CTA />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}

/* ------------------------------ HEADER ------------------------------ */

function TopBar() {
  return (
    <div className="hidden md:block bg-[var(--ink)] text-white/85">
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between py-2.5 text-xs">
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-2 hover:text-brand transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-brand" /> {EMAIL}
          </a>
        </div>
        <div className="flex items-center gap-5">
          <span>Available 24/7 across the UAE</span>
          <div className="flex items-center gap-3 text-white/70">
            <a
              href={FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-brand transition-colors"
            >
              <Facebook className="h-3.5 w-3.5" />
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-brand transition-colors"
            >
              <Instagram className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <a href="#" className="flex items-center gap-3 group">
      <img
        src={logoAsset}
        alt="Royal Chauffeur UAE logo"
        className="h-11 w-11 rounded-full object-cover ring-1 ring-brand/40"
      />
      <div className="leading-tight">
        <div className="font-display text-lg tracking-tight text-foreground">
          ROYAL <span className="text-brand">CHAUFFEUR</span>
        </div>
        <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase font-semibold">
          UAE
        </div>
      </div>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const nav = [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Fleet", href: "#fleet" },
    { label: "Services", href: "#services" },
    { label: "Packages", href: "#packages" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex items-center gap-9 text-sm font-medium">
            {nav.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-foreground/80 hover:text-brand transition-colors"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={WHATSAPP}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-5 py-3 text-sm font-bold hover:bg-brand transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Book on WhatsApp</span>
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:border-brand hover:text-brand transition"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-[var(--ink)]/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-[var(--ink)] text-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={logoAsset}
                  alt="Royal Chauffeur UAE logo"
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-brand/40"
                />
                <div className="font-display text-base">
                  ROYAL <span className="text-brand">CHAUFFEUR</span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 hover:text-brand hover:border-brand transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {nav.map((n, i) => (
                <a
                  key={n.label}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-4 py-4 border-b border-white/10 last:border-0"
                >
                  <span className="text-[11px] font-mono text-brand/70 w-6">0{i + 1}</span>
                  <span className="font-display text-2xl text-white group-hover:text-brand transition-colors">
                    {n.label}
                  </span>
                </a>
              ))}
            </div>

            <div className="px-6 pb-8 pt-4 border-t border-white/10 space-y-3">
              <a
                href={WHATSAPP}
                className="flex items-center justify-center gap-2 rounded-full bg-brand text-[var(--ink)] px-5 py-3.5 text-sm font-bold"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-4 w-4" /> Book on WhatsApp
              </a>
              <div className="flex items-center justify-center gap-5 pt-2 text-white/60">
                <a
                  href={FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-brand transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-brand transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

/* ------------------------------ ABOUT ------------------------------ */

function About() {
  const points = [
    "A UAE-based team, on the road here since 2013",
    "UAE-licensed chauffeurs, background-checked and uniformed",
    "Owner-managed fleet — the same cars you see, every time",
    "Flat quotes agreed on WhatsApp before your ride starts",
  ];
  return (
    <section id="about" className="py-24 sm:py-28 bg-[var(--cream)]">
      <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <img
            src={dubaiChauffeur}
            alt="Royal Chauffeur UAE driver beside a luxury car"
            loading="lazy"
            width={1200}
            height={900}
            className="rounded-3xl w-full object-cover aspect-[4/3]"
          />
          <div className="absolute -bottom-6 left-6 right-6 sm:right-auto rounded-2xl bg-[var(--ink)] text-white px-6 py-5 flex items-center gap-6">
            {trustStats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-xl text-brand">{s.value}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/70">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 lg:pt-0">
          <SectionEyebrow>About Us</SectionEyebrow>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-foreground">
            The UAE's private <br /> <span className="brand-text italic">chauffeur company</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Royal Chauffeur UAE started with one simple idea: getting around this city should feel
            calm. We drive residents to work, children to school, executives to meetings and
            families to the airport — with the same chauffeur, the same car and a price agreed in
            advance.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            No apps, no meters, no queue. Just a message on WhatsApp and a driver who already knows
            your route, your timings and how you like your journey.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-foreground/85">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <a
            href={WHATSAPP}
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-3.5 text-sm font-bold hover:bg-brand transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp Booking
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ HERO ------------------------------ */

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);
  const slide = heroSlides[i];

  return (
    <section className="relative flex min-h-[92vh] w-full flex-col overflow-hidden bg-[var(--ink)] text-white">
      {/* Full-bleed rotating background */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((s, idx) => (
          <img
            key={idx}
            src={s.image}
            alt={s.alt}
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1600ms] ease-out will-change-[opacity,transform]"
            style={{
              opacity: idx === i ? 0.55 : 0,
              transform: idx === i ? "scale(1.04)" : "scale(1.12)",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-grow items-center px-6 pt-24 pb-20 lg:pt-32 lg:pb-24">
        <div className="grid w-full gap-14 lg:grid-cols-2 lg:items-center">
          {/* Left column – editorial copy */}
          <div className="max-w-2xl">
            <div className="mb-8 flex flex-wrap gap-3">
              <span
                key={`eye-${i}`}
                className="flex items-center gap-2 rounded-full border border-brand/30 bg-[var(--espresso)]/40 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand backdrop-blur-md"
                style={{ animation: "hero-fade 0.6s ease-out both" }}
              >
                <span className="h-1 w-1 rounded-full bg-brand shadow-[0_0_8px_var(--brand)]" />
                {slide.eyebrow}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                RTA Licensed
              </span>
            </div>

            <div className="space-y-6">
              <h1
                key={`title-${i}`}
                className="font-display text-[44px] leading-[1.05] tracking-tight sm:text-6xl lg:text-[80px]"
                style={{ animation: "hero-fade 0.8s ease-out both" }}
              >
                {slide.title.map((line, idx) => (
                  <span key={idx} className="block">
                    {idx === slide.accentIndex ? (
                      <span className="italic text-brand">{line}</span>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-white/70">
                Discreet, RTA-licensed chauffeurs for hourly errands, full-day hire, monthly
                personal drivers, airport transfers and the daily school run.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-brand px-8 py-4 font-semibold text-[var(--ink)] transition-all hover:bg-white"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp Booking
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </a>
            </div>

            {/* Slide dots */}
            <div className="mt-10 flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Show slide ${idx + 1}`}
                  className={`h-1 rounded-full transition-all ${
                    idx === i ? "w-10 bg-brand" : "w-3 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right column – glass rate card */}
          <div className="flex justify-center lg:justify-end">
            <div className="group relative w-full max-w-sm">
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-b from-brand/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--ink)]/40 p-8 backdrop-blur-2xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)]">
                <div className="mb-10 space-y-1">
                  <h2 className="font-display text-2xl text-white">Exclusive Rates</h2>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Fixed, transparent pricing
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      label: "Full Day Service",
                      note: "10 Hours Coverage",
                      price: "Under 750",
                      unit: "AED",
                    },
                    {
                      label: "Half Day Service",
                      note: "5 Hours Coverage",
                      price: "Under 450",
                      unit: "AED",
                    },
                    {
                      label: "Monthly Retainer",
                      note: "Commuter Package",
                      price: "From 2,500",
                      unit: "AED",
                    },
                  ].map((r) => (
                    <div
                      key={r.label}
                      className="flex items-end justify-between border-b border-white/5 pb-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm text-white/70">{r.label}</p>
                        <p className="text-[10px] uppercase tracking-tight text-white/30">
                          {r.note}
                        </p>
                      </div>
                      <p className="text-lg font-medium text-brand">
                        {r.price} <span className="text-[10px] text-white/40">{r.unit}</span>
                      </p>
                    </div>
                  ))}
                  <div className="flex items-end justify-between pb-2">
                    <p className="text-sm text-white/70">School Runs</p>
                    <p className="text-xs italic text-white/40">On Request</p>
                  </div>
                </div>

                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-brand/30 bg-gradient-to-r from-[var(--espresso)] to-[var(--ink)] py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:border-brand"
                >
                  Get Instant Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats strip */}
      <div className="relative z-10 w-full border-t border-white/5 bg-[var(--ink)]/80 py-8 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-8 md:flex-nowrap">
            {trustStats.map((s, idx) => (
              <div key={s.label} className="flex items-center gap-8">
                {idx > 0 && <div className="hidden h-8 w-px bg-white/10 md:block" />}
                <div className="flex flex-col gap-1">
                  <span className="font-display text-3xl tracking-tight text-white">{s.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
            <div className="hidden h-8 w-px bg-white/10 md:block" />
            <div className="flex flex-col gap-1">
              {heroBadges.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2 text-[11px] text-white/60">
                  <Icon className="h-3 w-3 text-brand" /> {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ MARQUEE ------------------------------ */

function Marquee() {
  const items = [
    "Airport Transfers",
    "Monthly Chauffeur",
    "School Pickup & Drop-off",
    "Corporate & VIP",
    "Full Day Chauffeur",
    "Half Day Chauffeur",
    "Family SUV",
    "Weekend Getaways",
  ];
  const loop = [...items, ...items];
  return (
    <div className="border-y border-border bg-[var(--cream)] overflow-hidden">
      <div
        className="flex gap-10 whitespace-nowrap py-4 text-sm font-semibold text-foreground/80"
        style={{ animation: "ticker 40s linear infinite", width: "max-content" }}
      >
        {loop.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-10">
            <span className="tracking-[0.24em] uppercase text-xs">{t}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ FLEET ------------------------------ */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-4">
      <span className="gold-rule w-10 shrink-0" />
      <span className="text-[10px] uppercase tracking-[0.42em] text-brand font-bold">
        {children}
      </span>
    </div>
  );
}

function Fleet() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.8, 280);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section id="fleet" className="py-24 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <SectionEyebrow>Our Fleet</SectionEyebrow>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-foreground">
              Choose your <span className="brand-text italic">ride</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl">
              From efficient daily sedans to full-size family SUVs — every car in our fleet is
              regularly serviced and driven by a professional chauffeur.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous cars"
              onClick={() => scrollBy(-1)}
              className="h-11 w-11 inline-flex items-center justify-center rounded-full border border-foreground/15 bg-background hover:border-brand hover:text-brand transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next cars"
              onClick={() => scrollBy(1)}
              className="h-11 w-11 inline-flex items-center justify-center rounded-full border border-foreground/15 bg-background hover:border-brand hover:text-brand transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <a
              href={WHATSAPP}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-3 text-sm font-semibold text-foreground hover:border-brand hover:text-brand transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reserve a Vehicle <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-14 flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {fleet.map((car) => (
            <article
              key={car.slug}
              className="group relative snap-start shrink-0 w-[82%] sm:w-[46%] lg:w-[31.5%] bg-background border border-brand/20 overflow-hidden shadow-[0_20px_50px_rgba(35,22,2,0.05)] transition duration-300 hover:border-brand/50 hover:shadow-[0_28px_60px_rgba(35,22,2,0.12)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--cream)]">
                <img
                  src={car.img}
                  alt={`${car.name} chauffeur car in the UAE`}
                  loading="lazy"
                  width={1200}
                  height={750}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-[var(--espresso)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                    {car.tier}
                  </span>
                </div>
              </div>

              <div className="p-7 sm:p-8">
                <h3 className="font-display text-2xl text-foreground">{car.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{car.short}</p>

                <div className="mt-6 mb-8 flex items-center gap-6 border-y border-brand/10 py-4">
                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground">
                    <Users className="h-4 w-4 text-brand" strokeWidth={1.5} /> {car.seats} Seats
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground">
                    <Briefcase className="h-4 w-4 text-brand" strokeWidth={1.5} /> {car.bags} Bags
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Link
                    to="/fleet/$slug"
                    params={{ slug: car.slug }}
                    className="shrink-0 border-b border-transparent pb-1 text-xs font-semibold uppercase tracking-[0.15em] text-foreground transition-colors hover:border-brand hover:text-brand"
                  >
                    View Details
                  </Link>
                  <a
                    href={WHATSAPP}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-brand px-5 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-brand/20 transition-all duration-300 hover:bg-[var(--espresso)]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Book
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ HOW IT WORKS ------------------------------ */

function HowItWorks() {
  return (
    <section className="py-24 sm:py-28 bg-[var(--cream)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex justify-center">
            <SectionEyebrow>Simple Process</SectionEyebrow>
          </div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-foreground">
            How it <span className="brand-text italic">works</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three steps from message to arrival — no app downloads, no forms, no fine print.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <article
              key={s.n}
              className="relative rounded-2xl border border-border bg-background p-8 hover:border-brand/50 transition"
            >
              <div className="absolute -top-5 left-8 font-display text-4xl font-black text-brand">
                {s.n}
              </div>
              <h3 className="mt-4 font-display text-2xl text-foreground">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-[11px] font-semibold text-brand"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ VALUES ------------------------------ */

function Values() {
  return (
    <section className="py-24 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <SectionEyebrow>Why Royal Chauffeur</SectionEyebrow>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-foreground">
            Built around <br /> <span className="brand-text italic">your day</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="rounded-2xl bg-[var(--cream)] border border-border p-8 hover:border-brand/50 transition"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ink)] text-brand">
                <Icon className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <h3 className="mt-6 font-display text-xl text-foreground">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ PACKAGES ------------------------------ */

function Packages() {
  return (
    <section id="packages" className="py-24 sm:py-28 bg-[var(--cream)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <SectionEyebrow>Packages & Pricing</SectionEyebrow>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-foreground">
              Transparent <span className="brand-text italic">pricing</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Flat rates for every plan — hourly, daily and monthly. Nothing hidden.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {packages.map((p) => (
            <article
              key={p.name}
              className={`relative flex flex-col rounded-3xl p-8 border transition ${
                p.highlight
                  ? "bg-[var(--ink)] border-brand shadow-[0_30px_60px_-30px_rgba(184,137,46,0.55)] text-white"
                  : "bg-background border-border hover:border-brand/40"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  Most Popular
                </div>
              )}
              <h3
                className={`font-display text-xl leading-tight ${p.highlight ? "text-white" : "text-foreground"}`}
              >
                {p.name}
              </h3>
              <p
                className={`mt-2 text-sm ${p.highlight ? "text-white/70" : "text-muted-foreground"}`}
              >
                {p.tagline}
              </p>

              <div className="mt-6 space-y-3">
                {p.rows.map((r) => (
                  <div
                    key={r.label}
                    className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 border ${
                      r.strong
                        ? "bg-brand/10 border-brand/40"
                        : p.highlight
                          ? "bg-white/5 border-white/10"
                          : "bg-[var(--cream)] border-border"
                    }`}
                  >
                    <span
                      className={`text-xs ${p.highlight ? "text-white/80" : "text-foreground/80"}`}
                    >
                      {r.label}
                    </span>
                    <span
                      className={`text-sm font-extrabold ${r.strong ? "text-brand" : p.highlight ? "text-white" : "text-foreground"}`}
                    >
                      {r.price}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className={`mt-6 text-[11px] uppercase tracking-widest font-semibold ${p.highlight ? "text-white/50" : "text-muted-foreground"}`}
              >
                Included
              </div>
              <ul className="mt-3 space-y-2 flex-1">
                {p.includes.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-3 text-sm ${p.highlight ? "text-white/85" : "text-foreground/85"}`}
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand/15 text-brand shrink-0">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={WHATSAPP}
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition ${
                  p.highlight
                    ? "bg-brand text-white hover:bg-brand-soft"
                    : "bg-[var(--ink)] text-white hover:bg-brand"
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Now <ArrowUpRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ SERVICES ------------------------------ */

function Services() {
  return (
    <section id="services" className="py-24 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <SectionEyebrow>Our Services</SectionEyebrow>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-foreground">
              Chauffeured travel, <br />{" "}
              <span className="brand-text italic">on your schedule.</span>
            </h2>
          </div>
          <a
            href={WHATSAPP}
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-5 py-3 text-sm font-bold hover:bg-brand transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            More Services <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc, slug }) => (
            <article
              key={title}
              className="group rounded-2xl bg-[var(--cream)] border border-border p-7 transition hover:border-brand/50 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 font-display text-xl text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              <div className="mt-5 flex items-center gap-4">
                {slug ? (
                  <Link
                    to="/services/$slug"
                    params={{ slug }}
                    className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:gap-3 transition-all"
                  >
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ) : null}
                <a
                  href={WHATSAPP}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-brand transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Now
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FAQ ------------------------------ */

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 sm:py-28 bg-[var(--cream)]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <div className="flex justify-center">
            <SectionEyebrow>Need Help?</SectionEyebrow>
          </div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-foreground">
            Frequently asked <span className="brand-text italic">questions</span>
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`rounded-2xl border transition bg-background ${
                  isOpen ? "border-brand/50 shadow-sm" : "border-border hover:border-foreground/20"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-foreground">{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-brand shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ CTA ------------------------------ */

function CTA() {
  return (
    <section id="contact" className="py-24 sm:py-28 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-[var(--ink)] text-white p-10 sm:p-14">
          <div
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
            aria-hidden
          />
          <div className="relative grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-brand" />
                <span className="text-[11px] uppercase tracking-[0.3em] text-brand font-bold">
                  Ready When You Are
                </span>
              </div>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight">
                Book your <span className="brand-text italic">chauffeur</span> in 30 seconds.
              </h2>
              <p className="mt-4 text-white/75 max-w-lg">
                Message us on WhatsApp with your pickup, destination and time — we'll confirm your
                driver and vehicle within minutes.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={WHATSAPP}
                  className="inline-flex items-center gap-2 rounded-full bg-brand text-white px-7 py-4 text-sm font-bold hover:bg-brand-soft transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
                </a>
              </div>
            </div>
            <div className="grid gap-3">
              <ContactRow icon={Mail} title="Email" value={EMAIL} />
              <ContactRow icon={MapPin} title="Based in" value="Dubai, UAE" />
              <ContactRow icon={Clock} title="Hours" value="Available 24/7" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:border-brand/40 transition">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-white/60 font-semibold">
          {title}
        </div>
        <div className="text-sm font-bold text-white mt-0.5">{value}</div>
      </div>
    </div>
  );
}

/* ------------------------------ FOOTER ------------------------------ */

function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-white/80 border-t border-black/10">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <a href="#" className="flex items-center gap-3 group">
            <img
              src={logoAsset}
              alt="Royal Chauffeur UAE logo"
              className="h-11 w-11 rounded-full object-cover ring-1 ring-brand/40"
            />
            <div className="leading-tight">
              <div className="font-display text-lg tracking-tight text-white">
                ROYAL <span className="text-brand">CHAUFFEUR</span>
              </div>
              <div className="text-[10px] tracking-[0.3em] text-white/60 uppercase font-semibold">
                UAE
              </div>
            </div>
          </a>
          <p className="mt-5 max-w-sm text-sm text-white/65 leading-relaxed">
            Royal Chauffeur UAE — professional car with driver services across the UAE. Full-day,
            half-day and monthly plans, plus airport transfers and school pickup.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 hover:border-brand hover:text-brand transition"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 hover:border-brand hover:text-brand transition"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-brand font-bold">
            Services
          </div>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>Car with Driver</li>
            <li>School Pickup & Drop-off</li>
            <li>Executive Airport Transport</li>
            <li>Full Day / Half Day</li>
            <li>Monthly Driver</li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-brand font-bold">
            Contact
          </div>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>{EMAIL}</li>
            <li>Dubai, UAE</li>
            <li>Available 24/7</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <div>© {new Date().getFullYear()} Royal Chauffeur UAE. All rights reserved.</div>
          <div className="font-semibold text-brand">Luxury in every journey.</div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------ AREA COVERAGE ------------------------------ */

function AreaCoverage() {
  return (
    <section className="py-24 sm:py-28 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <SectionEyebrow>Areas We Cover</SectionEyebrow>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight">
            Every corner of <span className="brand-text italic">the UAE.</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Pickups and drop-offs across all major UAE neighbourhoods and both airports — plus
            inter-emirate trips to Abu Dhabi, Sharjah, Al Ain and Ras Al Khaimah.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {areas.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-[var(--cream)] px-4 py-2 text-sm font-semibold text-foreground"
            >
              <MapPin className="h-3.5 w-3.5 text-brand" /> {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FLOATING WHATSAPP ------------------------------ */

function StickyMobileCTA() {
  return <FloatingWhatsApp />;
}
