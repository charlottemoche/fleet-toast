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

Flat array of driver objects, plus a separate flat array of trucks (drivers reference one by `truckId`).

```
{
  id, name, truckId, phone,
  shiftStart,       // HOS calc
  lastPing,         // offline/staleness detection
  location: { lat, lng, label },
  currentDelivery: { id, eta, loads, isPerishable } | null,
  logs: [{ timestamp, message }]   // dispatcher notes, static mock data
}
```

```
{ id, make, model, year }   // trucks.js — a real distinct entity, not a bare string on the driver
```

**Derived, never stored:** status/time-remaining/offline all recompute from `shiftStart`/`lastPing`/`now` every tick — never a persisted `status: "critical"` field that can go stale.

## Architecture decisions

- Pure functions in `hos.js`, `now` passed as a param — testable without mocking time.
- Staleness check wins over tier resolution — an unreachable driver's reading can't be trusted.
- One shared `useClockTick`, not a timer per row.
- Dashboard ticks ~5s, drill-in ticks 1s — only the open drill-in needs a live countdown.
- No Context; `statusConfig.js` is data-driven (array of tiers) — new tier = one object.
- Status = current state (pill). Alert = fires on an event (toast) — not the same concept.
- Toast fires only on transition into an alertable tier (Critical or Violation), not on every render/poll.
- Toast doesn't auto-dismiss — only × or "View driver" (which opens the drill-in) clears it.
- Toast opens the drill-in — the brief requires that flow, not optional.
- Rows sorted ascending by time remaining within each tier — most urgent leads.
- Sticky header lives inside a bounded, internally-scrolling table panel rather than page-level scroll — stays visible without breaking horizontal scroll on mobile.
- Semantic color tokens (`success`/`warning`/`error`/`critical`/`info`/`action`) drive every status badge, filter pill, and toast — one token per meaning, no hardcoded colors per component.
- Dispatcher activity shows as a per-driver log (timestamped notes) — the table's Logs column, and in full in the drill-in. Static mock data, same as `currentDelivery`/`location` — no write path exists yet.
- `driver.phone` + a real `tel:` link — an action that actually works, not a mockup of one we can't build (reassignment/dispatch).

## Alert tiers

- **Violation** — at the HOS limit (0 min).
- **Critical** — <20 min.
- **Approaching** — <2hr.
- **On track**
- **Offline/stale** — no ping in N min, greyed out.

No pagination. Virtualization not needed at demo scale.

## Layout — Hybrid

One urgency-sorted table, broken into labeled sections with live counts. Chosen over a plain sorted list (no glance) or status swimlanes (on-track drivers hidden behind a click). Every section always shows its rows; the status filter (a dropdown menu) is the only way to isolate one tier.

## Mock data

14 drivers: 3 critical (one crosses into violation live during the demo), 3 approaching (one crosses into critical live during the demo), 5 on-track, 3 offline. One `currentDelivery: null` for the empty state.

## Build checklist

- [x] Data model, HOS utils + tests, status tiers, hooks
- [x] Row/section components, dashboard, drill-in, badge treatment
- [x] Toast alert
- [x] Sort each section by time remaining, + regression test
- [x] Call-driver action
- [x] Mobile/responsive fixes (column widths, sticky header, hover collisions)
- [x] Status-tier filter — a dropdown menu that isolates one tier at a time
- [x] Violation tier (remaining at zero) — distinct from Critical, its own alert
- [x] Alert hook derives which tiers to alert on from tier config (`alertMessage`), not a hardcoded tier list
- [x] Time-remaining display fixed so "0m" only means the real HOS floor
- [x] Faster dashboard tick for quicker status/alert updates
- [x] Full test suite for format/status-config helpers, plus a demo failing test
- [x] README rewritten to match current behavior (hooks, scripts, what's-here)
- [x] Trucks modeled as a real entity (`trucks.js`), referenced by `truckId` — Truck row in the drill-in shows make/model/year, not just an id string
- [x] "Trucks available" stat genuinely derived (`trucks.length - active deliveries`), not hardcoded
- [x] Sticky Driver column when scrolling the table horizontally
- [x] Extracted a shared `Modal` component — `DriverDrillIn` and the Needs Review panel were duplicating the same dialog-open/backdrop-close/close-button logic verbatim
- [x] Per-driver activity log (dispatcher notes) — Logs column in the table, full list in the drill-in
- [x] "Needs review" stat is clickable — opens a panel listing every current Critical/Violation driver with one-click calling
- [x] Section collapse/expand removed — every section always shows its rows now that the filter dropdown covers "isolate one tier"
- [x] Tier lookups (`getTierById`) are the single source for label/color — no separate `section` field or duplicate lookup functions

## Not taken

- No `react-window` virtualization at 14-driver scale.
- No backend/real API — simulated data is enough signal for a front-end-scoped exercise.

## Walkthrough prep

- HOS calc should move server-side in production — client clock isn't trustworthy for a legally safety-critical number.
- Logs are static local data — no write path, no persistence, no multi-dispatcher visibility. Production needs a real log entity, persisted server-side and pushed live (WebSocket), same reasoning as HOS.
- Derive-don't-store, end to end.
- Live-change surface: new status tier → one object in `statusConfig.js`; new filter → one predicate over the flat driver array.
- Fleet dispatch ↔ restaurant procurement: both have a hard external deadline (HOS limit ≈ order cutoff), many things where only a few need attention now, and offline/stale data as a real failure mode.
