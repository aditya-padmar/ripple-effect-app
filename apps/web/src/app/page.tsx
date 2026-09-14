"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileJson2,
  GitBranch,
  Github,
  LockKeyhole,
  Network,
  Radar,
  ScanLine,
  Shield,
  SlidersHorizontal,
} from "lucide-react";
import { DependencyMap } from "@/features/scenario/DependencyMap";
import {
  evaluateScenario,
  percentage,
  scenario,
  type PayloadMode,
} from "@/features/scenario/evaluator";

const features = [
  {
    icon: FileJson2,
    number: "01",
    category: "Understand your inventory",
    title: "SBOM (CycloneDX) Ingestion",
    description:
      "Bring components, versions, and declared dependency relationships into one inspectable model. Preserve occurrence context—not just a list of package names.",
    detail: "From inventory to topology",
  },
  {
    icon: ScanLine,
    number: "02",
    category: "Ground risk in evidence",
    title: "OSV Advisory Mapping",
    description:
      "Connect package versions to published advisory evidence. Keep known vulnerabilities separate from unknown status and hypothetical compromise scenarios.",
    detail: "Evidence, not assumptions",
  },
  {
    icon: Network,
    number: "03",
    category: "Follow the downstream impact",
    title: "Blast-Radius Simulation",
    description:
      "Trace the assets a compromised dependency could reach. Compare runtime and install-script assumptions, with explicit lower and upper exposure bounds.",
    detail: "Every path tells you why",
  },
  {
    icon: SlidersHorizontal,
    number: "04",
    category: "Make the next repair count",
    title: "Effort-Budgeted Mitigation",
    description:
      "Compare route exclusions, environment controls, and package replacement against your engineering budget. Find a feasible plan and inspect what remains exposed.",
    detail: "Impact reduced. Effort accounted for.",
  },
];

