# Dispatcher's Dashboard — working plan

Toast take-home, Design Engineer. 2-3 hr timebox. Working doc, updated as decisions get made — not a writeup for submission.

## Brief (condensed)

Build the "Active Shift" dashboard a fleet dispatcher (~50 trucks, 1000+ deliveries/day) lives in, scoped to ONE variable: **HOS (Hours of Service)** — an 11-hour legal driving limit, system must flag drivers nearing their mandatory reset. Build:

1. The main dashboard view.
2. One exception flow — the HOS alert (driver nearing the 11hr limit) + a drill-in from that alert.

Real running code, driven by a real data model, working interactions. "Time until reset" computed from data, not hardcoded. Grading cares about: how the UI avoids overwhelming the dispatcher with 1000+ datapoints (visual precedence), how alerts get surfaced proactively, and how the design handles data latency / a driver going offline. 45-min walkthrough afterward, may include a live code change (new alert type or a filter).

## Scope decisions

- HOS only. No map view, no bulk actions, no settings page — explicitly out, doesn't prove anything on the rubric.
- No backend. "API" calls simulated with fake fetch + setTimeout + loading/error states. HOS calc is client-side for the demo; production would move it server-side (client clock can't be trusted for a legally safety-critical number).
- No React Context — component tree is 2-3 levels (Dashboard → DriverSection → DriverRow), props flow fine.
- No router.
- No headless UI dependency for the drill-in — native `<dialog>` covers focus trap / ESC-close / `aria-modal` for free.

## Data model

Flat array of driver objects (not a tree — no real nesting in this domain).

```
{
  id, name, truckId,
  shiftStart,       // source of truth for HOS calc
  lastPing,         // source of truth for offline/staleness detection
  location: { lat, lng, label },
  currentDelivery: { id, eta } | null
}
```

**Core principle: status, time-remaining, and offline state are all derived, never stored.** Every tick, recompute from `shiftStart` / `lastPing` / `now` — never decrement a stored counter or persist a `status: "critical"` field that could go stale.

## Architecture decisions log

| Decision                                                                                                                            | Why                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Pure functions in `utils/hos.js`, `now` always passed in as a param                                                                 | Deterministic, unit-testable without mocking time                                                                                                                                          |
| Staleness check short-circuits to `offline` before tier resolution                                                                  | An unreachable driver's HOS reading can't be trusted — offline has to win                                                                                                                  |
| Single `useClockTick` at Dashboard level, not one timer per row                                                                     | 50 independent intervals would drift and thrash; one shared `now` is cheap                                                                                                                 |
| Two-speed ticking: Dashboard ~30s, DriverDrillIn its own 1s tick                                                                    | Coarse is plenty for section bucketing; the open drill-in is the one place a visibly live countdown matters                                                                                |
| Dropped the originally-planned `useStaleness` hook                                                                                  | `isStale` already lives in `hos.js` and is folded into `getDriverStatus` — a wrapper hook with no added logic is unnecessary abstraction                                                   |
| No Context                                                                                                                          | Tree is 2-3 levels, `now` as a prop is fine                                                                                                                                                |
| `alertConfig.js` is data-driven (array of tiers, not a switch statement)                                                            | New tier = one object added, nothing else touched — this is the file most likely to get a live "add an alert type" ask                                                                     |
| Native `<dialog>` for the drill-in, no `@radix-ui`/`@headlessui` dependency                                                         | `.showModal()` gives real focus trap + ESC-close + `aria-modal` natively, zero deps, strong a11y story                                                                                     |
| Alert-treatment toggle is plain `useState` in Dashboard, no localStorage                                                            | It's a live-demo control, not a saved preference — simplest thing that works                                                                                                               |
| Drill-in dialog centered via explicit `fixed inset-0 m-auto`, not the UA default                                                    | Tailwind's preflight resets `margin: 0` globally, which silently kills the browser's native `dialog { margin: auto }` centering — caught via a real backdrop-click test, not by eye        |
| Tier badge colors changed from solid-500/600 + white text to pastel-100 bg + dark-800 text                                          | The original solid colors (`bg-amber-500 text-white`, `bg-gray-400 text-white`) fail WCAG contrast (~2.2:1) — never caught because they'd only ever been used on a 10px dot, not real text |
| Section filter pills reuse `alertConfig`'s per-tier classes (`badgeClassName`/new `activeBadgeClassName`), not a separate color map | One color source of truth for status everywhere it appears — row tint, badge, and filter pill all trace back to the same tier object                                                       |

## Alert tiers

- **Critical** — under threshold (e.g. <20 min to reset). Always fully rendered, never paginated/virtualized.
- **Approaching** — e.g. <2hr. Always fully rendered.
- **On track** — collapsed to a count by default.
- **Offline/stale** — no ping in N minutes, greyed out, non-blocking. Collapsed to a count by default.

No pagination anywhere (breaks "nobody hidden"). Infinite scroll is fine for low-urgency sections if expanded. Virtualization (react-window-style) is a separate rendering-perf concern, only relevant if a collapsed section is expanded at real fleet scale — not needed at demo scale.

## Layout concept — Hybrid

Explored three directions, chose the hybrid:

- **A — Triage list:** one dense sorted table, urgency = sort order + row color. Nobody hidden, but no "how bad is today" glance.
- **B — Status board:** swimlanes by status. Instant glanceability, but on-track drivers get compressed behind a click.
- **C — Hybrid (chosen):** one continuous urgency-sorted table, broken into labeled sections with live counts. Gets density and glanceability without dropping anyone out of view.

## Two alert UI treatments

- **Concept 01 — Badge:** subtle inline status badge/pill in the row. Low-noise, spreadsheet-native.
- **Concept 02 — Banner:** a prominent banner strip pinned above the table listing critical alerts. High-attention.

Toggle switches which renders for critical/approaching drivers; on-track/offline rows are unaffected either way.

## Mock data plan

14 drivers total:

- 3 critical
- 3 approaching (one authored to cross into critical live, during the demo, at the dashboard's tick cadence — doubles as the "proactive surfacing" grading point)
- 5 on-track
- 3 offline/stale

One driver with `currentDelivery: null` to exercise a real empty-state guard. Large enough that "collapse to count" means something; small enough to hand-author in the timebox.

## Build checklist

- [x] 0. `docs: add dispatcher dashboard plan` (this file)
- [x] 1. `chore: add test runner` — vitest + testing-library + jsdom, fold `test` into `verify`
- [x] 2. `feat: add driver data model and mock data`
- [x] 3. `feat: add HOS derivation utils` + tests
- [x] 4. `feat: add alert tier config`
- [x] 5. `feat: add clock tick hook`
- [x] 6. `feat: add driver status hook`
- [x] 7. `feat: add shared status components` (StatusDot, Timer)
- [x] 8. `feat: add driver row component`
- [x] 9. `feat: add driver section component`
- [x] 10. `feat: render active shift dashboard` — first visually working commit
- [x] 11. `feat: add HOS alert drill-in view` — both hard brief requirements done after this
- [x] 12. `feat: add alert badge treatment` — done as part of the filter/badge pass below, ahead of schedule
- [ ] 13. `feat: add alert banner treatment`
- [ ] 14. `feat: add dual alert treatment toggle`
- [ ] 15. `test: add DriverRow component tests`
- [ ] 16. `docs: write README with setup, architecture, and tradeoffs`

If time runs out, 0-11 are non-negotiable; everything from 12 on compresses first, in reverse order.

Status-tier filtering (click a count in the summary bar to narrow the table to just that section) is done — added after using the dashboard and finding no way to scale down to just what matters. De-risks the "or a filter" live-demo ask on its own.

Nice-to-haves if time remains (pick 2-3): live-ticking countdown in the drill-in, a free-text name/truck-id filter input (a _second_, complementary filter axis — status tier is "which severity," this would be "which specific driver"), empty/loading states via simulated fetch, `prefers-reduced-motion`-respecting pulse on newly-critical rows.

## Deliberately-not-taken tradeoffs

- No `react-window` virtualization at 14-driver scale — would be over-engineering here. Production path (50+ trucks, expanded on-track/offline sections) documented but not built.
- No backend / real API — simulated fetch is enough signal for a front-end-scoped exercise without the live-demo risk of two processes.

## Walkthrough prep

- Why HOS calc should move server-side in production: client clock isn't trustworthy for a legally safety-critical number.
- Derive-don't-store, end to end: nothing about a driver's alert status is ever written to state — it's recomputed from `shiftStart`/`lastPing`/`now` every tick.
- Exactly where a live change lands: new alert type → one object in `data/alertConfig.js`. New filter → one predicate function over the flat driver array.
- Fleet dispatch ↔ restaurant procurement parallel (narrative only, not code): both have a hard external deadline outside your control (HOS limit ≈ order cutoff), many moving parts where only a few need attention right now, and offline/stale data as a real failure mode (driver offline ≈ vendor with no live tracking).
