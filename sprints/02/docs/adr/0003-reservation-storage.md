# ADR‑0003: Foglalás‑perzisztencia localStorage‑ben (MVP)

**Status:** Accepted
**Date:** 2026‑04‑26 (Sprint 02)
**Decision makers:** Pesz Szabolcs

## Context

A Sprint 02‑re bevezetett **parkolóhely-foglalási flow** (US‑06) perzisztens állapotot igényel — a felhasználó a foglalása után térjen vissza később, és lássa azt a "Foglalások" oldalon. Backend nincs (Sprint 03 dolga), így három alternatíva merült fel.

## Considered options

1. **localStorage (kulcs: `parkvision.reservations.v1`)** — kliens‑oldali, instant olvasás/írás, browser‑specifikus.
2. **`localforage` (IndexedDB wrapper)** — már része a függőségeknek (offlineStore.ts), aszinkron, nagyobb adatmennyiségre is bír.
3. **MSW handler in‑memory state** — backend‑szerű mock, de oldal-újratöltéskor elveszik.

## Decision

**1. opció — localStorage**, mert:
- a foglalás‑lista jellemzően < 100 elem (~10 KB),
- a TanStack Query‑val kompatibilis (custom hook szerveződik körüle),
- szinkron API‑ja egyszerűbb tesztelni, mint az IndexedDB‑t,
- a `localforage` használatát az **offline parkoló‑adat cache** számára tartjuk fenn (külön concern).

## Consequences

- **+** Egyszerű implementáció, ~80 sor kód.
- **+** Tesztben mockolható (`vi.spyOn(localStorage, 'getItem')`).
- **+** A user device‑újratöltéseken túl is persistent.
- **−** Eszközök közötti szinkronizáció nincs (pl. mobil + desktop nem látja egymás foglalásait). Sprint 03‑ban backend‑re átállva ez ingyen megoldódik.
- **−** Privát böngésző‑ablakban a localStorage session‑szintű — elfogadható kompromisszum az MVP‑hez.

## Migration path (Sprint 03)

Backend integrációkor a `useReservations` hook interface‑e változatlan marad, csak a belső storage implementáció localStorage → axios + REST.
