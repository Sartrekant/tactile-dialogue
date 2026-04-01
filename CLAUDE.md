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
│   ├── Ressourcer.tsx                # /ressourcer — card grid index with type filter tabs
│   ├── RessourceDetail.tsx           # /ressourcer/:id — article/audio/video detail page
│   ├── AdminDashboard.tsx            # Content admin panel (6 tabs; auth-gated)
│   ├── AdminLogin.tsx                # Admin login form → /api/admin/auth
│   └── NotFound.tsx                  # 404 fallback
├── components/
│   ├── Navbar.tsx                    # 5 nav style variants (topbar/floating/dots/siderail/overlay)
│   ├── HeroSection.tsx               # Video-to-canvas with scroll parallax; onChatOpen prop
│   ├── ChatDrawer.tsx                # Sliding chat drawer → /api/stream (useChat)
│   ├── SelectedWorkSection.tsx       # Portfolio entries (content.work)
│   ├── HaandvaerketSection.tsx       # Full-bleed image section with parallax
│   ├── KasperSection.tsx             # Founder bio section
│   ├── JournalenSection.tsx          # Journal/blog entries (content.journal)
│   ├── AIContactSection.tsx          # Contact form → /api/contact
│   ├── RevealText.tsx                # Text slide-up animation (exports EASING)
│   ├── ScrollReveal.tsx              # useInView fade-in wrapper
│   └── SectionDivider.tsx            # Line/ornament divider
├── hooks/
│   └── useContent.ts                 # Fetches /api/content, falls back to DEFAULTS
├── lib/
│   └── content-types.ts             # SiteContent, RessourceEntry interfaces + DEFAULTS
├── assets/
│   ├── hero-video.mp4               # H.264, 1280px, no audio (~1 MB)
│   ├── hero.webp                    # Håndværket background (48 KB)
│   └── contact-bg.webp              # Contact background (147 KB)
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
/ressourcer         → Ressourcer.tsx     (curated content grid)
/ressourcer/:id     → RessourceDetail.tsx (single entry detail)
/admin              → AdminDashboard.tsx  (auth-gated)
/admin/login        → AdminLogin.tsx
*                   → NotFound.tsx
```

All pages lazy-loaded with `React.lazy()`. Suspense fallback is a blank page in the background color — no spinner.

`vercel.json` rewrites `/admin/*` and `/ressourcer/*` to `index.html` for SPA routing.

---

## Content System

All site content is a single `content.json` in Vercel Blob.

**Read:** `GET /api/content` → `readContent()` → `deepMerge(DEFAULTS, blob)` → response. Cache: `max-age=30, stale-while-revalidate=120`. If Blob is unavailable, return `DEFAULTS`.

**Write:** `POST /api/admin/save` → authenticate → read current → patch section → write back. Sections replace wholesale. Arrays replace entirely — no array merging.

**deepMerge:** Objects merge recursively, arrays and primitives replace, undefined source values keep target. Adding a new field to `DEFAULTS` makes it appear automatically — no migration needed.

**Content sections** defined in `SiteContent` in `src/lib/content-types.ts`:

| Section | Purpose |
|---------|---------|
| `hero` | Headline, tagline |
| `kasper` | Founder bio, portrait |
| `work` | Portfolio entries array |
| `metoden` | Method section, background image |
| `journal` | Journal entries array |
| `contact` | Contact info, background image |
| `nav` | Navigation style + links |
| `settings` | Availability, SEO, chatPrompt, social links |
| `ressourcer` | Curated NotebookLM content (articles, audio, video) |

`DEFAULTS` contains complete hardcoded Danish fallback content for every section.

---

## Ressourcer

Curated portfolio of NotebookLM content — markdown articles, audio overviews, and YouTube videos.

**Entry type** (`RessourceEntry` in `content-types.ts`):

```typescript
{
  id: string;              // slug, e.g. "ai-strategi-2025"
  type: "article" | "audio" | "video";
  title: string;
  excerpt: string;         // 1-2 sentences for card display
  tag: string;             // e.g. "AI Strategi", "Podcast"
  date: string;            // ISO date for sorting
  featured: boolean;       // pinned to top of grid
  content?: string;        // markdown body (articles only)
  audioUrl?: string;       // Vercel Blob URL (audio only)
  videoId?: string;        // YouTube video ID (video only)
  coverUrl?: string;       // optional card thumbnail
}
```

**Index page** (`/ressourcer`): Filter tabs (Alle / Artikler / Audio / Video), responsive card grid (1/2/3 cols), sorted by date descending with featured entries first. Cards show type icon, title, excerpt, tag, date.

**Detail page** (`/ressourcer/:id`): Renders based on entry type:
- **article** — markdown rendered with `react-markdown` + `remark-gfm`, styled with `@tailwindcss/typography` prose classes customized to site palette
- **audio** — native `<audio>` player styled to match site, with title/description
- **video** — YouTube `<iframe>` embed, with title/description

Audio files are uploaded to Vercel Blob via `/api/admin/upload`. Markdown content is stored inline in `content.json`. No separate files, no new API endpoints.

**Admin panel** manages entries in the 6th tab of `AdminDashboard`. Form fields adapt to the selected type. Supports add/edit/delete/reorder.

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

**Navigation:** Hash-based section scroll on the main page: `#kasper`, `#metoden`, `#journalen`, `#kontakt`. Scroll padding 80px. `/ressourcer` link in navbar.

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

Rewrites route `/admin/*` and `/ressourcer/*` to `index.html` for SPA routing. Assets get immutable cache headers (1 year). Security headers: nosniff, DENY framing, strict-origin-when-cross-origin referrer.

Chunk splitting: `framer-motion`, `react-vendor` (react + react-dom + react-router-dom), app code.

**Required env vars:** `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `ADMIN_PASSWORD`, `ADMIN_SECRET`.

---

## Testing

Vitest for unit, Playwright for E2E. Test files in `src/test/`. Globals enabled.

Test the contract, not the implementation. No mocking of a database — there isn't one.
