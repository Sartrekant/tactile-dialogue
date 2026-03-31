# CLAUDE.md

## Project

**LANDSVIG** — Danish-language single-page personal brand site for Kasper Landsvig, AI consultant & digital tool maker. React + TypeScript + Vite, deployed on Vercel.

## Commands

```bash
npm run dev          # dev server → localhost:8080
npm run build        # production build → dist/
npm run preview      # preview production build
npm run lint         # ESLint
npm test             # Vitest (single run)
npm run test:watch   # Vitest watch mode
```

## Stack

- **React 18** + **TypeScript 5.8** + **Vite 5.4** (SWC compiler)
- **Framer Motion 12** — all animations
- **TailwindCSS 3.4** — utility-only styling, CSS variables in HSL
- **Lucide React** — icons
- **Vercel AI SDK (`ai`)** — `streamText` for chat, `generateObject` for lead scoring
- **@ai-sdk/react** — `useChat` hook for streaming chat UI
- **@ai-sdk/anthropic** — Claude model provider (`claude-sonnet-4-6`)
- **Zod 4** — schema validation for AI outputs
- **Vercel Edge Functions** — API routes (`/api/`)
- **Resend** — transactional email
- **@vercel/blob** — content persistence (stores `content.json`)
- **@vercel/analytics** — page view + Web Vitals tracking

## File Structure

```
src/
├── main.tsx                          # React 18 entry point + Vercel Analytics
├── App.tsx                           # BrowserRouter, routes (Index, AdminDashboard, AdminLogin, NotFound)
├── index.css                         # Tailwind base + CSS variables
├── pages/
│   ├── Index.tsx                     # Main page: composes all sections, chat state, SEO meta update
│   ├── AdminDashboard.tsx            # Content admin panel (5 tabs; auth-gated)
│   ├── AdminLogin.tsx                # Admin login form → /api/admin/auth
│   └── NotFound.tsx                  # 404 fallback
├── components/
│   ├── Navbar.tsx                    # 5 nav style variants (topbar/floating/dots/siderail/overlay)
│   ├── HeroSection.tsx               # Video-to-canvas with scroll parallax; onChatOpen prop
│   ├── ChatDrawer.tsx                # Sliding chat drawer → /api/stream (useChat)
│   ├── SelectedWorkSection.tsx       # Portfolio entries (from content.work)
│   ├── HaandvaerketSection.tsx       # Full-bleed image section with parallax
│   ├── KasperSection.tsx             # Founder bio section
│   ├── JournalenSection.tsx          # Journal/blog entries (from content.journal)
│   ├── AIContactSection.tsx          # Contact form → /api/contact
│   ├── RevealText.tsx                # Text slide-up animation (exports EASING)
│   ├── ScrollReveal.tsx              # useInView fade-in wrapper
│   └── SectionDivider.tsx            # Line/ornament divider
├── hooks/
│   └── useContent.ts                 # Fetches /api/content, falls back to DEFAULTS
├── lib/
│   └── content-types.ts             # SiteContent interface + DEFAULTS
├── assets/
│   ├── hero-video.mp4               # H.264, 1280px, no audio (~1 MB)
│   ├── hero.webp                    # Håndværket background (48 KB)
│   └── contact-bg.webp              # Contact section background (147 KB)
└── test/
    └── example.test.ts

api/
├── contact.ts                        # Edge Function: Resend email + AI lead scoring
├── stream.ts                         # Edge Function: Claude streaming chat
├── content.ts                        # Edge Function: public GET for site content (Blob → DEFAULTS fallback)
├── _content.ts                       # Shared: readContent(), writeContent(), deepMerge()
├── _auth.ts                          # Shared: HMAC-SHA256 token auth (createToken, verifyToken, isAuthenticated)
└── admin/
    ├── auth.ts                       # POST /api/admin/auth — password login, sets cookie
    ├── logout.ts                     # POST /api/admin/logout — clears cookie
    ├── check.ts                      # GET /api/admin/check — verify auth (used by AdminDashboard on mount)
    ├── save.ts                       # POST /api/admin/save — patch a content section to Blob
    └── upload.ts                     # POST /api/admin/upload — upload asset to Blob

public/
├── favicon.ico
└── robots.txt
```

