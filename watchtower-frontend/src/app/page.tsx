export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      {/* Background Glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 px-5 py-4 backdrop-blur-md sm:px-8 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 sm:h-3 sm:w-3" />
          <h1 className="text-lg font-black tracking-[0.2em] text-white sm:text-2xl">
            WATCHTOWER
          </h1>
        </div>

        <nav className="hidden gap-6 text-sm text-gray-300 md:flex md:gap-8">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#monitoring" className="transition hover:text-white">
            Monitoring
          </a>
          <a href="#alerts" className="transition hover:text-white">
            Alerts
          </a>
        </nav>

        <a
          href="/login"
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
        >
          Login
        </a>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-10 flex min-h-[92vh] flex-col items-center justify-center px-5 py-16 text-center sm:px-8 sm:py-20">
        {/* Radar Circle */}
        <div className="relative mb-10 flex h-44 w-44 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/5 sm:mb-14 sm:h-52 sm:w-52">
          <div className="absolute h-full w-full animate-ping rounded-full border border-emerald-400/15" />
          <div className="absolute h-[76%] w-[76%] rounded-full border border-emerald-500/20" />
          <div className="absolute h-[55%] w-[55%] rounded-full border border-emerald-500/20" />
          <div className="absolute h-[34%] w-[34%] rounded-full border border-emerald-500/20" />
          {/* Tower */}
          <div className="relative flex flex-col items-center">
            <div className="h-16 w-2 rounded-full bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] sm:h-20" />
            <div className="absolute -top-1.5 h-4 w-4 rounded-full bg-emerald-300 shadow-[0_0_28px_rgba(52,211,153,1)] sm:h-5 sm:w-5" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="max-w-4xl text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Real-Time Website
          <span className="mt-1 block bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
            Monitoring &amp; Observability
          </span>
        </h2>

        <p className="mt-6 max-w-xl text-base leading-7 text-gray-400 sm:mt-8 sm:text-lg">
          Monitor uptime, track latency, analyze failures, and receive instant
          alerts using BullMQ workers, Prometheus metrics, and Grafana
          dashboards.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row">
          <button className="rounded-xl bg-emerald-400 px-7 py-4 text-base font-bold text-black transition hover:scale-105 hover:bg-emerald-300 sm:px-8">
            Start Monitoring
          </button>
          <button className="rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-base font-bold text-white transition hover:bg-white/10 sm:px-8">
            View Demo
          </button>
        </div>

        {/* Status Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-center backdrop-blur-md sm:mt-16 sm:flex-nowrap sm:px-6">
          <div className="h-2.5 w-2.5 flex-shrink-0 animate-pulse rounded-full bg-emerald-400" />
          <p className="text-xs text-emerald-300 sm:text-sm">
            Monitoring systems active &bull; Prometheus connected &bull; Workers
            online
          </p>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="features"
        className="relative z-10 px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-20 md:px-16 lg:px-24"
      >
        <div className="grid gap-5 sm:gap-6 md:grid-cols-3 lg:gap-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md transition hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:-translate-y-1 sm:p-8">
            <div className="text-4xl">⚡</div>
            <h3 className="text-xl font-bold sm:text-2xl">
              Real-Time Monitoring
            </h3>
            <p className="leading-7 text-gray-400">
              BullMQ workers continuously monitor websites and collect uptime
              &amp; response-time metrics.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md transition hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:-translate-y-1 sm:p-8">
            <div className="text-4xl">📊</div>
            <h3 className="text-xl font-bold sm:text-2xl">Grafana Analytics</h3>
            <p className="leading-7 text-gray-400">
              Visualize latency, uptime percentage, and HTTP failures using live
              Prometheus-powered dashboards.
            </p>
          </div>

          <div
            id="alerts"
            className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md transition hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:-translate-y-1 sm:p-8"
          >
            <div className="text-4xl">🚨</div>
            <h3 className="text-xl font-bold sm:text-2xl">Instant Alerts</h3>
            <p className="leading-7 text-gray-400">
              Get instant Discord alerts whenever monitored services go down or
              return failures.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
