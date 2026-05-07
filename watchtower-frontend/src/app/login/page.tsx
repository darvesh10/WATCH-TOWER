"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  // UI State
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError("");
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    localStorage.setItem("token", res.data.token);
    router.push("/dashboard");
  } catch (err: unknown) {
    // This "if" check removes the red underline
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.error || "Login failed");
    } else {
      setError("An unexpected error occurred");
    }
  } finally {
    setLoading(false);
  }
};

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError("");
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      { email, password },
      { withCredentials: true }
    );
    localStorage.setItem("token", res.data.token);
    router.push("/dashboard");
  } catch (err: unknown) {
    // This "if" check removes the red underline
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.error || "Register failed");
    } else {
      setError("An unexpected error occurred");
    }
  } finally {
    setLoading(false);
  }
};


  // Helper to clear form when switching tabs
  const toggleAuthMode = (mode: boolean) => {
    setIsLogin(mode);
    setError("");
    setEmail("");
    setPassword("");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-black px-6 py-12 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="relative z-10 grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        
        {/* ── LEFT COLUMN: Project Details ── */}
        <div className="flex flex-col space-y-8">
          <Link href="/" className="flex w-max items-center gap-3 transition-opacity hover:opacity-80">
            <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
            <h1 className="text-xl font-black tracking-[0.2em] text-white sm:text-2xl">
              WATCHTOWER
            </h1>
          </Link>

          <div>
            <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Distributed System <br />
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                Observability
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
              Access your centralized dashboard to monitor infrastructure health in real-time. Watch Tower utilizes high-speed Redis data storage and dedicated worker nodes to continuously ping and track your distributed services.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
              <div className="mb-3 text-2xl">⚡</div>
              <h3 className="mb-1 font-bold text-white">High-Speed Workers</h3>
              <p className="text-sm text-gray-400">Continuous pinging and latency tracking for minimal downtime.</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
              <div className="mb-3 text-2xl">🗄️</div>
              <h3 className="mb-1 font-bold text-white">Redis Powered</h3>
              <p className="text-sm text-gray-400">In-memory datastore ensuring lightning-fast metric retrieval.</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Auth Card ── */}
        <div className="mx-auto w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            
            {/* Sliding Toggle Control */}
            <div className="relative mb-8 flex h-14 w-full rounded-full border border-white/10 bg-black/50 p-1">
              {/* Active Slider Background */}
              <div
                className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-full border border-emerald-500/30 bg-emerald-500/20 transition-transform duration-300 ease-in-out ${
                  isLogin ? "translate-x-0" : "translate-x-full"
                }`}
              />
              
              <button
                onClick={() => toggleAuthMode(true)}
                className={`relative z-10 flex-1 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  isLogin ? "text-emerald-300" : "text-gray-400 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => toggleAuthMode(false)}
                className={`relative z-10 flex-1 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  !isLogin ? "text-emerald-300" : "text-gray-400 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            {/* Forms Container */}
            <div className="relative">
              
              {/* ── LOGIN FORM ── */}
              <form 
                onSubmit={handleLogin}
                className={`transition-all duration-500 ease-in-out ${
                  isLogin 
                    ? "visible relative translate-x-0 opacity-100" 
                    : "invisible absolute inset-0 -translate-x-8 opacity-0"
                } space-y-5`}
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:bg-black/60 focus:ring-1 focus:ring-emerald-400/50"
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-300">Password</label>
                    <a href="#" className="text-xs text-emerald-400 transition hover:text-emerald-300">Forgot?</a>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:bg-black/60 focus:ring-1 focus:ring-emerald-400/50"
                  />
                </div>

                {error && <p className="text-sm font-medium text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full rounded-xl bg-emerald-400 py-3.5 font-bold text-black shadow-[0_0_20px_rgba(52,211,153,0.3)] transition hover:scale-[1.02] hover:bg-emerald-300 hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {loading ? "Signing In..." : "Sign In to Dashboard"}
                </button>
              </form>

              {/* ── REGISTER FORM ── */}
              <form 
                onSubmit={handleRegister}
                className={`transition-all duration-500 ease-in-out ${
                  !isLogin 
                    ? "visible relative translate-x-0 opacity-100" 
                    : "invisible absolute inset-0 translate-x-8 opacity-0"
                } space-y-5`}
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:bg-black/60 focus:ring-1 focus:ring-emerald-400/50"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:bg-black/60 focus:ring-1 focus:ring-emerald-400/50"
                  />
                </div>

                {error && <p className="text-sm font-medium text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full rounded-xl border border-emerald-400 bg-emerald-500/10 py-3.5 font-bold text-emerald-400 transition hover:bg-emerald-500/20 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}