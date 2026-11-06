import { createFileRoute, Outlet, Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Image as ImageIcon,
  FolderTree,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  Inbox,
} from "lucide-react";
import logoAsset from "@/assets/royal-chauffeur-logo.jpg";
import { getAdminSessionFn } from "@/functions/blog";

export const Route = createFileRoute("/admin")({
  component: AdminLayoutShell,
});

function AdminLayoutShell() {
  const router = useRouter();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") : null;
    if (!token) {
      router.navigate({ to: "/admin/login" });
      return;
    }

    // Verify session
    getAdminSessionFn({ data: { token } })
      .then((res) => {
        if (!res?.admin) {
          localStorage.removeItem("royal_admin_token");
          router.navigate({ to: "/admin/login" });
        } else {
          setAdminUser(res.admin);
        }
      })
      .catch(() => {
        localStorage.removeItem("royal_admin_token");
        router.navigate({ to: "/admin/login" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("royal_admin_token");
    }
    router.navigate({ to: "/admin/login" });
  };

  if (isLoginPage) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="text-sm font-medium text-white/70">Authenticating Royal Admin Console...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", to: "/admin" as const, icon: LayoutDashboard },
    { label: "All Posts", to: "/admin/blogs" as const, icon: FileText },
    { label: "Write New Post", to: "/admin/blogs/new" as const, icon: PlusCircle },
    { label: "Media Library", to: "/admin/media" as const, icon: ImageIcon },
    { label: "Categories", to: "/admin/categories" as const, icon: FolderTree },
    { label: "Enquiries", to: "/admin/enquiries" as const, icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-muted/30 text-foreground flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-[var(--ink)] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src={logoAsset} alt="Logo" className="h-9 w-9 rounded-full object-cover ring-1 ring-brand/50" />
          <span className="font-display text-sm font-bold text-white tracking-wide">
            ROYAL <span className="text-brand">ADMIN</span>
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white/80 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--ink)] text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Logo & Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <img
              src={logoAsset}
              alt="Royal Chauffeur UAE"
              className="h-10 w-10 rounded-full object-cover ring-1 ring-brand/50"
            />
            <div>
              <div className="font-display text-sm font-bold tracking-tight text-white">
                ROYAL <span className="text-brand">CHAUFFEUR</span>
              </div>
              <div className="text-[10px] tracking-[0.25em] text-white/50 uppercase font-semibold">
                Admin Console
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/admin"
                  ? pathname === "/admin" || pathname === "/admin/"
                  : pathname.startsWith(item.to);

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-brand text-[var(--ink)] font-bold shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            to="/blog"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-lg text-xs text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-brand" /> View Public Site
            </span>
          </Link>

          <div className="px-4 py-2 rounded-lg bg-white/5 text-xs">
            <div className="text-[11px] text-white/50 font-medium">Signed in as:</div>
            <div className="text-white font-semibold truncate">{adminUser?.name || "Admin"}</div>
            <div className="text-[10px] text-white/40 truncate">{adminUser?.email}</div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
