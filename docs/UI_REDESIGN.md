# RippleGuard UI redesign

## Originality
An original dependency-impact observatory using navy surfaces, teal interactions, rose modeled exposure, and amber uncertainty. Socket.dev, Wiz.io, and Chainguard.dev were aesthetic references only; their layouts, assets, wording, code, and brand motifs were not copied. No fabricated customers, scan activity, or live findings.

## Delivered
- Landing hero with a derived propagation map, mode toggle, feature grid, `/demo` and `/signup` CTAs.
- Public scenario lab with asset/path explanations, weighted exposure, effort-budget planning, and local report export.
- Protected project dashboard with actual API-derived inventory summaries, filtering, error/retry/empty states, and a native creation dialog.
- Responsive navigation, keyboard focus, skip link, reduced motion, and labelled mobile graph alternatives.

## Synthetic semantics
Fixture: `apps/web/src/features/scenario/multi_app_fixture.json`, copied from the repository fixture. No scenario API calls or package execution.

Runtime exposure is `12/18–13/18` (66.7%–72.2%). Billing scripts are disabled by default; this has no runtime effect. Install-only exposure becomes `8/18–9/18` (44.4%–50.0%); enabling Billing scripts restores baseline. Unknown Docs paths affect only the upper bound. Identity is **Not reached**, not safe. Both Checkout routes are retained. Route exclusions apply to all users of that shared edge; source replacement is a hypothetical global removal. The planner minimizes upper bound, then lower bound, then cost.

## Checks
From `apps/web`:

```sh
npm ci
npm run typecheck
npm run lint
npm run build
bun test src/features/scenario/evaluator.test.ts
```

Seven evaluator tests cover bounds, modes, parallel paths, replacement, and budgets. Browser checks covered desktop/mobile navigation, scenario controls, export, and overflow at 360px. Real authenticated API operations require the configured backend/session and were not end-to-end verified here.

## Pre-existing gap
Dashboard `/projects/[id]` links are preserved, but the repository has no detail page at that route. This UI change does not add that workflow.
