"use client";

import { useId } from "react";
import { ArrowDown, Package, Server } from "lucide-react";
import { scenario, statusForAsset, type ScenarioResult } from "./evaluator";

const tones = {
  exposed: {
    stroke: "#fb7185",
    fill: "#251322",
    label: "Reached · true gates",
  },
  unknown: {
    stroke: "#fbbf24",
    fill: "#241f19",
    label: "Possible · unknown gates",
  },
  "not-reached": {
    stroke: "#7890ac",
    fill: "#111d2e",
    label: "Not reached in model",
  },
};

/** Fixture topology is drawn dependency → dependent (the direction of modeled impact).
 * Muted links preserve inventory context; bright links are currently reachable paths.
 * Mobile uses an equivalent, fully labelled asset list instead of microscopic SVG text.
 */
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
  const id = useId().replace(/:/g, "");
  const source = scenario.source_package.local_ref;
  const dependencies = scenario.occurrences.filter(
    (item) => item.local_ref !== source,
  );
  const rows = Math.max(dependencies.length, scenario.assets.length);
  const height = rows * 72 + 48;
  const positions = new Map<string, { x: number; y: number; width: number }>();
  positions.set(source, { x: 20, y: height / 2 - 26, width: 156 });
  dependencies.forEach((item, index) =>
    positions.set(item.local_ref, { x: 278, y: 38 + index * 72, width: 168 }),
  );
  scenario.assets.forEach((asset, index) =>
    positions.set(asset.root_ref, { x: 562, y: 38 + index * 72, width: 188 }),
  );
  const highlighted = new Set(
    result.assets
      .filter((reach) => !selectedId || reach.asset.asset_id === selectedId)
      .flatMap((reach) =>
        reach.paths.flatMap((path) => path.map((edge) => edge.id)),
      ),
  );
  const sourceRemoved = result.controls.some(
    (control) => control.control_type === "replace_occurrence",
  );
  const focusedRefs = new Set(
    result.assets
      .filter((reach) => !selectedId || reach.asset.asset_id === selectedId)
      .flatMap((reach) =>
        reach.paths.flatMap((path) =>
          path.flatMap((edge) => [edge.from_ref, edge.to_ref]),
        ),
      ),
  );
  const assetButtons = result.assets.map((reach) => {
    const status = statusForAsset(reach);
    const inner = (
      <>
        <Server
          className="h-4 w-4 shrink-0"
          style={{ color: tones[status].stroke }}
        />
        <span className="flex-1 text-left">
          <strong className="block text-xs font-semibold text-slate-100">
            {reach.asset.name}
          </strong>
          <span className="text-[11px] text-slate-400">
            {tones[status].label} · weight {reach.asset.weight}
          </span>
        </span>
        {status === "unknown" && (
          <span className="text-xs text-amber-300">?</span>
        )}
      </>
    );
    return onSelect ? (
      <button
        key={reach.asset.asset_id}
        aria-pressed={selectedId === reach.asset.asset_id}
        onClick={() => onSelect(reach.asset.asset_id)}
        className="flex w-full items-center gap-3 rounded-lg border border-slate-700/70 bg-navy-900 px-3 py-2.5 aria-pressed:border-teal-300"
      >
        {inner}
      </button>
    ) : (
      <li
        key={reach.asset.asset_id}
        className="flex items-center gap-3 rounded-lg border border-slate-700/70 bg-navy-900 px-3 py-2.5"
      >
        {inner}
      </li>
    );
  });

  return (
    <div
      className={`dependency-map ${compact ? "dependency-map-compact" : ""}`}
    >
      <div className="hidden sm:block">
        <svg
          viewBox={`0 0 770 ${height}`}
          className="h-auto w-full"
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
        >
          <title id={`${id}-title`}>Synthetic dependency impact map</title>
          <desc id={`${id}-desc`}>
            Impact flows from {scenario.source_package.name} through shared
            dependencies to enterprise assets. Bright paths show{" "}
            {selectedId ? "the selected asset's" : "all"} modeled reachable
            routes. Dashed amber paths have unknown gates. Muted edges show
            inventory context, not active exposure.{" "}
            {result.assets
              .map(
                (reach) =>
                  `${reach.asset.name}: ${tones[statusForAsset(reach)].label}`,
              )
              .join(". ")}
            .
          </desc>
          <defs>
            <pattern
              id={`${id}-dots`}
              width="18"
              height="18"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r=".7" fill="#354662" opacity=".6" />
            </pattern>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path
                d="M 1 1 L 9 5 L 1 9"
                fill="none"
                stroke="context-stroke"
                strokeWidth="1.5"
              />
            </marker>
          </defs>
          <rect width="770" height={height} fill={`url(#${id}-dots)`} />
          <text x="20" y="19" fill="#91a4be" fontSize="10" letterSpacing="1.5">
            ASSUMED SOURCE
          </text>
          <text x="278" y="19" fill="#91a4be" fontSize="10" letterSpacing="1.5">
            DEPENDENCY ROUTES
          </text>
          <text x="562" y="19" fill="#91a4be" fontSize="10" letterSpacing="1.5">
            ENTERPRISE ASSETS
          </text>
          {!sourceRemoved && (
            <g className="source-rings" aria-hidden="true">
              <circle
                cx="98"
                cy={height / 2}
                r="81"
                fill="none"
                stroke="#f43f5e"
                strokeOpacity=".16"
              />
              <circle
                cx="98"
                cy={height / 2}
                r="111"
                fill="none"
                stroke="#f43f5e"
                strokeOpacity=".08"
              />
            </g>
          )}
          {scenario.edges.map((edge) => {
            const from = positions.get(edge.to_ref),
              to = positions.get(edge.from_ref);
            if (!from || !to) return null;
            const active = highlighted.has(edge.id);
            const stroke = active
              ? edge.gate_default === "unknown"
                ? "#fbbf24"
                : "#fb7185"
              : "#33435b";
            const x1 = from.x + from.width,
              y1 = from.y + 26,
              x2 = to.x - 5,
              y2 = to.y + 26;
            return (
              <path
                key={edge.id}
                d={`M${x1},${y1} C${x1 + 52},${y1} ${x2 - 52},${y2} ${x2},${y2}`}
                fill="none"
                stroke={stroke}
                strokeWidth={active ? 2 : 1.2}
                strokeDasharray={
                  edge.gate_default === "unknown" ? "5 5" : undefined
                }
                markerEnd={`url(#${id}-arrow)`}
                className={active ? "impact-path" : undefined}
              />
            );
          })}
          {scenario.occurrences.map((item) => {
            const pos = positions.get(item.local_ref)!;
            const isSource = item.local_ref === source;
            const active = focusedRefs.has(item.local_ref);
            return (
              <g key={item.local_ref}>
                <rect
                  {...pos}
                  height="52"
                  rx="9"
                  fill={isSource && !sourceRemoved ? "#2a1423" : "#111b2e"}
                  stroke={
                    isSource && !sourceRemoved
                      ? "#fb7185"
                      : active
                        ? "#7389a9"
                        : "#33435b"
                  }
                />
                <text
                  x={pos.x + 12}
                  y={pos.y + 22}
                  fill="#e8eef8"
                  fontSize="14"
                  fontWeight="600"
                >
                  {item.name}
                </text>
                <text
                  x={pos.x + 12}
                  y={pos.y + 39}
                  fill={isSource && !sourceRemoved ? "#fda4af" : "#99abc1"}
                  fontSize="10"
                >
                  {isSource
                    ? sourceRemoved
                      ? "Removed by modeled control"
                      : "Hypothetical compromise"
                    : `v${item.version} · fixture`}
                </text>
              </g>
            );
          })}
          {result.assets.map((reach) => {
            const pos = positions.get(reach.asset.root_ref)!;
            const status = statusForAsset(reach),
              tone = tones[status];
            return (
              <g key={reach.asset.asset_id}>
                <rect
                  {...pos}
                  height="52"
                  rx="9"
                  fill={tone.fill}
                  stroke={
                    reach.asset.asset_id === selectedId
                      ? "#5eead4"
                      : tone.stroke
                  }
                  strokeWidth={reach.asset.asset_id === selectedId ? 2 : 1}
                />
                <text
                  x={pos.x + 12}
                  y={pos.y + 21}
                  fill="#e8eef8"
                  fontSize="13"
                  fontWeight="600"
                >
                  {reach.asset.name}
                </text>
                <text
                  x={pos.x + 12}
                  y={pos.y + 39}
                  fill={tone.stroke}
                  fontSize="10"
                >
                  {status === "exposed"
                    ? "Reached"
                    : status === "unknown"
                      ? "Unknown gate"
                      : "Not reached"}{" "}
                  · weight {reach.asset.weight}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="space-y-2 p-4 sm:hidden">
        <div className="flex items-center gap-3 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-3">
          <Package className="h-5 w-5 text-rose-300" />
          <div>
            <strong className="block text-sm text-white">
              {scenario.source_package.name}@{scenario.source_package.version}
            </strong>
            <span className="text-[11px] text-rose-200">
              {sourceRemoved
                ? "Source removed by modeled control"
                : "Assumed compromise · synthetic"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 py-1 text-[10px] uppercase tracking-widest text-slate-400">
          <ArrowDown className="h-3 w-3" /> Downstream asset reach
        </div>
        {onSelect ? (
          <div className="space-y-2">{assetButtons}</div>
        ) : (
          <ul className="space-y-2">{assetButtons}</ul>
        )}
      </div>
    </div>
  );
}
