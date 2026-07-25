import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Menu,
  X,
} from "lucide-react";
import logoAsset from "@/assets/royal-chauffeur-logo.png.asset.json";

const WHATSAPP = "https://wa.me/971551988793";
const PHONE = "+971 55 198 8793";
const EMAIL = "royalchauffeurdubai@gmail.com";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const nav = [
    { label: "Home", to: "/" as const, hash: "" },
    { label: "About", to: "/" as const, hash: "about" },
    { label: "Fleet", to: "/" as const, hash: "fleet" },
    { label: "Services", to: "/" as const, hash: "services" },
    { label: "Packages", to: "/" as const, hash: "packages" },
    { label: "Contact", to: "/" as const, hash: "contact" },
  ];
  return (
    <>
      <div className="hidden md:block bg-[var(--ink)] text-white/85">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between py-2.5 text-xs">
          <div className="flex items-center gap-6">
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-brand transition-colors">
              <Phone className="h-3.5 w-3.5 text-brand" /> {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-brand transition-colors">
              <Mail className="h-3.5 w-3.5 text-brand" /> {EMAIL}
            </a>
          </div>
          <div className="flex items-center gap-5">
            <span>Available 24/7 across Dubai</span>
            <div className="flex items-center gap-3 text-white/70">
              <a href="https://www.facebook.com/share/1MdBvEg6Sh/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-brand transition-colors"><Facebook className="h-3.5 w-3.5" /></a>
              </div>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoAsset.url} alt="Royal Chauffeur Dubai logo" className="h-11 w-11 rounded-full object-cover ring-1 ring-brand/40" />
            <div className="leading-tight">
              <div className="font-display text-lg font-extrabold tracking-tight text-foreground">
                ROYAL <span className="text-brand">CHAUFFEUR</span>
              </div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase font-semibold">Dubai</div>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-9 text-sm font-medium">
            {nav.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                hash={n.hash || undefined}
                className="text-foreground/80 hover:text-brand transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={WHATSAPP}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-white px-5 py-3 text-sm font-bold hover:bg-brand transition"
             target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
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
                  <img src={logoAsset.url} alt="Royal Chauffeur Dubai logo" className="h-10 w-10 rounded-full object-cover ring-1 ring-brand/40" />
                  <div className="font-display text-base font-extrabold">
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
                  <Link
                    key={n.label}
                    to={n.to}
                    hash={n.hash || undefined}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 py-4 border-b border-white/10 last:border-0"
                  >
                    <span className="text-[11px] font-mono text-brand/70 w-6">
                      0{i + 1}
                    </span>
                    <span className="font-display text-2xl font-bold text-white group-hover:text-brand transition-colors">
                      {n.label}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="px-6 pb-8 pt-4 border-t border-white/10 space-y-3">
                <a
                  href={WHATSAPP}
                  className="flex items-center justify-center gap-2 rounded-full bg-brand text-[var(--ink)] px-5 py-3.5 text-sm font-bold"
                 target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" /> Book on WhatsApp
                </a>
                <a
                  href={`tel:${PHONE.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/25 text-white px-5 py-3.5 text-sm font-bold"
                >
                  <Phone className="h-4 w-4 text-brand" /> {PHONE}
                </a>
                <div className="flex items-center justify-center gap-5 pt-2 text-white/60">
                  <a href="https://www.facebook.com/share/1MdBvEg6Sh/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-brand transition-colors"><Facebook className="h-4 w-4" /></a>
                  </div>
              </div>
            </nav>
          </div>
        )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-[var(--ink)] text-white/80 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="Royal Chauffeur Dubai logo" className="h-11 w-11 rounded-full object-cover ring-1 ring-brand/40" />
            <div className="font-display text-lg font-extrabold text-white">
              ROYAL <span className="text-brand">CHAUFFEUR</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-sm">
            Dubai's private chauffeur service for residents, families and executives. Luxury in every journey.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-brand font-bold">Contact</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={`tel:${PHONE.replace(/\s/g, "")}`} className="hover:text-brand">{PHONE}</a></li>
            <li><a href={`mailto:${EMAIL}`} className="hover:text-brand">{EMAIL}</a></li>
            <li>Dubai, United Arab Emirates</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-brand font-bold">Explore</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" hash="fleet" className="hover:text-brand">Fleet</Link></li>
            <li><Link to="/" hash="services" className="hover:text-brand">Services</Link></li>
            <li><Link to="/" hash="packages" className="hover:text-brand">Packages</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <div>© {new Date().getFullYear()} Royal Chauffeur Dubai. All rights reserved.</div>
          <div className="font-semibold text-brand">Luxury in every journey.</div>
        </div>
      </div>
    </footer>
  );
}
