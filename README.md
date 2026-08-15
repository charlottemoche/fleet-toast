# Take home specs

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
