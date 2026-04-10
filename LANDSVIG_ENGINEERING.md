# Landsvig Engineering Reference

Technical architecture and conventions for building projects under the Landsvig stack. Use alongside [LANDSVIG_DESIGN_SYSTEM.md](./LANDSVIG_DESIGN_SYSTEM.md) for the visual layer.

---

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Language** | TypeScript (strict) | ES2020 target, ESNext modules |
| **Frontend** | React 18 | Functional components, hooks only |
| **Build** | Vite + SWC | Fast dev server, vendor chunk splitting |
| **Styling** | Tailwind CSS 3 | Utility-only, CSS custom properties in HSL |
| **Animation** | Framer Motion | All motion — no CSS keyframes for UI animation |
| **Routing** | React Router 6 | Client-side SPA, lazy-loaded pages |
| **API** | Vercel Functions | Node.js runtime by default, Edge where needed |
| **AI** | Vercel AI SDK + Anthropic | `streamText()` for chat, `generateObject()` for structured output |
| **Validation** | Zod | Runtime schema validation for AI outputs and API inputs |
| **Storage** | Vercel Blob | JSON content persistence, public asset uploads |
| **Email** | Resend | Transactional email delivery |
| **Auth** | HMAC-SHA256 cookies | Stateless, 24h TTL, HttpOnly/Secure/SameSite=Strict |
| **Analytics** | Vercel Analytics | Page views + Web Vitals |
| **Testing** | Vitest + Playwright | Unit + E2E |
| **Deploy** | Vercel | Git-triggered, automatic |

---

## Repository Structure

```
src/
  main.tsx                 Entry point, mounts React + Analytics
  App.tsx                  BrowserRouter, lazy-loaded routes
  index.css                Tailwind directives + CSS custom properties
  pages/                   Full-page components (Index, Admin, Login, 404)
  components/              Single-file components, no barrel exports
  hooks/                   Custom hooks (useContent, etc.)
  lib/                     Types, constants, utilities
  assets/                  Static media (video, images)
  test/                    Test files + setup

api/
  _auth.ts                 Shared: HMAC token utilities (underscore = internal)
  _content.ts              Shared: Blob read/write, deepMerge
  stream.ts                POST: Claude streaming chat
  contact.ts               POST: Contact form → Resend email
  content.ts               GET: Public content (Blob → fallback)
  admin/
    auth.ts                POST: Password login, set cookie
    check.ts               GET: Verify auth status
    logout.ts              POST: Clear cookie
    save.ts                POST: Patch content section to Blob
    upload.ts              POST: Upload asset to Blob

public/
  favicon.ico
  robots.txt
  sitemap.xml
```

### Conventions

- **Components**: PascalCase, single file, no nested folders. `HeroSection.tsx`, not `hero/Section.tsx`.
- **Hooks**: `use` prefix. One hook per file in `hooks/`.
- **API internals**: Underscore prefix for shared utilities (`_auth.ts`, `_content.ts`). Never exposed as endpoints.
- **API endpoints**: Lowercase, one function per file. File name = route path.
- **Types**: PascalCase interfaces in `lib/`. No `I` prefix (`SiteContent`, not `ISiteContent`).

---

## TypeScript

