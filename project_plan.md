# Project Plan – ParkVision

## Egy mondatos értékajánlat
Webes kezelőfelület parkolóüzemeltetők számára, amelyen valós idejű foglaltsági adatokat követhetnek zónánként — React alapú SPA mock API-val, amely validálja az UX-et a valódi backend integrációja előtt.

## Képességek

| Képesség | Kategória | Komplexitás | Miért nem triviális? |
|---|---|---|---|
| Foglaltsági statisztika dashboard | Value | M | Több forrásból aggregált mutatók (total, occupied, free, %) valós idejű újraszámítással |
| Parkolóhely-tábla szűréssel és rendezéssel | Value | M | Többszintű szűrő (státusz), oszloprendezés és lapozás egyidejű state kezelése |
| Zóna kapacitás áttekintő | Value | M | Per-zóna töltöttség vizualizáció haladásjelzőkkel, dinamikus színkódolással |
| Bejelentkezés és szerepkör-alapú útvédelem | Productization | L | JWT refresh token rotáció, RBAC guard React Routerrel, token lejárat kezelése |
| Hibaállapot kezelése retry logikával | Productization | M | TanStack Query retry konfiguráció + kontextusfüggő hibaüzenetek + felhasználói visszaállítás |
| MSW mock API többszcenáriós támogatással | Productization | L | Fejlesztési és tesztkörnyezet izolációja, `normal` / `empty` / `error` szcenáriók egységes kezelése, handler override tesztekben |
| Tesztlefedettség CI-ban érvényesítve | Productization | L | Komponens-, hook- és integrációs tesztek, 60%-os küszöb GitHub Actions pipeline-ban |

## A legnehezebb rész
Az MSW mock réteg úgy való megépítése, hogy az egyszerre legyen fejlesztési eszköz, tesztelési alap és UX-validációs platform. A három szcenárió (normal / empty / error) kezelése handler szinten egyszerűnek tűnik, de a tesztek handler override-ja és az async TanStack Query állapotátmenetek szinkronizálása — különösen a retry logikával kombinálva — nem fog elsőre működni: a vitest + RTL + MSW + TanStack Query stack-ben a timing hibák nehezen reprodukálhatók és debugolhatók.

## Tech stack – indoklással

| Réteg | Technológia | Miért ezt és nem mást? |
|---|---|---|
| UI | React 18 + TypeScript + Material-UI 5 | Komponens-alapú újrafelhasználhatóság; MUI kész design system-t ad, így nem kell CSS architektúrát tervezni; TS strict mode korai hibafogást biztosít |
| Adatlekérés / logika | TanStack Query 4 + Axios | Automatikus cache, retry, loading/error state kezelés boilerplate nélkül; Axiosnál jobb interceptor és error normalizáció mint fetch-nél |
| Mock backend | MSW 1.2 | Service Worker szinten interceptál, ezért azonos kód fut fejlesztésben és tesztben — nem kell külön mock szervert üzemeltetni |
| Routing | React Router 6 | De-facto standard React SPA routinghoz; nested route + Outlet pattern tiszta layout-szeparációt ad |
| Adattárolás | Nincs perzisztens tároló (Sprint 2) | MVP célja UX validáció, nem adat-perzisztencia; backend integráció Sprint 3 feladata |
| Auth | JWT + refresh token (tervezett) | Stateless, skálázható; a role claim közvetlenül a tokenből olvasható route guardhoz |
| Build / Dev | Vite 4 | Natív ES modul HMR < 100ms; CRA-nál lényegesen gyorsabb fejlesztési ciklus |
| Tesztelés | Vitest + React Testing Library | Vite-natív, nincs Jest konfiguráció overhead; RTL a felhasználói viselkedést teszteli, nem az implementációt |

## Ami kimarad (non-goals)
- Valódi backend API integráció (Sprint 3 feladata)
- Valós idejű frissítés WebSocket / SSE alapon
- Mobil natív alkalmazás
- Fizetési vagy foglalási funkciók
- Adminisztrációs CRUD műveletek (parkolóhelyek szerkesztése)
- SEO optimalizáció (SPA limitáció, Sprint 2-ben elfogadott)

## Ami még nem tiszta
- Milyen granularitású szerepköröket igényel az auth rendszer (operator vs. admin vs. viewer)?
- Hogyan kezeljük az offline állapotot, amikor a valódi backend elérhetetlenné válik?
- Szükséges-e E2E tesztelés (Playwright) már Sprint 2-ben, vagy elegendő az egységtesztek + integrációs tesztek kombinációja?
