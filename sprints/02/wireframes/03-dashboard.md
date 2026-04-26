# Wireframe — Admin Dashboard (`/admin/dashboard`)

**Story:** US‑01, US‑05
**Komponens:** `src/pages/DashboardPage.tsx`

```
┌──────────────────────────────────────────────────────────────────────┐
│ Vezérlőpult                                                          │
│ Valós idejű áttekintés a parkolóinkról                               │
│                                                                      │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│ │ 🏬          │ │ 🅿️ Foglalt  │ │ ✅ Szabad   │ │ 📊 Átlag    │      │ KPI cards (gradient bg, trend ikon)
│ │ Központok   │ │ helyek      │ │ helyek      │ │ kihasználts.│      │
│ │ 7           │ │ 4 320       │ │ 2 180       │ │ 66%   ↑ 4%  │      │
│ │             │ │ ↑ 3% (mai)  │ │ ↓ 2%        │ │ vs. tegnap  │      │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                                      │
│ Központ‑szintű kihasználtság                                         │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ Westend   ▓▓▓▓▓▓▓▓░░ 65%                                         │ │
│ │ Aréna     ▓▓▓▓░░░░░░ 35%                                         │ │
│ │ Allee     ▓▓▓▓▓▓▓▓░░ 80%                                         │ │
│ │ Mammut    ▓▓░░░░░░░░ 20%                                         │ │
│ │ ...                                                              │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

## Állapotok

- **Loading**: `<DashboardSkeleton />` 4 KPI card skeleton + chart skeleton.
- **Empty** (`scenario=empty`): EmptyState ikon + "Még nincs központ a rendszerben".
- **Error** (`scenario=error`): ErrorBanner + retry.