```json
{
  "target": "ES2020",
  "module": "ESNext",
  "moduleResolution": "bundler",
  "jsx": "react-jsx",
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

**Path alias**: `@/*` → `./src/*`

Props typed with interfaces. No `any`. No `as` casts unless unavoidable (document why). Zod for runtime validation at system boundaries (API inputs, AI outputs).

---

## Build & Dev

```bash
npm run dev          # Vite dev server → localhost:8080
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
npm run lint         # ESLint (flat config)
npm test             # Vitest single run
npm run test:watch   # Vitest watch mode
```

**Vite config**:
- SWC plugin for React (faster than Babel)
- Dev server on port 8080, IPv6 host, HMR overlay disabled
- `@` alias resolves to `./src`
- React deduplication (single instance of react, react-dom, jsx-runtime)

**Chunk splitting**:
- `framer-motion` → separate bundle
- `react` + `react-dom` + `react-router-dom` → `react-vendor` bundle
- Application code → main bundle

---

## API Conventions

### Runtime

Default to **Node.js runtime** for API routes. Use Edge only when the function needs no Node.js APIs (auth checks, simple redirects). Content and AI routes use Node.js because they depend on Blob SDK and streaming.

### CORS

Every endpoint checks the `Origin` header against an allowlist:

```
https://landsvig.com
https://www.landsvig.com
http://localhost:8080
http://localhost:5173
```

Return 403 on mismatch. Handle OPTIONS preflight with 204.

### HTTP Methods

- Reject wrong methods with 405.
- GET for reads. POST for writes. No PUT, PATCH, or DELETE.

### Response Shape

```typescript
// Success
{ success: true }
{ ok: true }
{ url: "https://..." }

// Error
{ error: "Danish error message" }
```

Always `Content-Type: application/json`. Error messages in Danish for user-facing endpoints.

### Input Sanitization

At the API boundary:
- HTML-escape user strings (`&`, `<`, `>`, `"`, `'`)
- Enforce max length (500 chars for form fields)
- Trim whitespace
- Coerce to string (empty string if wrong type)
- Whitelist valid values (section names, upload filenames)

---

## Authentication

Stateless HMAC-SHA256 cookie auth. No database, no sessions table.

### Token Format

```
{timestamp}.{hmac-signature}
```

- Timestamp: `Date.now()` as string
- Signature: HMAC-SHA256 of timestamp, base64-encoded, using `ADMIN_SECRET`
- Uses `crypto.subtle` (works in both Node.js and Edge runtime)

### Cookie Settings

```
admin_token={token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/
```

24-hour TTL. No JavaScript access. HTTPS only. Strict same-site.

### Flow

1. User POSTs password to `/api/admin/auth`
2. Server compares against `ADMIN_PASSWORD` env var
3. On match: create token, set cookie, return `{ ok: true }`
4. Protected routes call `isAuthenticated(req)` which extracts cookie, verifies signature, checks expiry
5. Logout clears cookie with `Max-Age=0`

### Functions (`_auth.ts`)

| Function | Purpose |
|----------|---------|
| `createToken(secret)` | Generate `timestamp.signature` |
| `verifyToken(token, secret)` | Validate signature + check 24h expiry |
| `isAuthenticated(req)` | Extract cookie → verify → boolean |
| `cookieHeader(token)` | Format Set-Cookie string |
| `clearCookieHeader()` | Format cookie-clearing Set-Cookie |
| `getTokenFromRequest(req)` | Parse cookie header |
| `unauthorized()` | Return 401 Response |

---

## Content System

All site content lives in a single `content.json` in Vercel Blob. No database.

### Read Path

```
Client → GET /api/content → readContent() → Blob → deepMerge(DEFAULTS, blob) → Response
```

- Cache: `max-age=30, stale-while-revalidate=120`
- Fallback: If Blob unavailable or token missing, return `DEFAULTS`
- `deepMerge` ensures new schema fields from DEFAULTS always propagate

### Write Path

```
Admin UI → POST /api/admin/save → isAuthenticated() → readContent() → patch section → writeContent()
```

- Sections are replaced wholesale (shallow patch on the top-level key)
- Arrays (work entries, journal entries) replace entirely — no array merging

### deepMerge Behavior

```typescript
deepMerge(target, source)
// Objects: recursive merge
// Arrays: source replaces target entirely
// Primitives: source replaces target
// Undefined source values: keep target
```

This means: adding a new field to DEFAULTS makes it appear automatically after the next read, without migrating stored content.

### Content Type (`SiteContent`)

Defined in `src/lib/content-types.ts`. Sections:

| Section | Key fields |
|---------|-----------|
| `hero` | headline, tagline |
| `kasper` | bio (3-string tuple), details array, portraitUrl |
| `work` | Array of { number, title, description, tag } |
| `metoden` | headline, paragraphs (2-string tuple), backgroundUrl |
| `journal` | Array of { number, tag, title, excerpt } |
| `contact` | headline, tagline, email, backgroundUrl |
| `nav` | style (5 variants), links array |
| `settings` | availability, SEO fields, chatPrompt, social links |

`DEFAULTS` is the complete fallback — hardcoded Danish content for every section.

---

## AI Integration

### Streaming Chat (`/api/stream`)

```typescript
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const result = streamText({
  model: anthropic("claude-sonnet-4-6"),
  system: chatPrompt,        // Fetched from Blob at request time
  messages: messages,         // From request body
  maxTokens: 1024,
});

return result.toTextStreamResponse();
```

- System prompt is editable via admin panel (`settings.chatPrompt`)
- Client uses `useChat({ api: "/api/stream" })` from `@ai-sdk/react`
- Messages stream as Server-Sent Events

### Lead Scoring (in `/api/contact`)

Uses `generateObject()` with a Zod schema to classify contact form submissions.

### Client Hook

```typescript
import { useChat } from "@ai-sdk/react";

const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: "/api/stream",
});
```

---

## Frontend Patterns

### Data Flow

```
useContent() hook → fetches /api/content on mount
                  → returns { content, loading }
                  → falls back to DEFAULTS on error

Index.tsx → calls useContent() once
          → passes section data as explicit props to each component
          → no context providers, no prop drilling beyond one level
```

### Routing

```typescript
// App.tsx
<BrowserRouter>
  <Suspense fallback={<div className="bg-background min-h-screen" />}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
</BrowserRouter>
```

All pages lazy-loaded with `React.lazy()`. Suspense fallback is a blank page in the background color (no spinner).

### Animation

One shared easing constant:

```typescript
export const EASING = [0.22, 1, 0.36, 1] as const;
```

Exported from `RevealText.tsx`, imported everywhere. Two reusable wrappers:

- **`RevealText`**: Text slides up from below on scroll into view. Used for every heading.
- **`ScrollReveal`**: Generic fade + slide-up wrapper. Used for section-level entrance.

Both trigger on `IntersectionObserver` with `once: true` and negative margin (~80–100px before element enters viewport).

### Section Components

Each section:
- Has an `id` for hash-based scroll navigation
- Accepts typed `content` props from `Index.tsx`
- Is self-contained (no internal API calls, no context)
- Uses `ScrollReveal` or `RevealText` for entrance animation

---

## Deployment

### Vercel Configuration

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/admin/(.*)", "destination": "/index.html" },
    { "source": "/admin", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | Yes | Claude API access |
| `RESEND_API_KEY` | Yes | Email delivery |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob persistence |
| `ADMIN_PASSWORD` | Yes | Admin login |
| `ADMIN_SECRET` | Yes | HMAC token signing |

### Build Output

- `dist/assets/index-[hash].js` — App code
- `dist/assets/react-vendor-[hash].js` — React ecosystem
- `dist/assets/framer-motion-[hash].js` — Animation library
- `dist/assets/index-[hash].css` — Compiled Tailwind
- Static assets fingerprinted with immutable cache headers

---

## Testing

**Vitest** for unit tests. **Playwright** for E2E.

```bash
npm test             # Vitest single run
npm run test:watch   # Vitest watch mode
```

Test files in `src/test/`. Globals enabled (no explicit imports for `describe`, `it`, `expect`).

### What's Tested

| File | Coverage |
|------|----------|
| `auth.test.ts` | Token creation, verification, expiry, tampering |
| `content.test.ts` | deepMerge algorithm (recursive merge, array replace, new fields) |
| `admin-handlers.test.ts` | Admin API endpoints |

### Test Conventions

- Test the contract, not the implementation
- Auth tests verify cryptographic properties (tampering detection, time expiry)
- Content tests verify merge semantics (new fields appear, arrays replace, objects merge)
- No mocking of the database — there isn't one

---

## Security

| Concern | Approach |
|---------|----------|
| **XSS** | HTML-escape all user input at the API boundary |
| **CSRF** | SameSite=Strict cookies |
| **Auth** | HMAC-SHA256 with time-based expiry, HttpOnly cookies |
| **CORS** | Origin allowlist on every endpoint |
| **Injection** | Whitelist valid section names, sanitize filenames |
| **Input** | Max length, type coercion, trim, Zod validation |
| **Headers** | nosniff, DENY framing, strict referrer |

---

*v1.0 — Companion to LANDSVIG_DESIGN_SYSTEM.md*
