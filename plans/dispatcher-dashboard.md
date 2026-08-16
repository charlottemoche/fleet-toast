# Dispatcher's Dashboard — working plan

Toast take-home, Design Engineer. 2-3 hr timebox. Working doc, not a writeup for submission.

## Brief (condensed)

Build the "Active Shift" dashboard a fleet dispatcher (~50 trucks, 1000+ deliveries/day) lives in, scoped to ONE variable: **HOS** — 11hr legal driving limit, flag drivers nearing mandatory reset.

1. Main dashboard view.
2. One exception flow — HOS alert + drill-in from it.

Real running code, real data model, working interactions. "Time until reset" computed, not hardcoded. Graded on: visual precedence at 1000+ datapoints, proactive alert surfacing, handling data latency/offline. 45-min walkthrough after, may include a live code change.

## Scope decisions

- HOS only. No map, no bulk actions, no settings — doesn't prove anything on the rubric.
- No backend. Client-side HOS calc for the demo; production would move it server-side (client clock isn't trustworthy for a legally safety-critical number).
- No Context — tree's 2-3 levels, props are fine.
- No router.
- Native `<dialog>` for the drill-in — free focus trap/ESC/`aria-modal`, no deps.

## Data model

Flat array of driver objects.

```
{
  id, name, truckId, phone,
  shiftStart,       // HOS calc
  lastPing,         // offline/staleness detection
  location: { lat, lng, label },
  currentDelivery: { id, eta } | null
}
```

**Derived, never stored:** status/time-remaining/offline all recompute from `shiftStart`/`lastPing`/`now` every tick — never a persisted `status: "critical"` field that can go stale.

## Architecture decisions

- Pure functions in `hos.js`, `now` passed as a param — testable without mocking time.
- Staleness check wins over tier resolution — an unreachable driver's reading can't be trusted.
- One shared `useClockTick`, not a timer per row.
- Dashboard ticks ~30s, drill-in ticks 1s — only the open drill-in needs a live countdown.
- No Context; `statusConfig.js` is data-driven (array of tiers) — new tier = one object.
- Drill-in centered via `fixed inset-0 m-auto` — Tailwind preflight kills the UA default `dialog` centering.
- Badge colors are pastel bg + dark text, not solid + white — solid failed WCAG contrast.
- Filter pills reuse the same per-tier classes as the badge — one color source of truth.
- Renamed alert → status. Status = current state (pill). Alert = fires on an event (toast), not a duplicate concept.
- Toast fires only on transition into critical, not on every render/poll.
- Toast doesn't auto-dismiss — only × or "View driver" (which opens the drill-in) clears it.
- Toast opens the drill-in — the brief requires that flow, not optional.
- Rows sorted ascending by time remaining within each tier — most urgent leads.
- Sticky header = a bounded, internally-scrolling table panel, not page-level sticky — `overflow-x-auto` (needed for mobile) breaks page-level `position: sticky`.
- Overrode Tailwind's `gray` scale in `@theme` — default leans blue.
- Custom theme colors need `@theme static` — otherwise Tailwind tree-shakes vars with no literal class usage.
- Acknowledge lives in the drill-in, not inline in the row.
- `driver.phone` + a real `tel:` link — an action that actually works, not a mockup of one we can't build (reassignment/dispatch).

## Alert tiers

- **Critical** — <20 min. Always expanded.
- **Approaching** — <2hr. Always expanded.
- **On track** — collapsed to a count.
- **Offline/stale** — no ping in N min, greyed out. Collapsed to a count.

No pagination. Virtualization not needed at demo scale.

## Layout — Hybrid

One urgency-sorted table, broken into labeled sections with live counts. Chosen over a plain sorted list (no glance) or status swimlanes (on-track drivers hidden behind a click).

## Alert UI — superseded

Original plan: toggle between a badge treatment and a banner treatment. Not what shipped — badge is the always-on status indicator, a toast (critical-transition only) is the alert. Not alternatives, no toggle.

## Mock data

14 drivers: 3 critical, 3 approaching (one crosses into critical live during the demo), 5 on-track, 3 offline. One `currentDelivery: null` for the empty state.

## Build checklist

- [x] 0-12: data model, HOS utils + tests, tiers, hooks, row/section components, dashboard, drill-in, badge treatment
- [x] 13: ~~banner treatment~~ → built as a toast instead
- [ ] 14: ~~dual treatment toggle~~ → dropped, not applicable
- [ ] 15: DriverRow component tests
- [ ] 16: README (this pass)
- [x] 17: renamed alert system → status
- [x] 18: real critical-transition toast alert
- [x] 19: sort each section by time remaining, + regression test
- [x] 20: call-driver action
- [x] 21: acknowledge toggle
- [x] 22: mobile/responsive fixes (column widths, sticky header, hover collisions)
- [x] 23: replaced Tailwind's gray scale

Status-tier filtering (click a count to narrow the table) also done — covers the "or a filter" live-demo ask.

## Not taken

- No `react-window` virtualization at 14-driver scale.
- No backend/real API — simulated data is enough signal for a front-end-scoped exercise.

## Walkthrough prep

- HOS calc should move server-side in production — client clock isn't trustworthy for a legally safety-critical number.
- Derive-don't-store, end to end.
- Live-change surface: new status tier → one object in `statusConfig.js`; new filter → one predicate over the flat driver array.
- Fleet dispatch ↔ restaurant procurement: both have a hard external deadline (HOS limit ≈ order cutoff), many things where only a few need attention now, and offline/stale data as a real failure mode.
