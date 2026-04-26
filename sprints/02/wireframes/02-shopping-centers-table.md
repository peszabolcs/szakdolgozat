# Wireframe — Bevásárlóközpontok admin tábla (`/admin/shopping-centers`)

**Story:** US‑02
**Komponens:** `src/pages/ShoppingCentersPage.tsx`

```
┌──────────────────────────────────────────────────────────────────────┐
│ [☰] ParkVision               [🌙] [HU ▾] [Admin ▾]                  │ AppBar
├──────────┬───────────────────────────────────────────────────────────┤
│          │                                                           │
│ Sidebar  │  Bevásárlóközpontok                                       │
│          │                                                           │
│ Dashbrd  │  Szűrő: [Összes] [Alacsony <50%] [Közepes 50‑80%] [Magas] │
│ ► Centers│                                                           │
│ Map      │  ┌─────────────────────────────────────────────────────┐  │
│ Reservt. │  │ Név          Cím        Kapacitás Foglalt  Kih.     │  │ Tábla header
│ Admin    │  ├─────────────────────────────────────────────────────┤  │
│          │  │ Westend      Váci út    1500      975      ▓▓▓░ 65% │  │ Tábla rows
│          │  │ Aréna        Kerepesi   1200      420      ▓░░░ 35% │  │
│          │  │ Allee        Október    900       720      ▓▓▓▓ 80% │  │
│          │  │ Mammut       Lövőház    1100      220      ▓░░░ 20% │  │
│          │  └─────────────────────────────────────────────────────┘  │
│          │  7 találat                                                │
└──────────┴───────────────────────────────────────────────────────────┘
```

## Állapotok

- **Loading**: `<TableSkeleton rows={5} />` szürke pulse.
- **Empty** (szűrőre 0): EmptyState ikon + "Nincs találat ezzel a szűrővel".
- **Error**: ErrorBanner.

## Interakciók

- Szűrő chip‑ek → instant újraszűrés.
- Sor click → `/admin/map?centerId=...` (térképen kiemelés).
- "Megtekintés térképen" gomb → ugyanaz.