export default function HomePage() {
  const [mode, setMode] = useState<PayloadMode>("runtime");
  // Fixed and visible preview assumption: disabled Billing lifecycle scripts.
  // That blocks install-time exposure only, never a runtime payload.
  const result = evaluateScenario({ mode, scriptsDisabled: true });

  return (
    <div className="flex-1 overflow-hidden">
      <section className="landing-hero relative" aria-labelledby="hero-heading">
        <div className="field-grid" aria-hidden="true" />
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1360px] gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-10 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="max-w-xl">
            <div className="eyebrow-pill">
              <Radar className="h-3.5 w-3.5" /> Explainable dependency risk
            </div>
            <h1
              id="hero-heading"
              className="mt-7 text-5xl font-semibold leading-[1.04] tracking-[-.055em] text-white sm:text-6xl xl:text-[76px]"
            >
              Simulate the ripple.
              <br />
              <span className="text-teal-300">
                Prioritize
                <br className="hidden xl:block" /> the repair.
              </span>
            </h1>
            <p className="mt-6 max-w-[440px] text-base leading-7 text-slate-300 sm:text-lg">
              One dependency can reach far beyond one app. See the downstream
              impact, understand the uncertainty, and put your engineering
              effort where it matters.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/demo" className="button-primary justify-center">
                Try Synthetic Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/signup" className="button-secondary justify-center">
                Analyze Your Project <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-slate-400">
              <Check className="h-4 w-4 text-teal-300" /> No signup for the
              demo. No packages executed.
            </p>
            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-700/60 pt-5 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400">
              <span className="flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5" /> Path-level reasoning
              </span>
              <span className="flex items-center gap-1.5">
                <LockKeyhole className="h-3.5 w-3.5" /> Private workspace
              </span>
            </div>
          </div>

          <div className="hero-console min-w-0">
            <div className="console-top">
              <div>
                <p className="eyebrow">Impact preview / 001</p>
                <h2 className="!font-sans !text-base">
                  One source. {scenario.assets.length} asset contexts.
                </h2>
              </div>
              <span className="fixture-badge !border-amber-400/30 !bg-amber-500/10 !text-amber-200">
                Synthetic
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-1 pt-4">
              <div
                className="segmented"
                role="group"
                aria-label="Preview payload mode"
              >
                <button
                  aria-pressed={mode === "runtime"}
                  onClick={() => setMode("runtime")}
                >
                  Runtime Attack
                </button>
                <button
                  aria-pressed={mode === "install"}
                  onClick={() => setMode("install")}
                >
                  Install-script Only
                </button>
              </div>
              <span className="text-[10px] text-slate-400">
                Change the assumption ↗
              </span>
            </div>
            <div className="px-2 pt-2 sm:px-3">
              <DependencyMap result={result} compact />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 px-5 pb-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <i className="dot exposed" /> Modeled exposure
              </span>
              <span className="flex items-center gap-1.5">
                <i className="dot unknown" /> Unknown path
              </span>
              <span className="flex items-center gap-1.5">
                <i className="dot bg-slate-400" /> Not reached
              </span>
            </div>
            <div
              className="console-result !mx-5 !mt-1"
              aria-live="polite"
              aria-atomic="true"
            >
              <div>
                <span>Weighted blast radius · lower–upper</span>
                <strong>
                  {percentage(result.lowerWeight, result.totalWeight)}–
                  {percentage(result.upperWeight, result.totalWeight)}
                </strong>
                <small>
                  {result.lowerWeight}/{result.totalWeight} definite ·{" "}
                  {result.upperWeight}/{result.totalWeight} including unknown
                  gates
                </small>
              </div>
              <div className="text-right">
                <span>Payload</span>
                <b className="mt-1 block text-xs font-semibold text-teal-200">
                  {mode === "runtime" ? "Runtime" : "Install script"}
                </b>
              </div>
            </div>
            <p className="console-foot !px-5">
              <b className="font-medium text-slate-300">
                Assumption: Billing lifecycle scripts are disabled.
              </b>{" "}
              {mode === "runtime"
                ? "That does not block runtime exposure."
                : "Billing’s weight 4 is excluded from this install-only scenario."}{" "}
              Synthetic scenario—not a real scan.
            </p>
          </div>
        </div>
      </section>

      <section
        className="border-y border-navy-800/80 bg-navy-900/25"
        aria-label="Modeling principles"
      >
        <div className="mx-auto grid max-w-[1360px] gap-px px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="signal-stat">
            <b>Uncertainty stays visible.</b>
            <span>Lower and upper bounds, not a false sense of certainty.</span>
          </div>
          <div className="signal-stat">
            <b>Every route is explainable.</b>
            <span>
              Follow declared relationships from source to affected asset.
            </span>
          </div>
          <div className="signal-stat">
            <b>Repairs have a real constraint.</b>
            <span>
              Compare potential impact against the effort you can spend.
            </span>
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-[1360px] px-4 py-20 sm:px-6 lg:px-8"
        aria-labelledby="capabilities-heading"
      >
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow">From dependency to decision</p>
            <h2
              id="capabilities-heading"
              className="mt-3 text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl"
            >
              Less guesswork.
              <br />A clearer path to repair.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-400">
            Inventory, evidence, impact, and action—connected in a workflow that
            keeps its assumptions in view.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {features.map(({ icon: Icon, ...feature }) => (
            <article
              key={feature.number}
              className="capability-panel group !min-h-[240px]"
            >
              <div className="capability-icon">
                <Icon />
              </div>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow">{feature.category}</p>
                  <span className="font-mono text-xs text-slate-500">
                    {feature.number}
                  </span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="mt-5 flex items-center gap-2 border-t border-slate-700/50 pt-4 text-[11px] font-medium text-teal-200">
                  <ArrowRight className="h-3 w-3" /> {feature.detail}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="callout-panel mx-auto max-w-[1360px]">
          <div>
            <p className="eyebrow text-teal-200">Built to be questioned</p>
            <h2>
              Don’t just see the score.
              <br />
              See what’s behind it.
            </h2>
            <p>
              Explore an inspectable synthetic model before bringing your own
              inventory. No signup, no live scan, and no hidden assumptions.
            </p>
          </div>
          <Link href="/demo" className="button-primary shrink-0">
            Explore the scenario lab <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <footer className="border-t border-navy-800 px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Shield className="h-4 w-4 text-teal-300" /> RippleGuard
            <span className="ml-2 text-xs font-normal text-slate-400">
              Explainable by design.
            </span>
          </div>
          <a
            href="https://github.com/aditya-padmar/ripple-effect-app"
            target="_blank"
            rel="noopener noreferrer"
            className="quiet-link flex items-center gap-2 text-xs"
          >
            <Github className="h-4 w-4" /> Explore the source{" "}
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
