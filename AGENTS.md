# Agent rules

Rules for AI tools working in this repo.

## Code style

- Use imports. Never use namespaced calls like `React.useState` — import what you need directly.
- Prefer flat, named functions over nested function definitions. If a function needs a helper, pull the helper out as its own named function (or a sibling function in the same scope) rather than defining it inline inside another function — easier to read and reason about independently.
- Use descriptive names. No shorthand — name things for what they actually do.
- No unnecessary comments. Only comment non-obvious logic — don't restate what the code already says.
- Use semantic HTML and make elements accessible wherever possible.

## Architecture

- Derive values from existing state instead of storing duplicates. Before adding a new `useState`, ask: can this be computed from data that's already there? Most flags/toggles/counts should be derived, not stored.
- Watch for state sprawl when adding new features — new functionality should rarely mean new state by default. If two pieces of state seem to track each other, that's a sign they should be merged or one should be derived from the other.

## General

- No unnecessary code or over-engineering. Keep implementations lean — don't pad with abstractions, config layers, or generality the task doesn't need.
- Don't be verbose. Say what's necessary, skip the narration.
- Explain reasoning before or alongside a suggestion, not just the output — the why matters, not just working code.
- If pushed back on, don't just concede — check first, and only correct if the pushback is actually right. Say so directly rather than folding immediately.
- Let reasoning finish before jumping to code, when it's being talked through out loud first.
- Before adding a new feature, check what's already there first. Don't just bolt on — old code tends to get left behind and pile up as dead/unnecessary cruft. Look at what the new feature touches, and clean up anything that's redundant or no longer necessary.