## Navigation

Hash-based section scroll: `#kasper`, `#metoden`, `#journalen`, `#kontakt`.
Scroll padding is 80px (fixed navbar height).

## Content System

All site content is stored in Vercel Blob as `content.json` and served via `/api/content`.

- `useContent()` hook in `Index.tsx` fetches on mount; falls back to `DEFAULTS` if Blob unavailable
- `AdminDashboard` allows live editing without redeployment
- `deepMerge()` in `api/_content.ts` ensures new schema fields always present after Blob reads
- Arrays (`work[]`, `journal[]`) are fully replaced on save — not merged

## Admin Panel

- Route: `/admin` — requires authentication
- Route: `/admin/login` — password form
- Auth: HMAC-SHA256 cookie (`admin_token`), 24h TTL, HttpOnly/Secure/SameSite=Strict
- On mount, `AdminDashboard` calls `GET /api/admin/check`; redirects to `/admin/login` on 401
- `AdminLogin` calls `GET /api/admin/check` on mount; redirects to `/admin` if already authenticated

## Conventions

### Animation

Shared easing constant from `RevealText.tsx`:

```ts
export const EASING = [0.22, 1, 0.36, 1] as const;
```

- Scroll reveals: `useInView(ref, { once: true, margin: "-100px" })`
- Motion pattern: `initial` → `animate` → `transition`
- Hero video: hidden `<video>` streams to `<canvas>` via `requestAnimationFrame`, pauses when offscreen

### Styling

- **Fonts**: Playfair Display (serif, headings), JetBrains Mono (monospace, body/UI at 13px base)
- **Colors**: CSS variables in HSL — beige background (`43 33% 97%`), charcoal foreground (`210 4% 18%`)
- **Border radius**: `0.125rem` (minimal)
- Tailwind utilities only. No CSS-in-JS, no component library.

### Components

- Functional components with hooks only
- Props typed with TypeScript interfaces
- Single-file components (no barrel exports, no nested folders)
- All section components accept `content` props from `useContent()` via `Index.tsx`

### Images & Media

- WebP format, `loading="lazy"`, `decoding="async"` for below-fold images
- Video: H.264, 1280px wide, audio stripped, `preload="metadata"`, playback rate 0.75×

### API

- `api/contact.ts` — receives form POST, sanitizes input (500-char limit, HTML-escape), sends email via Resend
- `api/stream.ts` — receives `{ messages }` POST, reads `chatPrompt` from Blob at request time, streams Claude Sonnet
- `api/content.ts` — public GET, 30s cache + 120s stale-while-revalidate, falls back to DEFAULTS
- All API routes: origin allowlist (`landsvig.com`, `localhost:8080`, `localhost:5173`), 405 on wrong method
- Admin routes additionally require valid `admin_token` cookie

### Chat

- `ChatDrawer` uses `useChat({ api: "/api/stream" })` from `@ai-sdk/react`
- State lives in `Index.tsx` (`chatOpen` / `setChatOpen`)
- Opened by the hero CTA button (`onChatOpen` prop on `HeroSection`)
- System prompt is editable live via admin panel (`settings.chatPrompt`)
- Enter submits, Shift+Enter inserts newline

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Yes | Contact form email delivery |
| `ANTHROPIC_API_KEY` | Yes | Chat streaming + lead scoring |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob content persistence |
| `ADMIN_PASSWORD` | Yes | Admin panel login |
| `ADMIN_SECRET` | Yes | HMAC signing key for auth tokens |

## Build

- Path alias: `@/` → `./src/`
- Chunk splitting: `framer-motion`, `react-vendor` (react + react-dom + react-router-dom), app code
- Build target: ES2020

## Language

All UI content is in **Danish**. The site uses `lang="da"`.
