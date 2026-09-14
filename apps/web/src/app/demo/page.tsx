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

const statusStyle = {
  exposed: "border-rose-400/35 bg-rose-500/10 text-rose-200",
  unknown: "border-amber-400/35 bg-amber-500/10 text-amber-100",
  "not-reached": "border-teal-400/25 bg-teal-500/5 text-teal-100",
};

export default function DemoPage() {
  const [mode, setMode] = useState<PayloadMode>("runtime");
  const [scriptsDisabled, setScriptsDisabled] = useState(true);
  const [budget, setBudget] = useState(0);
  const base = useMemo(
    () => evaluateScenario({ mode, scriptsDisabled }),
    [mode, scriptsDisabled],
  );
  const plan = useMemo(
    () => optimizeMitigations(budget, mode, scriptsDisabled),
    [budget, mode, scriptsDisabled],
  );
  const [selectedId, setSelectedId] = useState(scenario.assets[0].asset_id);
  const selected =
    (budget ? plan.result : base).assets.find(
      (item) => item.asset.asset_id === selectedId,
    ) ?? base.assets[0];
  const result = budget ? plan.result : base;
  const exportReport = () => {
    const report = [
      "RippleGuard — synthetic scenario report",
      scenario.disclaimer,
      `Mode: ${mode}`,
      `Billing lifecycle scripts disabled: ${scriptsDisabled}`,
      `Exposure: ${result.lowerWeight}/${result.totalWeight} lower; ${result.upperWeight}/${result.totalWeight} upper`,
      `Budget: ${budget}; selected cost: ${plan.cost}`,
      "Controls:",
      ...plan.controls.map(
        (control) => `- ${control.label} (${control.cost} effort)`,
      ),
      "",
      "This report contains deterministic fixture results only; it is not a scan or advisory.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rippleguard-synthetic-report.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const changeMode = (next: PayloadMode) => {
    setMode(next);
  };

  return (
    <div className="flex-1 bg-navy-950">
      <div className="synthetic-banner">
        <FlaskConical className="h-4 w-4" />{" "}
        <strong>Synthetic scenario — not a real scan.</strong>
        <span>
          Fixture-only paths, weights, and hypothetical advisory context. No
          external calls.
        </span>
      </div>
      <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Link
              href="/"
              className="quiet-link mb-3 inline-flex items-center gap-1.5 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Observatory
            </Link>
            <p className="eyebrow">Public fixture laboratory</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-.035em] text-white sm:text-4xl">
              The scenario lab<span className="text-teal-300">.</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Change the payload. Follow the impact. Find the repair that fits
              your budget.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportReport} className="button-secondary">
              <ArrowDownToLine className="h-4 w-4" /> Export fixture report
            </button>
            <Link href="/signup" className="button-primary">
              Analyze your project <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section
          className="lab-controls"
          aria-label="Synthetic scenario controls"
        >
          <div>
            <p className="control-label">Payload assumption</p>
            <div className="segmented" role="group" aria-label="Payload mode">
              <button
                aria-pressed={mode === "runtime"}
                onClick={() => changeMode("runtime")}
              >
                Runtime Attack
              </button>
              <button
                aria-pressed={mode === "install"}
                onClick={() => changeMode("install")}
              >
                Install-script Only
              </button>
            </div>
          </div>
          <div className="border-t border-navy-700/70 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <p className="control-label">Billing lifecycle scripts</p>
            <button
              disabled={mode === "runtime"}
              aria-pressed={scriptsDisabled}
              onClick={() => setScriptsDisabled(!scriptsDisabled)}
              className="switch-row"
            >
              <span className={`switch-dot ${scriptsDisabled ? "on" : ""}`} />{" "}
              {scriptsDisabled ? "Disabled" : "Enabled"}
            </button>
            <p className="mt-1.5 text-[11px] text-slate-400">
              {mode === "runtime"
                ? "Runtime does not depend on lifecycle scripts."
                : "Only blocks Billing’s fixture install-script path."}
            </p>
          </div>
          <div className="border-t border-navy-700/70 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <p className="control-label">Weighted exposure</p>
            <div className="flex items-end gap-2">
              <strong
                className="text-2xl tracking-tight text-white"
                aria-live="polite"
                aria-atomic="true"
              >
                {percentage(result.lowerWeight, result.totalWeight)}–
                {percentage(result.upperWeight, result.totalWeight)}
              </strong>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              lower {result.lowerWeight}/{result.totalWeight} · upper{" "}
              {result.upperWeight}/{result.totalWeight}
            </p>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
          <section className="workspace-panel p-4 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="eyebrow">Propagation map</p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  Selected route: {selected.asset.name}
                </h2>
              </div>
              <div className="legend">
                <span>
                  <i className="dot exposed" /> Exposed
                </span>
                <span>
                  <i className="dot unknown" /> Unknown gate
                </span>
                <span>
                  <i className="dot bg-slate-400" /> Not reached
                </span>
              </div>
            </div>
            <DependencyMap
              selectedId={selectedId}
              result={result}
              onSelect={setSelectedId}
            />
            <p className="mt-3 text-xs leading-5 text-slate-400">
              Impact flows left to right; bright lines highlight the selected
              asset’s active paths. Muted lines retain inventory context.
              Checkout has two routes:{" "}
              <b className="font-medium text-slate-300">shared-http</b> and{" "}
              <b className="font-medium text-slate-300">auth-helper</b>. The
              same auth-helper occurrence also connects Admin. Amber dashed
              links are documentation gates: included only in the upper bound.
            </p>
            <section
              className="mt-4 rounded-xl border border-slate-700/60 bg-navy-950/60 p-4"
              aria-labelledby="path-evidence-heading"
            >
              <h3
                id="path-evidence-heading"
                className="text-xs font-semibold text-slate-200"
              >
                Declared dependency paths · {selected.asset.name}
              </h3>
              {selected.paths.length ? (
                <ol className="mt-3 space-y-2">
                  {selected.paths.map((path, index) => (
                    <li
                      key={path.map((edge) => edge.id).join("/")}
                      className="text-[11px] leading-6 text-slate-400"
                    >
                      <span className="mr-2 font-mono text-teal-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="break-words font-mono text-slate-200">
                        {[
                          path[0].from_ref,
                          ...path.map((edge) => edge.to_ref),
                        ].join(" → ")}
                      </span>
                      <span className="mt-1 block">
                        {path.some((edge) => edge.gate_default === "unknown")
                          ? "Upper bound only · unknown execution gates"
                          : "Lower and upper bounds · all execution gates true"}{" "}
                        · provenance: fixture-manifest
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  No eligible path to the assumed source under the current mode
                  and controls. This is not evidence that the asset is safe.
                </p>
              )}
            </section>
          </section>

          <aside className="space-y-4">
            <section className="workspace-panel p-4">
              <div className="flex items-center gap-2">
                <Waypoints className="h-4 w-4 text-teal-300" />
                <h2 className="font-semibold text-white">Asset reachability</h2>
              </div>
              <div className="mt-3 space-y-2">
                {result.assets.map((reach) => {
                  const status = statusForAsset(reach);
                  return (
                    <button
                      key={reach.asset.asset_id}
                      onClick={() => setSelectedId(reach.asset.asset_id)}
                      aria-pressed={selectedId === reach.asset.asset_id}
                      className={`asset-row ${selectedId === reach.asset.asset_id ? "selected" : ""}`}
                    >
                      <span
                        className={`status-mark ${status}`}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 text-left">
                        <b>{reach.asset.name}</b>
                        <small>
                          {reach.asset.environment} · weight{" "}
                          {reach.asset.weight}
                        </small>
                      </span>
                      <span className="text-[10px] font-semibold uppercase">
                        {status === "not-reached" ? "Not reached" : status}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
            <section
              className={`rounded-xl border p-4 ${statusStyle[statusForAsset(selected)]}`}
            >
              <p className="flex items-center gap-2 text-xs font-semibold">
                <CircleHelp className="h-4 w-4" /> Why this status
              </p>
              <p className="mt-2 text-xs leading-5">
                {statusForAsset(selected) === "exposed"
                  ? `${selected.asset.name} has a true-gated path to the synthetic source package in this assumption.`
                  : statusForAsset(selected) === "unknown"
                    ? `${selected.asset.name} has only unknown-gated paths. It affects the upper bound, not the lower bound.`
                    : `${selected.asset.name} has no modeled route to the source package. “Not reached” is not a safety claim.`}
              </p>
            </section>
          </aside>
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
          <div className="workspace-panel p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <SlidersHorizontal className="mt-0.5 h-5 w-5 text-teal-300" />
              <div>
                <p className="eyebrow">Effort-budgeted mitigation</p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  The most impact within your budget.
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  The planner evaluates combinations of fixture controls. It
                  prioritizes the upper bound, then the lower bound, and only
                  selects controls within the stated effort budget.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <label className="sr-only" htmlFor="budget">
                Mitigation effort budget
              </label>
              <input
                id="budget"
                aria-describedby="budget-help"
                type="range"
                min="0"
                max="7"
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
                className="accent-teal-400 w-full"
              />
              <strong className="whitespace-nowrap text-sm text-teal-200">
                {budget} pts
              </strong>
            </div>
            <p id="budget-help" className="mt-2 text-[11px] text-slate-400">
              Selected plan cost: {plan.cost} points. A 0-point budget leaves
              the modeled baseline unchanged.
            </p>
            <div className="mt-5 grid gap-2">
              {scenario.candidate_controls.map((control) => {
                const chosen = plan.controls.some(
                  (item) => item.id === control.id,
                );
                return (
                  <div
                    key={control.id}
                    className={`control-card ${chosen ? "chosen" : ""}`}
                  >
                    <span className="mt-0.5">
                      {chosen ? (
                        <Check className="h-4 w-4 text-teal-300" />
                      ) : (
                        <span className="block h-4 w-4 rounded border border-navy-600" />
                      )}
                    </span>
                    <div>
                      <b>{control.label}</b>
                      <p>{control.assumptions[0]}</p>
                    </div>
                    <span className="cost">{control.cost} pts</span>
                  </div>
                );
              })}
            </div>
          </div>
          <aside className="workspace-panel flex flex-col justify-between p-5 sm:p-6">
            <div>
              <div className="flex items-center gap-2 text-teal-300">
                <Braces className="h-5 w-5" />
                <p className="eyebrow text-teal-200">Plan result</p>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {percentage(plan.result.lowerWeight, plan.result.totalWeight)}–
                {percentage(plan.result.upperWeight, plan.result.totalWeight)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {plan.result.lowerWeight}/{plan.result.totalWeight} lower ·{" "}
                {plan.result.upperWeight}/{plan.result.totalWeight} upper
              </p>
            </div>
            <div className="mt-6 border-t border-navy-700/70 pt-4">
              <p className="text-xs font-semibold text-white">
                Semantics to retain
              </p>
              <ul className="mt-2 space-y-2 text-xs leading-5 text-slate-400">
                <li>
                  • Route exclusions affect every asset using that shared
                  occurrence edge.
                </li>
                <li>
                  • The Billing scripts control is meaningful only for
                  install-script payloads.
                </li>
                <li>
                  • Replacement is modeled as a global source-occurrence
                  removal, not verification evidence.
                </li>
              </ul>
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <article className="feature-note">
            <Layers3 className="h-5 w-5" />
            <h2>SBOM ingestion</h2>
            <p>
              CycloneDX inventories provide the dependency topology used for
              analysis.
            </p>
          </article>
          <article className="feature-note">
            <FileWarning className="h-5 w-5" />
            <h2>OSV advisory mapping</h2>
            <p>
              Production workflows can map published advisory evidence; this
              demo has none.
            </p>
          </article>
          <article className="feature-note">
            <Sparkles className="h-5 w-5" />
            <h2>Blast-radius simulation</h2>
            <p>
              True and unknown execution gates produce explainable lower and
              upper bounds.
            </p>
          </article>
          <article className="feature-note">
            <ShieldAlert className="h-5 w-5" />
            <h2>Mitigation planning</h2>
            <p>
              Compare explicit controls against an engineering effort budget.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
