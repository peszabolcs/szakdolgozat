# ParkVision Frontend MVP

A ParkVision egy okos parkolásmenedzsment rendszer front-end MVP-je. Ez a repository a megvalósított felületet, a kapcsolódó dokumentációt és a fejlesztési eszközöket tartalmazza.

## Gyors áttekintés

**Cél**: egy reszponzív, többnyelvű, PWA-képes admin felület létrehozása, amely képes parkolóhelyek, területek és bevásárlóközpontok adatainak bemutatására, és megbízhatóan működik offline helyzetekben is.

**Fő fókuszok**:

- Stabil, tesztelhető React komponens- és oldalstruktúra
- Mockolt API-integráció (MSW) a backend nélküli fejlesztéshez
- PWA és offline támogatás
- Átlátható dokumentáció és traceability

## Dokumentáció

Az alábbi, a rootban található dokumentumok a fő összefoglalók:

- [PWA_ENHANCEMENT_SUMMARY.md](PWA_ENHANCEMENT_SUMMARY.md)
- [PWA_TEST_REPORT.md](PWA_TEST_REPORT.md)
- [MSW_FIX_APPLIED.md](MSW_FIX_APPLIED.md)

## Fő funkciók

- Dashboard statisztikák és összegzések
- Parkolóhelyek listázása és státuszok megjelenítése
- Területek kezelése (kapacitás, kihasználtság)
- Bevásárlóközpontok listázása
- Hibakezelés és üres állapotok egységes UI-val
- Reszponzív megjelenítés mobil és desktop nézetre
- PWA telepíthetőség és offline jelzés

## Architektúra áttekintés

**Fő rétegek**:

1. **UI réteg**: komponensek és oldalak a [src/components](src/components) és [src/pages](src/pages) alatt.
2. **Adatlekérés**: TanStack Query hookok a [src/hooks](src/hooks) alatt.
3. **Mock API**: MSW handler-ek a [src/mocks](src/mocks) alatt.
4. **Állapot és kontextus**: Auth és téma kontextus a [src/contexts](src/contexts) alatt.
5. **Segédlogika**: típusok és utility-k a [src/types](src/types) és [src/utils](src/utils) alatt.

**Adatfolyam**:

- Oldalak meghívják a hookokat (például `useParkingSpaces`).
- A hookok axioson keresztül `GET /api/*` kéréseket indítanak.
- Fejlesztési módban az MSW elfogja ezeket és a [src/mocks/data](src/mocks/data) statikus adataival válaszol.
- A válaszok megjelennek a komponensekben és chartokban.

## Routing és hozzáférés

A routing és a hozzáférés a [src/App.tsx](src/App.tsx) fájlban van definiálva.

**Nyilvános útvonalak**:

- `/` – publikus kezdőoldal
- `/login` – admin belépés

**Védett admin útvonalak** (csak bejelentkezve):

- `/admin/dashboard`
- `/admin/shopping-centers`
- `/admin/map`
- `/admin/admin-panel`

**Bejelentkezés**: mockolt admin felhasználóval történik, lásd [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx). Alapértelmezett hitelesítési adatok:

- Email: `admin@parkvision.hu`
- Jelszó: `admin123`

## I18n és nyelvkezelés

A projekt két nyelvet támogat:

- magyar
- angol

A beállítás a [src/i18n/config.ts](src/i18n/config.ts) fájlban található. Az aktuális nyelv a `language` localStorage kulcsban kerül tárolásra, alapértelmezett értéke `hu`.

## PWA és offline működés

A PWA beállítások a [vite.config.ts](vite.config.ts) fájlban találhatók, a `vite-plugin-pwa` használatával.

Főbb jellemzők:

- automatikus service worker frissítés
- statikus assetek precache-elése
- runtime caching API és képek esetén
- telepíthető alkalmazásnézet

Az offline cache-t a `localforage` kezeli a [src/stores/offlineStore.ts](src/stores/offlineStore.ts) fájlban.

## Mock API és tesztelési szcenáriók

Fejlesztéskor az MSW biztosítja az API-t. A szcenáriók környezeti változóval állíthatók:

```bash
VITE_MOCK_SCENARIO=normal npm run dev
VITE_MOCK_SCENARIO=empty npm run dev
VITE_MOCK_SCENARIO=error npm run dev
```

## Telepítés és futtatás

### Előfeltételek

- Node.js 18.x
- npm 9.x
- Terraform 1.5+ (IaC futtatáshoz)

### Telepítés

```bash
npm install
npm run dev
```

Alapértelmezett fejlesztői URL: `http://localhost:5173`

## NPM scriptek

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run test:watch
npm run test:coverage
npm run lint
npm run ci-local
```

## Mappa-struktúra

```text
src/
	components/   UI komponensek
	pages/        Oldalak és route-ok
	hooks/        TanStack Query hookok
	contexts/     Auth és theme kontextus
	mocks/        MSW handler-ek és mock adatok
	stores/       Offline cache réteg
	i18n/         Fordítások
	types/        Központi típusdefiníciók
	utils/        Segédfüggvények
	test/         Teszt konfiguráció
```

## Technológiai stack

- React 18, TypeScript 5
- Vite 4
- Material UI 5
- TanStack Query 4
- Zustand 3
- MSW 1
- Vitest és Testing Library
- Vite PWA plugin

## Korlátok és ismert hiányok

- Valós backend integráció helyett mock adatok
- Teljes körű táblázatos lapozás és rendezés hiánya
- E2E tesztek csak előkészítve

## Licenc

MIT

---

**Verzió:** 0.2.0  
**Utoljára frissítve:** 2026-01-30
