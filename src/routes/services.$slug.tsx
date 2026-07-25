import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  MessageCircle,
  Phone,
} from "lucide-react";
import { services, getService, type ServiceDetail } from "@/lib/services";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

const WHATSAPP = "https://wa.me/971551988793";
const PHONE = "+971 55 198 8793";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Service not found — Royal Chauffeur Dubai" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { service } = loaderData;
    const title = `${service.title} — Royal Chauffeur Dubai`;
    const desc = service.short;
    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(faqJsonLd),
        },
      ],
    };
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { service } = Route.useLoaderData() as { service: ServiceDetail };
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />


      <section className="bg-[var(--ink)] text-white">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 lg:pt-20 lg:pb-24">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-brand text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand/50 bg-black/30 backdrop-blur px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-brand font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {service.hero}
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.98] tracking-tight max-w-4xl">
            {service.title.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="brand-text italic">
              {service.title.split(" ").slice(-2).join(" ")}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80 leading-relaxed">
            {service.intro}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP}
              className="group inline-flex items-center gap-2 rounded-full bg-brand text-[var(--ink)] px-7 py-4 text-sm font-extrabold hover:bg-white transition"
             target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> Book On WhatsApp
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

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-brand font-bold">
              What's Included
            </div>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold leading-tight">
              Everything in <span className="brand-text italic">the service</span>
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {service.highlights.map((h) => (
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
          </div>

          <aside className="rounded-3xl border border-border bg-[var(--cream)] p-8">
            <div className="text-[11px] uppercase tracking-[0.3em] text-brand font-bold">
              Indicative Pricing
            </div>
            <dl className="mt-6 divide-y divide-border">
              {service.pricing.map((p) => (
                <div key={p.label} className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-sm text-muted-foreground">{p.label}</dt>
                  <dd className="text-sm font-bold text-foreground text-right">{p.value}</dd>
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

      <section className="py-20 bg-[var(--cream)]">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-[11px] uppercase tracking-[0.3em] text-brand font-bold">
            Frequently Asked
          </div>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight">
            Questions about <span className="brand-text italic">{service.hero.toLowerCase()}</span>
          </h2>
          <div className="mt-10 space-y-4">
            {service.faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-background p-6">
                <div className="font-display text-lg font-bold text-foreground">{f.q}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight">
              Other <span className="brand-text italic">services</span>
            </h2>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:gap-3 transition-all"
            >
              Back to home <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group rounded-2xl bg-[var(--cream)] border border-border p-7 transition hover:border-brand/50 hover:-translate-y-1"
              >
                <div className="text-[10px] uppercase tracking-[0.24em] text-brand font-bold">
                  {s.hero}
                </div>
                <h3 className="mt-3 font-display text-xl font-extrabold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {s.short}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand">
                  View details <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
