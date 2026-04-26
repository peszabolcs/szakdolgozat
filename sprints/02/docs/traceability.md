# Traceability Matrix — Sprint 02

A user story‑k, az AC‑k, a tesztek, a kód, és a CI workflow‑k összerendelése.

| Story | AC | Test (file) | Code (file) | CI | Status |
|---|---|---|---|---|---|
| US‑01 Üres állapot | AC1‑2 | `src/components/EmptyState.test.tsx`, `tests/acceptance/empty_state.feature` | `src/components/EmptyState.tsx` | test.yml | ✅ |
| US‑02 Bevásárlóközpont szűrés | AC1‑2 | `src/pages/ShoppingCentersPage.test.tsx` | `src/pages/ShoppingCentersPage.tsx` | test.yml | ✅ |
| US‑03 Térkép + keresés | AC1‑2 | (Sprint 03) | `src/components/InteractiveMap.tsx` | test.yml | 🟡 részben |
| US‑04 Téma + nyelv | AC1‑2 | (kontextus tesztek) | `src/contexts/ThemeContext.tsx`, `src/i18n/config.ts` | test.yml | ✅ |
| US‑05 Hibakezelés | AC1‑2 | `src/components/ErrorBanner.test.tsx`, `tests/acceptance/error_handling.feature` | `src/components/ErrorBanner.tsx` | test.yml | ✅ |
| US‑06 Foglalás (ÚJ) | AC1‑6 | `src/hooks/useReservations.test.ts`, `src/components/ReservationModal.test.tsx`, `tests/acceptance/reservation_flow.feature` | `src/hooks/useReservations.ts`, `src/components/ReservationModal.tsx`, `src/pages/ReservationsPage.tsx` | test.yml | ✅ |

## Architektúra‑elemek

| ADR | Téma | Status |
|---|---|---|
| ADR‑0001 | React + Vite + Vercel | Accepted |
| ADR‑0002 | Terraform validate + plan | Accepted |
| ADR‑0003 | Reservation localStorage | Accepted |

## Build / Quality artefactumok

| Artefactum | Forrás | CI workflow |
|---|---|---|
| Lint report | `npm run lint` | test.yml |
| Test results | `npm test` | test.yml |
| Coverage report | `npm run test:coverage` → `sprints/02/reports/coverage/` | test.yml (artifact upload) |
| Production build | `npm run build` → `dist/` | build.yml |
| Terraform plan | `terraform plan` → artifact | terraform.yml (token‑függő) |

## Wireframes ↔ Stories

| Wireframe | Stories |
|---|---|
| `01-public-home.md` | US‑03, US‑06 (CTA) |
| `02-shopping-centers-table.md` | US‑02 |
| `03-dashboard.md` | US‑01 (empty state) |
| `04-reservation-modal.md` | US‑06 |
| `05-error-empty-states.md` | US‑01, US‑05 |
