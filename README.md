# ParkVision Frontend MVP

A ParkVision egy okos parkolásmenedzsment rendszer front‑end MVP‑je. Ez a repository szakdolgozati keretben készül: **frontend‑first** megvalósítás, mockolt API‑val, valós idejű parkolóhely‑kihasználtsági UX‑szel, foglalási flow‑val és teljes körű admin felülettel.

> **Bilicki tanár úr számára** — a szakdolgozati artifacts a [`sprints/`](sprints/) mappa alatt, egyenként a milestone‑ok szerint. A `sprints/02/` az aktív sprint, ott találhatók az ADR‑ek, user storyk, wireframe‑ek, Gherkin acceptance tesztek, Terraform IaC, és az AI usage log.

---

## Tartalomjegyzék

- [Gyors áttekintés](#gyors-áttekintés)
- [Telepítés és futtatás](#telepítés-és-futtatás)
- [Sprint deliverables](#sprint-deliverables)
- [Architektúra](#architektúra)
- [Funkciók](#funkciók)
- [Foglalási flow](#foglalási-flow)
- [Mock API + szcenáriók](#mock-api--szcenáriók)
- [Tesztelés](#tesztelés)
- [CI/CD](#cicd)
- [I18n + téma](#i18n--téma)
- [PWA + offline](#pwa--offline)
- [Mappa‑struktúra](#mappa-struktúra)
- [Verzió + roadmap](#verzió--roadmap)

---

## Gyors áttekintés

**Cél**: reszponzív, többnyelvű, PWA‑képes felület a budapesti bevásárlóközpontok parkolóinak valós idejű kihasználtsági információival, foglalási lehetőséggel.

**Kiemelt képességek**:

- Publikus landing page Leaflet‑térképpel + parkolóhely‑foglalási flow.
- Admin felület: dashboard (KPI), shopping centers tábla szűrőkkel, foglalások kezelése, Recharts analitika.
- Mock API (MSW) `normal` / `empty` / `error` szcenáriókkal.
- Mock auth (`admin@parkvision.hu` / `admin123`).
- HU/EN nyelv, light/dark téma, PWA install + offline indicator.
- CI: lint + build + test (≥ 60% coverage cél).

---

## Telepítés és futtatás

### Előfeltételek

- Node.js 20.x (LTS)
- npm 10.x
- Terraform 1.5+ (csak az IaC futtatásához, opcionális)

### Lépések

```bash
git clone https://github.com/peszabolcs/szakdolgozat.git
cd szakdolgozat
npm install
npm run dev
```

Alapértelmezett URL: `http://localhost:5173`.

### Mock szcenárió kapcsolók

```bash
VITE_MOCK_SCENARIO=normal npm run dev   # Default — 7 bevásárlóközpont
VITE_MOCK_SCENARIO=empty  npm run dev   # Üres állapot teszt
VITE_MOCK_SCENARIO=error  npm run dev   # API hiba teszt
```

### NPM scriptek

| Parancs | Mit csinál |
|---|---|
| `npm run dev` | Vite dev server + MSW worker |
| `npm run build` | TypeScript check + production build (`dist/`) |
| `npm run preview` | Production build helyi futtatása |
| `npm run lint` | ESLint, **zero warnings policy** |
| `npm test` | Vitest egyszer fut le |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:ui` | Vitest UI |
| `npm run test:coverage` | Coverage report a `sprints/02/reports/coverage/`‑ban |
| `npm run ci-local` | Lint + test + coverage + build (mint a CI) |

---

## Sprint deliverables

**Sprint 02 (aktív)** — minden artifact a [`sprints/02/`](sprints/02/) alatt:

| Artifact | Hely |
|---|---|
| Termékspecifikáció v0.2 | [`sprints/02/docs/spec/product_spec_v0.2.md`](sprints/02/docs/spec/product_spec_v0.2.md) |
| 6 INVEST user story | [`sprints/02/docs/stories/user_stories.md`](sprints/02/docs/stories/user_stories.md) |
| ADR‑0001 Frontend platform | [`sprints/02/docs/adr/0001-frontend-platform.md`](sprints/02/docs/adr/0001-frontend-platform.md) |
| ADR‑0002 IaC stratégia | [`sprints/02/docs/adr/0002-iac-strategy.md`](sprints/02/docs/adr/0002-iac-strategy.md) |
| ADR‑0003 Foglalás storage | [`sprints/02/docs/adr/0003-reservation-storage.md`](sprints/02/docs/adr/0003-reservation-storage.md) |
| Definition of Ready / Done | [`sprints/02/docs/process/dor_dod.md`](sprints/02/docs/process/dor_dod.md) |
| Traceability matrix | [`sprints/02/docs/traceability.md`](sprints/02/docs/traceability.md) |
| Wireframe‑ek (5 db) | [`sprints/02/wireframes/`](sprints/02/wireframes/) |
| Gherkin acceptance tesztek | [`sprints/02/tests/acceptance/`](sprints/02/tests/acceptance/) |
| Terraform Vercel deploy | [`sprints/02/infra/terraform/`](sprints/02/infra/terraform/) |
| AI usage log | [`sprints/02/ai/ai_log.jsonl`](sprints/02/ai/ai_log.jsonl) |
| Coverage report (CI artifact) | [`sprints/02/reports/coverage/`](sprints/02/reports/coverage/) |

**Sprint 01** — research & architecture, lezárt: [`sprints/01/README.md`](sprints/01/README.md).

---

## Architektúra

```
React 18 + Vite + TypeScript 5.0
  ↓
MUI 5 (theme: teal/orange identity, dark+light)
  ↓
Page (e.g. PublicHomePage, DashboardPage, ReservationsPage)
  ↓
Custom hook (TanStack Query, e.g. useShoppingCenters, useReservations)
  ↓
axios → /api/*  (or localStorage for reservations)
  ↓
MSW handler (only in dev/test)
  ↓
Mock data (src/mocks/data/) or localStorage state
```

### Routing

| Útvonal | Hozzáférés | Komponens |
|---|---|---|
| `/` | publikus | `PublicHomePage` (hero + map + center grid + reservation modal) |
| `/login` | publikus | `LoginPage` |
| `/admin/dashboard` | védett | `DashboardPage` |
| `/admin/shopping-centers` | védett | `ShoppingCentersPage` |
| `/admin/map` | védett | `MapPage` |
| `/admin/reservations` | védett | `ReservationsPage` *(új Sprint 02)* |
| `/admin/admin-panel` | védett | `AdminPage` |

### State pattern

Minden adat‑oldal kezeli a négy állapotot: **loading** (`<*Skeleton />`), **error** (`<ErrorBanner />` + retry), **empty** (`<EmptyState />` + CTA), **success**.

```typescript
const { data, isLoading, isError, error, refetch } = useShoppingCenters();
if (isLoading) return <DashboardSkeleton />;
if (isError) return <ErrorBanner message={...} onRetry={refetch} />;
if (!data?.length) return <EmptyState ... />;
return <Content data={data} />;
```

---

## Funkciók

- ✅ Publikus landing page gradient hero‑val + scroll‑triggered card animációkkal
- ✅ Interaktív Leaflet‑térkép geolokációval és kereséssel
- ✅ Bevásárlóközpontok grid + tábla, foglaltság szerinti szűrés
- ✅ **Parkolóhely‑foglalási flow** (`ReservationModal` + `/admin/reservations`)
- ✅ Admin dashboard polished StatCard‑okkal (gradient, trend, accent‑szín)
- ✅ Recharts analitika (occupancy trend, capacity, distribution)
- ✅ Empty / Error / Loading state mindenhol illusztrált skeletonnel
- ✅ Toast notifikációk (notistack) sikeres és hibás műveletekre
- ✅ HU / EN nyelv, light / dark téma, mindkettő perzisztens
- ✅ PWA install prompt + offline indicator

---

## Foglalási flow

**User story**: US‑06 — látogató parkolóhelyet foglal egy bevásárlóközpontba egy adott időpontra.

**Komponensek**: `src/components/ReservationModal.tsx`, `src/pages/ReservationsPage.tsx`, `src/hooks/useReservations.ts`.

**Adat**: `localStorage` kulcs `parkvision.reservations.v1` alatt — egy `Reservation[]` tömb. Sprint 03‑ban backend API‑val cserélhető a hook interface módosítása nélkül (lásd [ADR‑0003](sprints/02/docs/adr/0003-reservation-storage.md)).

**Validáció**:

- Múltbéli időpont → inline error, confirm gomb disabled.
- 100% telített központ → warning toast + foglalás letiltva.
- Duplikált foglalás (ugyanaz a center+slot) → warning toast.

**Próba lokálisan**:

1. `npm run dev`
2. Nyisd meg `http://localhost:5173`‑t.
3. Bármelyik központ kártyán „Foglalás" gomb → modal nyílik.
4. Válassz dátumot + 1‑órás időslot‑ot → „Foglalás megerősítése".
5. Sikertoast jelenik meg, a foglalás megjelenik a `/admin/reservations` oldalon (admin login után).

---

## Mock API + szcenáriók

A backend hiányát az [MSW](https://mswjs.io/) pótolja. A handler‑ek `src/mocks/handlers/`‑ben vannak, az adatok `src/mocks/data/`‑ban.

| Szcenárió | Mit ad vissza |
|---|---|
| `normal` (default) | 7 budapesti bevásárlóközpont reális adatokkal |
| `empty` | Üres tömb → empty state UI tesztelése |
| `error` | 500 Internal Server Error → ErrorBanner + retry tesztelése |

---

## Tesztelés

Vitest + React Testing Library + MSW.

```bash
npm test                  # Egyszer lefut
npm run test:watch        # Watch mode
npm run test:ui           # Vizuális UI
npm run test:coverage     # Coverage report
```

A coverage report a [`sprints/02/reports/coverage/`](sprints/02/reports/coverage/) mappába kerül (CI artifact).

**Fontos test fájlok**:

- `src/hooks/useReservations.test.tsx` — happy path + 4 validation scenario
- `src/components/ReservationModal.test.tsx` — render + disabled állapotok
- `src/components/EmptyState.test.tsx`, `ErrorBanner.test.tsx`, `StatCard.test.tsx`
- `src/hooks/useShoppingCenters` / `useParkingSpaces` / `useAreas` — meglévő tesztek

---

## CI/CD

3 GitHub Actions workflow a [`.github/workflows/`](.github/workflows/) alatt:

| Workflow | Trigger | Mit csinál |
|---|---|---|
| [`test.yml`](.github/workflows/test.yml) | push / PR `main`‑re | install → lint → build → test:coverage → upload coverage artifact |
| [`build.yml`](.github/workflows/build.yml) | push / PR `main`‑re | install → build → upload `dist/` artifact |
| [`terraform.yml`](.github/workflows/terraform.yml) | `sprints/02/infra/terraform/**` változás | fmt → init → validate → plan (token‑függő) |

A `terraform plan` csak akkor fut le, ha a `VERCEL_API_TOKEN` GitHub secret konfigurálva van. Sprint 02‑ben nem kötelező, Sprint 03‑ban élesedik az `apply`.

---

## I18n + téma

- Magyar / angol (`src/i18n/locales/hu.json`, `en.json`).
- Téma kapcsoló (`light` / `dark`), perzisztens `localStorage`‑ben.
- Theme: `src/theme/theme.ts` — teal `#26636f` + arany `#f9a825`, gradient buttons, blur Cards.

---

## PWA + offline

- Vite PWA plugin (`vite-plugin-pwa`) — auto service worker update, asset precache.
- `OfflineIndicator` komponens kapcsolat‑monitorral.
- `PWAInstallPrompt` az install hívásra.
- Offline cache `localforage`‑on keresztül a `src/stores/offlineStore.ts`‑ben.

---

## Mappa‑struktúra

```
.
├── .github/workflows/         CI workflows (test, build, terraform)
├── sprints/                   Szakdolgozati sprint deliverables
│   ├── 01/                    Sprint 01 — research & architecture (zárt)
│   └── 02/                    Sprint 02 — MVP (aktív)
│       ├── docs/              Spec, user stories, ADRs, DoR/DoD, traceability
│       ├── wireframes/        ASCII wireframe-ek
│       ├── tests/acceptance/  Gherkin feature fájlok
│       ├── infra/terraform/   IaC Vercel deployhoz
│       ├── ai/                AI usage log (jsonl)
│       └── reports/coverage/  Vitest coverage output
├── src/
│   ├── components/            UI komponensek (+ skeletons/, tests)
│   ├── pages/                 Route oldalak
│   ├── hooks/                 TanStack Query hookok
│   ├── contexts/              Auth + Theme
│   ├── mocks/                 MSW handlerek + mock data
│   ├── stores/                Offline cache (localforage)
│   ├── i18n/                  HU + EN fordítások
│   ├── types/                 Központi típusok
│   ├── utils/                 Segédfüggvények
│   └── test/                  Test setup
├── docs/                      Egyéb projektdokumentációk
├── public/                    Statikus assetek + MSW worker
└── package.json
```

---

## Verzió + roadmap

**Verzió:** 0.3.0 — *Sprint 02 (Apr 26, 2026)*

**Roadmap**:

- 🟡 **Sprint 02 (aktív)** — MVP + reservation flow + visual polish
- 🟢 **Sprint 03 (May 3 — May 23, 2026)** — Backend API integráció, E2E (Playwright), Lighthouse CI, Terraform `apply` automatizálás

**Korábban készült dokumentumok** a fő projektgyökérben (legacy):

- [PWA_ENHANCEMENT_SUMMARY.md](PWA_ENHANCEMENT_SUMMARY.md)
- [PWA_TEST_REPORT.md](PWA_TEST_REPORT.md)
- [MSW_FIX_APPLIED.md](MSW_FIX_APPLIED.md)
- [project_plan.md](project_plan.md)

---

## Licenc

MIT

---

**Verzió:** 0.3.0
**Utoljára frissítve:** 2026‑04‑26
