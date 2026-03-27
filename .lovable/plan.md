

# Baggrundsbillede på kontaktsektionen

## Opgave
Anvend det uploadede billede som fuldskærmsbaggrund bag kontaktsektionen med samme principper som hero-sektionen: blur-up reveal, scroll-drevet skalering, og gradient-overlays for læsbarhed.

## Implementering

### 1. Kopier billede til `src/assets/contact-bg.jpg`

### 2. Omskriv `ContactSection.tsx`
- Gør sektionen `relative` med `overflow-hidden` og `min-h-screen` for at rumme baggrundsbilledet
- Tilføj en `motion.div` med `motion.img` indeni (samme mønster som HeroSection):
  - **Blur-up**: Benhvid placeholder-div der fader ud over 1.5s når billedet loader
  - **Scroll-scale**: `useScroll` + `useTransform` for subtil skalering (1.0 → 1.05)
  - **Entry-animation**: `scale: 1.04 → 1.0` over 1.8s med EASING
- Gradient-overlays for tekstlæsbarhed:
  - `bg-gradient-to-r from-background/80 via-background/40 to-transparent` (venstre side)
  - Evt. en top-gradient for blød overgang fra foregående sektion
- Content-div med `relative z-10` for at ligge over baggrunden

### Filer
- **Kopieres**: `user-uploads://Generated_Image...jpg` → `src/assets/contact-bg.jpg`
- **Ændres**: `src/components/ContactSection.tsx`

