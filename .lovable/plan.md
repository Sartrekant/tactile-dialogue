

# Elegante sektionsovergange

## Problem
Sektionerne (Hero → Workshop → Håndværket → Kontakt → Footer) skifter abrupt uden visuel sammenhæng. Den tomme `#haandvaerket`-sektion er kun en tynd border-linje.

## Løsning
Skabe organiske overgange mellem sektioner med to virkemidler: **dekorative skillelinjer** og **scroll-drevne fade-overgange**.

### 1. `<SectionDivider />` — ny komponent
En genbrugelig overgangskomponent der placeres mellem sektioner:
- Stor vertikal whitespace (`py-24`)
- En tynd, centreret horisontal linje (`max-w-[120px]`, `border-border`) der animeres ind via Framer Motion (scale-x fra 0 til 1) med den tunge easing-kurve
- Scroll-triggered (`useInView`)
- Variant-prop for at vælge mellem linje, lille serif-ornament, eller ingen visuel markør

### 2. Scroll-drevet opacity på sektioner
Wrap hver sektion i en `motion.div` der fader ind fra `opacity: 0` og `y: 40px` med den tunge easing (`[0.22, 1, 0.36, 1]`, 1s varighed) når den kommer i viewport. Ingen spring, ingen bounce.

### 3. Opdater `Index.tsx`
- Fjern den tomme `#haandvaerket` sektion (den gør ingenting)
- Indsæt `<SectionDivider />` mellem Hero→Workshop og Workshop→Kontakt
- Tilføj gradient-fades i toppen af WorkshopGrid og ContactSection via pseudo-elementer eller en subtil `bg-gradient-to-b from-background via-background/0` for at blødgøre overgangen fra foregående sektion

### 4. Footer-overgang
Tilføj en bredere, mere "åndende" `pt-32` spacing over footeren og lad border-linjen også animere ind.

## Filer der ændres
- **Ny**: `src/components/SectionDivider.tsx`
- **Ændres**: `src/pages/Index.tsx` — tilføj dividers, fjern tom sektion
- **Ændres**: `src/components/WorkshopGrid.tsx` — juster top-padding
- **Ændres**: `src/components/ContactSection.tsx` — juster top-padding

