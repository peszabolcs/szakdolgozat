# Wireframe — Foglalási modal és foglalás‑lista oldal

**Story:** US‑06 (ÚJ Sprint 02‑ben)
**Komponens:** `src/components/ReservationModal.tsx`, `src/pages/ReservationsPage.tsx`

## A) Foglalási modal

```
            ┌────────────────────────────────────────────────────┐
            │  Parkolóhely foglalása                          ✕  │
            ├────────────────────────────────────────────────────┤
            │                                                    │
            │  Bevásárlóközpont                                  │
            │  ┌──────────────────────────────────────────┐      │
            │  │ Westend Bevásárlóközpont           ▾     │      │ Select (előválasztva
            │  └──────────────────────────────────────────┘      │ ha card‑ról nyílt)
            │  Foglaltság: 65% — szabad helyek: 525              │ Live status
            │                                                    │
            │  Dátum                                             │
            │  ┌──────────────────────────────────────────┐      │
            │  │ 2026‑04‑27  📅                           │      │ Date input
            │  └──────────────────────────────────────────┘      │
            │                                                    │
            │  Időslot (1 óra)                                   │
            │  [10:00] [11:00] [12:00] [13:00] [14:00]           │ Time slot chips
            │  [15:00] [16:00] [17:00] [18:00] [19:00]           │ disabled = múlt
            │                                                    │
            │  ⚠ A választott időslot a múltban van.             │ Inline error
            │                                                    │
            ├────────────────────────────────────────────────────┤
            │                       [Mégse]  [Foglalás megerősítése] │
            └────────────────────────────────────────────────────┘
```

### Validáció
- **Múlt időpont**: inline error, "Foglalás megerősítése" disabled.
- **100% telített**: warning toast a megerősítés előtt, "Foglalás megerősítése" disabled.
- **Duplikált foglalás** (ugyanaz a center+slotStart): warning toast.

### Sikeres foglalás
- Toast (notistack): "Sikeres foglalás 14:00‑ra a Westendbe."
- Modal bezárul.
- (Apró trükk:) UI‑szinten a center occupancy +1 ideiglenesen, hogy „lássuk" a hatást.

---

## B) Foglalások oldal (`/admin/reservations`)

```
┌────────────────────────────────────────────────────────────────────┐
│ Foglalásaim                                                        │
│ ┌──────────────────────────────────┐                               │
│ │ [Közelgő (3)] [Múlt (12)]        │                               │ Tabs
│ └──────────────────────────────────┘                               │
│                                                                    │
│ ┌────────────────────────────────────────────────────────────────┐ │
│ │ 🏬 Westend     2026‑04‑27 14:00 ‑ 15:00     [Lemondás]         │ │ Reservation row
│ ├────────────────────────────────────────────────────────────────┤ │
│ │ 🏬 Aréna       2026‑04‑28 18:00 ‑ 19:00     [Lemondás]         │ │
│ ├────────────────────────────────────────────────────────────────┤ │
│ │ 🏬 Allee       2026‑04‑30 11:00 ‑ 12:00     [Lemondás]         │ │
│ └────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

### Állapotok
- **Empty** (nincs foglalás): EmptyState illusztráció + "Még nem foglaltál parkolót" + CTA "Foglalj most".
- **Cancelled** foglalás: a Múlt tab alá kerül, status chip = "Lemondva".
