// "use client";

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type Monitor = {
//   id: number;
//   url: string;
//   last_status: number;
//   last_checked: string;
//   last_response_time: number | null;
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   const [monitors, setMonitors] = useState<Monitor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshKey, setRefreshKey] = useState(0); // 🔥 Ye table refresh karega

//   const [showModal, setShowModal] = useState(false);
//   const [newUrl, setNewUrl] = useState("");
//   const [interval, setIntervalValue] = useState(10000); // 🔥 Zod ke hisaab se 10000ms
//   const [adding, setAdding] = useState(false);

//   // ✅ PERFECT FETCH LOGIC: Koi ESLint warning nahi aayegi ab
//   // ✅ PERFECT FETCH LOGIC WITH REAL-TIME POLLING
//   useEffect(() => {
//     // isSilent = true ka matlab hai "background mein fetch karo, Loading spinner mat dikhao"
//     const fetchMonitors = async (isSilent = false) => {
//       try {
//         if (!isSilent) setLoading(true); // Sirf pehli baar loading dikhao
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/monitors`,
//           { withCredentials: true },
//         );
//         setMonitors(res.data);
//       } catch (err) {
//         console.error("Failed to fetch monitors:", err);
//         setMonitors([]);
//       } finally {
//         if (!isSilent) setLoading(false);
//       }
//     };

//     // 1. Component load hote hi pehli baar data lao (Loading spinner ke sath)
//     fetchMonitors(false);

//     // 2. 🔥 POLLING: Har 5 second (5000ms) mein chup-chaap naya data lao
//     const intervalId = setInterval(() => {
//       fetchMonitors(true);
//     }, 5000);

//     // 3. Cleanup: Agar user dusre page pe jaye toh polling rok do
//     return () => clearInterval(intervalId);
//   }, [refreshKey]); // Jab refreshKey change hoga (Add/Delete pe), ye reset hoga

//   const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
//         {},
//         { withCredentials: true },
//       );
//       router.push("/login");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAddMonitor = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newUrl) return;
//     setAdding(true);
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/monitors`,
//         {
//           url: newUrl,
//           interval: Number(interval), // 10000, 60000 jayega yahan se
//         },
//         { withCredentials: true },
//       );
//       setNewUrl("");
//       setShowModal(false);
//       triggerRefresh(); // 🔥 Table auto-update
//     } catch (err) {
//       console.error("Failed to add monitor", err);
//     } finally {
//       setAdding(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Are you sure?")) return;
//     try {
//       await axios.delete(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/monitors/${id}`,
//         { withCredentials: true },
//       );
//       triggerRefresh(); // 🔥 Table auto-update
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-black text-white relative">
//       <div className="fixed left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

//       <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
//             <h1 className="text-2xl font-black tracking-[0.2em]">WATCHTOWER</h1>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
//         <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h2 className="text-4xl font-black tracking-tight">Dashboard</h2>
//             <p className="mt-2 text-gray-400">
//               Track uptime and latency in real-time.
//             </p>
//           </div>

