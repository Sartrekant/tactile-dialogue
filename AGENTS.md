# AGENTS.md — LANDSVIG Codebase Rules

Rules for any AI assistant (Claude, Copilot, Cursor, v0, etc.) operating in this repository.
Read this file in full before making any changes. Also read `CLAUDE.md` for project commands,
stack details, and file structure reference.

---

## Project Identity

**LANDSVIG** is a Danish-language single-page marketing site for an AI consultancy targeting
trades businesses (VVS, tømrer, maler, el-installatør). It is a Vite + React 18 + TypeScript SPA
deployed on Vercel. It is NOT a Next.js project. It does NOT use the App Router. It does NOT
use server components. All routing is client-side via React Router 6.

---

## Language Rules

- All UI text, labels, placeholders, error messages, button text, ARIA labels, and meta content
  MUST be in Danish.
- `index.html` is `lang="da"`. This must not change.
- The 404 page (`src/pages/NotFound.tsx`) currently contains English text — this is a known
  exception to fix, not a precedent to follow.
- Do not introduce English copy into any component. Comments and code identifiers may be English.

---

## Directory Structure Rules

```
src/components/   Single-file section or utility components only. No sub-folders.
src/pages/        Route-level page components only (Index.tsx, NotFound.tsx).
src/hooks/        Custom React hooks only. Empty now — reserved.
src/lib/          Pure utility functions only. Empty now — reserved.
src/assets/       Static media: WebP images and mp4 video only.
src/test/         Vitest unit/integration tests and setup.
api/              Vercel Edge Functions only. One function per file.
public/           Static files served at root (favicon, robots.txt).
```

- No barrel files (`index.ts` re-exports). Import components directly by filename.
- No nested folders inside `src/components/`.
- No CSS modules, styled-components, Emotion, or CSS-in-JS of any kind.
- No Storybook, no additional routing libraries.
- No additional UI component libraries (shadcn/ui, Radix, MUI, etc.). Components are built
  from scratch using Tailwind utilities.

### Scaffolding Artifacts — Do Not Mistake for Active Patterns

The following files are Lovable.dev/shadcn scaffolding leftovers. They do NOT represent
active patterns and must not be expanded upon:

- **`components.json`** — shadcn/ui configuration file. The paths it references
  (`@/components/ui/`, `@/lib/utils`) do NOT exist. Do not run `npx shadcn add` or
  any shadcn CLI command against this repo. Do not create `src/components/ui/` or
  `src/lib/utils.ts`.
- **`tailwind.config.ts` keyframes** — `accordion-down`/`accordion-up` and sidebar color
  tokens are template leftovers referencing Radix UI variables. No accordion or sidebar
  component exists. Do not add components that depend on these.
- **`darkMode: ["class"]`** in tailwind.config.ts — dark mode class toggle is wired up in
  the config but intentionally unused. Do not add `dark:` variant classes.

---

## TypeScript Rules

- `strict: true` is required in `tsconfig.app.json`. Do not relax it.
- `noUnusedLocals: true` and `noUnusedParameters: true` must remain enabled.
- `noFallthroughCasesInSwitch: true` must remain enabled.
- The root `tsconfig.json` is a project-references aggregator only. Its `compilerOptions`
  block exists solely for editor tooling path resolution. Do not add loose flags there that
  contradict `tsconfig.app.json`.
- All props must be typed with a named TypeScript `interface` declared at the top of the file.
- Do not use `any`. Do not use type assertions (`as unknown as X`) to silence real errors.
- `noImplicitAny` is enforced via `strict: true`. Do not re-add it as an explicit `false`.

---

## Component Architecture Rules

- All components are functional components using React hooks.
- No class components.
- Each component lives in a single `.tsx` file in `src/components/`.
- No nested component definitions exported from a file that already exports a default component
  (sub-components used only within the same file are allowed as unexported helpers).
- The path alias `@/` maps to `./src/`. Always use `@/` for cross-directory imports.
- Relative imports (`./`, `../`) are allowed only within the same directory.

