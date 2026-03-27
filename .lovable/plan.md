

# Smooth video ved lav hastighed

## Problem
Når `playbackRate` sættes til 0.3, har browseren ikke nok frames at vise. En video optaget i 30fps har kun ~9 unikke frames per sekund ved 30% hastighed — det ser hakkende ud fordi browseren bare holder hvert frame længere.

## Løsning: Canvas-baseret frame interpolation

Erstat den synlige `<video>` med et `<canvas>` element der tegner frames via `requestAnimationFrame`. Videoen afspilles skjult i baggrunden. Canvas-tilgangen giver to fordele:

1. **Jævnere frame-timing**: `requestAnimationFrame` kører på 60fps og tegner det aktuelle video-frame til canvas — selv om videoen kun har nye frames ~9 gange i sekundet, undgår vi browserens native video-rendering pipeline som kan "hoppe" mellem frames.

2. **Alternativ: Hæv minimum hastighed** — den simpleste løsning er at sætte `min` på slideren til 50 (i stedet for 10), da de fleste videoer ser acceptabelt ud ned til 50% hastighed (15fps ved 30fps kilde).

### Anbefaling
Kombiner begge: Hæv minimum til 30% og brug canvas-rendering for at udglatte frame-timing.

### Implementering

**`src/components/HeroSection.tsx`**:
- Behold `<video>` som skjult kilde (`display: none` eller `opacity: 0; position: absolute`)
- Tilføj et `<canvas>` element med samme dimensioner (`w-full h-full object-cover` via CSS)
- I en `useEffect`, start en `requestAnimationFrame`-loop der tegner `ctx.drawImage(videoRef.current, 0, 0, width, height)` hvert frame
- Canvas auto-resizes via `ResizeObserver` på containeren
- Slider min ændres fra 10 til 30

### Filer der ændres
- `src/components/HeroSection.tsx`

