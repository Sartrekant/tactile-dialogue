

# Videooptimering — lav FPS i hero

## Problem
Videoen kører med lav framerate. To hovedårsager:

1. **CSS `filter: blur()` på en `<video>`** — browseren skal re-rasterize hvert frame gennem blur-filteret, selv efter blur er fjernet (Framer Motion holder elementet i compositing pipeline)
2. **Framer Motion `scale` transform på scroll** — `useTransform` opdaterer `scale` på videoen hvert frame under scroll, hvilket tvinger layout/paint

## Løsning

### 1. Flyt blur-up til placeholder, ikke videoen
I stedet for at anvende `filter: blur(20px)` direkte på video-wrapperen, lad videoen altid være uskarp-fri. Brug kun placeholder-div'en (som allerede eksisterer) til blur-effekten. Når videoen er klar, fade placeholder ud — videoen afspilles altid uden filter.

### 2. Brug `will-change: transform` og undgå nested transforms
- Fjern den indre `motion.div` med entry-scale animation (den skaber dobbelt compositing)
- Flyt entry-scale til den ydre `motion.div` der allerede har scroll-scale
- Tilføj `will-change: "transform"` på video-containeren for GPU-acceleration

### 3. Tilføj `preload="auto"` på videoen
Sikrer at browseren bufferer videoen aggressivt.

### 4. Reducer compositing layers
- Brug en plain `<div>` i stedet for `motion.div` for den indre wrapper
- Lad kun én `motion.div` styre scale (kombinér scroll-scale og entry-scale)

## Fil der ændres
- `src/components/HeroSection.tsx`

## Resultat
- Blur-filter rører aldrig videoen → ingen per-frame rasterization
- Én compositing layer i stedet for to nested → halveret GPU-arbejde
- `will-change: transform` promoverer til egen GPU-layer

