

# LANDSVIG — "Den Taktile Algoritme"

## Overview
A single-page web app for LANDSVIG, a boutique AI consultancy. The design follows "quiet luxury" Scandinavian minimalism with physical, analog-feeling aesthetics.

## Design System
- **Background**: Benhvid (#F9F8F4)
- **Primary text**: Oxideret stål (#2C2E30)
- **Borders**: Varm grå hør (#E2DFD8)
- **Fonts**: Playfair Display (headings), JetBrains Mono (body/labels)
- **Noise texture overlay** for tactile paper feel
- **No standard shadows, no large border-radius, no off-palette colors**

## Components to Build

### 1. Design System Setup
- Install Framer Motion
- Import Google Fonts (Playfair Display, JetBrains Mono)
- Update Tailwind config with custom colors and fonts
- Add noise texture overlay in App.tsx

### 2. `<RevealText />` — Reusable Animation Component
- overflow-hidden wrapper with text animating from y:100% to y:0%
- Uses custom easing [0.22, 1, 0.36, 1], duration 0.8-1.2s
- Scroll-triggered with `viewport={{ once: true, margin: "-100px" }}`

### 3. `<Navbar />`
- Sticky, glassmorphic (backdrop-blur, semi-transparent #F9F8F4)
- Left: "LANDSVIG" in Playfair Display
- Right: "Værkstedet", "Håndværket", "Kontakt" in JetBrains Mono uppercase
- Bottom border in #E2DFD8

### 4. `<HeroSection />`
- Full viewport height, centered content, generous whitespace
- H1 (Playfair, massive): "Vi bygger systemet. Så du kan køre hjem kl. 16."
- Subtext (JetBrains Mono, max-w ~400px)
- Minimalist CTA button with #2C2E30 border: "Start en samtale"

### 5. `<WorkshopGrid />` — "Digitale Redskaber"
- Section title in Playfair
- 3-column grid with divide-x/divide-y borders (#E2DFD8) — blueprint aesthetic
- Three `<ToolCard />` components with dark placeholder images (#2C2E30 with subtle inner border)
  - "Timer & Materialer"
  - "Den Automatiske Dagseddel"
  - "Tilbudsmotoren"

### 6. `<ConversationalForm />` — "Håndtrykket"
- Interactive "Mad Libs" style contact form
- Large Playfair text with inline dropdowns and text input
- Dropdowns for company type and pain point
- Text input for contact info (border-bottom only, focus color change)
- Submit button in JetBrains Mono: "Send beskeden"

### 7. Assembly
- All components assembled in App.tsx with smooth scroll sections
- All Framer Motion animations use the specified easing curve
- Hover states: subtle y:-2 lift with custom soft shadow

