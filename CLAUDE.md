# CLAUDE.md

**LANDSVIG** — Danish-language personal brand site for Kasper Landsvig, AI consultant & digital tool maker. React + TypeScript + Vite, deployed on Vercel. All UI content is in Danish (`lang="da"`).

See `LANDSVIG_DESIGN_SYSTEM.md` for the visual layer.

---

## Hard Rules

- **Vercel Blob is this project's only persistence layer.** Don't introduce a database, ORM, or sessions table.
- **No context providers.** Data flows through props, one level deep from page components.
- **No barrel exports.** Import directly from the file.
- **No `any`.** No `as` casts unless unavoidable — add a comment explaining why.
- **No CSS keyframes for UI animation.** All motion uses Framer Motion.
- **No PUT, PATCH, or DELETE.** GET for reads, POST for writes.
- **No new API endpoints unless absolutely necessary.** The content system is generic — use it.
- **Error messages in Danish** for user-facing API responses.
- **Tailwind utility classes only.** No CSS-in-JS, no component library. Custom properties defined in HSL in `index.css`.

---

## Stack

React 18 · TypeScript 5.8 · Vite 5.4 (SWC) · Tailwind CSS 3.4 · Framer Motion 12 · Lucide React · React Router 6 · Vercel AI SDK (`streamText`, `generateObject`) · @ai-sdk/anthropic (`claude-sonnet-4-6`) · @ai-sdk/react (`useChat`) · Zod 4 · Vercel Blob · Vercel Edge Functions · Resend · Vercel Analytics · react-markdown + remark-gfm · @tailwindcss/typography · Vitest + Playwright

---

## Commands

```bash
npm run dev          # Vite → localhost:8080
npm run build        # Production → dist/
npm run preview      # Preview production build
npm run lint         # ESLint (flat config)
npm test             # Vitest single run
npm run test:watch   # Vitest watch mode
```

---

## File Structure

```
src/
├── main.tsx                          # React 18 entry point + Vercel Analytics
├── App.tsx                           # BrowserRouter, lazy-loaded routes
├── index.css                         # Tailwind base + CSS variables
├── pages/
│   ├── Index.tsx                     # Main page: composes all sections, chat state, SEO meta
│   ├── Projekter.tsx                 # /projekter — project portfolio page
│   ├── Placeholder.tsx               # /vaerktoejer, /faq — coming-soon shell (title prop)
│   ├── AdminDashboard.tsx            # Content admin panel (4 tabs; auth-gated)
│   ├── AdminLogin.tsx                # Admin login form → /api/admin/auth
│   └── NotFound.tsx                  # 404 fallback
│   └── admin/
│       ├── TeksterTab.tsx            # Edit overview, space, tools, advisory, conversation
│       ├── NavigationTab.tsx         # Edit nav style + links
│       ├── AktiverTab.tsx            # Availability toggle
│       └── IndstillingerTab.tsx      # SEO, chatPrompt, social links
├── components/
│   ├── Navbar.tsx                    # 5 nav style variants (topbar/floating/dots/siderail/overlay)
│   ├── HeroSection.tsx               # Video-to-canvas with scroll parallax; onChatOpen prop
│   ├── ChatDrawer.tsx                # Sliding chat drawer → /api/stream (useChat)
│   ├── ServicesSection.tsx           # Reusable services grid (content.space / content.tools)
│   ├── HaandvaerketSection.tsx       # Advisory text section (content.advisory)
│   ├── KasperSection.tsx             # Portrait + bio section (content.overview)
│   ├── AIContactSection.tsx          # Contact form → /api/contact (content.conversation)
│   ├── RevealText.tsx                # Text slide-up animation (exports EASING)
│   ├── ScrollReveal.tsx              # useInView fade-in wrapper
│   └── SectionDivider.tsx            # Line/ornament divider
├── hooks/
│   └── useContent.ts                 # Fetches /api/content, falls back to DEFAULTS
├── lib/
│   └── content-types.ts             # SiteContent interface + DEFAULTS
├── assets/
│   └── hero-video.mp4               # H.264, 1280px, no audio (~1 MB)
└── test/

api/
├── _auth.ts                          # Shared: HMAC-SHA256 token auth (underscore = internal)
├── _content.ts                       # Shared: Blob read/write, deepMerge (underscore = internal)
├── stream.ts                         # POST — Claude streaming chat
├── contact.ts                        # POST — Contact form → Resend + AI lead scoring
├── content.ts                        # GET — Public content (Blob → DEFAULTS fallback)
└── admin/
    ├── auth.ts                       # POST — Password login, set cookie
    ├── check.ts                      # GET — Verify auth status
    ├── logout.ts                     # POST — Clear cookie
    ├── save.ts                       # POST — Patch content section to Blob
    └── upload.ts                     # POST — Upload asset to Blob (images, audio)
```

**Naming:** Components are PascalCase single files (`HeroSection.tsx`, not `hero/Section.tsx`). API endpoints are lowercase, one function per file. Types are PascalCase interfaces in `lib/`, no `I` prefix (`SiteContent`, not `ISiteContent`). Underscore-prefixed API files are shared internals, never exposed as endpoints.

---

## Routing

```
/                   → Index.tsx          (main single-page site)
/projekter          → Projekter.tsx      (project portfolio)
/vaerktoejer        → Placeholder.tsx    (coming soon)
/faq                → Placeholder.tsx    (coming soon)
/admin              → AdminDashboard.tsx  (auth-gated)
/admin/login        → AdminLogin.tsx
*                   → NotFound.tsx
```

All pages lazy-loaded with `React.lazy()`. Suspense fallback is a blank page in the background color — no spinner.

