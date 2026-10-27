"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Activity,
  BarChart3,
  Clock3,
  Bell,
  Droplets,
  Lock,
  Mail,
  MapPin,
  Menu,
  Phone,
  RadioTower,
  ShieldCheck,
  Thermometer,
  Waves,
  Wifi,
  X,
} from "lucide-react";

type PublicStats = {
  total: number;
  online: number;
  warning: number;
  offline: number;
};

type SiteStatus = "Connected" | "Attention" | "Offline";

type SitePreview = {
  id: string;
  name: string;
  deviceId: string;
  temperatureC: number | null;
  status: SiteStatus;
  signal: number | null;
  lastSeen: string;
};

// Centralized presentation values. Switch NEXT_PUBLIC_LANDING_DATA_MODE to "live"
// when you want the public overview to read from the deployed API again.
const PRESENTATION_STATS: PublicStats = {
  total: 8,
  online: 6,
  warning: 2,
  offline: 2,
};

const PRESENTATION_SITES: SitePreview[] = [
  { id: "site-01", name: "IMTA Cage 1", deviceId: "BCBO-SEN-001", temperatureC: 27.4, status: "Connected", signal: 92, lastSeen: "2 min ago" },
  { id: "site-02", name: "IMTA Cage 2", deviceId: "BCBO-SEN-002", temperatureC: 28.1, status: "Connected", signal: 86, lastSeen: "4 min ago" },
  { id: "site-03", name: "Seaweed Line A", deviceId: "BCBO-SEN-003", temperatureC: 32.4, status: "Attention", signal: 78, lastSeen: "3 min ago" },
  { id: "site-04", name: "Seaweed Line B", deviceId: "BCBO-SEN-004", temperatureC: 30.6, status: "Connected", signal: 71, lastSeen: "5 min ago" },
  { id: "site-05", name: "Nearshore Cage A", deviceId: "BCBO-SEN-005", temperatureC: 19.6, status: "Attention", signal: 65, lastSeen: "1 min ago" },
  { id: "site-06", name: "Nearshore Cage B", deviceId: "BCBO-SEN-006", temperatureC: null, status: "Offline", signal: null, lastSeen: "28 min ago" },
  { id: "site-07", name: "Estuary Sensor 07", deviceId: "BCBO-SEN-007", temperatureC: null, status: "Offline", signal: null, lastSeen: "34 min ago" },
  { id: "site-08", name: "Coastal Sensor 08", deviceId: "BCBO-SEN-008", temperatureC: 26.8, status: "Connected", signal: 83, lastSeen: "2 min ago" },
];

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://bahari-cbo-web-api.onrender.com/api";
const USE_LIVE_LANDING_DATA = process.env.NEXT_PUBLIC_LANDING_DATA_MODE === "live";
const FARMER_APP_URL = process.env.NEXT_PUBLIC_FARMER_APP_URL || "https://app.baharicbo.com";

