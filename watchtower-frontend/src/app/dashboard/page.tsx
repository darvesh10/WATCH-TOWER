"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Monitor = {
  id: number;
  url: string;
  last_status: number;
  last_checked: string;
  last_response_time: number | null;
};

export default function DashboardPage() {
  const router = useRouter();
  
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // 🔥 Ye table refresh karega
  
  const [showModal, setShowModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [interval, setIntervalValue] = useState(10000); // 🔥 Zod ke hisaab se 10000ms
  const [adding, setAdding] = useState(false);

  // ✅ PERFECT FETCH LOGIC: Koi ESLint warning nahi aayegi ab
  useEffect(() => {
    const fetchMonitors = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/monitors`,
          { withCredentials: true }
        );
        setMonitors(res.data);
      } catch (err) {
        console.error("Failed to fetch monitors:", err);
        setMonitors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonitors();
  }, [refreshKey]); // Jab refreshKey change hoga, ye auto-fetch karega

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    setAdding(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/monitors`,
        { 
          url: newUrl,
          interval: Number(interval) // 10000, 60000 jayega yahan se
        },
        { withCredentials: true }
      );
      setNewUrl("");
      setShowModal(false);
      triggerRefresh(); // 🔥 Table auto-update
    } catch (err) {
      console.error("Failed to add monitor", err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/monitors/${id}`,
        { withCredentials: true }
      );
      triggerRefresh(); // 🔥 Table auto-update
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative">
      <div className="fixed left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
            <h1 className="text-2xl font-black tracking-[0.2em]">WATCHTOWER</h1>
          </div>
          <button onClick={handleLogout} className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition">
            Logout
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tight">Dashboard</h2>
            <p className="mt-2 text-gray-400">Track uptime and latency in real-time.</p>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="rounded-2xl bg-emerald-400 px-6 py-3 font-bold text-black hover:scale-105 transition shadow-[0_0_15px_rgba(52,211,153,0.3)]"
          >
            + Add Monitor
          </button>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm text-gray-400">Total Monitors</p>
            <h3 className="mt-3 text-4xl font-black">{loading ? "..." : monitors.length}</h3>
          </div>
          <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-6 backdrop-blur-xl">
            <p className="text-sm text-green-300">Healthy</p>
            <h3 className="mt-3 text-4xl font-black text-green-400">
              {loading ? "..." : monitors.filter(m => m.last_status >= 200 && m.last_status < 300).length}
            </h3>
          </div>
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-xl">
            <p className="text-sm text-red-300">Down</p>
            <h3 className="mt-3 text-4xl font-black text-red-400">
              {loading ? "..." : monitors.filter(m => m.last_status >= 400 || !m.last_status).length}
            </h3>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">URL</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Response Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-10 text-center text-gray-400">Loading...</td></tr>
              ) : monitors.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center text-gray-400">{"No monitors found. Click '+ Add Monitor'"}</td></tr>
              ) : monitors.map((monitor) => (
                <tr key={monitor.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-6 py-4 font-medium">{monitor.url}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${monitor.last_status >= 200 && monitor.last_status < 300 ? "bg-green-500/20 text-green-400" : monitor.last_status >= 400 ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {monitor.last_status || "Checking..."}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {monitor.last_response_time ? `${monitor.last_response_time}ms` : "--"}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button 
                      onClick={() => router.push(`/dashboard/analytics/${monitor.id}`)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-sm transition hover:bg-white/10"
                    >
                      Analytics
                    </button>
                    <button 
                      onClick={() => handleDelete(monitor.id)}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-sm text-red-400 transition hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <form onSubmit={handleAddMonitor} className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-8">
            <h3 className="mb-6 text-2xl font-bold">Add New Monitor</h3>
            
            <div className="space-y-4">
              <input
                type="url"
                placeholder="https://example.com"
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-emerald-400"
              />
              
              {/* Values updated to match Zod (.min(10000)) and BullMQ directly */}
              <select 
                value={interval} 
                onChange={(e) => setIntervalValue(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-emerald-400 text-gray-300"
              >
                <option value={10000}>Every 10 Seconds</option>
                <option value={60000}>Every 1 Minute</option>
                <option value={300000}>Every 5 Minutes</option>
              </select>
            </div>

            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl bg-white/5 py-3 font-semibold hover:bg-white/10 transition">Cancel</button>
              <button disabled={adding} type="submit" className="flex-1 rounded-xl bg-emerald-400 py-3 font-bold text-black disabled:opacity-50 hover:bg-emerald-300 transition">
                {adding ? "Adding..." : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}