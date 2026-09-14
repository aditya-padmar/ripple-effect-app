"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Shield,
  Radio,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Network,
  FileCode2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  ChevronRight,
  Terminal,
  ExternalLink,
} from "lucide-react";
import {
  evaluateScenario,
  percentage,
  type PayloadMode,
} from "@/features/scenario/evaluator";

const features = [
  {
    icon: FileCode2,
    number: "01",
    badge: "Inventory & Topology",
    title: "CycloneDX SBOM Ingestion",
    description:
      "Parse and validate standard CycloneDX 1.5/1.6 JSON software bills of materials. Preserves exact dependency graph topology and component occurrence metadata instead of a flat list.",
  },
  {
    icon: Radio,
    number: "02",
    badge: "Evidence-Based",
    title: "OSV Advisory Mapping",
    description:
      "Query Open Source Vulnerabilities (OSV.dev) with persistent TTL caching. Clearly differentiates verified security advisories from hypothetical compromise simulations.",
  },
  {
    icon: Network,
    number: "03",
    badge: "Downstream Impact",
    title: "Blast-Radius Simulation",
    description:
      "Traverse consumer-dependency relationships to measure blast radius if a package were compromised. Supports both runtime code execution and install-script lifecycle scenarios.",
  },
  {
    icon: SlidersHorizontal,
    number: "04",
    badge: "Effort Budgeting",
    title: "Mitigation Optimizer",
    description:
      "Evaluate preventative interventions (route exclusions, script controls, safe replacements) against a defined engineering effort budget to discover the optimal fix plan.",
  },
];

