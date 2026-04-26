# Wireframe — Error és Empty állapotok

**Story:** US‑01, US‑05
**Komponens:** `src/components/EmptyState.tsx`, `src/components/ErrorBanner.tsx`

## EmptyState

```
            ┌────────────────────────────────────────────┐
            │                                            │
            │            ┌─────────────────┐             │
            │            │   ╲   ╱         │             │
            │            │    ╲ ╱          │             │
            │            │     P           │             │  Custom SVG illusztráció:
            │            │    ╱ ╲          │             │  parking pin + üres rács
            │            │   ╱   ╲         │             │
            │            └─────────────────┘             │
            │                                            │
            │      Még nincs foglalásod                  │
            │                                            │
            │   Foglalj parkolóhelyet egy kattintással,  │
            │   és térj vissza ide bármikor.             │
            │                                            │
            │       ┌──────────────────────┐             │
            │       │  Foglalj most ▸      │             │ CTA gomb
            │       └──────────────────────┘             │
            │                                            │
            └────────────────────────────────────────────┘
```

### Animáció
- Belépés: SVG `motion.svg` `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}` 0.3s ease‑out.
- CTA: hover scale 1.02, shadow lift.

## ErrorBanner

```
   ┌────────────────────────────────────────────────────────────┐
   │ ❗  Nem sikerült betölteni az adatokat              [↻]    │ Színes left border
   │     Kérlek, próbáld újra.                                  │ pulse animation az ikonon
   └────────────────────────────────────────────────────────────┘
```

### Stilus
- `borderLeft: 4px solid theme.palette.error.main`
- `box-shadow: 0 4px 12px rgba(error/0.15)`
- Hover az "Újrapróbálás" gombon: `transform: rotate(180deg)` 0.4s — vizuális retry feedback.

### Used by
- Minden TanStack Query hook `isError` ágában.
- A `Layout`‑on belül `ErrorBoundary` fallback‑ként.
