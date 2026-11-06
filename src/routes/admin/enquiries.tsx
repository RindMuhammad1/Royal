import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Inbox, Mail, Phone, Search, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { getEnquiriesFn, updateEnquiryStatusFn, deleteEnquiryFn } from "@/functions/enquiries";

export const Route = createFileRoute("/admin/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries | Royal Chauffeur Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminEnquiriesPage,
});

type Status = "new" | "contacted" | "closed";
type EnquiryRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  pickupDate: string | null;
  message: string;
  status: Status;
  createdAt: string | Date;
};

const STATUS_STYLES: Record<Status, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  contacted: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  closed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("royal_admin_token") || "" : "";
}

function handleAuthError(err: unknown) {
  if (String(err).includes("Unauthorized")) {
    localStorage.removeItem("royal_admin_token");
    window.location.href = "/admin/login";
    return true;
  }
  return false;
}

function AdminEnquiriesPage() {
  const [rows, setRows] = useState<EnquiryRow[]>([]);
  const [counts, setCounts] = useState({ new: 0, contacted: 0, closed: 0 });
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getEnquiriesFn({
      data: { token: getToken(), status: filter === "all" ? undefined : filter, search },
    })
      .then((res) => {
        setRows(res.enquiries as EnquiryRow[]);
        setCounts(res.counts);
        setError("error" in res && res.error ? res.error : null);
      })
      .catch((err) => {
        if (!handleAuthError(err)) setError("Failed to load enquiries.");
      })
      .finally(() => setLoading(false));
  }, [filter, search]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const changeStatus = async (id: number, status: Status) => {
    try {
      const res = await updateEnquiryStatusFn({ data: { token: getToken(), id, status } });
      if (res.success) {
        toast.success(`Marked as ${status}`);
        load();
      } else toast.error(res.error || "Update failed");
    } catch (err) {
      if (!handleAuthError(err)) toast.error("Update failed");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    try {
      const res = await deleteEnquiryFn({ data: { token: getToken(), id } });
      if (res.success) {
        toast.success("Enquiry deleted");
        load();
      } else toast.error(res.error || "Delete failed");
    } catch (err) {
      if (!handleAuthError(err)) toast.error("Delete failed");
    }
  };

  const total = counts.new + counts.contacted + counts.closed;
  const tabs: Array<{ key: "all" | Status; label: string; count: number }> = [
    { key: "all", label: "All", count: total },
    { key: "new", label: "New", count: counts.new },
    { key: "contacted", label: "Contacted", count: counts.contacted },
    { key: "closed", label: "Closed", count: counts.closed },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Enquiries</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Messages submitted through the website contact form.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold border transition ${
                filter === t.key
                  ? "bg-brand text-[var(--ink)] border-brand"
                  : "bg-card border-border text-foreground hover:bg-muted"
              }`}
            >
              {t.label} <span className="opacity-70">({t.count})</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full sm:w-72 rounded-xl border border-border bg-card pl-9 pr-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-600">{error}</div>
      )}

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
            <Inbox className="h-8 w-8 text-muted-foreground/60" />
            No enquiries found.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {rows.map((r) => (
              <div key={r.id} className="p-5 hover:bg-muted/30 transition">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <button
                    className="text-left min-w-0 flex-1"
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[r.status]}`}
                      >
                        {r.status}
                      </span>
                      <span className="font-display text-sm font-semibold text-foreground">{r.name}</span>
                      {r.service && <span className="text-xs text-muted-foreground">• {r.service}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {r.email}
                      </span>
                      {r.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" /> {r.phone}
                        </span>
                      )}
                      {r.pickupDate && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {r.pickupDate}
                        </span>
                      )}
                      <span>Received {new Date(r.createdAt).toLocaleString()}</span>
                    </div>
                    <p
                      className={`mt-2 text-sm text-foreground/80 whitespace-pre-wrap break-words ${
                        expanded === r.id ? "" : "line-clamp-2"
                      }`}
                    >
                      {r.message}
                    </p>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`mailto:${encodeURIComponent(r.email)}`}
                      className="rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand transition"
                    >
                      Reply
                    </a>
                    <select
                      value={r.status}
                      onChange={(e) => changeStatus(r.id, e.target.value as Status)}
                      className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs font-semibold"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => remove(r.id)}
                      className="rounded-lg border border-red-500/30 p-1.5 text-red-500 hover:bg-red-500/10 transition"
                      aria-label="Delete enquiry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