export default function HomePage() {
  const [mode, setMode] = useState<PayloadMode>("runtime");
  const [scriptsDisabled, setScriptsDisabled] = useState(true);

  // Evaluate the simulation dynamically
  const result = evaluateScenario({ mode, scriptsDisabled });

  return (
    <div className="relative min-h-screen bg-navy-950 text-slate-100 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="field-grid" />

      {/* Hero Glow Orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-teal-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-80 right-10 w-[400px] h-[300px] bg-rose-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-xs font-semibold text-teal-300">
                <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-ping" />
                <span>Explainable Dependency Risk Simulator</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Simulate the ripple.{" "}
                <span className="bg-gradient-to-r from-teal-300 via-teal-400 to-teal-200 bg-clip-text text-transparent">
                  Prioritize the repair.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                One shared dependency can reach across multiple production applications.
                Map the downstream blast radius, simulate attack scenarios, and prioritize 
                preventative mitigations within your engineering effort budget.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                <Link href="/demo" className="btn-primary text-sm py-3 px-6 shadow-glow-teal">
                  <Sparkles className="h-4 w-4" />
                  <span>Explore Scenario Lab</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/signup" className="btn-secondary text-sm py-3 px-6">
                  <span>Analyze Your Project</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-navy-800 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">100%</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Deterministic Evidence</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-400 tracking-tight">CycloneDX</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Standard 1.5 & 1.6</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">0</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">Code Execution Risk</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Attack-Ripple Simulation Card */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl border border-navy-700/80 bg-navy-900/85 p-6 backdrop-blur-2xl shadow-2xl overflow-hidden">
                {/* Glowing border highlight */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-navy-800">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-3 w-3 items-center justify-center rounded-full bg-rose-500/20">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                    </div>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                      Downstream Blast-Radius Simulator
                    </span>
                  </div>
                  <span className="rounded-md bg-navy-800 px-2 py-0.5 text-[11px] font-mono text-teal-300 border border-navy-700">
                    SYNTHETIC LAB
                  </span>
                </div>

                {/* Interactive Mode Selector */}
                <div className="mt-5 p-3 rounded-xl bg-navy-950/80 border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-left w-full sm:w-auto">
                    <div className="text-xs font-semibold text-slate-200">Attack Vector:</div>
                    <div className="text-[11px] text-slate-400">Toggle assumption to see score change</div>
                  </div>
                  <div className="flex rounded-lg bg-navy-900 p-1 border border-navy-700/70 w-full sm:w-auto">
                    <button
                      onClick={() => setMode("runtime")}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        mode === "runtime"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Runtime Attack
                    </button>
                    <button
                      onClick={() => setMode("install")}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        mode === "install"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Install-Script Only
                    </button>
                  </div>
                </div>

                {/* Simulation Visualization */}
                <div className="mt-6 space-y-4">
                  {/* Origin Node (Compromised Source) */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                        <Flame className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white">@shared/logger</span>
                          <span className="text-[10px] font-mono text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                            COMPROMISED
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Simulated source package (v1.2.0)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-rose-400">Origin Point</span>
                    </div>
                  </div>

                  {/* Propagation Flow Line */}
                  <div className="flex items-center justify-center py-1">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                      <span>Transitive Propagation</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>

                  {/* Downstream Assets Grid */}
                  <div className="grid grid-cols-3 gap-2.5 text-left">
                    <div className="p-3 rounded-xl border border-rose-500/25 bg-navy-950/70">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">PROD</span>
                        <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                      </div>
                      <div className="text-xs font-semibold text-white mt-1 truncate">checkout-svc</div>
                      <div className="text-[10px] text-rose-400 mt-1 font-semibold">Exposed (Wt 5)</div>
                    </div>

                    <div className="p-3 rounded-xl border border-navy-700 bg-navy-950/70">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">INTERNAL</span>
                        <span className={`h-2 w-2 rounded-full ${mode === "runtime" ? "bg-rose-400" : "bg-teal-400"}`} />
                      </div>
                      <div className="text-xs font-semibold text-white mt-1 truncate">billing-api</div>
                      <div className={`text-[10px] mt-1 font-semibold ${mode === "runtime" ? "text-rose-400" : "text-teal-400"}`}>
                        {mode === "runtime" ? "Exposed (Wt 4)" : "Protected (Wt 4)"}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-navy-700 bg-navy-950/70">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">STAGING</span>
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                      </div>
                      <div className="text-xs font-semibold text-white mt-1 truncate">docs-site</div>
                      <div className="text-[10px] text-amber-300 mt-1 font-semibold">Unknown (Wt 1)</div>
                    </div>
                  </div>
                </div>

                {/* Real-time Dynamic Gauge Output */}
                <div className="mt-5 pt-4 border-t border-navy-800 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs text-slate-400 font-medium">Modeled Exposure:</span>
                    <div className="text-lg font-mono font-bold text-white">
                      {result.lowerWeight} / {result.totalWeight} assets ({percentage(result.lowerWeight, result.totalWeight)})
                    </div>
                  </div>
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    <span>Inspect Full Graph</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="relative py-20 border-t border-navy-800 bg-navy-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest">
              Core Capabilities
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              From Dependency Inventory to Verified Repair
            </p>
            <p className="mt-3 text-sm text-slate-400">
              RippleGuard replaces vague vulnerability counters with mathematical path reachability
              and bounded scenario evaluation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.number}
                  className="glass-card-hover p-6 flex flex-col justify-between text-left group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 group-hover:scale-105 group-hover:border-teal-400/40 transition-all">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-teal-400/80 transition-colors">
                        {feat.number}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                      {feat.badge}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-navy-850 flex items-center text-[11px] font-semibold text-slate-400 group-hover:text-teal-300 transition-colors">
                    <span>Learn how it works</span>
                    <ArrowRight className="h-3 w-3 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY STATIC SCANNERS FALL SHORT */}
      <section className="relative py-20 border-t border-navy-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-navy-700/80 bg-gradient-to-br from-navy-900/90 via-navy-900/60 to-navy-950 p-8 sm:p-12 backdrop-blur-xl">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 text-left">
                <span className="badge-teal">Reachability vs Presence</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Don&apos;t just count alerts. Understand downstream exposure.
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Traditional software scanners flood developers with hundreds of CVE warnings without
                  knowing whether the code is actually reachable or which business services could be impacted.
                  RippleGuard provides:
                </p>
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300">
                      <strong>Explicit Lower & Upper Bounds:</strong> Account for unknown execution paths instead of guessing.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300">
                      <strong>Multi-Application Asset Scope:</strong> Trace packages across staging, internal, and production workloads.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300">
                      <strong>Effort-Budgeted Plan:</strong> Find the highest-return mitigations within your team&apos;s sprint capacity.
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
                <div className="w-full max-w-sm rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/20 text-teal-300 mx-auto">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Experience the Public Lab</h3>
                  <p className="text-xs text-slate-400">
                    Try the pre-loaded synthetic multi-app scenario. No sign up or API keys required.
                  </p>
                  <Link href="/demo" className="btn-primary w-full text-xs py-2.5">
                    <span>Launch Synthetic Demo</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-navy-800 bg-navy-950 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-teal-400" />
            <span className="text-sm font-bold text-white">RippleGuard</span>
            <span className="text-xs text-slate-500 font-mono">— Explainable by design.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/demo" className="hover:text-teal-300 transition-colors">
              Synthetic Demo
            </Link>
            <Link href="/dashboard" className="hover:text-teal-300 transition-colors">
              Workspace
            </Link>
            <a
              href="https://github.com/aditya-padmar/ripple-effect-app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
