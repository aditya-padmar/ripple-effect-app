"use client";

import React from "react";
import {
  Flame,
  Layers,
  Server,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  scenario,
  statusForAsset,
  type ScenarioResult,
} from "./evaluator";

const statusTone = {
  exposed: {
    badge: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30",
    border: "border-rose-300 bg-rose-50/60 dark:border-rose-500/40 dark:bg-rose-500/5",
    dot: "bg-rose-500 dark:bg-rose-400",
    label: "Exposed",
  },
  unknown: {
    badge: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
    border: "border-amber-300 bg-amber-50/60 dark:border-amber-500/40 dark:bg-amber-500/5",
    dot: "bg-amber-500 dark:bg-amber-400",
    label: "Unknown Gate",
  },
  "not-reached": {
    badge: "bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-500/30",
    border: "border-teal-300 bg-teal-50/60 dark:border-teal-500/40 dark:bg-teal-500/5",
    dot: "bg-teal-500 dark:bg-teal-400",
    label: "Not Reached",
  },
};

export function DependencyMap({
  result,
  selectedId,
  onSelect,
  compact = false,
}: {
  result: ScenarioResult;
  selectedId?: string;
  onSelect?: (id: string) => void;
  compact?: boolean;
}) {
  const sourceRef = scenario.source_package.local_ref;
  const isSourceReplaced = result.controls.some(
    (c) => c.control_type === "replace_occurrence"
  );

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 sm:p-6 backdrop-blur-xl shadow-lg dark:border-navy-700/80 dark:bg-navy-900/80 dark:shadow-xl transition-colors duration-200">
      {/* Map Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-navy-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 dark:bg-teal-400" />
            <span>Dependency Downstream Reachability Topology</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Direction: Dependency ➔ Consumer (modeled blast-radius flow)
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 dark:bg-rose-400" />
            <span>Exposed</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
            <span>Unknown</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-300">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-teal-400" />
            <span>Not Reached</span>
          </span>
        </div>
      </div>

      {/* Responsive Graph Columns */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Column 1: Compromised Source Package (Cols 3) */}
        <div className="md:col-span-3 flex flex-col justify-center">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2">
            Compromised Origin
          </div>
          <div
            className={`p-4 rounded-xl border transition-all ${
              isSourceReplaced
                ? "border-teal-400/40 bg-teal-50 dark:bg-teal-500/5 text-slate-700 dark:text-slate-300"
                : "border-rose-300 bg-rose-50/70 dark:border-rose-500/50 dark:bg-rose-500/10 dark:shadow-glow-rose"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-lg ${
                  isSourceReplaced
                    ? "bg-teal-500/20 text-teal-600 dark:text-teal-400"
                    : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                }`}
              >
                <Flame className="h-5 w-5" />
              </div>
              <div className="overflow-hidden text-left">
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate">
                  {scenario.source_package.name}
                </div>
                <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  v{scenario.source_package.version}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-navy-800 text-[11px] font-mono flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Status:</span>
              <span
                className={`font-semibold ${
                  isSourceReplaced ? "text-teal-600 dark:text-teal-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {isSourceReplaced ? "Mitigated (Replaced)" : "Active Source"}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow Divider */}
        <div className="hidden md:flex md:col-span-1 justify-center text-slate-400 dark:text-slate-600">
          <ArrowRight className="h-5 w-5" />
        </div>

        {/* Column 2: Intermediate Transitive Dependencies (Cols 4) */}
        <div className="md:col-span-4 space-y-2.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2 text-left">
            Transitive Dependencies ({scenario.occurrences.length - 1})
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {scenario.occurrences
              .filter((item) => item.local_ref !== sourceRef)
              .map((item) => (
                <div
                  key={item.local_ref}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 dark:border-navy-700/70 dark:bg-navy-950/70 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Layers className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-200/70 dark:bg-navy-900 px-1.5 py-0.5 rounded border border-slate-300 dark:border-navy-800">
                    v{item.version}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Arrow Divider */}
        <div className="hidden md:flex md:col-span-1 justify-center text-slate-400 dark:text-slate-600">
          <ArrowRight className="h-5 w-5" />
        </div>

        {/* Column 3: Downstream Target Assets (Cols 3) */}
        <div className="md:col-span-3 space-y-2.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2 text-left">
            Target Assets ({result.assets.length})
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {result.assets.map((reach) => {
              const status = statusForAsset(reach);
              const tone = statusTone[status];
              const isSelected = selectedId === reach.asset.asset_id;

              return (
                <button
                  key={reach.asset.asset_id}
                  onClick={() => onSelect && onSelect(reach.asset.asset_id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? "border-teal-500 bg-teal-50/70 dark:border-teal-400 dark:bg-navy-850 dark:shadow-glow-teal"
                      : "border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-navy-700/80 dark:bg-navy-950/70 dark:hover:border-navy-600 dark:hover:bg-navy-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${tone.dot}`} />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {reach.asset.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        Weight: {reach.asset.weight} · {reach.asset.environment}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border shrink-0 ${tone.badge}`}
                  >
                    {tone.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer Helper */}
      <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-navy-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>Click any asset above to inspect its exact witness routes and gate evidence.</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
          Graph model v1.0.0
        </span>
      </div>
    </div>
  );
}
