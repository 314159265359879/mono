# Claude Instructions

## Code style

- Don't use enums.
- DO NOT USE COMMENTS UNLESS EXPLICITLY ASKED.
- DO NOT REMOVE EXISTING COMMENTS.
- Default to interfaces for object signatures.
- Use `function` declaration for top-level functions and React components.
- Use arrow functions for callbacks.
- Use object method shorthand syntax in objects and interfaces.
  constants.ts files.
- Avoid nested ternary expressions; prefer clear branching or functional expressions.
- Prefer `const` where possible; avoid `let` when it improves clarity.
- Prefer constants over magic numbers or strings.

## Naming

- use camelCase for file-level constants, screaming snake case in the "constants" package or constants.ts files.
- Use descriptive, elaborate, intention-revealing names that explain what the function does, not how.
- Booleans start with is/has/should/can.

## Never use exceptions for control flow

- Do not throw errors in helpers, utility functions, or any part of normal control paths (e.g., React lifecycle, async setup, reducers, render logic).
- Exceptions are for truly unexpected, unrecoverable failures—not for branching or expected conditions.
- Use explicit return values like null, undefined, or well-typed status objects to represent expected failure or alternative paths.

## Decompose impure logic

- Avoid mixing unrelated concerns (e.g., state access, conditional logic, async side effects, configuration).
- Separate pure computation from impure operations (e.g., store reads/writes, I/O, global mutations).
- Factor out non-trivial meaningful logic into named functions, even if only used once.
- Prefer composable functions with clear input/output boundaries.

## Typescript

- Do not use type casting through `as` or non-null assertions (!).
- If a cast is truly necessary, include a runtime check and/or a type guard.
- Do not use `any`; prefer `unknown` with further narrowing if a type cannot be immediately described.

## React component props

- Define component props in a separate interface above the component, in the format
  ComponentNameProps.
- Destructure props directly in the signature: `function Component({ propA, propB }: ComponentProps)`

## File naming

- Use snake case file names
- File names must explain their contents, e.g., a file containing `AlternateHeaderLayout`
  is called `alternate-header-layout.tsx`
- Avoid using index.ts(x) files, except for the following scenarios:
  - Barrel exports from library packages
  - Required by file-based router
- use \*.spec.ts(x) for tests

## Use Remeda for functional utilities

Prefer [Remeda](https://remedajs.com) when working with non-trivial data transformations that benefit from strong typing, immutability, and composability.

### Typed object utilities

Use `keys`, `entries`, and `fromEntries` instead of `Object.keys`, `Object.entries`, and `Object.fromEntries`. Remeda retains exact key types, including literal unions.

```ts
import { keys } from 'remeda';

const obj = { foo: 1, bar: 2 };
const result = keys(obj); // type: ('foo' | 'bar')[]
```

### Chained transformations

```ts
import { filter, groupBy, mapValues, pipe } from 'remeda';

const users = [
  { id: 1, role: 'admin', isActive: true },
  { id: 2, role: 'user', isActive: true },
  { id: 3, role: 'admin', isActive: false },
];

const counts = pipe(
  users,
  filter(u => u.isActive),
  groupBy(u => u.role),
  mapValues(list => list.length)
);
// type: { admin: number; user: number }
```

### When not to use Remeda

Use native JS methods for trivial operations where type inference is already correct and readability is higher:

```ts
const ids = items.map(x => x.id);
```

## Commit conventions

- Use conventional commits format.
- Use scope to specify affected areas, .e.g., feat(mobile), refactor(web), fix(utils).
- Use imperative language.
- Do not add anything to the commit message body unless explicitly asked.

## Tooling

### Package Management

- Our repo is a turbo monorepo which uses `pnpm` for package management and package.json scripts.
- Many common actions can be found in respective pacakge and apps `scripts` in the package.json.

### Verify before completing

Verify that no formatting, type, or lint errors are introduced:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
```

If `format:check` fails, run `pnpm format` to auto-fix formatting issues.

For faster feedback when working in a specific package, use filtered commands:

```bash
pnpm --filter @leather.io/web lint
pnpm --filter @leather.io/extension typecheck
```

Fix any errors before considering the task complete.

### Prettier formatting

Follow the project's Prettier configuration. Key rules:

- Use single quotes for strings
- Use trailing commas where valid in ES5 (objects, arrays)
- 2-space indentation
- 100 character print width
- Avoid parentheses around single arrow function parameters: `x => x` not `(x) => x`
- Imports are auto-sorted: React first, then third-party, then `@leather.io/*`, then relative

## Release notes & changelog (automation-friendly)

We publish product release notes in the Leather changelog: [`app.leather.io/changelog`](https://app.leather.io/changelog).

### Product Release Ethos

#### I. We announce what we release

When we release features we announce them on X and keep a changelog at `app.leather.io/changelog` with robust explanations and images / gifs / videos showing the changes.

Announcing and explaining what we are doing as a team and a product consistently, with moderately high quality, ensures our users:

- Stay interested in our product because they see it growing and improving
- View us as a serious high quality product
- View us as trustworthy and consistent

#### II. We release when the work is done

As a small team there is no need for consolidated ownership of releasing. It is no single person's job to schedule and plan releases; the whole team shares the load and releases as work completes.

### Tone rules (match `app.leather.io/changelog`)

- Lead with **what the user can do now** (not internal implementation).
- Use short headings + short paragraphs.
- Prefer concrete outcomes over vague claims (e.g. “USDCx balances now appear automatically” > “Improved assets”).
- Avoid internal references (ticket IDs, package bumps, refactors, CI-only changes) unless they affect users.
- If a change is security-sensitive, describe impact without exposing exploit details.

### Inputs Claude needs to draft store + changelog notes

Provide these in one message:

- **App**: `mobile` / `extension` / `web` (or multiple)
- **Target version**: e.g. `2.96.4`
- **Last public version(s)**:
  - iOS: `x.y.z`
  - Android: `x.y.z`
- **Any “must-mention” items**: 3–8 bullets from Product/Eng
- **Any “do-not-mention” items**: anything sensitive or not user-facing

If last public versions are unknown, Claude should ask for them first.

### Where to source changes in this repo

- Mobile release history: `apps/mobile/CHANGELOG.md`
- Extension release history: `apps/extension/CHANGELOG.md`
- Web release history: `apps/web/CHANGELOG.md` (if present) or PR summaries

Claude should prefer **Features** + **Bug Fixes** sections over dependency-only entries.

### Release notes templates

#### App Store / Play Store “What’s New” (short)

Use 5–8 bullets max:

- **Swaps**: …
- **Collectibles**: …
- **Performance & reliability**: …

Avoid “Dependencies” and build/CI notes.

#### `app.leather.io/changelog` entry (richer)

Structure:

- **Title** (user-facing): “Leather supports …”, “Improved …”, “New …”
- 1–2 sentence summary (what changed + why it matters)
- 2–4 subheadings with short paragraphs (what’s included, how it works, tips)
- Optional “What you can do now” list
- Optional media callouts (where to add screenshots/gifs/video)

### Checklist: drafting mobile release notes (jump releases)

When the store jumps across many versions (e.g. from `2.81.0` to `2.96.4`), Claude should:

- Treat the release notes as **aggregate since last public version**, not just “what changed in x.y.z”.
- Merge related items into a small number of user-facing themes (swaps, collectibles, onramps, reliability, etc.).
- Call out the biggest visible changes explicitly (new flows/screens, new default assets, new onramps).
- Produce two drafts:
  - **Store notes** (short)
  - **Changelog post** (richer, matches `app.leather.io/changelog` tone)
