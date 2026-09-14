import { test } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateScenario,
  optimizeMitigations,
  scenario,
  statusForAsset,
  type PayloadMode,
} from "./evaluator";

const runtime = evaluateScenario({ mode: "runtime" });

test("fixture baseline retains lower/upper uncertainty and all scoped weight", () => {
  assert.equal(runtime.totalWeight, 18);
  assert.equal(runtime.lowerWeight, 12);
  assert.equal(runtime.upperWeight, 13);
  assert.equal(
    runtime.assets.filter((item) => item.upper && !item.lower).length,
    1,
  );
  assert.equal(runtime.assets.filter((item) => !item.upper).length, 1);
  for (const reach of runtime.assets.filter((item) => !item.upper))
    assert.equal(statusForAsset(reach), "not-reached");
});

test("disabling lifecycle scripts changes install-time reach only", () => {
  const installed = evaluateScenario({
    mode: "install",
    scriptsDisabled: true,
  });
  assert.equal(installed.lowerWeight, 8);
  assert.equal(installed.upperWeight, 9);
  assert.deepEqual(
    evaluateScenario({ mode: "runtime", scriptsDisabled: true }).assets,
    runtime.assets,
  );
  assert.deepEqual(
    evaluateScenario({ mode: "install", scriptsDisabled: false }).assets,
    runtime.assets,
  );
});

test("parallel Checkout routes survive a single route exclusion", () => {
  const parallel = runtime.assets.find((reach) => reach.paths.length > 1)!;
  assert.ok(parallel);
  assert.equal(parallel.paths.length, 2);
  const cuts = scenario.candidate_controls.filter(
    (control) => control.control_type === "exclude_dependency_route",
  );
  for (const cut of cuts) {
    const result = evaluateScenario({ mode: "runtime", controls: [cut] });
    assert.equal(
      result.assets.find(
        (reach) => reach.asset.asset_id === parallel.asset.asset_id,
      )?.lower,
      true,
    );
  }
  const both = evaluateScenario({ mode: "runtime", controls: cuts });
  assert.equal(
    both.assets.find(
      (reach) => reach.asset.asset_id === parallel.asset.asset_id,
    )?.upper,
    false,
  );
});

test("unknown gates are absent from lower-bound witness paths", () => {
  const uncertain = runtime.assets.find(
    (reach) => reach.upper && !reach.lower,
  )!;
  assert.ok(uncertain);
  assert.ok(
    uncertain.paths.every((path) =>
      path.some((edge) => edge.gate_default === "unknown"),
    ),
  );
});

test("replacement removes the modeled source for both payload modes", () => {
  const replacement = scenario.candidate_controls.find(
    (control) => control.control_type === "replace_occurrence",
  )!;
  for (const mode of ["runtime", "install"] as PayloadMode[]) {
    const result = evaluateScenario({ mode, controls: [replacement] });
    assert.equal(result.lowerWeight, 0);
    assert.equal(result.upperWeight, 0);
  }
});

test("planner is budget-safe, nonincreasing, and deterministic for every budget", () => {
  for (const mode of ["runtime", "install"] as PayloadMode[])
    for (const scriptsDisabled of [false, true]) {
      const baseline = evaluateScenario({ mode, scriptsDisabled });
      let priorUpper = baseline.upperWeight;
      for (let budget = 0; budget <= 7; budget += 1) {
        const plan = optimizeMitigations(budget, mode, scriptsDisabled);
        assert.ok(plan.cost <= budget);
        assert.ok(plan.result.lowerWeight <= plan.result.upperWeight);
        assert.ok(plan.result.upperWeight <= priorUpper);
        assert.ok(plan.result.lowerWeight <= baseline.lowerWeight);
        assert.deepEqual(
          plan,
          optimizeMitigations(budget, mode, scriptsDisabled),
        );
        priorUpper = plan.result.upperWeight;
      }
    }
});

test("all fixture control combinations preserve bounded exposure", () => {
  const candidates = scenario.candidate_controls;
  for (const mode of ["runtime", "install"] as PayloadMode[])
    for (let mask = 0; mask < 1 << candidates.length; mask += 1) {
      const controls = candidates.filter((_, index) =>
        Boolean(mask & (1 << index)),
      );
      const result = evaluateScenario({ mode, controls });
      assert.ok(
        0 <= result.lowerWeight &&
          result.lowerWeight <= result.upperWeight &&
          result.upperWeight <= result.totalWeight,
      );
    }
});
