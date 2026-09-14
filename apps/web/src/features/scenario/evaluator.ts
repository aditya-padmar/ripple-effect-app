import fixture from "./multi_app_fixture.json";

export type PayloadMode = "runtime" | "install";
export type Bound = "lower" | "upper";
export type GateState = "true" | "false" | "unknown";

type Fixture = typeof fixture;
export type ScenarioControl = Fixture["candidate_controls"][number];
export type ScenarioAsset = Fixture["assets"][number];
export type ScenarioEdge = Fixture["edges"][number];

export const scenario = fixture;

export interface AssetReach {
  asset: ScenarioAsset;
  lower: boolean;
  upper: boolean;
  paths: ScenarioEdge[][];
}

export interface ScenarioResult {
  assets: AssetReach[];
  lowerWeight: number;
  upperWeight: number;
  totalWeight: number;
  controls: ScenarioControl[];
  mode: PayloadMode;
  scriptsDisabled: boolean;
}

const edgeByFrom = new Map<string, ScenarioEdge[]>();
for (const edge of scenario.edges) {
  const existing = edgeByFrom.get(edge.from_ref) ?? [];
  existing.push(edge);
  edgeByFrom.set(edge.from_ref, existing);
}

function usable(gate: GateState, bound: Bound): boolean {
  return gate === "true" || (bound === "upper" && gate === "unknown");
}

function activeControls(controls: ScenarioControl[], mode: PayloadMode) {
  // Lifecycle controls describe an install-time mechanism; all other controls apply to either mode.
  return controls.filter(
    (control) =>
      control.control_type !== "disable_lifecycle_scripts" ||
      mode === "install",
  );
}

function reachesAsset(
  asset: ScenarioAsset,
  bound: Bound,
  controls: ScenarioControl[],
  mode: PayloadMode,
  scriptsDisabled: boolean,
) {
  const active = activeControls(controls, mode);
  if (active.some((control) => control.control_type === "replace_occurrence"))
    return [];
  const lifecycleDisabledByControl = active.some(
    (control) =>
      control.control_type === "disable_lifecycle_scripts" &&
      "asset_id" in control.parameters &&
      control.parameters.asset_id === asset.asset_id,
  );
  const previewLifecycleAsset = scenario.candidate_controls.find(
    (control) =>
      control.control_type === "disable_lifecycle_scripts" &&
      "asset_id" in control.parameters,
  );
  const lifecycleDisabledByPreview = Boolean(
    scriptsDisabled &&
    previewLifecycleAsset &&
    "asset_id" in previewLifecycleAsset.parameters &&
    previewLifecycleAsset.parameters.asset_id === asset.asset_id,
  );
  if (
    mode === "install" &&
    (lifecycleDisabledByControl || lifecycleDisabledByPreview)
  )
    return [];

  const cutEdges = new Set(
    active
      .filter((control) => control.control_type === "exclude_dependency_route")
      .flatMap((control) =>
        "edge_id" in control.parameters
          ? [String(control.parameters.edge_id)]
          : [],
      ),
  );
  const target = scenario.source_package.local_ref;
  const paths: ScenarioEdge[][] = [];

  const visit = (ref: string, path: ScenarioEdge[], visited: Set<string>) => {
    if (ref === target) {
      paths.push(path);
      return;
    }
    for (const edge of edgeByFrom.get(ref) ?? []) {
      if (
        cutEdges.has(edge.id) ||
        !usable(edge.gate_default as GateState, bound) ||
        visited.has(edge.to_ref)
      )
        continue;
      const nextVisited = new Set(visited);
      nextVisited.add(edge.to_ref);
      visit(edge.to_ref, [...path, edge], nextVisited);
    }
  };
  visit(asset.root_ref, [], new Set([asset.root_ref]));
  return paths;
}

export function evaluateScenario({
  mode,
  scriptsDisabled = false,
  controls = [],
}: {
  mode: PayloadMode;
  scriptsDisabled?: boolean;
  controls?: ScenarioControl[];
}): ScenarioResult {
  const assets = scenario.assets.map((asset) => {
    const lowerPaths = reachesAsset(
      asset,
      "lower",
      controls,
      mode,
      scriptsDisabled,
    );
    const upperPaths = reachesAsset(
      asset,
      "upper",
      controls,
      mode,
      scriptsDisabled,
    );
    return {
      asset,
      lower: lowerPaths.length > 0,
      upper: upperPaths.length > 0,
      paths: upperPaths,
    };
  });
  const totalWeight = scenario.assets.reduce(
    (sum, asset) => sum + asset.weight,
    0,
  );
  return {
    assets,
    totalWeight,
    lowerWeight: assets
      .filter(({ lower }) => lower)
      .reduce((sum, { asset }) => sum + asset.weight, 0),
    upperWeight: assets
      .filter(({ upper }) => upper)
      .reduce((sum, { asset }) => sum + asset.weight, 0),
    controls,
    mode,
    scriptsDisabled,
  };
}

export function percentage(
  weight: number,
  total = scenario.assets.reduce((sum, asset) => sum + asset.weight, 0),
) {
  return `${((weight / total) * 100).toFixed(1)}%`;
}

export interface MitigationPlan {
  controls: ScenarioControl[];
  result: ScenarioResult;
  cost: number;
}

export function optimizeMitigations(
  budget: number,
  mode: PayloadMode,
  scriptsDisabled: boolean,
): MitigationPlan {
  const candidates = scenario.candidate_controls;
  let best: MitigationPlan = {
    controls: [],
    result: evaluateScenario({ mode, scriptsDisabled }),
    cost: 0,
  };
  for (let mask = 0; mask < 1 << candidates.length; mask += 1) {
    const controls = candidates.filter((_, index) =>
      Boolean(mask & (1 << index)),
    );
    const cost = controls.reduce((sum, control) => sum + control.cost, 0);
    if (cost > budget) continue;
    const result = evaluateScenario({ mode, scriptsDisabled, controls });
    // Reduce the conservative upper bound first, then the lower bound, then avoid needless work.
    if (
      result.upperWeight < best.result.upperWeight ||
      (result.upperWeight === best.result.upperWeight &&
        result.lowerWeight < best.result.lowerWeight) ||
      (result.upperWeight === best.result.upperWeight &&
        result.lowerWeight === best.result.lowerWeight &&
        cost < best.cost)
    )
      best = { controls, result, cost };
  }
  return best;
}

export function statusForAsset(reach: AssetReach) {
  if (reach.lower) return "exposed" as const;
  if (reach.upper) return "unknown" as const;
  return "not-reached" as const;
}