---

## Animation System Rules

- **All** animations must use Framer Motion 12. Do not use CSS `@keyframes`, `transition` on
  non-Tailwind classes, or any other animation library.
- The shared easing constant is the single source of truth:
  ```ts
  // src/components/RevealText.tsx
  export const EASING = [0.22, 1, 0.36, 1] as const;
  ```
  Import it from there: `import { EASING } from "@/components/RevealText"`.
  Do not hardcode `[0.22, 1, 0.36, 1]` or `cubic-bezier(0.22, 1, 0.36, 1)` elsewhere in JS/TS.
  The exception is `index.css` and inline `style={}` transition strings in `.tsx` files where
  Framer Motion is not driving the animation (e.g. the blur-up image fade in
  `HaandvaerketSection` and `AIContactSection`).
- Scroll-triggered animations follow a three-tier margin convention based on element role:
  - **`"-100px"`** — content reveals: text, cards, feature lists, pricing elements, inline
    `whileInView` paragraphs. This is the default for anything inside a section.
  - **`"-80px"`** — section/layout wrappers: `ScrollReveal.tsx`, full journal sections.
    Trigger slightly earlier so the wrapper fades in before inner `-100px` elements.
  - **`"-50px"`** — decorative micro-elements: `SectionDivider.tsx` lines/ornaments,
    the `AnimatedFooter` rule line. These are thin visual elements that should appear
    promptly without waiting deep into the viewport.
  Do not use any other margin values without a code comment justifying the choice.
- The motion pattern is always `initial` → `animate` → `transition` (not `variants` unless
  complexity demands it). `whileInView` is acceptable for stateless one-shot reveals without a ref.
- The hero video renders via a hidden `<video>` streamed to a `<canvas>` via `requestAnimationFrame`.
  Do not replace this with a direct `<video>` element or any third-party video player.
- Parallax scroll effects use `useScroll` + `useTransform` from Framer Motion.
  Scale range for full-bleed images is `[1, 1.05]` over `["start end", "end start"]`.
- Do not add `will-change` properties unless already present.

---

## Styling Rules

### Fonts
- Headings (`h1`–`h6`): `font-serif` → Playfair Display. Applied globally in `index.css`.
  Use `font-serif` Tailwind class on heading elements.
- Body / UI / labels / buttons: `font-mono` → JetBrains Mono at `13px` base.
  Applied globally in `index.css` on `body`.
- Do not introduce any other typefaces. Do not change the Google Fonts import in `index.html`.

### Colors
- Use CSS variables exclusively via Tailwind semantic tokens:
  `bg-background`, `text-foreground`, `bg-foreground`, `text-background`,
  `border-border`, `bg-muted`, `text-muted-foreground`, etc.
- Do not hardcode hex, RGB, or raw HSL values in Tailwind classes or inline styles.
  Exception: the navbar uses `rgba(249, 248, 244, 0.8)` as an inline style for backdrop
  transparency — this is intentional and must not be changed to a Tailwind class.
- Opacity modifiers on semantic tokens are allowed: `text-foreground/70`, `bg-foreground/10`.

### Border Radius
- `--radius` is `0.125rem` (2px). The design is intentionally near-square.
- The tailwind.config.ts uses shadcn-style overrides:
  - `rounded-lg` = `var(--radius)` = **2px** ← use this as the standard
  - `rounded-md` = `calc(var(--radius) - 2px)` = 0px
  - `rounded-sm` = `calc(var(--radius) - 4px)` = -2px (clamps to 0 in browsers)
- Use `rounded-lg` for most elements. Use `rounded-full` only for pill/circular micro-elements
  such as waveform bars. Do not use `rounded`, `rounded-md`, or `rounded-sm`.

### Tailwind Conventions
- Tailwind utilities only. No custom CSS classes in `index.css` beyond the `@layer base` block
  already present.
