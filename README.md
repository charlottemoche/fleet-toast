# Fleet dispatch — Active Shift dashboard

Take-home for the Design Engineer role. The dashboard a fleet dispatcher lives in, scoped to one variable: HOS (Hours of Service) — drivers have an 11-hour legal driving limit, and the system flags anyone nearing their mandatory reset.

## What's here

- Status table, sorted by urgency, grouped into Critical/Approaching/On track/Offline. Critical and Approaching stay expanded; the other two collapse.
- A real alert: a toast fires when a driver crosses into critical (not on page load, not on every tick), and opens the same drill-in a row click does.
- Drill-in dialog with driver details, a working `tel:` call action, and an acknowledge toggle.
- Offline detection: a stale ping overrides the HOS math, independent of however much drive time the math would otherwise show.
- Time-until-reset is computed live from `shiftStart`, not hardcoded.

Mock data only — 14 drivers, no backend. See `plans/dispatcher-dashboard.md` for the full decision log and what's deliberately out of scope.

## Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (v4, via `@tailwindcss/vite`)
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) for linting
- [Prettier](https://prettier.io/) for formatting (with `prettier-plugin-tailwindcss` for class sorting)
- [commitlint](https://commitlint.js.org/) + [Husky](https://typicode.github.io/husky/) for commit message enforcement

## Getting started

```sh
npm install
npm run dev
```

## Scripts

| Script                 | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Start the dev server                               |
| `npm run build`        | Build for production                               |
| `npm run preview`      | Preview the production build                       |
| `npm run lint`         | Lint with oxlint                                   |
| `npm run format`       | Format the codebase with Prettier                  |
| `npm run format:check` | Check formatting without writing                   |
| `npm run commitlint`   | Check commit messages from `origin/main` to `HEAD` |
| `npm run verify`       | Run `format:check`, `lint`, and `commitlint`       |

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.). Commit messages are linted automatically on commit via a Husky `commit-msg` hook, and again on push (along with lint/format) via a `pre-push` hook.

If a commit or push is rejected, fix the message/formatting/lint errors and try again — don't bypass the hooks.
