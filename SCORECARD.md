# SCORECARD — Reakció a 2026‑04‑15‑i értékelésre

> **Cél**: pontonként reagálni Bilicki Vilmos és a tech bíráló (Perjesi Szabolcs) értékelésére, és bemutatni, hogy a Sprint 02‑es push (2026‑04‑26) mire ad választ. A repó verziója: **v0.4.0**.

---

## 1. rész — Funkcionalitás és Technológiai Értékelés (eredeti: 2.0/5)

### Bíráló kritika → mit tettünk

| Bíráló pont | Eredeti értékelés | Sprint 02 reakció (v0.4.0) |
|---|---|---|
| **Backend infra (Express.js / FastAPI)** | „SÜRGŐS" | ✅ **Express 4 backend** a `server/` alatt, modulárisan: `app.ts`, `routes/`, `auth/`, `db/`, `simulator/`. CORS, JSON body, hibakezelés, health endpoint. |
| **DB séma (PostgreSQL/MongoDB)** | „SÜRGŐS" | ✅ **better‑sqlite3** Vercel‑kompatibilis SQL adatbázissal. 6 tábla: `users`, `shopping_centers`, `parking_spaces`, `areas`, `reservations`, `occupancy_history`. Index‑ek, foreign key kényszerek. (Választás indoklása: ADR‑0004.) |
| **REST API: legalább 5 endpoint** | „SÜRGŐS" | ✅ **12+ endpoint**: `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/shopping-centers`, `GET /api/shopping-centers/:id`, `GET /api/shopping-centers/:id/history`, `GET /api/parking-spaces`, `GET /api/areas`, `GET /api/reservations`, `POST /api/reservations`, `DELETE /api/reservations/:id`, `GET /api/dashboard/stats`, `GET /api/health`. |
| **Adatforrás (CSV/JSON import vagy IoT szimuláció)** | „SÜRGŐS" | ✅ **IoT szimulátor** (`server/src/simulator/iot.ts`) — `setInterval` 30 mp‑enként ±5 fős occupancy változással + `occupancy_history` audit log. 7 napos seed historikus adat (peak hours szimuláció) a heatmap‑hez. |
| **Deploy: Docker + GitHub Actions CI/CD** | „SÜRGŐS" | ✅ **Multi‑stage Dockerfile** + **`docker-compose.yml`** (api + nginx web). ✅ **GitHub Actions**: `test.yml` (frontend), `backend.yml` (Express+SQLite tests), `build.yml`, `terraform.yml`, `docker.yml`. ✅ **Vercel serverless** deploy `api/index.ts`‑szel és `vercel.json`‑nal. |
| **Autentikáció (jelenleg nincs)** | „Sürgős" | ✅ **Valódi JWT auth** — `jsonwebtoken` 7d tokennel, `bcryptjs` jelszóhash, `requireAuth` middleware, `requireRole`, frontend axios interceptor a Bearer header‑hez (`src/utils/apiClient.ts`). 2 seed user: admin + visitor. |
| **„Csak töredék valósult meg (29%)"** | 2/5 | ✅ A 7 tervezett képességből most működik mind: dashboard, parkolóhely tábla, zóna áttekintő, JWT auth + RBAC, hibaállapot retry, **valós backend** (nem csak MSW), tesztlefedettség CI‑ban. |
| **„1 commit 32 nap alatt"** | 2/5 fejlesztési folyamat | ✅ A Sprint 02‑es push **6+ atomic commit**‑tal érkezik (ld. `git log`). A munka strukturált a `sprints/02/docs/stories/user_stories.md` 8 INVEST‑story alapján. |
| **„Frontend‑only projekt, nincs backend/DB"** | Összegzés | ✅ Most már teljes stack: **React 18 + Vite SPA** ↔ **Express 4 + SQLite** ↔ **Vercel serverless / Docker compose**. MSW marad fejlesztési **fallback**ként (`VITE_USE_MSW=true`). |

### Mi maradt szándékosan kívül

- **Vercel Postgres** vagy **Turso** integráció: a deploy stabilitása érdekében Vercel‑en az SQLite **in‑memory** módban fut (cold‑start után újraseedel a `seed.ts`‑ből). A foglalások közben perzisztensek; a hosszú távú perzisztencia Sprint 03 témája.
- **OAuth2 / OIDC**: JWT mock identitásszolgáltatóval. Az Auth0/Keycloak integráció backend‑oldali config‑váltás csak.
- **Parkolóhely‑felismerés ML modell**: a tanári javaslat egy önálló kutatási projekt, ami túlmegy a Sprint 02 hatókörén. Az IoT szimulátor a placeholder‑e.

### Tervezett képességek — frissített státusz

