# Top 3 User Journey — ParkVision

---

## Journey 1 — Reggeli telítettség-ellenőrzés

**Cím:** Napi nyitás előtt az admin leellenőrzi, hol vannak kritikus pontok

**Persona:** Kovács Péter, parkolómenedzser. Reggel munkakezdéskor szeretné azonnal látni, melyik bevásárlóközpont közel telt, és hol van még szabad kapacitás — mielőtt fogadja a járőröktől az első hívásokat.

**Belépési pont:** PWA ikon az asztali képernyőn (vagy böngésző bookmark → /)

| # | Képernyő | Mit csinál a felhasználó | Mit lát / rendszerválasz | Lehetséges hibaág |
|---|----------|--------------------------|--------------------------|-------------------|
| 1 | S01 — Főoldal | Megnyitja az alkalmazást | Hero szekció + bevásárlóközpont kártyák + interaktív térkép preview töltődik | Ha API hiba: kártyák helyett skeleton / hibaüzenet |
| 2 | S01 → S02 | A jobb felső sarokban a „Bejelentkezés" gombra kattint | Bejelentkezési oldal jelenik meg email + jelszó mezőkkel | — |
| 3 | S02 — Bejelentkezés | Beírja az email és jelszó kombinációt, submit | Loading spinner, majd átirányítás `/admin/dashboard`-ra | Helytelen adatok: hibaüzenet a form alatt; A „Bejelentkezés" gomb disabled marad loading alatt |
| 4 | S03 — Vezérlőpult | Áttekinti a 5 StatCard-ot | Látja az összesített számokat: összes hely, foglalt, szabad, átlagos kihasználtság %-ban | Ha API hiba: ErrorBanner „Retry" gombbal jelenik meg; Ha nincs adat: EmptyState |
| 5 | S03 → S04 | Sidebar „Shopping Centers" menüre kattint | Táblázatos nézet töltődik az összes bevásárlóközponttal és progress bar-okkal | — |
| 6 | S04 — Bevásárlóközpontok | A szűrőből kiválasztja a „Magas (≥80%)" opciót | A táblázat csak a kritikusan telt helyszíneket mutatja; az eredmények száma frissül | Ha nincs ilyen szint: üres táblázat „Nincs találat" üzenettel |
| 7 | S04 → S05 | Egy kritikus sornál a „View on Map" ikon gombra kattint | Térkép oldal nyílik, a kiválasztott területen piros marker látszik | — |

**Sikerkritérium:** A felhasználó látja, hogy az adott bevásárlóközpont melyik ponton van a térképen, és piros (>80%) markerrel jelölve van.

**Mért időtartam:** ~6 kattintás / ~45–60 másodperc (első bejelentkezéssel); visszatérő használatnál session él → ~3 kattintás / ~20 mp

---

## Journey 2 — Szabad hely keresése a térképen

**Cím:** Helyszíni felügyelő gyorsan megtalálja a legközelebb szabad parkolóterületet

**Persona:** Nagy Eszter, parkolófelügyelő. Terepen van, telefonon nyitja meg az appot. Azt keresi, melyik zónában van még szabad hely a bevásárlóközpont közelében, hogy oda irányítsa az autókat.

**Belépési pont:** Böngésző mobilon → / → bejelentkezés (session él) → sidebar → S05

| # | Képernyő | Mit csinál a felhasználó | Mit lát / rendszerválasz | Lehetséges hibaág |
|---|----------|--------------------------|--------------------------|-------------------|
| 1 | S03 — Vezérlőpult | Sidebar „Map" menüre koppint | Térkép oldal töltődik, az összes területet mutató markerekkel | Ha API hiba: hibaüzenet szöveg a térkép helyett |
| 2 | S05 — Térkép | A jobb alsó sarokban a „Saját helyzet" gombra koppint | Böngésző geolokáció-engedélyt kér; jóváhagyás után kék marker jelenik meg az aktuális pozíción; térkép rázoomol | Engedély megtagadva: toast/alert „Helymeghatározás nem engedélyezett"; marker nem jelenik meg |
| 3 | S05 — Térkép | A keresőmezőbe beírja a zóna nevét (pl. „Zone A") | A megjelenített markerek valós időben szűrődnek a névegyezés alapján | Nincs találat: összes marker eltűnik, keresőmező alatt üres állapot |
| 4 | S05 — Térkép | Rákoppint egy zöld (szabad <50%) markerre | Popup jelenik meg: terület neve, szabad helyek száma (chip), kihasználtság %; alul kártya nyílik: „X spaces available" | — |
| 5 | S05 — Térkép | A popupban / alsó kártyán a „Navigate" gombra koppint | Google Maps megnyílik egy új böngészőfülön az adott terület koordinátáira irányítva | Ha koordináta nincs: gomb disabled |

**Sikerkritérium:** Google Maps megnyílik és navigációt kínál a kiválasztott parkolóterülethez.

**Mért időtartam:** ~3–4 koppintás / ~20–30 másodperc

---

## Journey 3 — Foglaltsági trendanalízis az admin panelen

**Cím:** Vezető megnézi a 24 órás kihasználtság-trendet döntéshozatalhoz

**Persona:** Dr. Horváth Gábor, területi vezető. Havonta értékelést készít a parkolókapacitás-kihasználtságról. Azt akarja látni, melyik terület volt konzisztensen túlterhelt az elmúlt 24 órában.

**Belépési pont:** Böngésző (asztali) → bejelentkezés → sidebar → S06

| # | Képernyő | Mit csinál a felhasználó | Mit lát / rendszerválasz | Lehetséges hibaág |
|---|----------|--------------------------|--------------------------|-------------------|
| 1 | S03 — Vezérlőpult | Sidebar „Admin Panel" menüre kattint | Admin Panel oldal töltődik: 4 StatCard fent + 3 tab-os kártyás szekció + részletes táblázat alul | Ha API hiba: loading állapot marad / nincs ErrorBanner |
| 2 | S06 — Admin Panel | Az „Occupancy Trends" tab aktív alapértelmezetten | Area chart jelenik meg: X tengely = utolsó 24 óra (óránként), Y tengely = kihasználtság % | Ha nincs adat: üres grafikon terület |
| 3 | S06 — Admin Panel | Az egeret a grafikon egy pontja fölé viszi | Tooltip jelenik meg az adott időpont és kihasználtság értékével (Recharts natív tooltip) | — |
| 4 | S06 — Admin Panel | A jobb felső sarokban a Refresh ikonra kattint | `refetch()` meghívódik, adatok frissülnek; loading röviden megjelenik | Ha API hiba: nem jelenik meg hibaüzenet (jelenlegi implementáció hiányossága) |
| 5 | S06 — Admin Panel | Legörget a táblázathoz, megnézi a top 10 terület sorát | Soronként: kapacitás, foglalt, elérhető (color-coded chip), kihasználtság % + inline progress bar, státusz | — |

**Sikerkritérium:** A vezető látja az idősor grafikont és azonosíthatja a csúcsidőket; a táblázat alapján rangsorolhatja a területeket kihasználtság szerint.

**Mért időtartam:** ~2–3 kattintás / ~15–20 másodperc (grafikon betöltésig)