`vercel.json` rewrites `/admin/*`, `/projekter`, `/vaerktoejer`, and `/faq` to `index.html` for SPA routing.

---

## Content System

All site content is a single `content.json` in Vercel Blob.

**Read:** `GET /api/content` → `readContent()` → `deepMerge(DEFAULTS, blob)` → response. Cache: `max-age=30, stale-while-revalidate=120`. If Blob is unavailable, return `DEFAULTS`.

**Write:** `POST /api/admin/save` → authenticate → read current → patch section → write back. Sections replace wholesale. Arrays replace entirely — no array merging.

**deepMerge:** Objects merge recursively, arrays and primitives replace, undefined source values keep target. Adding a new field to `DEFAULTS` makes it appear automatically — no migration needed.

**Content sections** defined in `SiteContent` in `src/lib/content-types.ts`:

| Section | Purpose |
|---------|---------|
| `overview` | Headline, tagline, bio paragraphs, details list, portrait URL |
| `space` | "Rummet" services grid (headline, tagline, `ServiceItem[]`) |
| `tools` | "Værktøjerne" services grid (headline, tagline, `ServiceItem[]`) |
| `advisory` | "Rådgivningen" text block (headline, paragraphs) |
| `conversation` | Contact section (headline, tagline, email) |
| `nav` | Navigation style + links |
| `settings` | Availability, SEO, chatPrompt, social links |

`DEFAULTS` contains complete hardcoded Danish fallback content for every section.

---

## Auth

Stateless HMAC-SHA256 cookie auth. All logic in `api/_auth.ts`.

Token format: `{timestamp}.{hmac-signature}` using `crypto.subtle` and `ADMIN_SECRET`. Cookie: `admin_token`, HttpOnly, Secure, SameSite=Strict, 24h TTL.

- `AdminDashboard` calls `GET /api/admin/check` on mount; redirects to `/admin/login` on 401
- `AdminLogin` calls `GET /api/admin/check` on mount; redirects to `/admin` if already authenticated

---

## API Conventions

**Runtime:** Node.js by default. Edge only when the function needs no Node.js APIs.

**CORS:** Every endpoint checks `Origin` against the allowlist (`landsvig.com`, `www.landsvig.com`, `localhost:8080`, `localhost:5173`). Return 403 on mismatch, 204 for OPTIONS preflight. Admin routes additionally require valid `admin_token` cookie.

**Response shape:** `{ success: true }` or `{ ok: true }` or `{ url: "..." }` on success. `{ error: "Danish message" }` on error. Always `application/json`.

**Input sanitization at the API boundary:** HTML-escape user strings, enforce max length (500 chars), trim whitespace, coerce to string, whitelist valid section names and filenames.

---

## AI Integration

**Chat streaming** (`/api/stream`): `streamText()` with `anthropic("claude-sonnet-4-6")`. System prompt fetched from Blob at request time (`settings.chatPrompt`), editable via admin panel.

**Client:** `ChatDrawer` uses `useChat({ api: "/api/stream" })` from `@ai-sdk/react`. Chat state (`chatOpen`/`setChatOpen`) lives in `Index.tsx`. Opened by the hero CTA (`onChatOpen` prop). Enter submits, Shift+Enter inserts newline.

**Lead scoring** (`/api/contact`): `generateObject()` with a Zod schema to classify form submissions.

---

## Frontend Patterns

**Data flow:** `useContent()` fetches `/api/content` on mount → `{ content, loading }` → falls back to `DEFAULTS`. Page components call it once, pass section data as explicit props. No context. No prop drilling beyond one level.

**Navigation:** Hash-based section scroll on the main page: `#rummet`, `#vaerktoejerne`, `#raadgivningen`, `#kontakt`. Scroll padding 80px.

**Animation:** Shared easing `[0.22, 1, 0.36, 1]` exported from `RevealText.tsx`. Two reusable wrappers:
- `RevealText` — text slides up on scroll. Used for every heading.
- `ScrollReveal` — generic fade + slide-up. Used for section entrances.

Both use `useInView` with `once: true` and `margin: "-100px"`.

**Hero video:** Hidden `<video>` streams to `<canvas>` via `requestAnimationFrame`, pauses when offscreen. H.264, 1280px, no audio, playback rate 0.75×.

**Section components:** Each has an `id` for hash navigation, accepts typed content props, makes no internal API calls, uses `ScrollReveal` or `RevealText` for entrance.

---

## Styling

- **Fonts:** Playfair Display (serif, headings), JetBrains Mono (monospace, body/UI at 13px base)
- **Colors:** CSS variables in HSL — beige background (`43 33% 97%`), charcoal foreground (`210 4% 18%`)
- **Border radius:** `0.125rem` (minimal)
- **Images:** WebP, `loading="lazy"`, `decoding="async"` for below-fold
- **Prose:** `@tailwindcss/typography` for rendered markdown, customized to match site palette and fonts

---

## Deployment

Vercel, git-triggered. Framework: Vite. Output: `dist/`. Build target: ES2020. Path alias: `@/` → `./src/`.

Rewrites `/admin/*`, `/projekter`, `/vaerktoejer`, `/faq` to `index.html` for SPA routing. Assets get immutable cache headers (1 year). Security headers: nosniff, DENY framing, strict-origin-when-cross-origin referrer.

Chunk splitting: `framer-motion`, `react-vendor` (react + react-dom + react-router-dom), app code.

**Required env vars:** `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `ADMIN_PASSWORD`, `ADMIN_SECRET`.

---

## Testing

Vitest for unit, Playwright for E2E. Test files in `src/test/`. Globals enabled.

Test the contract, not the implementation. No mocking of a database — there isn't one.