| Képesség | Korábbi | Most (v0.4.0) |
|---|---|---|
| Foglaltsági irányítópult | M, mock | ✅ Valós backend, JWT‑védett `/api/dashboard/stats`, 5 KPI accent színekkel |
| Parkolóhely tábla szűréssel | M, frontend logika | ✅ `/api/parking-spaces` + szabadon/foglalt szűrő + keresés + paginálás (`ParkingSpacesPage`) |
| Zóna kapacitás áttekintő | M, „valós érzékelő nélkül értelmetlen" | ✅ IoT szimulátor + `occupancy_history` 7×24 heatmap (`ParkingDetailPage`) |
| JWT auth + RBAC | L, csak terv | ✅ Valódi JWT (jsonwebtoken), bcrypt jelszóhash, role‑guard middleware |
| Hibaállapot retry logika | L, csak teszt | ✅ TanStack Query `retry: 1`, `ErrorBanner` retry CTA, 401 interceptor → auto‑logout |
| MSW multi‑scenario mock | L, „NEM backend" | ✅ Marad fejlesztési fallback, kapcsolható (`VITE_USE_MSW=true`) |
| Tesztlefedettség CI (60%) | L, „nincs valódi teszt" | ✅ **40 frontend teszt** + **14 backend teszt** (Vitest + supertest), CI‑ban futnak |

### Tech stack — frissített kép

| Réteg | Korábbi | Most |
|---|---|---|
| Frontend | React 18 + TS + Vite | React 18 + TS + Vite ✅ |
| UI | MUI | MUI 5, **teljes design system + reszponzív** ✅ |
| State | TanStack Query | TanStack Query + **valós backend** ✅ |
| Mock API | MSW 1.2 | MSW marad fallback‑ként, **kapcsolóval** |
| **Backend** | NINCS | **Express 4 + Zod validation + JWT** ✅ |
| **Adatbázis** | NINCS | **better‑sqlite3** (file lokálisan, in‑memory Vercel‑en) ✅ |
| **Deploy** | NINCS | **Vercel serverless + Docker compose** ✅ |
| **CI/CD** | NINCS | **5 GitHub Actions workflow** ✅ |

---

## 2. rész — GUI/UX értékelés (eredeti: 67/100, 3.38/5)

### Sebes javítások a 20 heurisztika alapján

| # | Heurisztika | Korábbi | Mit változtattunk |
|---|---|---|---|
| 1 | Rendszer állapot láthatósága | 3/5 | ✅ **Auth error state** explicit `LoginPage`‑en (invalid credentials, network error, ismeretlen — színes Alert címmel + leírással). `ProtectedRoute` hidratálási spinner. Toast notifikáció (notistack) minden mutáció után. |
| 2 | Valós világ egyezés | 3/5 | ✅ A korábbi placeholder S04‑S08 **mindegyike valódi képernyő**: `ReservationsPage`, `ParkingSpacesPage`, `ParkingDetailPage`, `SettingsPage`. Sidebar minden link aktív. |
| 3 | Felhasználói kontroll | 3/5 | ✅ **Mobile hamburger menu** — `Drawer variant="temporary"` `<md` alatt + `MenuIcon` az AppBar‑ban. Kibejelentkezés perzisztens token‑törléssel. „Vissza a főoldalra" gomb a LoginPage‑en. |
| 4 | Konzisztencia | 4/5 | ✅ Theme egységes (teal/orange + gradient buttons + blur cards). |
| 5 | Hibaelőzés | 3/5 | ✅ **Form validation** real‑time (email regex, password length 6+), **input adornments**, password toggle visibility. Backend Zod schema validáció minden POST‑on. Foglalásnál: múlt slot disabled chip, telített központ inline warning. |
| 6 | Felismerés > emlékezés | 3/5 | ✅ **EmptyState**‑ek illusztrált SVG‑vel (parking pin / reservation grid). **ErrorBanner** színkódolt left border + ikon pulse animáció. Skeleton loader minden adat‑oldalon. |
| 7 | Rugalmasság/hatékonyság | 3/5 | ✅ Demo credentials a LoginPage‑en kattintható (admin + visitor). Toggle button group a szűrőkre. Pagination 24 elem/oldal. |
| 8 | Hibakezelés | 3/5 | ✅ Backend kódolt error response‑ok (`code: 'past' \| 'duplicate' \| 'full'`) → frontend strukturált handling. 401 → automata logout + redirect a Login‑ra. |
| 9 | Segítség/dokumentáció | 2/5 | ✅ README v0.4.0 részletes szekciókkal, demo URL, screenshot placeholder, futtatási útmutató (3 mód: dev / Docker / Vercel). `SCORECARD.md` ez a fájl. |
| 10 | Visszajelzés | 4/5 | ✅ Toast (notistack) success/error/warning/info négyféle stílusban. Trend ikon (↑/↓) StatCard‑on. |
| 11 | Vizuális hierarchia | 4/5 | ✅ Megerősítve: KPI cards > tábla > chart, gradient hero, scroll‑triggered card animációk Framer Motion‑nal. |
| 12 | Közelség | 4/5 | ✅ Megerősítve. |
| 13 | Hasonlóság | 4/5 | ✅ Megerősítve. |
| 14 | Esztétika/minimalizmus | 4/5 | ✅ Hero gradient + radial blur, `LoginPage` background gradient mindkét témában. |
| 15 | Szín/kontraszt | 4/5 | ✅ MUI default WCAG AA. Dark mode külön palettával (nem csak inverz). |
| 16 | Tipográfia | 4/5 | ✅ Inter font, fontWeight 700‑800 a heading‑ekre, monospace a credentials‑re. |
| 17 | **Reszponzív/mobil** | 3/5 | ✅ **Mobile drawer (hamburger)**, app‑bar IconButton small a mobilon, Stack column‑ra vált `<md`. Touch target ≥48px. |
| 18 | Navigáció | 4/5 | ✅ Active link highlight (left accent border + bold), settings menüpont a user menü‑ből is. |
| 19 | Akadálymentesség | 3/5 | ✅ `aria-label`‑ek minden ikon‑gombon, `aria-current="page"` az aktív menüpontnál, `role="status"` az EmptyState‑en, `role="alert"` az ErrorBanner‑en. Form input `aria-describedby` a helper text‑hez (MUI default). Password toggle `aria-label`. |
| 20 | Állapotkezelés | 3/5 | ✅ TanStack Query cache + invalidate, hook szintű hibrid (local/remote) a foglalásnál. |