//           <button
//             onClick={() => setShowModal(true)}
//             className="rounded-2xl bg-emerald-400 px-6 py-3 font-bold text-black hover:scale-105 transition shadow-[0_0_15px_rgba(52,211,153,0.3)]"
//           >
//             + Add Monitor
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="mb-10 grid gap-6 md:grid-cols-3">
//           <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
//             <p className="text-sm text-gray-400">Total Monitors</p>
//             <h3 className="mt-3 text-4xl font-black">
//               {loading ? "..." : monitors.length}
//             </h3>
//           </div>
//           <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-6 backdrop-blur-xl">
//             <p className="text-sm text-green-300">Healthy</p>
//             <h3 className="mt-3 text-4xl font-black text-green-400">
//               {loading
//                 ? "..."
//                 : monitors.filter(
//                     (m) => m.last_status >= 200 && m.last_status < 300,
//                   ).length}
//             </h3>
//           </div>
//           <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-xl">
//             <p className="text-sm text-red-300">Down</p>
//             <h3 className="mt-3 text-4xl font-black text-red-400">
//               {loading
//                 ? "..."
//                 : monitors.filter((m) => m.last_status >= 400 || !m.last_status)
//                     .length}
//             </h3>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
//           <table className="w-full">
//             <thead className="border-b border-white/10 bg-white/5">
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
//                   URL
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
//                   Response Time
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={4} className="py-10 text-center text-gray-400">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : monitors.length === 0 ? (
//                 <tr>
//                   <td colSpan={4} className="py-10 text-center text-gray-400">
//                     {"No monitors found. Click '+ Add Monitor'"}
//                   </td>
//                 </tr>
//               ) : (
//                 monitors.map((monitor) => (
//                   <tr
//                     key={monitor.id}
//                     className="border-b border-white/5 hover:bg-white/5 transition"
//                   >
//                     <td className="px-6 py-4 font-medium">{monitor.url}</td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`rounded-full px-3 py-1 text-xs font-bold ${monitor.last_status >= 200 && monitor.last_status < 300 ? "bg-green-500/20 text-green-400" : monitor.last_status >= 400 ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}
//                       >
//                         {monitor.last_status || "Checking..."}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-gray-300">
//                       {monitor.last_response_time
//                         ? `${monitor.last_response_time}ms`
//                         : "--"}
//                     </td>
//                     <td className="px-6 py-4 flex gap-3">
//                       <button
//                         onClick={() =>
//                           router.push(`/dashboard/analytics/${monitor.id}`)
//                         }
//                         className="rounded-lg border border-white/10 px-3 py-1 text-sm transition hover:bg-white/10"
//                       >
//                         Analytics
//                       </button>
//                       <button
//                         onClick={() => handleDelete(monitor.id)}
//                         className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-sm text-red-400 transition hover:bg-red-500/20"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
//           <form
//             onSubmit={handleAddMonitor}
//             className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-8"
//           >
//             <h3 className="mb-6 text-2xl font-bold">Add New Monitor</h3>

//             <div className="space-y-4">
//               <input
//                 type="url"
//                 placeholder="https://example.com"
//                 required
//                 value={newUrl}
//                 onChange={(e) => setNewUrl(e.target.value)}
//                 className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-emerald-400"
//               />

//               {/* Values updated to match Zod (.min(10000)) and BullMQ directly */}
//               <select
//                 value={interval}
//                 onChange={(e) => setIntervalValue(Number(e.target.value))}
//                 className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-emerald-400 text-gray-300"
//               >
//                 <option value={10000}>Every 10 Seconds</option>
//                 <option value={60000}>Every 1 Minute</option>
//                 <option value={300000}>Every 5 Minutes</option>
//               </select>
//             </div>

//             <div className="mt-8 flex gap-3">
//               <button
//                 type="button"
//                 onClick={() => setShowModal(false)}
//                 className="flex-1 rounded-xl bg-white/5 py-3 font-semibold hover:bg-white/10 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 disabled={adding}
//                 type="submit"
//                 className="flex-1 rounded-xl bg-emerald-400 py-3 font-bold text-black disabled:opacity-50 hover:bg-emerald-300 transition"
//               >
//                 {adding ? "Adding..." : "Confirm"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </main>
//   );
// }


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
  const [refreshKey, setRefreshKey] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [interval, setIntervalValue] = useState(10000);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchMonitors = async (isSilent = false) => {
      try {
        if (!isSilent) setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/monitors`,
          { withCredentials: true },
        );
        setMonitors(res.data);
      } catch (err) {
        console.error("Failed to fetch monitors:", err);
        setMonitors([]);
      } finally {
        if (!isSilent) setLoading(false);
      }
    };

    fetchMonitors(false);

    const intervalId = setInterval(() => {
      fetchMonitors(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [refreshKey]);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true },
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
        { url: newUrl, interval: Number(interval) },
        { withCredentials: true },
      );
      setNewUrl("");
      setShowModal(false);
      triggerRefresh();
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
        { withCredentials: true },
      );
      triggerRefresh();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const healthyCount = monitors.filter(
    (m) => m.last_status >= 200 && m.last_status < 300,
  ).length;

  const downCount = monitors.filter(
    (m) => m.last_status >= 400 || !m.last_status,
  ).length;

  return (
    <main className="relative min-h-screen bg-black text-white">

      {/* Background Glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-black/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <div className="absolute h-full w-full animate-ping rounded-full border border-emerald-400/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <h1 className="text-lg font-black tracking-[0.18em] sm:text-xl">
              WATCHTOWER
            </h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1.5 sm:flex">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-300">Workers online</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20 sm:text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

        {/* ── HERO ROW ── */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400/70">
              Control Center
            </p>
            <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Monitor{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-400">
              Every service you watch, in one place. Uptime, latency, and
              failures tracked around the clock — so you know before your
              users do.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-300 to-emerald-500 px-6 py-3.5 text-sm font-black text-black shadow-[0_0_24px_rgba(52,211,153,0.2)] transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] sm:w-auto"
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Monitor
          </button>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-3 sm:gap-5">

          {/* Total */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.15] sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Total Monitors
                </p>
                <p className="mt-0.5 text-[11px] text-gray-700">All registered endpoints</p>
              </div>
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-5xl font-black leading-none">
              {loading ? <span className="animate-pulse text-gray-700">—</span> : monitors.length}
            </p>
          </div>

          {/* Healthy */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 sm:rounded-3xl sm:p-6">
            <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400/80">Healthy</p>
                <p className="mt-0.5 text-[11px] text-emerald-700/60">Responding with 2xx</p>
              </div>
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-5xl font-black leading-none text-emerald-400">
              {loading ? <span className="animate-pulse text-emerald-900">—</span> : healthyCount}
            </p>
          </div>

          {/* Down */}
          <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-red-500/40 sm:rounded-3xl sm:p-6">
            <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-500/10 blur-2xl" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-red-400/80">Down</p>
                <p className="mt-0.5 text-[11px] text-red-700/60">Failing or unreachable</p>
              </div>
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-5xl font-black leading-none text-red-400">
              {loading ? <span className="animate-pulse text-red-900">—</span> : downCount}
            </p>
          </div>
        </div>

        {/* ── MONITORS TABLE / CARD LIST ── */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-xl sm:rounded-3xl">

          {/* Top bar */}
          <div className="flex flex-col gap-3 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
            <div>
              <h3 className="text-sm font-bold text-white">Active Monitors</h3>
              <p className="mt-0.5 text-[11px] text-gray-600">
                {loading
                  ? "Loading…"
                  : `${monitors.length} endpoint${monitors.length !== 1 ? "s" : ""} under watch`}
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3.5 py-1.5">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[11px] font-semibold text-emerald-300">
                Live · auto-refresh every 5s
              </span>
            </div>
          </div>

          {/* ── DESKTOP TABLE ── */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full">
              <thead className="border-b border-white/[0.05] bg-white/[0.015]">
                <tr>
                  {["Endpoint URL", "HTTP Status", "Response Time", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-7 py-4 text-left text-[10px] font-bold uppercase tracking-[0.1em] text-gray-600"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                        <p className="text-xs text-gray-600">Fetching your monitors…</p>
                      </div>
                    </td>
                  </tr>
                ) : monitors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <p className="text-sm font-medium text-gray-500">
                        No monitors yet.{" "}
                        <button
                          onClick={() => setShowModal(true)}
                          className="font-bold text-emerald-400 underline-offset-2 hover:text-emerald-300 hover:underline"
                        >
                          Add your first endpoint →
                        </button>
                      </p>
                      <p className="mt-1 text-xs text-gray-700">
                        Watchtower will start checking it immediately.
                      </p>
                    </td>
                  </tr>
                ) : (
                  monitors.map((monitor) => {
                    const isUp   = monitor.last_status >= 200 && monitor.last_status < 300;
                    const isDown = monitor.last_status >= 400;

                    return (
                      <tr
                        key={monitor.id}
                        className="border-b border-white/[0.04] transition duration-150 hover:bg-white/[0.02]"
                      >
                        <td className="px-7 py-5">
                          <p className="max-w-xs truncate text-sm font-semibold text-white">
                            {monitor.url}
                          </p>
                        </td>

                        <td className="px-7 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${
                              isUp
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                : isDown
                                ? "border-red-500/20 bg-red-500/10 text-red-400"
                                : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full bg-current ${isUp ? "animate-pulse" : ""}`} />
                            {monitor.last_status || "Checking…"}
                          </span>
                        </td>

                        <td className="px-7 py-5 font-mono text-sm tabular-nums text-gray-400">
                          {monitor.last_response_time ? `${monitor.last_response_time}ms` : "—"}
                        </td>

                        <td className="px-7 py-5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/dashboard/analytics/${monitor.id}`)}
                              className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                            >
                              Analytics
                            </button>
                            <button
                              onClick={() => handleDelete(monitor.id)}
                              className="rounded-lg border border-red-500/20 bg-red-500/[0.07] px-3.5 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARD LIST ── */}
          <div className="divide-y divide-white/[0.05] sm:hidden">
            {loading ? (
              <div className="flex flex-col items-center gap-3 py-16">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                <p className="text-xs text-gray-600">Fetching your monitors…</p>
              </div>
            ) : monitors.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm font-medium text-gray-500">
                  No monitors yet.{" "}
                  <button
                    onClick={() => setShowModal(true)}
                    className="font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    Add one →
                  </button>
                </p>
              </div>
            ) : (
              monitors.map((monitor) => {
                const isUp   = monitor.last_status >= 200 && monitor.last_status < 300;
                const isDown = monitor.last_status >= 400;

                return (
                  <div key={monitor.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="break-all text-sm font-semibold leading-snug text-white">
                        {monitor.url}
                      </p>
                      <span
                        className={`flex-shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                          isUp
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : isDown
                            ? "border-red-500/20 bg-red-500/10 text-red-400"
                            : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {monitor.last_status || "Checking…"}
                      </span>
                    </div>

                    <p className="mt-1.5 font-mono text-xs text-gray-600">
                      {monitor.last_response_time
                        ? `Response: ${monitor.last_response_time}ms`
                        : "Awaiting first check"}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/analytics/${monitor.id}`)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-bold text-gray-300 transition hover:bg-white/10"
                      >
                        Analytics
                      </button>
                      <button
                        onClick={() => handleDelete(monitor.id)}
                        className="flex-1 rounded-xl border border-red-500/20 bg-red-500/[0.07] py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ── ADD MONITOR MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 px-4 backdrop-blur-md sm:items-center">
          <form
            onSubmit={handleAddMonitor}
            className="w-full max-w-md rounded-t-3xl border border-white/10 bg-[#0a0a0a] p-7 shadow-2xl sm:rounded-3xl sm:p-9"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black">Add New Monitor</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Watchtower starts checking it right away.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-500 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-service.com"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/[0.08]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">
                  Check Interval
                </label>
                <select
                  value={interval}
                  onChange={(e) => setIntervalValue(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3.5 text-sm text-gray-300 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/[0.08]"
                >
                  <option value={10000}>Every 10 seconds — for critical services</option>
                  <option value={60000}>Every 1 minute — recommended</option>
                  <option value={300000}>Every 5 minutes — for low-traffic sites</option>
                </select>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-white/10 bg-white/[0.04] py-3.5 text-sm font-bold text-gray-300 transition hover:bg-white/[0.08]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={adding}
                className="rounded-xl bg-gradient-to-r from-emerald-300 to-emerald-500 py-3.5 text-sm font-black text-black transition hover:scale-[1.01] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
              >
                {adding ? "Adding…" : "Start Monitoring"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}