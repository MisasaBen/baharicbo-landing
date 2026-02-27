"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// If you have these shadcn components, keep them.
// If not, you can replace Dialog/Select/Input/Textarea with your own HTML.
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Activity,
  BarChart3,
  Bell,
  Droplets,
  Lock,
  Mail,
  Menu,
  Phone,
  ShieldCheck,
  Thermometer,
  Waves,
  X,
} from "lucide-react";

/**
 * Dummy/offline-first-ready landing page structure.
 * - Correct naming: Bahari CBO Network + Blue Empowerment (BE) Project
 * - Adds Farmer’s Link preview + dummy login modal
 * - Adds contact details, partners strip, privacy/community data note
 * - Adds simple “dashboard-ish” preview (site selector, status pills, trend placeholder)
 */

type Metrics = {
  temperatureC: number;
  ph: number;
  salinityPpt: number;
  turbidityNtu: number;
  lastUpdated: string;
  apiMode: "Mock" | "Live";
  site: string;
};

const MOCK_SITES = [
  { id: "imta-cage-1", label: "IMTA Cage 1" },
  { id: "imta-cage-2", label: "IMTA Cage 2" },
  { id: "seaweed-line-a", label: "Seaweed Line A" },
];

function formatTemp(c: number) {
  return `${c.toFixed(1)}°C`;
}

function getTempStatus(c: number) {
  // Dummy thresholds; adjust later with real agronomic guidance.
  if (c < 24 || c > 31) return { label: "Attention", tone: "warning" as const };
  return { label: "Normal", tone: "ok" as const };
}

function getPhStatus(ph: number) {
  if (ph < 7.2 || ph > 8.6) return { label: "Attention", tone: "warning" as const };
  return { label: "Normal", tone: "ok" as const };
}

function getTurbidityStatus(ntu: number) {
  if (ntu > 10) return { label: "Attention", tone: "warning" as const };
  return { label: "Normal", tone: "ok" as const };
}

function getSalinityStatus(ppt: number) {
  if (ppt < 28 || ppt > 38) return { label: "Attention", tone: "warning" as const };
  return { label: "Normal", tone: "ok" as const };
}

