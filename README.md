# ParkVision

> **Smart parking management** — Budapest bevásárlóközpontok valós idejű parkolóhely‑kihasználtsága, foglalási flow, admin analitika. **Frontend (React + Vite + MUI) + Backend (Express + SQLite + JWT) + IoT szimuláció**, Vercel serverless vagy Docker compose deploy.

> **Bilicki tanár úr számára** — a [`SCORECARD.md`](SCORECARD.md) pontonként mutatja, hogy a 2026‑04‑15‑i visszajelzés melyik kritikájára mit változtattunk a Sprint 02 push‑ban (v0.4.0). A részletes szakdolgozati artifact‑ek a [`sprints/02/`](sprints/02/) alatt élnek.

---

## Tartalomjegyzék

- [Mit lát a felhasználó](#mit-lát-a-felhasználó)
- [Telepítés és futtatás](#telepítés-és-futtatás)
- [Architektúra](#architektúra)
- [Sprint deliverables](#sprint-deliverables)
- [Backend API](#backend-api)
- [Foglalási flow](#foglalási-flow)
- [Tesztelés](#tesztelés)
- [CI/CD](#cicd)
- [Mappa‑struktúra](#mappa-struktúra)
- [Verzió + roadmap](#verzió--roadmap)

---

## Mit lát a felhasználó

### Publikus oldal (`/`)
- Gradient hero CTA‑val: **„Foglalás indítása"** + **„Központok böngészése"** (smooth scroll).
- Interaktív Leaflet térkép geolokációval, kereséssel.
- 7 budapesti bevásárlóközpont kártyán élő foglaltsággal — minden kártyán „Foglalás" gomb (ReservationModal).

### Admin felület (bejelentkezés után, `/admin/...`)
| Útvonal | Komponens | Mit csinál |
|---|---|---|
| `/admin/dashboard` | `DashboardPage` | 5 KPI (központok, kapacitás, foglalt, szabad, átlag %), accent színek + skeleton |
| `/admin/shopping-centers` | `ShoppingCentersPage` | Tábla foglaltság szerinti szűrővel |
| `/admin/centers/:id` | `ParkingDetailPage` | Hero + 3 KPI + 24h area chart + 7×24 occupancy heatmap |
| `/admin/parking-spaces` | `ParkingSpacesPage` | Egyedi parkolóhelyek grid (free/occupied chip, search, paginálás) |
| `/admin/map` | `MapPage` | Leaflet térkép, zónafilter |
| `/admin/reservations` | `ReservationsPage` | Foglalások (Upcoming / Past tabok, lemondás) |
| `/admin/admin-panel` | `AdminPage` | Recharts analitika (occupancy trend, capacity, distribution) |
| `/admin/settings` | `SettingsPage` | Profil, értesítések, fizetési mód |

**Mobile**: `<md` alatt sidebar → hamburger menu, `<800px` adaptív KPI/Grid.

---

## Telepítés és futtatás

### Előfeltételek

- **Node.js 20.x** (LTS)
- **npm 10.x**
- *(Opcionális)* Docker + Docker Compose, vagy Terraform 1.5+

### A) Lokális fejlesztés (frontend + backend egyszerre)

```bash
git clone https://github.com/peszabolcs/szakdolgozat.git
cd szakdolgozat
npm install
npm run dev
```

Ez egy parancsban indítja:
- **Vite frontend**: `http://localhost:5173`
- **Express backend**: `http://localhost:3001`
- A frontend `/api/*` kérései proxy‑zódnak a backendre (`vite.config.ts`).

**Bejelentkezés**:
- `admin@parkvision.hu` / `admin123` (admin szerep)
- `visitor@parkvision.hu` / `visitor123` (visitor szerep)

### B) Docker compose (egyetlen parancs)

```bash
npm run build           # frontend dist/
docker compose up -d
```

- **Web**: `http://localhost:8080` (nginx + SPA + API proxy)
- **API**: `http://localhost:3001/api/health`
- SQLite perzisztens volume‑ben (`parkvision-data:/data`).

### C) Vercel serverless deploy

```bash
npm install -g vercel
vercel link
vercel deploy --prod
```

A `vercel.json` `rewrites`‑szel a `/api/*` URL‑ek a `api/index.ts` serverless függvénybe mennek (Express `createApp()`).

### D) MSW fallback (backend nélküli demo)

Ha csak a frontendet akarod nézni MSW mock‑okkal:

```bash
VITE_USE_MSW=true npm run dev:web
```

`VITE_MOCK_SCENARIO=normal|empty|error` szabályozza a mock választ.

### NPM scriptek

| Parancs | Mit csinál |
|---|---|
| `npm run dev` | **Frontend + backend egyszerre** (concurrently) |
| `npm run dev:web` | Csak Vite frontend |
| `npm run server:dev` | Csak Express backend (tsx watch) |
| `npm run build` | Frontend prod build (`dist/`) |
| `npm run server:build` | Backend TS build (`server/dist/`) |
| `npm run server:start` | Prod backend (`node server/dist/index.js`) |
| `npm run lint` | ESLint, **zero warnings** |
| `npm test` | Frontend Vitest |
| `npm run test:coverage` | Frontend coverage |
| `npm run server:test` | Backend Vitest (supertest) |
| `npm run test:all` | Frontend + backend tesztek |
| `npm run ci-local` | Lint + test + coverage + server:test + build |

---

## Architektúra

```
┌─────────────────────────────┐         ┌─────────────────────────────┐
│  React 18 SPA               │         │  Express 4 API              │
│  Vite + TS + MUI 5          │         │  better-sqlite3 (file/mem)  │
│  TanStack Query             │  HTTP   │  JWT (jsonwebtoken)         │
│  Framer Motion              │ ───────►│  bcryptjs                   │
│  notistack toasts           │         │  Zod request validation     │
│  Leaflet + Recharts         │         │  IoT simulator (setInterval) │
└──────────┬──────────────────┘         └──────────┬──────────────────┘
           │                                        │
           │  axios (apiClient)                     │  better-sqlite3
           │  Bearer header                         │  schema + seed
           ▼                                        ▼
   ┌────────────────┐                       ┌────────────────┐
   │  /api/auth/*   │                       │  users         │
   │  /api/...      │                       │  shopping_*    │
   │  Vite proxy    │                       │  reservations  │
   │  (dev) /       │                       │  occupancy_*   │
   │  Vercel        │                       └────────────────┘
   │  rewrites      │
   │  (prod)        │
   └────────────────┘
```

**State pattern** minden adat‑oldalon: `loading` (skeleton) → `error` (ErrorBanner + retry) → `empty` (illusztrált EmptyState + CTA) → `success`.

---

## Sprint deliverables

A szakdolgozati artifact‑ek a [`sprints/02/`](sprints/02/) alatt:

| Artifact | Hely |
|---|---|
| Termékspecifikáció v0.2 | [`sprints/02/docs/spec/product_spec_v0.2.md`](sprints/02/docs/spec/product_spec_v0.2.md) |
| 6 INVEST user story (incl. US‑06 foglalás) | [`sprints/02/docs/stories/user_stories.md`](sprints/02/docs/stories/user_stories.md) |
| 6 ADR | [`sprints/02/docs/adr/`](sprints/02/docs/adr/) |
| Definition of Ready / Done | [`sprints/02/docs/process/dor_dod.md`](sprints/02/docs/process/dor_dod.md) |
| Traceability matrix | [`sprints/02/docs/traceability.md`](sprints/02/docs/traceability.md) |
| 5 wireframe | [`sprints/02/wireframes/`](sprints/02/wireframes/) |
| 3 Gherkin acceptance feature | [`sprints/02/tests/acceptance/`](sprints/02/tests/acceptance/) |
| Vercel Terraform IaC | [`sprints/02/infra/terraform/`](sprints/02/infra/terraform/) |
| AI usage log | [`sprints/02/ai/ai_log.jsonl`](sprints/02/ai/ai_log.jsonl) |

**ADR‑ek**:
- [ADR‑0001 — Frontend platform](sprints/02/docs/adr/0001-frontend-platform.md) (React + Vite + Vercel)
- [ADR‑0002 — IaC stratégia](sprints/02/docs/adr/0002-iac-strategy.md)
- [ADR‑0003 — Reservation storage](sprints/02/docs/adr/0003-reservation-storage.md) (localStorage MVP)
- [ADR‑0004 — Backend stack](sprints/02/docs/adr/0004-backend-stack.md) (**ÚJ**: Express + SQLite)
- [ADR‑0005 — Auth strategy](sprints/02/docs/adr/0005-auth-strategy.md) (**ÚJ**: JWT + bcrypt)
- [ADR‑0006 — Deploy strategy](sprints/02/docs/adr/0006-deploy-strategy.md) (**ÚJ**: Vercel + Docker)

---

## Backend API

Részletek: [`server/`](server/). 12+ endpoint:

| Endpoint | Method | Auth | Leírás |
|---|---|---|---|
| `/api/health` | GET | — | Liveness check |
| `/api/auth/login` | POST | — | JWT (7 nap), Zod email validation |
| `/api/auth/me` | GET | Bearer | Aktuális user |
| `/api/shopping-centers` | GET | — | 7 budapesti központ (élő occupancy) |
| `/api/shopping-centers/:id` | GET | — | Egy konkrét központ |
| `/api/shopping-centers/:id/history` | GET | — | 7 napos occupancy historikum |
| `/api/parking-spaces` | GET | — | Egyedi helyek + zóna |
| `/api/areas` | GET | — | 5 zóna (kapacitás + foglaltság) |
| `/api/reservations` | GET | Bearer | Saját foglalások |
| `/api/reservations` | POST | Bearer | Új foglalás (validáció: past / duplicate / full) |
| `/api/reservations/:id` | DELETE | Bearer | Foglalás lemondás |
| `/api/dashboard/stats` | GET | — | KPI aggregáció |

**IoT szimulátor** (`server/src/simulator/iot.ts`): 30 mp‑enként ±5 occupancy random change minden központra, audit log az `occupancy_history` táblába.

**Adatbázis**: `better-sqlite3`. Lokálisan: `server/data/parkvision.db` (file). Vercel: in‑memory (cold start = reseed). 6 tábla: `users`, `shopping_centers`, `parking_spaces`, `areas`, `reservations`, `occupancy_history`.

---

## Foglalási flow

**User story**: US‑06 — látogató parkolóhelyet foglal egy bevásárlóközpontba egy adott időpontra.

**Komponensek**: `src/components/ReservationModal.tsx`, `src/pages/ReservationsPage.tsx`, `src/hooks/useReservations.ts`.

**Hibrid storage**:
- **Bejelentkezve** → `POST /api/reservations` (perzisztens backend, JWT‑védett).
- **Nincs auth** → `localStorage` (`parkvision.reservations.v1`) — guest demo mode.

**Validáció (mindkét rétegben)**:
- Múlt időpont → 422 + `code: 'past'`.
- Telített központ → 409 + `code: 'full'`.
- Duplikált foglalás → 409 + `code: 'duplicate'`.

**Próba**:
1. `npm run dev`
2. Nyisd meg `http://localhost:5173/`
3. Bármelyik központ kártyán „Foglalás" → modal.
4. Idő + slot → „Foglalás megerősítése" → success toast.
5. Loginolj be (`admin@parkvision.hu` / `admin123`) → `/admin/reservations`-en látszik.

---

## Tesztelés

Vitest + React Testing Library + supertest (backend) + MSW (frontend).

```bash
npm test               # Frontend Vitest (40 teszt)
npm run server:test    # Backend Vitest + supertest (14 teszt)
npm run test:all       # Mindkettő
npm run test:coverage  # Frontend coverage → sprints/02/reports/coverage/
```

**Tesztek összesen**: **54** (40 frontend + 14 backend).

Backend teszt fájlok:
- `server/tests/auth.test.ts` — JWT login + me (7 teszt)
- `server/tests/reservations.test.ts` — CRUD + validáció + dashboard (7 teszt)

Frontend kulcs tesztek:
- `src/hooks/useReservations.test.tsx` — 5 scenario (create, past, duplicate, cancel, empty)
- `src/components/ReservationModal.test.tsx` — render + state
- `src/pages/{Dashboard,ParkingSpaces,Areas}Page.test.tsx` — page integráció

---

## CI/CD

5 GitHub Actions workflow a [`.github/workflows/`](.github/workflows/):

| Workflow | Trigger | Mit csinál |
|---|---|---|
| [`test.yml`](.github/workflows/test.yml) | push / PR `main`‑re | Frontend lint + build + test:coverage |
| [`build.yml`](.github/workflows/build.yml) | push / PR `main`‑re | Vite production build artifact |
| [`backend.yml`](.github/workflows/backend.yml) | `server/**` változás | Express tsc + supertest |
| [`docker.yml`](.github/workflows/docker.yml) | `Dockerfile` változás | Multi‑stage Docker build verifikáció |
| [`terraform.yml`](.github/workflows/terraform.yml) | `sprints/02/infra/terraform/**` | fmt + init + validate (+ plan ha token) |

---

## Mappa‑struktúra

```
.
├── .github/workflows/         5 GitHub Actions workflow
├── api/
│   └── index.ts               Vercel serverless entry
├── docker/
│   └── nginx.conf             SPA proxy konfig
├── Dockerfile                 Multi-stage Node + better-sqlite3
├── docker-compose.yml         api + web (nginx)
├── sprints/                   Szakdolgozati sprint deliverables
│   ├── 01/                    Sprint 01 — research & architecture (zárt)
│   └── 02/                    Sprint 02 — MVP + backend (aktív)
│       ├── docs/              Spec, user stories, 6 ADR, DoR/DoD, traceability
│       ├── wireframes/        ASCII wireframe-ek (5)
│       ├── tests/acceptance/  Gherkin feature fájlok (3)
│       ├── infra/terraform/   IaC Vercel deployhoz
│       ├── ai/                AI usage log (jsonl)
│       └── reports/coverage/  Vitest coverage output
├── server/
│   ├── src/
│   │   ├── app.ts             Express app factory
│   │   ├── index.ts           Local dev entry (port 3001)
│   │   ├── db/                schema.ts, seed.ts, client.ts
│   │   ├── auth/              jwt.ts, middleware.ts
│   │   ├── routes/            auth, shoppingCenters, parkingSpaces, areas, reservations, dashboard
│   │   └── simulator/         iot.ts (occupancy szimulátor)
│   ├── tests/                 supertest auth + reservations
│   └── tsconfig.json
├── src/
│   ├── components/            UI + skeletons + ReservationModal
│   ├── pages/                 8 oldal (Public + 7 admin)
│   ├── hooks/                 TanStack Query hookok (useShoppingCenters, useReservations, ...)
│   ├── contexts/              Auth + Theme
│   ├── mocks/                 MSW handlerek (fallback)
│   ├── i18n/                  HU + EN fordítások
│   ├── types/                 Központi típusok
│   ├── utils/                 apiClient + dataAdapters
│   └── test/                  Test setup
├── docs/
│   ├── ai-usage-draft.md      ~2 oldal vázlat a thesis MI fejezethez
│   └── ux/                    UX dokumentáció
├── SCORECARD.md               Pontonkénti reakció a tanári visszajelzésre
├── README.md                  Ez a fájl
├── package.json
├── vite.config.ts             Frontend build + dev proxy + test config
├── vitest.config.ts           Vitest frontend config (kizárja a server/-t)
├── vitest.server.config.ts    Vitest backend config (singleFork)
└── vercel.json                Vercel deploy konfig
```

---

## Verzió + roadmap

**Verzió:** 0.4.0 — *Sprint 02 / M1 push (2026‑04‑26)*

### Sprint 02 (befejezve)
- ✅ Frontend MVP polish (gradient hero, skeletons, toasts, mobile hamburger)
- ✅ Foglalási flow (US‑06)
- ✅ **Valós backend** (Express + SQLite + JWT)
- ✅ **IoT szimuláció** (`setInterval` 30s + audit history)
- ✅ **Vercel serverless deploy** + **Docker compose**
- ✅ 5 új képernyő (S04–S08 placeholder pótlása)
- ✅ Auth: bcrypt + JWT + axios interceptor + 401 auto‑logout
- ✅ Mobile responsive + a11y polish
- ✅ 5 GitHub Actions workflow
- ✅ 54 teszt (40 frontend + 14 backend)

### Sprint 03 (tervezett — 2026‑05‑03 → 2026‑05‑23)
- 🟡 Vercel Postgres / Turso integráció (perzisztens prod DB)
- 🟡 OAuth2 / OIDC valódi identitásszolgáltatóval
- 🟡 E2E tesztek Playwright‑tel
- 🟡 Lighthouse CI mobile + desktop
- 🟡 Refresh token + HttpOnly cookie auth
- 🟡 Push notifications (Web Push API)

---

## Licenc

MIT

---

**Verzió:** 0.4.0
**Utoljára frissítve:** 2026‑04‑26 (M1 push)
