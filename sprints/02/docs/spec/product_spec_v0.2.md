# Product Specification — ParkVision MVP

**Version:** 0.3.0
**Sprint:** 02
**Last updated:** 2026-04-26
**Status:** Active

---

## 1. Vision

A ParkVision egy okos parkolásmenedzsment-rendszer, amely a budapesti bevásárlóközpontok parkolóinak valós idejű kihasználtsági adatait teszi elérhetővé a látogatóknak (publikus felület), és teljes körű menedzsment-eszközt nyújt a központok üzemeltetőinek (admin felület). A Sprint 02-es MVP ezt **frontend‑first**, mockolt API‑val (MSW) szállítja, hogy az ügyfél már a backend‑integráció előtt lássa és validálja a teljes UX‑t.

## 2. Hatókör (Scope)

### Scope (in)
- Publikus kezdőoldal (landing) hős szekcióval, interaktív Leaflet‑térképpel, bevásárlóközpont‑listával.
- Admin felület: dashboard (KPI‑k), shopping centers tábla szűrőkkel, térkép, foglalások (új), admin panel (chartok).
- Mock API (MSW) három szcenárióval: `normal`, `empty`, `error`.
- Mock auth (`admin@parkvision.hu` / `admin123`).
- i18n (HU/EN), világos/sötét téma, PWA install + offline indicator.
- **Új**: parkolóhely-foglalási flow (modal, foglaláslista oldal, localStorage perzisztencia).
- CI: lint + build + teszt + coverage GitHub Actions‑ön.
- IaC: Terraform validate + plan a Vercel deploy-hoz (apply Sprint 03‑ban).

### Out of scope (az MVP‑ben)
- Valós backend / API‑integráció.
- E2E Playwright tesztek (a `@playwright/test` dep előkészítve).
- Felhasználói profil + kedvencek.
- Push‑értesítések, fizetés, navigáció‑provider integráció (Google Maps Direction).
- Valós identitásszolgáltató (OIDC, OAuth).

## 3. Felhasználói szerepkörök

| Szerep | Leírás |
|---|---|
| **Visitor** (publikus) | Auth nélkül böngészi a központokat, foglal parkolóhelyet. |
| **Admin** | Bejelentkezve látja a dashboard‑ot, a foglalásokat, a térképet, és a részletes analitikát. |

## 4. Non‑functional Requirements

| ID | NFR | Cél |
|---|---|---|
| NFR‑01 | Performance | A publikus oldal `LCP < 2.5s` desktopon, `< 4s` 3G mobil simulációban. |
| NFR‑02 | Accessibility | WCAG AA — szín kontraszt, aria‑label‑ek, billentyűzet-navigáció. |
| NFR‑03 | Offline | Service worker cache‑elt assetekkel, offline indicator. |
| NFR‑04 | Reszponzív | Mobil (≥360px), tablet, desktop layout. |
| NFR‑05 | Coverage | Egységtesztek ≥ 60% (cél), kritikus hookoknál 100%. |
| NFR‑06 | Lint | Zero ESLint warning policy a CI‑ban. |
| NFR‑07 | i18n | Minden UI‑szöveg fordítható (HU/EN), nincs hardcoded magyar/angol. |
| NFR‑08 | Build | TypeScript strict mode, `tsc --noEmit` siker. |

## 5. Acceptance Criteria (összesítve)

A részletes Given‑When‑Then AC‑ket a [user_stories.md](../stories/user_stories.md) tartalmazza. Itt csak a magas szintű szabványokat rögzítjük:

- **AC‑G1** Minden adat‑oldal kezeli a négy állapotot: loading (skeleton), error (banner + retry), empty (illusztrált EmptyState), success.
- **AC‑G2** A dark/light és HU/EN váltás minden oldalon működik, és perzisztens (`localStorage`).
- **AC‑G3** A foglalási flow validálja a múltbéli időpontokat és a 100%‑os telítettséget.
- **AC‑G4** A CI minden push‑on lefut, és zöld build/teszt/lint nélkül nem mergelhető a `main`.
- **AC‑G5** A `terraform validate` zöld; `plan` opcionális (token‑függő).

## 6. Kockázatok és feltételezések

- **R1** A mock adatok valós backenddel kicserélése Sprint 03‑ban — a hookok interface‑e stabil, így a csere lokális.
- **R2** A foglalás localStorage‑ben él — eszközök közötti szinkronizáció Sprint 03+.
- **R3** A `https://source.unsplash.com` proxy időnként throttle‑ol — a `ShoppingCenterCard` fallback gradiens biztosítja a vizuális stabilitást.
