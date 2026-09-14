"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowDownToLine,
  Braces,
  Check,
  ChevronRight,
  CircleHelp,
  FileWarning,
  FlaskConical,
  Layers3,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Waypoints,
  Sliders,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  evaluateScenario,
  optimizeMitigations,
  percentage,
  scenario,
  statusForAsset,
  type PayloadMode,
} from "@/features/scenario/evaluator";
import { DependencyMap } from "@/features/scenario/DependencyMap";

const statusTone = {
  exposed: {
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    dot: "bg-rose-400",
    label: "Exposed",
  },
  unknown: {
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-400",
    label: "Unknown Gate",
  },
  "not-reached": {
    badge: "border-teal-500/30 bg-teal-500/10 text-teal-300",
    dot: "bg-teal-400",
    label: "Not Reached",
  },
};

export default function DemoPage() {
  const [mode, setMode] = useState<PayloadMode>("runtime");
  const [scriptsDisabled, setScriptsDisabled] = useState(true);
  const [budget, setBudget] = useState(0);

  const base = useMemo(
    () => evaluateScenario({ mode, scriptsDisabled }),
    [mode, scriptsDisabled]
  );
  const plan = useMemo(
    () => optimizeMitigations(budget, mode, scriptsDisabled),
    [budget, mode, scriptsDisabled]
  );

  const [selectedId, setSelectedId] = useState(scenario.assets[0].asset_id);
  const selected =
    (budget ? plan.result : base).assets.find(
      (item) => item.asset.asset_id === selectedId
    ) ?? base.assets[0];

  const result = budget ? plan.result : base;

  const exportReport = () => {
    const report = [
      "RippleGuard — Synthetic Scenario Report",
      "=======================================",
      scenario.disclaimer,
      "",
      `Payload Mode: ${mode}`,
      `Billing Lifecycle Scripts Disabled: ${scriptsDisabled}`,
      `Exposure Bound: ${result.lowerWeight}/${result.totalWeight} lower (${percentage(result.lowerWeight, result.totalWeight)}); ${result.upperWeight}/${result.totalWeight} upper (${percentage(result.upperWeight, result.totalWeight)})`,
      `Effort Budget: ${budget} pts; Selected Plan Cost: ${plan.cost} pts`,
      "",
      "Selected Mitigations:",
      ...plan.controls.map(
        (control) => `- ${control.label} (${control.cost} pts effort): ${control.assumptions[0]}`
      ),
      "",
      "Asset Evaluation:",
      ...result.assets.map((reach) => {
        const s = statusForAsset(reach);
        return `- ${reach.asset.name} (${reach.asset.environment}, wt ${reach.asset.weight}): ${s.toUpperCase()} (paths: ${reach.paths.length})`;
      }),
      "",
      "This report contains deterministic synthetic fixture results only. Not a live scan.",
    ].join("\n");

    const url = URL.createObjectURL(new Blob([report], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rippleguard-scenario-report.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const selectedStatus = statusForAsset(selected);

  return (
    <div className="min-h-screen bg-navy-950 pb-20 text-slate-100">
      {/* Synthetic Disclaimer Banner */}
      <div className="border-b border-teal-500/20 bg-teal-500/10 px-4 py-2 text-center text-xs text-teal-300">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <FlaskConical className="h-4 w-4 shrink-0 text-teal-400" />
          <span className="font-bold">Synthetic Scenario Lab:</span>
          <span className="text-slate-300">
            Running from immutable fixture topology. No production dependencies are executed or altered.
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 transition-colors mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Overview</span>
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interactive Experimentation Sandbox</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Scenario Analysis Lab
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl">
              Switch attack assumptions, observe downstream reachability, and optimize preventative
              controls within an engineering effort budget.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportReport}
              className="btn-secondary !text-xs !py-2.5 !px-4"
              title="Download text report"
            >
              <ArrowDownToLine className="h-4 w-4" />
              <span>Export Report</span>
            </button>
            <Link href="/signup" className="btn-primary !text-xs !py-2.5 !px-4">
              <span>Analyze Your App</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Control Deck (Payload Switcher, Lifecycle Script Gate, Exposure Metric) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border border-navy-700/80 bg-navy-900/80 p-5 backdrop-blur-xl mb-8">
          {/* 1. Payload Mode */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 block">
              1. Attack Payload Assumption
            </label>
            <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-navy-950 p-1 border border-navy-800">
              <button
                onClick={() => setMode("runtime")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  mode === "runtime"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Runtime Attack
              </button>
              <button
                onClick={() => setMode("install")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  mode === "install"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Install-Script Only
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {mode === "runtime"
                ? "Malicious runtime code bypasses build-only safeguards."
                : "Simulation restricted to npm pre/postinstall execution."}
            </p>
          </div>

          {/* 2. Billing Lifecycle Script Gate */}
          <div className="space-y-2 md:border-l md:border-navy-800 md:pl-5">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 block">
              2. Billing Lifecycle Script Gate
            </label>
            <button
              disabled={mode === "runtime"}
              onClick={() => setScriptsDisabled(!scriptsDisabled)}
              className={`w-full py-2 px-3 rounded-xl border flex items-center justify-between transition-all ${
                scriptsDisabled
                  ? "border-teal-500/40 bg-teal-500/10 text-teal-300"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-300"
              } ${mode === "runtime" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="text-xs font-semibold">
                {scriptsDisabled ? "Scripts Disabled (--ignore-scripts)" : "Scripts Enabled (Unsafe)"}
              </span>
              <span className={`h-2.5 w-2.5 rounded-full ${scriptsDisabled ? "bg-teal-400" : "bg-rose-400 animate-pulse"}`} />
            </button>
            <p className="text-[11px] text-slate-500 leading-tight">
              {mode === "runtime"
                ? "Disabled: Runtime execution is unaffected by build script toggles."
                : "Toggling alters install-script reachability for billing-api."}
            </p>
          </div>

          {/* 3. Real-time Exposure Metric */}
          <div className="space-y-2 md:border-l md:border-navy-800 md:pl-5">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 block">
              3. Weighted Blast-Radius
            </label>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-extrabold text-white">
                {percentage(result.lowerWeight, result.totalWeight)} – {percentage(result.upperWeight, result.totalWeight)}
              </span>
              <span className="text-xs font-mono text-slate-400">
                ({result.lowerWeight} to {result.upperWeight} / {result.totalWeight} pts)
              </span>
            </div>
            <div className="w-full bg-navy-950 h-2 rounded-full overflow-hidden border border-navy-800">
              <div
                className="bg-gradient-to-r from-rose-500 to-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: percentage(result.upperWeight, result.totalWeight) }}
              />
            </div>
          </div>
        </div>

        {/* Visual Topology & Asset Reachability Explorer */}
        <div className="space-y-6">
          <DependencyMap
            result={result}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Selected Asset Witness Routes & Gate Evidence */}
        <div className="mt-8 rounded-2xl border border-navy-700/80 bg-navy-900/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-navy-800 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Declared Dependency Witness Routes</span>
                <span className="text-teal-400 font-mono text-xs">({selected.asset.name})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Target environment: <span className="text-slate-200 font-semibold">{selected.asset.environment}</span> · Weight: <span className="text-slate-200 font-semibold">{selected.asset.weight}</span> · Status: <span className={`font-semibold ${statusTone[selectedStatus].badge} px-2 py-0.5 rounded border`}>{statusTone[selectedStatus].label}</span>
              </p>
            </div>
          </div>

          {selected.paths.length > 0 ? (
            <div className="space-y-3">
              {selected.paths.map((path, idx) => (
                <div
                  key={path.map((edge) => edge.id).join("-")}
                  className="p-3.5 rounded-xl border border-navy-800 bg-navy-950/80 font-mono text-xs"
                >
                  <div className="flex items-center gap-2 text-teal-300 font-bold mb-1.5">
                    <span>Route #{idx + 1}:</span>
                    <span className="text-slate-400 font-normal">
                      {path.some((e) => e.gate_default === "unknown")
                        ? "Upper Bound Only (Unknown Gates Present)"
                        : "Lower & Upper Bound (All Gates Verified True)"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-slate-200">
                    <span className="text-rose-400 font-bold">{path[0].from_ref}</span>
                    {path.map((edge) => (
                      <React.Fragment key={edge.id}>
                        <ArrowRight className="h-3 w-3 text-slate-600" />
                        <span className="text-slate-300">{edge.to_ref}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-xs text-teal-300">
              No active witness route reaches {selected.asset.name} under current scenario gates and applied controls.
            </div>
          )}
        </div>

        {/* Effort-Budgeted Mitigation Optimizer Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Selector (Cols 8) */}
          <div className="lg:col-span-8 rounded-2xl border border-navy-700/80 bg-navy-900/80 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800 mb-5">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-teal-400" />
                  <span>Effort-Budgeted Mitigation Optimizer</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Slide your engineering budget to automatically discover the highest-impact repair combination.
                </p>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Engineering Effort Budget:</span>
                <span className="text-teal-300 font-bold text-sm">{budget} Story Points</span>
              </div>
              <input
                type="range"
                min="0"
                max="7"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-teal-400 border border-navy-800"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0 pts (Baseline)</span>
                <span>2 pts</span>
                <span>4 pts</span>
                <span>7 pts (Max)</span>
              </div>
            </div>

            {/* Candidate Controls List */}
            <div className="space-y-3">
              {scenario.candidate_controls.map((control) => {
                const isSelected = plan.controls.some((c) => c.id === control.id);
                return (
                  <div
                    key={control.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-teal-500/50 bg-teal-500/10 shadow-glow-teal"
                        : "border-navy-800 bg-navy-950/60 opacity-70"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center border ${
                          isSelected
                            ? "border-teal-400 bg-teal-400 text-navy-950"
                            : "border-navy-700 bg-navy-900"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{control.label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {control.assumptions[0]}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded border border-navy-700 bg-navy-900 text-slate-300 shrink-0">
                      Cost: {control.cost} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optimized Plan Summary (Cols 4) */}
          <div className="lg:col-span-4 rounded-2xl border border-navy-700/80 bg-navy-900/80 p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-teal-400 mb-4">
                <Braces className="h-5 w-5" />
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-teal-300">
                  Optimized Plan Result
                </h3>
              </div>

              <div className="p-4 rounded-xl border border-navy-800 bg-navy-950/90 space-y-3 mb-6">
                <div>
                  <span className="text-xs text-slate-400">Resulting Exposure:</span>
                  <div className="text-3xl font-mono font-bold text-white mt-1">
                    {percentage(plan.result.lowerWeight, plan.result.totalWeight)}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Upper bound: {percentage(plan.result.upperWeight, plan.result.totalWeight)}
                  </div>
                </div>

                <div className="pt-3 border-t border-navy-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Budget Allocated:</span>
                    <span className="text-slate-200">{budget} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Plan Cost:</span>
                    <span className="text-teal-400 font-bold">{plan.cost} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Selected Controls:</span>
                    <span className="text-slate-200">{plan.controls.length} applied</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-navy-800 bg-navy-950/60 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-300">Model Guarantees:</div>
              <p className="text-[11px] leading-relaxed">
                Mitigation evaluations are simulated mathematically on a scenario copy. Real project inventories and live Git repositories are never mutated.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
