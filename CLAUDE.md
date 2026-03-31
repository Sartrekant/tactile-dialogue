# CLAUDE.md

## Project

**LANDSVIG** — Danish-language single-page marketing site for an AI consultancy targeting trades businesses (VVS, tømrer, maler, el-installatør). React + TypeScript + Vite, deployed on Vercel.

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
- **@ai-sdk/anthropic** — Claude model provider
- **Zod 4** — schema validation for AI outputs
- **Vercel Edge Functions** — API routes (`/api/`)
- **Resend** — transactional email
- **@vercel/analytics** — page view + Web Vitals tracking

## File Structure

```
src/
├── main.tsx                          # React 18 entry point + Vercel Analytics
├── App.tsx                           # BrowserRouter, routes (Index + NotFound)
├── index.css                         # Tailwind base + CSS variables
├── pages/
│   ├── Index.tsx                     # Main page, composes all sections + chat state
│   └── NotFound.tsx                  # 404 fallback
├── components/
│   ├── Navbar.tsx                    # Fixed nav, mobile hamburger menu
│   ├── HeroSection.tsx              # Video-to-canvas with scroll parallax; onChatOpen prop
│   ├── ChatDrawer.tsx               # Sliding chat drawer → /api/stream (useChat)
│   ├── WorkshopGrid.tsx             # 3 expandable tool cards
│   ├── HaandvaerketSection.tsx      # Full-bleed image section with parallax
│   ├── PricingSection.tsx           # 3 pricing cards + bundle
│   ├── KasperSection.tsx            # Founder bio section
│   ├── JournalenSection.tsx         # Hardcoded journal/blog entries
│   ├── AIContactSection.tsx         # Contact form → /api/contact
│   ├── RevealText.tsx               # Text slide-up animation (exports EASING)
│   ├── ScrollReveal.tsx             # useInView fade-in wrapper
│   └── SectionDivider.tsx           # Line/ornament divider
├── assets/
│   ├── hero-video.mp4               # H.264, 1280px, no audio (~1 MB)
│   ├── hero.webp                    # Håndværket background (48 KB)
│   └── contact-bg.webp              # Contact section background (147 KB)
├── hooks/                            # (empty, reserved)
├── lib/                              # (empty, reserved)
└── test/
    ├── example.test.ts
    └── setup.ts

api/
├── contact.ts                        # Edge Function: Resend email + AI lead scoring
└── stream.ts                         # Edge Function: Claude streaming chat

public/
├── favicon.ico
└── robots.txt
```

## Navigation

Hash-based section scroll: `#kasper`, `#vaerkstedet`, `#haandvaerket`, `#priser`, `#journalen`, `#kontakt`.
Scroll padding is 80px (fixed navbar height).

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

- **Fonts**: Playfair Display (serif, headings h1–h6 with tracking-tight), JetBrains Mono (monospace, body/UI at 13px base)
- **Colors**: CSS variables in HSL — beige background (`43 33% 97%`), charcoal foreground (`210 4% 18%`)
- **Border radius**: `0.125rem` (minimal)
- Tailwind utilities only. No CSS-in-JS, no component library.

### Components

- Functional components with hooks only
- Props typed with TypeScript interfaces
- Single-file components (no barrel exports, no nested folders)

### Images & Media

- WebP format, `loading="lazy"`, `decoding="async"` for below-fold images
- Video: H.264, 1280px wide, audio stripped, `preload="metadata"`, playback rate 0.75×

### API

- `api/contact.ts` — receives form POST, runs `generateObject` (Claude Haiku) for lead scoring, sends enriched email via Resend
- `api/stream.ts` — receives `{ messages }` POST, streams Claude Sonnet response via `streamText`
- Both: HTML escaping, input length limits (500 chars), origin allowlist
- Sends to `kasper@landsvig.com` via Resend

### Chat

- `ChatDrawer` uses `useChat({ api: "/api/stream" })` from `@ai-sdk/react`
- State lives in `Index.tsx` (`chatOpen` / `setChatOpen`)
- Opened by the hero CTA button (`onChatOpen` prop on `HeroSection`)
- Enter submits, Shift+Enter inserts newline

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Yes | Contact form email delivery |
| `ANTHROPIC_API_KEY` | Yes | Chat streaming + lead scoring |

## Build

- Path alias: `@/` → `./src/`
- Chunk splitting: `framer-motion`, `react-vendor` (react + react-dom + react-router-dom), app code
- Build target: ES2020
- Total dist: ~1.5 MB

## Language

All UI content is in **Danish**. The site uses `lang="da"`.