// Later: swap this for a real API call to Wireless Planet / your backend.
async function fetchMetrics(siteId: string): Promise<Omit<Metrics, "lastUpdated">> {
  // Mock values that vary slightly by site:
  const base = siteId === "imta-cage-2" ? 0.6 : siteId === "seaweed-line-a" ? -0.4 : 0;
  return {
    temperatureC: 27.4 + base,
    ph: 7.9 + base * 0.05,
    salinityPpt: 33 + base * 0.4,
    turbidityNtu: 4 + Math.abs(base) * 0.6,
    apiMode: "Mock",
    site: siteId,
  };
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(MOCK_SITES[0].id);

  const [data, setData] = useState<Metrics>({
    temperatureC: 27.4,
    ph: 7.9,
    salinityPpt: 33,
    turbidityNtu: 4,
    lastUpdated: "Just now",
    apiMode: "Mock",
    site: MOCK_SITES[0].id,
  });

  // Prevent background scrolling when mobile nav is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Refresh mock data periodically (placeholder for real polling)
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const m = await fetchMetrics(selectedSite);
      if (!isMounted) return;
      setData({
        ...m,
        lastUpdated: "Just now",
      });
    };

    load();

    const interval = setInterval(async () => {
      const m = await fetchMetrics(selectedSite);
      if (!isMounted) return;
      setData((prev) => ({
        ...prev,
        ...m,
        lastUpdated: "Just now",
      }));
    }, 300000); // 5 mins (change later)

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedSite]);

  const tempStatus = useMemo(() => getTempStatus(data.temperatureC), [data.temperatureC]);
  const phStatus = useMemo(() => getPhStatus(data.ph), [data.ph]);
  const salStatus = useMemo(() => getSalinityStatus(data.salinityPpt), [data.salinityPpt]);
  const turbStatus = useMemo(() => getTurbidityStatus(data.turbidityNtu), [data.turbidityNtu]);

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
      <div className="bg-blue-900 text-white">
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
            <div className="h-10 w-10 rounded-2xl bg-blue-700 text-white grid place-items-center font-bold">
              B
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold text-blue-800">Bahari CBO Network</div>
              <div className="text-xs text-gray-500">Blue Empowerment (BE) • IMTA Monitoring</div>
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

            <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 leading-tight">
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
              <MiniStat title="Offline-first" desc="Works even when internet is unstable" />
              <MiniStat title="Secure access" desc="Role-based portals: Farmers, Tech, Admin" />
              <MiniStat title="Expandable" desc="Ready for alerts, reports, and automation" />
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

            <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-3xl h-72 md:h-80 flex flex-col items-center justify-center text-blue-900 font-semibold border">
              <div className="text-sm opacity-70">Media placeholder</div>
              <div className="text-lg mt-2">Coastal IMTA Cage / Seaweed</div>
              <div className="text-xs mt-2 opacity-70">Replace with approved project photos later</div>
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
                desc="Prepare for SMS/WhatsApp alerts when conditions go outside safe ranges (Phase 2)."
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

        {/* Farmer’s Link (dashboard teaser) */}
        <section id="farmers-link" className="py-18 md:py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-blue-900">Farmer’s Link</h2>
                <p className="mt-3 text-gray-600 max-w-2xl">
                  A simple, secure dashboard for farmers and project teams. For now, this is a preview using mock data —
                  built to plug into the live IoT system after approval.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Pill
                  tone={data.apiMode === "Live" ? "ok" : "muted"}
                  icon={<BarChart3 size={14} />}
                  text={`API: ${data.apiMode}`}
                />
                <Pill tone="muted" icon={<Lock size={14} />} text="Role-based access" />
                <LoginDialogTrigger />
              </div>
            </div>

            <div className="mt-10 grid lg:grid-cols-3 gap-6">
              {/* Left: selector + alerts preview */}
              <Card className="rounded-3xl shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">Monitoring site</div>
                    <Select value={selectedSite} onValueChange={setSelectedSite}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_SITES.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-gray-500">Last updated: {data.lastUpdated}</div>
                  </div>

                  <div className="rounded-2xl border bg-blue-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 font-semibold text-blue-900">
                        <Bell size={16} />
                        Alerts
                      </div>
                      <span className="text-xs text-gray-600">Preview</span>
                    </div>

                    <div className="text-sm text-gray-700">
                      No active alerts (mock).
                    </div>

                    <div className="text-xs text-gray-500">
                      Phase 2: thresholds + SMS/WhatsApp alerts.
                    </div>
                  </div>

                  <div className="rounded-2xl border p-4 space-y-2">
                    <div className="text-sm font-semibold text-gray-700">User roles</div>
                    <div className="flex flex-wrap gap-2">
                      <Pill tone="muted" text="Farmers" />
                      <Pill tone="muted" text="Technical Staff" />
                      <Pill tone="muted" text="Admin" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Middle: metrics */}
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                <MetricCard
                  icon={<Thermometer size={28} />}
                  label="Temperature"
                  value={formatTemp(data.temperatureC)}
                  status={tempStatus}
                  hint="Key for fish & seaweed decisions"
                />
                <MetricCard
                  icon={<Droplets size={28} />}
                  label="pH"
                  value={data.ph.toFixed(2)}
                  status={phStatus}
                  hint="Water balance indicator"
                />
                <MetricCard
                  icon={<Waves size={28} />}
                  label="Salinity"
                  value={`${data.salinityPpt.toFixed(1)} ppt`}
                  status={salStatus}
                  hint="Tracks salt concentration"
                />
                <MetricCard
                  icon={<Activity size={28} />}
                  label="Turbidity"
                  value={`${data.turbidityNtu.toFixed(1)} NTU`}
                  status={turbStatus}
                  hint="Water clarity indicator"
                />

                <Card className="md:col-span-2 rounded-3xl shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 font-semibold text-blue-900">
                        <BarChart3 size={18} />
                        Weekly trend (preview)
                      </div>
                      <span className="text-xs text-gray-500">Placeholder chart</span>
                    </div>
                    <TrendPlaceholder />
                    <div className="text-xs text-gray-500">
                      Phase 2: real charts from IoT records + exportable reports.
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
              Designed for reliability: the system can store and display records locally, and sync when internet is available.
            </p>

            <div className="mt-12 grid md:grid-cols-4 gap-6 text-left">
              <StepCard n="1" title="Sensors read water" desc="Temperature, pH, salinity, turbidity at IMTA sites." />
              <StepCard n="2" title="Data is recorded" desc="Stored continuously (offline-first design)." />
              <StepCard n="3" title="Dashboard displays" desc="Farmers and staff view records on phones/laptops." />
              <StepCard n="4" title="Optional sync & reports" desc="Upload summaries weekly and generate donor-ready outputs." />
            </div>
          </div>
        </section>

        {/* Partners strip */}
        <section className="py-14 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-sm font-semibold text-gray-700 mb-4">
              In collaboration with (placeholders)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["KIRDI", "KMFRI", "Kenyatta University", "Other Partners"].map((p) => (
                <div
                  key={p}
                  className="rounded-2xl border bg-gray-50 py-4 px-4 text-center text-gray-700 font-semibold"
                >
                  {p}
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
                <div className="text-sm font-semibold text-gray-700">Quick note</div>
                <p className="mt-2 text-sm text-gray-600">
                  This page is a Phase 1 dummy prototype. After approval, we’ll connect the dashboard to real sensor data,
                  add secure logins, and implement alerts and reporting.
                </p>
              </div>
            </div>

            <Card className="rounded-3xl shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="text-lg font-bold text-blue-900">Contact form (dummy)</div>
                  <div className="text-sm text-gray-600">Submissions can be wired to email or CRM later.</div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input placeholder="Full name" aria-label="Full name" />
                  <Input placeholder="Phone or email" aria-label="Phone or email" />
                </div>
                <Textarea placeholder="Message" aria-label="Message" className="min-h-[120px]" />
                <Button className="rounded-2xl w-full py-6 text-base">Send message</Button>
                <div className="text-xs text-gray-500">
                  By contacting us, you agree to responsible handling of your information.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-2">
            <div className="font-bold text-lg">Bahari CBO Network</div>
            <div className="text-sm text-white/80">
              Blue Empowerment (BE) Project • IMTA Monitoring
            </div>
            <div className="text-xs text-white/70">
              Community-owned data • Privacy-first • Built for low-bandwidth access
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
          <DialogTitle className="text-blue-900">Farmer’s Link Login (Dummy)</DialogTitle>
          <DialogDescription>
            This is a prototype. After approval, we’ll add secure logins for Farmers, Technical Staff, and Admin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input placeholder="Username / Phone" aria-label="Username or phone" />
            <Input placeholder="Password" aria-label="Password" type="password" />
          </div>
          <Button className="rounded-2xl w-full py-6">Sign in</Button>

          <div className="rounded-2xl border bg-blue-50 p-4 text-sm text-gray-700">
            <div className="font-semibold text-blue-900 inline-flex items-center gap-2">
              <Lock size={16} /> Security note
            </div>
            <div className="mt-2">
              Phase 2 includes role-based access, audit logs, and privacy controls aligned to community-owned data governance.
            </div>
          </div>
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
  status: { label: string; tone: "ok" | "warning" };
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

          <Pill
            tone={status.tone}
            text={status.label}
          />
        </div>

        <div className="text-3xl font-extrabold text-blue-900">{value}</div>
      </CardContent>
    </Card>
  );
}

function TrendPlaceholder() {
  // simple, lightweight “chart” placeholder
  const bars = [35, 55, 45, 70, 60, 50, 65];
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-end gap-2 h-24">
        {bars.map((h, i) => (
          <div key={i} className="flex-1">
            <div
              className="w-full rounded-xl bg-blue-200"
              style={{ height: `${h}%` }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>
    </div>
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