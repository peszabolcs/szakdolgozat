# User Stories — Sprint 02

INVEST‑kompliant user storyk Given‑When‑Then acceptance criteriával. A traceability hivatkozásokat a [traceability.md](../traceability.md) tartja karban.

---

## US‑01 — Üres állapot a dashboardon

> **Mint** admin felhasználó,
> **szeretnék** értelmes üres állapot üzenetet látni, ha még nincs adat a rendszerben,
> **hogy** tudjam, mit kell tennem a kezdéshez.

**AC**:
- *Given* a mock szcenárió `empty`, *when* megnyitom a `/admin/dashboard`‑ot, *then* az "Nincs még bevásárlóközpont" feliratot és illusztrációt látom.
- *Given* az üres állapot látható, *when* van CTA gomb, *then* az aria‑role helyes és billentyűzettel elérhető.

**Test**: `src/components/EmptyState.test.tsx` · **Gherkin**: `tests/acceptance/empty_state.feature`

---

## US‑02 — Bevásárlóközpontok szűrése kihasználtság szerint

> **Mint** admin felhasználó,
> **szeretném** szűrni a bevásárlóközpontokat foglaltság szerint (alacsony / közepes / magas),
> **hogy** gyorsan azonosítsam azokat, ahol beavatkozás szükséges.

**AC**:
- *Given* a `/admin/shopping-centers` oldalon vagyok, *when* kiválasztom a "Magas (>80%)" szűrőt, *then* csak a 80% feletti foglaltságú központok jelennek meg.
- *Given* nincs találat, *then* EmptyState látszik megfelelő üzenettel.

**Test**: `src/pages/ShoppingCentersPage.test.tsx`

---

## US‑03 — Térképes nézet és keresés

> **Mint** látogató,
> **szeretném** térképen látni a központokat, és név/cím alapján keresni,
> **hogy** a számomra legközelebbi szabad parkolót találjam.

**AC**:
- *Given* megnyitom a térképet, *when* engedélyezem a geolokációt, *then* a térkép a saját pozíciómra centrál.
- *Given* keresek egy névrészletet, *when* találat van, *then* a térkép arra zoomol.

**Test**: `src/components/InteractiveMap.test.tsx` (placeholder a Sprint 03‑ban)

---

## US‑04 — Témaváltás és nyelvi preferencia

> **Mint** felhasználó,
> **szeretnék** sötét/világos témát és magyar/angol nyelvet váltani,
> **hogy** a saját környezetemnek megfelelő UI‑val dolgozhassak.

**AC**:
- *Given* a sötét témát választom, *when* újratöltöm az oldalt, *then* a sötét téma megmarad.
- *Given* angolra váltok, *when* navigálok bármely oldalra, *then* az UI angolul jelenik meg.

**Test**: kontextus‑szintű unit tesztek

---

## US‑05 — Hibakezelés API‑hibánál

> **Mint** felhasználó,
> **szeretném**, hogy ha az API hibázik, érthető üzenetet és újrapróbálási lehetőséget kapjak,
> **hogy** ne maradjak bizonytalanságban.

**AC**:
- *Given* a mock szcenárió `error`, *when* megnyitok egy adat‑oldalt, *then* `ErrorBanner` jelenik meg "Újrapróbálás" gombbal.
- *Given* megnyomom az újrapróbálást, *when* a hiba megszűnt, *then* az adatok megjelennek.

**Test**: `src/components/ErrorBanner.test.tsx` · **Gherkin**: `tests/acceptance/error_handling.feature`

---

## US‑06 — Parkolóhely foglalás (ÚJ Sprint 02‑ben)

> **Mint** látogató,
> **szeretnék** parkolóhelyet foglalni egy adott bevásárlóközpontba egy adott időpontra,
> **hogy** biztosan legyen szabad helyem érkezéskor.

**AC**:
- *Given* a publikus oldalon kiválasztok egy központot, *when* megnyomom a "Foglalás" gombot, *then* megjelenik a `ReservationModal` előválasztott központtal.
- *Given* a modalban kiválasztok egy jövőbeli időslot‑ot, *when* megerősítem, *then* a foglalás localStorage‑be kerül, success toast jelenik meg, és a modal bezárul.
- *Given* múltbéli időpontot választok, *when* megpróbálom a foglalást, *then* inline validation hibát kapok, és a "Megerősítés" gomb tiltott.
- *Given* 100%‑ban telített központra foglalnék, *when* kiválasztom, *then* warning toast jelenik meg, és a foglalás letiltódik.
- *Given* az `/admin/reservations` oldalon vagyok, *when* legalább egy aktív foglalásom van, *then* az látható "Közelgő" tab alatt időponttal és helyszínnel.
- *Given* lemondom a foglalást, *when* a "Lemondás" gombot megnyomom, *then* a foglalás státusza `cancelled`, és a "Múlt" tab alá kerül.

**Test**: `src/hooks/useReservations.test.ts`, `src/components/ReservationModal.test.tsx` · **Gherkin**: `tests/acceptance/reservation_flow.feature`
