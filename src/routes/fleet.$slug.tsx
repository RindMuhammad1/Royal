import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useRef } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Check,
  Phone,
  Users,
} from "lucide-react";
import { fleet, getCar, type FleetCar } from "@/lib/fleet";
import { SiteHeader, SiteFooter, FloatingWhatsApp } from "@/components/site-chrome";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

const WHATSAPP = "https://wa.me/971551988793";
const PHONE = "+971 55 198 8793";

export const Route = createFileRoute("/fleet/$slug")({
  loader: ({ params }) => {
    const car = getCar(params.slug);
    if (!car) throw notFound();
    return { car };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Vehicle not found — Royal Chauffeur UAE" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { car } = loaderData;
    const title = `${car.name} With Driver In The UAE — Royal Chauffeur`;
    const desc = `Hire the ${car.name} (${car.tier}) with a professional chauffeur in the UAE. ${car.short} Book on WhatsApp in seconds.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: FleetDetail,
});

function FleetDetail() {
  const { car } = Route.useLoaderData() as { car: FleetCar };
  const others = fleet.filter((c) => c.slug !== car.slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />



      {/* Hero of car */}
      <section className="relative overflow-hidden bg-[var(--ink)] text-white">
        <img
          src={car.img}
          alt={`${car.name} chauffeur car in the UAE`}
          width={1600}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/70 to-[var(--ink)]/20" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 lg:pt-20 lg:pb-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/50 bg-black/30 backdrop-blur px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-brand font-bold">

            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {car.tier}
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.98] tracking-tight max-w-3xl">
            {car.name} <br />
            <span className="brand-text italic">with driver in the UAE</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80 leading-relaxed">
            {car.hero}
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <span className="inline-flex items-center gap-2 text-white/85">
              <Users className="h-4 w-4 text-brand" /> {car.seats} Seats
            </span>
            <span className="inline-flex items-center gap-2 text-white/85">
              <Briefcase className="h-4 w-4 text-brand" /> {car.bags} Bags
            </span>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP}
              className="group inline-flex items-center gap-2 rounded-full bg-brand text-[var(--ink)] px-7 py-4 text-sm font-extrabold hover:bg-white transition"
             target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-4 w-4" /> Reserve This {car.name}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--ink)] text-brand transition-transform group-hover:rotate-45">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 backdrop-blur px-6 py-4 text-sm font-semibold text-white hover:border-brand hover:text-brand transition"
            >
              <Phone className="h-4 w-4" /> {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Highlights + Specs */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-brand font-bold">
              Onboard Experience
            </div>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl leading-tight">
              What's included in <span className="brand-text italic">every drive</span>
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {car.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-[var(--cream)] p-5"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-brand shrink-0">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-foreground/85 leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <div className="text-[11px] uppercase tracking-[0.3em] text-brand font-bold">
                Best For
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {car.bestFor.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center rounded-full border border-brand/30 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold text-brand"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-border bg-[var(--cream)] p-8">
            <div className="text-[11px] uppercase tracking-[0.3em] text-brand font-bold">
              Vehicle Specs
            </div>
            <dl className="mt-6 divide-y divide-border">
              {car.specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-3.5">
                  <dt className="text-sm text-muted-foreground">{s.label}</dt>
                  <dd className="text-sm font-bold text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>
            <a
              href={WHATSAPP}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] text-white px-6 py-3.5 text-sm font-bold hover:bg-brand transition"
             target="_blank" rel="noopener noreferrer">
              Get A Fixed Quote <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Reply in under 2 minutes · 24/7
            </p>
          </aside>
        </div>
      </section>

      {/* Other cars */}
      <FleetSlider cars={others} />


      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-brand/30 bg-[var(--ink)] text-white p-10 sm:p-14 text-center">
            <h2 className="font-display text-3xl sm:text-4xl leading-tight">
              Ready to ride in the <span className="brand-text italic">{car.name}?</span>
            </h2>
            <p className="mt-3 text-white/75 max-w-lg mx-auto">
              Message us with your pickup, destination and time — we'll confirm your driver in minutes.
            </p>
            <a
              href={WHATSAPP}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand text-[var(--ink)] px-7 py-4 text-sm font-extrabold hover:bg-white transition"
             target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-4 w-4" /> Book on WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
      <SiteFooter />
      <FloatingWhatsApp />
    </div>
  );
}

/* ------------------------------ FLEET SLIDER ------------------------------ */

function FleetSlider({ cars }: { cars: FleetCar[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.8, 280);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-[var(--cream)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h2 className="font-display text-3xl sm:text-4xl leading-tight">
            Other cars in <span className="brand-text italic">the fleet</span>
          </h2>
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
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {cars.map((c) => (
            <Link
              key={c.slug}
              to="/fleet/$slug"
              params={{ slug: c.slug }}
              className="group snap-start shrink-0 w-[78%] sm:w-[46%] lg:w-[31%] rounded-2xl bg-background border border-border overflow-hidden transition hover:border-brand/50 hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={c.img}
                  alt={`${c.name} chauffeur car in the UAE`}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="text-[10px] uppercase tracking-[0.24em] text-brand font-bold">
                  {c.tier}
                </div>
                <h3 className="mt-2 font-display text-xl">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.short}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand">
                  View details <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