async function fetchPublicStats(): Promise<PublicStats> {
  if (!USE_LIVE_LANDING_DATA) return PRESENTATION_STATS;

  try {
    const response = await fetch(`${API_BASE}/readings/public-stats`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Public stats request failed (${response.status})`);

    const json = await response.json();
    if (!json?.success || !json?.data) throw new Error("Public stats response was not in the expected format");

    return {
      total: Number(json.data.total ?? 0),
      online: Number(json.data.online ?? 0),
      warning: Number(json.data.warning ?? 0),
      offline: Number(json.data.offline ?? 0),
    };
  } catch (error) {
    console.error("[Landing] Could not load public stats; using presentation values.", error);
    return PRESENTATION_STATS;
  }
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState<PublicStats>(PRESENTATION_STATS);

  // Prevent background scrolling when mobile nav is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // In presentation mode the values are local and render immediately. Set
  // NEXT_PUBLIC_LANDING_DATA_MODE=live to refresh the summary from the API.
  useEffect(() => {
    if (!USE_LIVE_LANDING_DATA) return;

    let isMounted = true;
    const load = async () => {
      const result = await fetchPublicStats();
      if (isMounted) setStats(result);
    };

    void load();
    const interval = setInterval(() => void load(), 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Skip link (accessibility) */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:text-blue-800 focus:px-4 focus:py-2 focus:rounded-xl focus:shadow"
      >
        Skip to content
      </a>

      {/* Top bar */}
      <div className="bg-[var(--bahari-blue-deep)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="opacity-90" />
            <span>Bahari CBO Network • Blue Empowerment (BE) Project</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              className="inline-flex items-center gap-2 hover:underline"
              href="tel:+254712729004"
              aria-label="Call Bahari CBO Network"
            >
              <Phone size={16} /> 0712729004
            </a>
            <a
              className="inline-flex items-center gap-2 hover:underline"
              href="mailto:info@baharicbo.org"
              aria-label="Email Bahari CBO Network"
            >
              <Mail size={16} /> info@baharicbo.org
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
              <Image
                src="/logo-icon.png"
                alt="Bahari CBO Network logo"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="leading-tight">
              <div className="text-lg font-bold text-[var(--bahari-blue)]">
                Bahari CBO Network
              </div>
              <div className="text-xs text-gray-500">
                Blue Empowerment (BE) • IMTA Monitoring
              </div>
            </div>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a className="hover:text-blue-700" href="#about">About</a>
            <a className="hover:text-blue-700" href="#project">Blue Empowerment</a>
            <a className="hover:text-blue-700" href="#innovation">IMTA</a>
            <a className="hover:text-blue-700" href="#farmers-link">Farmer’s Link</a>
            <a className="hover:text-blue-700" href="#contact">Contact</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Pill tone="muted" icon={<Lock size={14} />} text="Secure portals" />
            <LoginDialogTrigger />
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 hover:bg-gray-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden p-4 bg-white border-t space-y-3">
            <a className="block py-2" href="#about" onClick={() => setMobileOpen(false)}>About</a>
            <a className="block py-2" href="#project" onClick={() => setMobileOpen(false)}>Blue Empowerment</a>
            <a className="block py-2" href="#innovation" onClick={() => setMobileOpen(false)}>IMTA</a>
            <a className="block py-2" href="#farmers-link" onClick={() => setMobileOpen(false)}>Farmer’s Link</a>
            <a className="block py-2" href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
            <div className="pt-2">
              <LoginDialogTrigger fullWidth />
            </div>
          </div>
        )}
      </header>

      <main id="main">
        {/* Hero */}
        <section className="relative py-20 md:py-28 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Pill tone="ok" icon={<Waves size={14} />} text="Coastal resilience" />
              <Pill tone="ok" icon={<Droplets size={14} />} text="Women & youth empowerment" />
              <Pill tone="muted" icon={<BarChart3 size={14} />} text="Data-driven aquaculture" />
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--bahari-blue)] leading-tight">
              Smart Aquaculture. Sustainable Oceans.
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              A community-owned monitoring platform for climate-smart Integrated Multi-Trophic Aquaculture (IMTA) — built
              for low bandwidth, local access, and real decisions on fish and seaweed production.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="rounded-2xl px-6 py-6 text-base sm:text-lg"
                onClick={() => document.getElementById("farmers-link")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore Farmer’s Link
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl px-6 py-6 text-base sm:text-lg"
                onClick={() => document.getElementById("innovation")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn about IMTA
              </Button>
            </div>

            <div className="mt-10 max-w-3xl mx-auto grid sm:grid-cols-3 gap-4 text-left">
              <MiniStat title="Low-bandwidth ready" desc="Designed around connectivity realities at coastal field sites" />
              <MiniStat title="Secure access" desc="Role-based portals: Farmers, Tech, Admin" />
              <MiniStat title="Expandable" desc="Structured to grow with alerts, reports, and additional sensors" />
            </div>
          </motion.div>
        </section>

        {/* About */}
        <section id="about" className="py-18 md:py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-blue-900">About Bahari CBO Network</h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                Bahari CBO Network is a community-led umbrella organization advancing sustainable fisheries, aquaculture,
                climate resilience, and gender equality across Kenya’s coastal communities. We prioritize women’s economic
                empowerment, evidence-based advocacy, and community ownership of data systems.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <FactChip label="Focus" value="Coastal livelihoods" />
                <FactChip label="Approach" value="Community-owned data" />
                <FactChip label="Priority" value="Women & youth leadership" />
                <FactChip label="Model" value="Climate-smart IMTA" />
              </div>
            </motion.div>

            <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-[var(--bahari-sea)] via-white to-[var(--bahari-green-soft)] p-6 md:p-8 shadow-sm">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-200/40 blur-2xl" />
              <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-sky-200/50 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--bahari-green)]">The IMTA approach</span>
                  <Waves className="text-[var(--bahari-blue)]" size={23} />
                </div>
                <h3 className="mt-4 max-w-sm text-2xl font-bold leading-snug text-[var(--bahari-blue)]">Healthy waters. Stronger livelihoods.</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">An integrated approach connecting aquaculture, seaweed cultivation, and practical environmental monitoring.</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur">
                    <Waves className="text-[var(--bahari-blue)]" size={22} />
                    <div className="mt-3 font-semibold text-slate-800">Fish production</div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-500">Site-level care and monitoring</div>
                  </div>
                  <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur">
                    <Droplets className="text-[var(--bahari-green)]" size={22} />
                    <div className="mt-3 font-semibold text-slate-800">Seaweed cultivation</div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-500">Climate-smart coastal livelihoods</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[var(--bahari-blue)] p-4 text-white shadow-sm">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15"><Activity size={20} /></div>
                  <div>
                    <div className="font-semibold">Environmental monitoring</div>
                    <div className="mt-0.5 text-xs text-white/75">Evidence to support timely decisions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project highlight */}
        <section id="project" className="py-18 md:py-20 px-6 bg-gradient-to-r from-blue-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-blue-900">Blue Empowerment (BE) Project</h2>
                <p className="mt-3 text-gray-600 max-w-2xl">
                  The BE Project supports climate-smart IMTA interventions to improve productivity, environmental
                  sustainability, and livelihoods for women and youth in fisheries and aquaculture.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill tone="muted" icon={<ShieldCheck size={14} />} text="Donor-ready reporting" />
                <Pill tone="muted" icon={<Lock size={14} />} text="Privacy-first" />
                <Pill tone="muted" icon={<BarChart3 size={14} />} text="Evidence for advocacy" />
              </div>
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Thermometer size={22} />}
                title="Site-specific monitoring"
                desc="Collect temperature and water-quality indicators to support weekly decisions and reduce losses."
              />
              <FeatureCard
                icon={<Bell size={22} />}
                title="Alerts & thresholds"
                desc="Configured temperature thresholds help teams identify unusual conditions early and prioritize follow-up."
              />
              <FeatureCard
                icon={<ShieldCheck size={22} />}
                title="Community ownership"
                desc="Data is stored, accessed, and governed with communities at the center."
              />
            </div>
          </div>
        </section>

        {/* IMTA */}
        <section
          id="innovation"
          className="py-18 md:py-20 px-6 bg-gradient-to-r from-blue-100 to-teal-100"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-900">Integrated Multi-Trophic Aquaculture (IMTA)</h2>
            <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
              Fish, seaweed, and marine ecosystems working together. Nutrients from fish support seaweed growth, helping
              maintain balanced waters and stronger yields.
            </p>

            <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
              <Card className="rounded-3xl shadow-lg">
                <CardContent className="p-6 space-y-3">
                  <Waves className="text-blue-900" size={34} />
                  <h3 className="font-semibold text-blue-900">Healthy Waters</h3>
                  <p className="text-sm text-gray-700">
                    Balanced systems support water quality and resilience across seasons.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-lg">
                <CardContent className="p-6 space-y-3">
                  <Droplets className="text-blue-900" size={34} />
                  <h3 className="font-semibold text-blue-900">Seaweed Growth</h3>
                  <p className="text-sm text-gray-700">
                    Seaweed benefits from nutrients, improving productivity and livelihoods.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-lg">
                <CardContent className="p-6 space-y-3">
                  <Activity className="text-blue-900" size={34} />
                  <h3 className="font-semibold text-blue-900">Data-driven Decisions</h3>
                  <p className="text-sm text-gray-700">
                    Weekly monitoring supports evidence-based actions for farmers and technical staff.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Farmer’s Link monitoring preview */}
        <section id="farmers-link" className="py-18 md:py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Monitoring overview
                </div>
                <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-[var(--bahari-blue)]">Farmer’s Link</h2>
                <p className="mt-3 max-w-2xl text-gray-600 leading-relaxed">
                  A clear view of monitoring activity across coastal sites, with temperature readings, device connectivity, and conditions that may need attention.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Pill tone="muted" icon={<Lock size={14} />} text="Role-based access" />
                <LoginDialogTrigger />
              </div>
            </div>

            <div className="mt-10 grid lg:grid-cols-3 gap-6 items-start">
              <Card className="rounded-3xl border-slate-200 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-bold text-[var(--bahari-blue)]">Network overview</div>
                      <div className="mt-1 text-sm text-gray-500">Monitoring devices across sites</div>
                    </div>
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--bahari-green-soft)] text-[var(--bahari-green)]">
                      <RadioTower size={21} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                      <div className="text-xs font-medium text-emerald-800">Reporting</div>
                      <div className="mt-1 text-2xl font-bold text-emerald-900">{stats.online}</div>
                      <div className="mt-1 text-xs text-emerald-800/80">devices</div>
                    </div>
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                      <div className="text-xs font-medium text-amber-800">Attention</div>
                      <div className="mt-1 text-2xl font-bold text-amber-900">{stats.warning}</div>
                      <div className="mt-1 text-xs text-amber-800/80">readings</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">Reporting devices</span>
                        <span className="tabular-nums text-slate-500">{stats.online} of {stats.total}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.min(100, (stats.online / Math.max(stats.total, 1)) * 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">Not reporting</span>
                        <span className="tabular-nums text-slate-500">{stats.offline} of {stats.total}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-slate-400 transition-all" style={{ width: `${Math.min(100, (stats.offline / Math.max(stats.total, 1)) * 100)}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                    <div className="flex items-center gap-2 font-semibold text-amber-900">
                      <Bell size={16} /> Conditions requiring review
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
                      {stats.warning > 0
                        ? `${stats.warning} monitoring points are outside the configured temperature range of 20–32°C.`
                        : "No monitoring points are outside the configured temperature range."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 grid md:grid-cols-2 gap-5">
                <MetricCard
                  icon={<RadioTower size={25} />}
                  label="Monitoring devices"
                  value={String(stats.total)}
                  hint="Across the monitoring network"
                />
                <MetricCard
                  icon={<Wifi size={25} />}
                  label="Reporting now"
                  value={String(stats.online)}
                  hint="Devices communicating with the system"
                />
                <MetricCard
                  icon={<Bell size={25} />}
                  label="Attention needed"
                  value={String(stats.warning)}
                  hint="Readings outside the configured range"
                />
                <MetricCard
                  icon={<Activity size={25} />}
                  label="Not reporting"
                  value={String(stats.offline)}
                  hint="Devices to check for connectivity"
                />

                <Card className="md:col-span-2 rounded-3xl border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 font-bold text-[var(--bahari-blue)]">
                          <BarChart3 size={19} /> Recent site readings
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Temperature and device activity by monitoring point</p>
                      </div>
                      <Pill tone="muted" icon={<Thermometer size={14} />} text="Temperature monitoring" />
                    </div>

                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full min-w-[720px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                            <th className="pb-3 pr-4 font-semibold">Monitoring site</th>
                            <th className="pb-3 pr-4 font-semibold">Temperature</th>
                            <th className="pb-3 pr-4 font-semibold">Signal</th>
                            <th className="pb-3 pr-4 font-semibold">Last activity</th>
                            <th className="pb-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PRESENTATION_SITES.map((site) => (
                            <tr key={site.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                              <td className="py-3.5 pr-4">
                                <div className="flex items-center gap-3">
                                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--bahari-green-soft)] text-[var(--bahari-green)]">
                                    <MapPin size={16} />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-800">{site.name}</div>
                                    <div className="mt-0.5 text-xs text-slate-500">{site.deviceId}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 pr-4 font-semibold tabular-nums text-[var(--bahari-blue)]">
                                {site.temperatureC === null ? "—" : `${site.temperatureC.toFixed(1)}°C`}
                              </td>
                              <td className="py-3.5 pr-4">
                                {site.signal === null ? (
                                  <span className="text-slate-400">—</span>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100">
                                      <div className={`h-full rounded-full ${site.signal < 70 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${site.signal}%` }} />
                                    </div>
                                    <span className="text-xs tabular-nums text-slate-500">{site.signal}%</span>
                                  </div>
                                )}
                              </td>
                              <td className="py-3.5 pr-4 whitespace-nowrap text-slate-500">
                                <span className="inline-flex items-center gap-1.5"><Clock3 size={13} /> {site.lastSeen}</span>
                              </td>
                              <td className="py-3.5">
                                <Pill tone={site.status === "Connected" ? "ok" : "warning"} text={site.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-18 md:py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-900">How it works</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Designed around field conditions: sensor readings are organized by site so farmers and technical teams can review activity and respond as connectivity allows.
            </p>

            <div className="mt-12 grid md:grid-cols-4 gap-6 text-left">
              <StepCard n="1" title="Sensors capture readings" desc="Temperature monitoring begins at participating IMTA sites." />
              <StepCard n="2" title="Readings are organized" desc="Records are associated with monitoring devices and sites." />
              <StepCard n="3" title="Teams review activity" desc="Farmers and technical staff can review site readings and device status." />
              <StepCard n="4" title="Insights support action" desc="Monitoring summaries help guide follow-up, planning, and reporting." />
            </div>
          </div>
        </section>

        {/* Partners strip */}
        <section className="py-14 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4 text-sm font-semibold text-gray-700">
              A community-centred model for coastal resilience
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["Community ownership", "Women & youth leadership", "Aquaculture livelihoods", "Technical collaboration"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-5 text-center text-sm font-semibold text-[var(--bahari-blue)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-18 md:py-20 px-6 bg-gradient-to-b from-blue-100 to-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold text-blue-900">Get in touch</h2>
              <p className="mt-4 text-gray-700">
                Partner with us to advance sustainable aquaculture and community resilience.
              </p>

              <div className="mt-8 space-y-3 text-gray-800">
                <div className="flex items-center gap-3">
                  <Phone className="text-blue-900" size={18} />
                  <a className="hover:underline" href="tel:+254712729004">0712729004</a>
                  <span className="text-gray-400">/</span>
                  <a className="hover:underline" href="tel:+254708872299">0708872299</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-900" size={18} />
                  <a className="hover:underline" href="mailto:info@baharicbo.org">info@baharicbo.org</a>
                </div>
                <div className="text-sm text-gray-600">
                  P.O. BOX 703-80400, Ukunda, Kenya
                </div>
              </div>

              <div className="mt-8 rounded-3xl border bg-white p-6">
                <div className="text-sm font-semibold text-gray-700">Community-led technology</div>
                <p className="mt-2 text-sm text-gray-600">
                  The Blue Empowerment Project brings practical aquaculture support and accessible monitoring together to help coastal communities make informed decisions.
                </p>
              </div>
            </div>

            <Card className="rounded-3xl shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="text-lg font-bold text-blue-900">Send us a message</div>
                  <div className="text-sm text-gray-600">Share a question or partnership enquiry with our team.</div>
                </div>
                <form
                  className="space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const name = String(formData.get("name") ?? "").trim();
                    const contact = String(formData.get("contact") ?? "").trim();
                    const message = String(formData.get("message") ?? "").trim();
                    const subject = encodeURIComponent(`Website enquiry from ${name}`);
                    const body = encodeURIComponent(`Name: ${name}\nContact: ${contact}\n\nMessage:\n${message}`);
                    window.location.href = `mailto:info@baharicbo.org?subject=${subject}&body=${body}`;
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input name="name" placeholder="Full name" aria-label="Full name" autoComplete="name" required />
                    <Input name="contact" placeholder="Phone or email" aria-label="Phone or email" autoComplete="email" required />
                  </div>
                  <Textarea name="message" placeholder="How can we help?" aria-label="Message" className="min-h-[120px]" required />
                  <Button type="submit" className="rounded-2xl w-full py-6 text-base">Prepare message</Button>
                </form>
                <div className="text-xs text-gray-500">
                  Your email application will open with the message ready to send.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <div className="relative h-16 w-56">
              <Image
                src="/logo-full.jpeg"
                alt="Bahari CBO Network full logo"
                fill
                className="object-contain object-left"
              />
            </div>

            <div className="text-sm text-white/80">
              Blue Empowerment (BE) Project • IMTA Monitoring
            </div>

            <div className="text-xs text-white/70">
              Bahari Yetu Maisha Yetu • Community-owned data • Privacy-first • Built for low-bandwidth access
            </div>
          </div>

          <div className="text-sm text-white/80 md:text-right space-y-2">
            <div>© {new Date().getFullYear()} Bahari CBO Network. All rights reserved.</div>
            <div className="text-xs text-white/70">
              Data generated by the monitoring system remains the property of Bahari CBO Network and participating communities.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------------- UI helpers ---------------------- */

function LoginDialogTrigger({ fullWidth }: { fullWidth?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={`rounded-2xl ${fullWidth ? "w-full" : ""}`}>
          Farmer’s Link Login
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-blue-900">Farmer’s Link</DialogTitle>
          <DialogDescription>
            Access site-specific readings, historical records, and monitoring alerts through the Farmer’s Link portal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-blue-50 p-4 text-sm text-gray-700">
            <div className="inline-flex items-center gap-2 font-semibold text-blue-900">
              <Lock size={16} /> Secure, role-based access
            </div>
            <div className="mt-2">
              The portal is designed for farmers and project teams to access the information relevant to their role.
            </div>
          </div>
          <Button
            className="w-full rounded-2xl py-6"
            onClick={() => {
              window.location.href = `${FARMER_APP_URL.replace(/\/$/, "")}/login`;
            }}
          >
            Open Farmer’s Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Pill({
  text,
  tone = "muted",
  icon,
}: {
  text: string;
  tone?: "ok" | "warning" | "muted";
  icon?: React.ReactNode;
}) {
  const cls =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-white/60 text-gray-700 border-gray-200";

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-semibold ${cls}`}>
      {icon ? <span className="opacity-90">{icon}</span> : null}
      {text}
    </span>
  );
}

function MiniStat({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border bg-white/70 p-5 text-left shadow-sm">
      <div className="font-bold text-blue-900">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
    </div>
  );
}

function FactChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-semibold text-blue-900 mt-1">{value}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="rounded-3xl shadow-lg">
      <CardContent className="p-6 space-y-3">
        <div className="text-blue-900">{icon}</div>
        <div className="font-semibold text-blue-900">{title}</div>
        <div className="text-sm text-gray-600">{desc}</div>
      </CardContent>
    </Card>
  );
}

function MetricCard({
  icon,
  label,
  value,
  status,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status?: { label: string; tone: "ok" | "warning" };
  hint?: string;
}) {
  return (
    <Card className="rounded-3xl shadow-lg hover:shadow-xl transition">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-blue-50 grid place-items-center text-blue-900">
              {icon}
            </div>
            <div>
              <div className="font-semibold text-gray-700">{label}</div>
              {hint ? <div className="text-xs text-gray-500">{hint}</div> : null}
            </div>
          </div>

          {status ? <Pill tone={status.tone} text={status.label} /> : null}
        </div>

        <div className="text-3xl font-extrabold text-blue-900">{value}</div>
      </CardContent>
    </Card>
  );
}

function StepCard({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <Card className="rounded-3xl shadow-lg">
      <CardContent className="p-6 space-y-3">
        <div className="inline-flex items-center justify-center h-9 w-9 rounded-2xl bg-blue-900 text-white font-bold">
          {n}
        </div>
        <div className="font-semibold text-blue-900">{title}</div>
        <div className="text-sm text-gray-600">{desc}</div>
      </CardContent>
    </Card>
  );
}