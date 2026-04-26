# Wireframe — Publikus kezdőoldal (`/`)

**Story:** US‑03, US‑06 (CTA)
**Komponens:** `src/pages/PublicHomePage.tsx`

```
┌──────────────────────────────────────────────────────────────────────┐
│  ParkVision  [HU/EN ▾] [Sötét/Világos] [Bejelentkezés]               │ AppBar (transzparens, scrollnál solid)
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ╔══════════════════════════════════════════════════════════════╗   │
│   ║  ╲ ╱   Találd meg a tökéletes parkolóhelyet                  ║   │
│   ║   ✱   Valós idejű parkolóhely információk                    ║   │ Hero (gradient + radial glow,
│   ║       budapesti bevásárlóközpontokban                        ║   │ SVG dekoráció: parking pin clusters)
│   ║                                                              ║   │
│   ║       ┌───────────────────┐  ┌─────────────────────┐         ║   │
│   ║       │ Parkolóhely keres │  │ Foglalás indítása ▸ │         ║   │ CTA‑k (gradient bg + hover scale)
│   ║       └───────────────────┘  └─────────────────────┘         ║   │
│   ╚══════════════════════════════════════════════════════════════╝   │
│                                                                      │
│   Bevásárlóközpontok                                                 │
│   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│   │   IMG      │ │   IMG      │ │   IMG      │ │   IMG      │        │ Card grid (3 col desktop, 1 col mobil)
│   │ Westend    │ │ Aréna      │ │ Allee      │ │ Mammut     │        │ Hover: y -4, shadow lift
│   │ ▓▓▓▓▓░░ 65%│ │ ▓▓▓░░░░ 35%│ │ ▓▓▓▓▓▓░ 80%│ │ ▓▓░░░░░ 20%│        │
│   │ [Foglalás] │ │ [Foglalás] │ │ [Foglalás] │ │ [Foglalás] │        │
│   └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
│                                                                      │
│   Térkép                                                             │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │   📍   📍                                                    │   │
│   │       📍   📍   (Leaflet map, 7 marker)                      │   │
│   │   📍       📍                                                │   │
│   └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│   © 2026 ParkVision · Minden jog fenntartva.                         │ Footer
└──────────────────────────────────────────────────────────────────────┘
```

## Állapotok

- **Loading**: Hero már betöltve, alatta `<CardGridSkeleton count={4} />` 180px image + 3 sor text skeleton.
- **Empty** (nincs központ): Hero + EmptyState illusztrációval ("Hamarosan új központok").
- **Error**: Hero + ErrorBanner ("Nem sikerült betölteni a központokat", retry).

## Interakciók

- Hero CTA "Foglalás indítása" → `ReservationModal` nyitott center select dropdown‑pal (preselect = null).
- Card "Foglalás" gomb → `ReservationModal` preselectálva az adott centerre.
- Card hover → `motion.div` `whileHover={{ y: -4, scale: 1.02 }}`.
- Térkép marker click → popup címmel, foglaltsággal, "Foglalás" gombbal.
