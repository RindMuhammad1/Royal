import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { adminLoginFn } from "@/functions/blog";
import logoAsset from "@/assets/royal-chauffeur-logo.jpg";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login | Royal Chauffeur UAE" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminLoginFn({ data: { email, password } });

      if (res.success && res.token) {
        localStorage.setItem("royal_admin_token", res.token);
        router.navigate({ to: "/admin" });
      } else {
        setError(res.error || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError(
        "Could not reach the server (" +
          (err instanceof Error ? err.message : String(err)).slice(0, 120) +
          "). Check the server logs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Card */}
        <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center text-center">
            <img
              src={logoAsset}
              alt="Royal Chauffeur UAE"
              className="h-16 w-16 rounded-full object-cover ring-2 ring-brand/50 shadow-md"
            />
            <div className="mt-4 font-display text-xl font-bold tracking-tight text-white">
              ROYAL <span className="text-brand">CHAUFFEUR</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/50 font-semibold">
              CMS Administration
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Administrator Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-white/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@royalchauffeuruae.com"
                  className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-white/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-brand text-[var(--ink)] font-bold text-sm py-3.5 hover:bg-brand/90 transition shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--ink)] border-t-transparent" />
              ) : (
                <>
                  Enter Admin Console <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/40">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              Authorized Access Only • Royal Chauffeur UAE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