- Do not add new `@layer components` or `@layer utilities` blocks.
- Max content width: `max-w-6xl` (72rem). Do not introduce wider containers.
- Section horizontal padding: `px-4 md:px-6`.
- Section vertical padding: `py-20 md:py-32`.
- Responsive breakpoint: `md` (768px) is the primary breakpoint. Do not add `sm`, `lg`, or `xl`
  breakpoints unless strictly necessary, and document why.
- `clamp()` is used for fluid heading sizes (e.g. `text-[clamp(2rem,6vw,4.5rem)]`). Preserve
  these; do not replace with fixed Tailwind text sizes.

---

## Testing Rules

- Unit/integration tests: Vitest + Testing Library. Files live in `src/test/` or co-located as
  `*.test.tsx` files in `src/components/` or `src/pages/`.
- E2E tests: Playwright via `playwright.config.ts`.
- Run tests before committing any change: `npm test`.
- The `matchMedia` mock in `src/test/setup.ts` must remain. Do not remove it.
- Do not add snapshot tests. They create noise and break on cosmetic changes.
- Test user-visible behavior, not implementation details.
- The contact form submission path (`/api/contact`) should be mocked in unit tests —
  do not make real network calls in tests.

---

## API / Edge Function Rules

- All API routes live in `api/`. Each file exports a single default `async function handler(req: Request)`.
- All Edge Functions must include `export const config = { runtime: "edge" }`.
- `api/contact.ts` is the only API route. Do not add routes unless clearly required.
- Security requirements (non-negotiable):
  - HTML-escape all user input with the existing `escapeHtml()` function before using it in
    HTML email templates.
  - Enforce input length limits (500 chars max) via `sanitize()`.
  - Origin allowlist check must remain: only `https://landsvig.com`,
    `https://www.landsvig.com`, `http://localhost:8080`, `http://localhost:5173` are permitted.
  - Method check: only `POST` is accepted. All others return 405.
- `RESEND_API_KEY` is an environment variable. Never hardcode it. Never log it.
- The sender address is `noreply@landsvig.com`. The recipient is `kasper@landsvig.com`.
  Do not change these without explicit instruction.

---

## Build System Rules

- Bundler: Vite 5 with `@vitejs/plugin-react-swc`. Do not switch to Babel or esbuild directly.
- Build target: `ES2020`. Do not lower it.
- Manual chunks: `framer-motion` and `react-vendor` are split intentionally. Do not consolidate them.
- Path alias `@/` → `./src/` is defined in both `vite.config.ts` and `tsconfig.app.json`. Keep them in sync.
- Dev server runs on port `8080`. Do not change this — it is in the Resend/Vercel origin allowlist.

---

## Deployment Rules

- Platform: Vercel. Framework preset: `vite` (NOT `nextjs`).
- The `vercel.json` defines cache headers and security headers. Do not remove them.
- SPA fallback: Vite's default SPA mode rewrites all 404s to `index.html`. React Router handles
  client-side routing. Do not add a `rewrites` block to `vercel.json` unless required.

---

## What Is Forbidden — Never Change

1. Do not convert this project to Next.js or add any Next.js dependencies.
2. Do not add a dark mode. There is no `dark:` variant in use and the design has no dark theme.
3. Do not add a component library (shadcn/ui, Radix UI primitives, MUI, Ant Design, etc.).
4. Do not add a state management library (Redux, Zustand, Jotai, etc.).
5. Do not add a CSS-in-JS library.
6. Do not add a new font family.
7. Do not change `lang="da"` on the `<html>` element.
8. Do not change `--radius: 0.125rem` in `index.css`.
9. Do not change `EASING = [0.22, 1, 0.36, 1]` in `RevealText.tsx`.
10. Do not split a section component into a sub-folder structure.
11. Do not add barrel exports (`index.ts` files).
12. Do not add a database or ORM.
13. Do not upgrade to React 19 without explicit approval and a full migration plan.
14. Do not disable ESLint rules project-wide via `eslint.config.js` overrides.
15. Do not add server-side rendering, static site generation, or hydration strategies —
    this is a pure client-side SPA.
