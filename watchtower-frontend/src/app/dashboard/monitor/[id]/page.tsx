"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

type Monitor = {
  id: number;
  url: string;
  last_status: number;
  last_response_time: number | null;
};

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FIX 1: Port updated to 3001 as per your docker-compose
  const GRAFANA_BASE_URL =
    "http://localhost:3001/d-solo/ad4wr4k/usefull-queries-to-check-monitors-health";

  useEffect(() => {
    const fetchMonitorDetail = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/monitors`,
          { withCredentials: true },
        );

        // 🔥 FIX 2: String conversion ensures that ID match never fails
        const found = res.data.find(
          (m: Monitor) => String(m.id) === String(params.id),
        );

        if (found) {
          setMonitor(found);
        } else {
          console.error("Monitor ID not found in database:", params.id);
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Error fetching monitor detail", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonitorDetail();
  }, [params.id, router]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="pointer-events-none fixed left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <p className="text-sm font-semibold text-emerald-400">
            Loading analytics…
          </p>
        </div>
      </div>
    );
  }

  if (!monitor) return null;

  // 🔥 FIX 3: URL encoding to safely pass "https://" to Grafana
  const encodedUrl = encodeURIComponent(monitor.url);

  const isUp = monitor.last_status >= 200 && monitor.last_status < 300;

  const panels = [
    { title: "Uptime Percentage",       desc: "% time the endpoint was reachable",   id: 1 },
    { title: "Latency · Response Time", desc: "Average time to receive a response",   id: 2 },
    { title: "HTTP Status History",     desc: "Status codes recorded over time",      id: 5 },
    { title: "Incidents & Failures",    desc: "Timeline of detected downtime events", id: 4 },
  ] as const;

  return (
    <main className="relative min-h-screen bg-black text-white">

      {/* Background Glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-black/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-7 w-7 items-center justify-center">
              <div className="absolute h-full w-full animate-ping rounded-full border border-emerald-400/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-lg font-black tracking-[0.18em] sm:text-xl">
              WATCHTOWER
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3.5 py-1.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="hidden text-[11px] font-semibold text-emerald-300 sm:block">
              Prometheus connected
            </span>
            <span className="text-[11px] font-semibold text-emerald-300 sm:hidden">
              Live
            </span>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-gray-600">
          <Link
            href="/dashboard"
            className="font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            ← Dashboard
          </Link>
          <span className="text-white/10">/</span>
          <span className="text-gray-600">Analytics</span>
          <span className="text-white/10">/</span>
          <span className="max-w-[140px] truncate text-gray-700 sm:max-w-xs">
            {monitor.url}
          </span>
        </nav>

        {/* ── HERO ROW ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-emerald-400/60">
              Endpoint Analytics
            </p>
            <h2 className="break-all text-xl font-black leading-snug tracking-tight sm:text-3xl lg:text-4xl">
              <span className="text-emerald-400">{monitor.url}</span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Real-time health, latency trends, and incident history — powered
              by Prometheus &amp; Grafana.
            </p>

            {/* Quick meta pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-gray-500">
                Monitor #{monitor.id}
              </span>
              {monitor.last_response_time && (
                <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-gray-500">
                  Last ping: {monitor.last_response_time}ms
                </span>
              )}
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-gray-500">
                HTTP {monitor.last_status}
              </span>
            </div>
          </div>

          {/* Status pill */}
          <div
            className={`flex flex-shrink-0 items-center gap-3 self-start rounded-2xl border px-5 py-4 backdrop-blur-xl ${
              isUp
                ? "border-emerald-500/20 bg-emerald-500/[0.06]"
                : "border-red-500/20 bg-red-500/[0.06]"
            }`}
          >
            <div
              className={`h-3 w-3 animate-pulse rounded-full ${
                isUp ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            <div>
              <p
                className={`text-sm font-black ${
                  isUp ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {isUp ? "System Operational" : "Service Down"}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-600">
                Last checked just now
              </p>
            </div>
          </div>
        </div>

        {/* ── GRAFANA PANEL GRID ── */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {panels.map(({ title, desc, id }) => (
            <div
              key={id}
              className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-emerald-500/20 sm:rounded-3xl"
            >
              {/* Panel header */}
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.05] px-5 py-4 sm:px-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white sm:text-[11px]">
                    {title}
                  </h3>
                  {/* ✅ FIXED: was text-[10px] text-gray-700 — now visible */}
                  <p className="mt-1 text-xs font-medium text-gray-400">{desc}</p>
                </div>
                <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  Live
                </span>
              </div>

              {/* Iframe */}
              <div className="h-[260px] p-3 sm:h-[310px] sm:p-4">
                <iframe
                  src={`${GRAFANA_BASE_URL}?orgId=1&var-url=${encodedUrl}&panelId=${id}&theme=dark&refresh=20s`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="rounded-xl"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[11px] text-gray-700">
          Data sourced from Prometheus · Visualized via Grafana · Refreshes
          automatically
        </p>
      </div>
    </main>
  );
}