### Új képernyők (a tanári „javasolt új képernyők és funkciók" pontra)

| Tanári javaslat | Implementálva | Hol |
|---|---|---|
| S04 — Parkolóhely foglalás (időpont, zóna, fizetés) | ✅ | `ReservationModal` + `ReservationsPage`, `/admin/reservations`, `/api/reservations` |
| S05 — Térkép nézet (Leaflet, valós idejű IoT) | ✅ | `MapPage` + `InteractiveMap` + IoT simulator a backend‑en |
| S06 — Foglalási előzmények, aktív állapot | ✅ | `ReservationsPage` upcoming/past tabokkal, status chip‑ek |
| S07 — Admin analitika (kihasználtsági grafikonok) | ✅ | `AdminPage` (Recharts) + `ParkingDetailPage` 7×24 heatmap + 24h area chart |
| S08 — Beállítások (profil, értesítés, fizetés) | ✅ | `SettingsPage` (`/admin/settings`) — 3 szekció (profile/notifications/payment) |
| Mobil → hamburger menü, touch target | ✅ | Layout responsive Drawer + IconButton sizing |
| Autentikáció valódi JWT | ✅ | server/src/auth + frontend AuthContext refactor |

---

## 3. rész — Mit lát a tanár, ha most megnyitja a repót

1. **GitHub README**: `v0.4.0`, dokumentált három futtatási mód (dev, Docker compose, Vercel), Sprint deliverable linkek, foglalási flow leírás.
2. **`sprints/02/`**: spec, 6+2 INVEST user story, **6 ADR** (frontend, IaC, reservation storage, **backend stack, auth, deploy**), DoR/DoD, traceability matrix, 5 wireframe, 3 Gherkin feature, Vercel Terraform IaC, AI usage log.
3. **CI**: `.github/workflows/{test,build,terraform,backend,docker}.yml` — minden push‑on lefut.
4. **Backend**: `server/src/{app.ts,routes/,auth/,db/,simulator/}` — Express + SQLite + JWT + IoT.
5. **Frontend**: 8+ valós képernyő (publikus + 7 admin), mobil hamburger, dark mode, HU/EN, polish layer.
6. **Tesztek**: 40 frontend + 14 backend (összesen 54), `npm run ci-local` zöld.

---

## 4. rész — Várt új pontszám‑becslés

| Szempont | Korábbi | Becsült új | Indok |
|---|---|---|---|
| Megvalósítás | 2/5 | **4/5** | 7/7 képesség + 5 új képernyő, valós backend |
| Fejlesztési folyamat | 2/5 | **4/5** | 6+ atomic commit, INVEST stories, ADR‑ek, traceability |
| Tech stack | 4/5 | **5/5** | Backend + DB + auth + deploy mind hozzáadva |
| Tesztelés | 3/5 | **4/5** | 54 teszt + CI |
| Deploy / CI/CD | 1/5 | **4/5** | Vercel serverless + Docker compose + 5 CI workflow |
| **Funkcionalitás összesen** | **2.0/5** | **4.2/5 (cél)** | |
| **GUI/UX összesen** | **3.38/5** | **4.0/5 (cél)** | 20 heurisztikára célzott javítások |

---

*Készítette: Pesz Szabolcs (Neptun: EJDD1H) — 2026‑04‑26 (M1 push)*
