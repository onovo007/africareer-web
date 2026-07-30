"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "../../lib/api";

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-3xl font-extrabold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function BarTable({ title, rows }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">No data yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="truncate text-slate-700">{r.label}</span>
                <span className="ml-2 font-semibold text-slate-900">{r.count}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${(r.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (tok) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.adminMetrics(tok);
      if (!res.ok) throw new Error(res.error || "Could not load metrics");
      setData(res);
      setAuthed(true);
      sessionStorage.setItem("aca_admin", tok);
    } catch (e) {
      setError(e.message || "Failed to load");
      setAuthed(false);
      sessionStorage.removeItem("aca_admin");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem("aca_admin") : "";
    if (saved) {
      setToken(saved);
      load(saved);
    }
  }, [load]);

  const signOut = () => {
    sessionStorage.removeItem("aca_admin");
    setAuthed(false);
    setData(null);
    setToken("");
  };

  // ---- Login gate ----
  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-[var(--brand-dark)] to-indigo-950 px-6">
        <div className="w-full max-w-sm rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur">
          <h1 className="text-xl font-bold text-slate-900">AfriCareer AI · Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Enter the admin access token to view usage metrics.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (token.trim()) load(token.trim());
            }}
            className="mt-5 space-y-3"
          >
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Admin token"
              autoFocus
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-blue-100"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)] disabled:opacity-60"
            >
              {loading ? "Checking…" : "View dashboard"}
            </button>
          </form>
          <Link href="/" className="mt-4 inline-block text-xs text-slate-400 hover:text-slate-600">
            ← Back to site
          </Link>
        </div>
      </main>
    );
  }

  // ---- Dashboard ----
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              AfriCareer <span className="text-[var(--brand)]">AI</span>
            </span>
            <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[var(--brand)]">Admin</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button onClick={() => load(token)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50">
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button onClick={signOut} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {data && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Total events" value={data.total_events} />
              <Stat label="Unique users" value={data.unique_users} />
              <Stat label="Logins / visits" value={data.logins} />
              <Stat label="Countries" value={data.countries.length} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <BarTable title="Most-used tools" rows={data.events} />
              <BarTable title="Top countries" rows={data.countries} />
              <BarTable title="Languages" rows={data.languages} />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <BarTable title="Daily activity (last 14 days)" rows={data.daily.map((d) => ({ label: d.date, count: d.count }))} />

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent activity</h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase text-slate-400">
                      <tr>
                        <th className="pb-2 pr-3">When</th>
                        <th className="pb-2 pr-3">Event</th>
                        <th className="pb-2 pr-3">User</th>
                        <th className="pb-2">Country</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.recent.map((r, i) => (
                        <tr key={i} className="text-slate-700">
                          <td className="py-1.5 pr-3 whitespace-nowrap text-slate-500">{(r.timestamp || "").replace("T", " ").slice(0, 16)}</td>
                          <td className="py-1.5 pr-3">{r.event}</td>
                          <td className="py-1.5 pr-3">{r.user_name || "—"}</td>
                          <td className="py-1.5">{r.country || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              Data source: Supabase <code>analytics</code> table · showing up to the latest 5,000 events.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
