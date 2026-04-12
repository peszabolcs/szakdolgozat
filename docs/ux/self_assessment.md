# UX Önértékelés — ParkVision

## Pontozási táblázat

| Szempont | Pontszám (1–5) | Indoklás |
|----------|:--------------:|----------|
| Vizuális konzisztencia (szín, tipográfia, spacing) | 4 | A MUI custom theme egységesen érvényesül minden képernyőn; az Inter font, a teal–amber színpár és a 16px-es border radius következetes; Framer Motion mikroanimációk tovább egységesítik az élményt. |
| Információs hierarchia és olvashatóság | 4 | A StatCard-ok, táblázat fejlécek és a tab navigáció logikusan rétegezi az információt; a szekciók jól elkülönülnek spacing-gel és kártya-határolokon; h1–h6 skála konzisztensen alkalmazott. |
| Visszajelzések (loading, validáció, hiba, siker) | 4 | Minden adatvezérelt oldal kezeli a loading / error / empty / success állapotokat; az `aria-live` attribútumok screen readerhez is biztosítják a visszajelzést; a gombok disabled állapotban jelennek meg töltés közben. |
| Hibakezelés és üres állapotok | 4 | Az `ErrorBanner` komponens „Retry" gombbal minden oldalon elérhető; az `EmptyState` kontextusfüggő üzenettel és (disabled) CTA gombbal jelenik meg; a bejelentkezési hiba direkt form-szintű üzenetben jelenik meg. |
| Mobil / asztal lefedettség | 3 | A grid layout reszponzív (xs/sm/md/lg breakpointok); azonban a sidebar `variant="permanent"` mobilon is mindig látszik, ami szűkíti a tartalomterületet; a Leaflet térkép mobil-kompatibilis. |
| Akadálymentesség (a11y) | 3 | `role="alert"` az ErrorBanner-en, `role="status"` az EmptyState-en, `aria-current="page"` a sidebar navigációban és `aria-live="polite"` a loading állapotban implementálva; azonban az ikonok, grafikonok és a tárkép markerei nem rendelkeznek teljes ARIA-leírással; a kontrasztarány a teal–fehér párosnál megfelelő (WCAG AA szint), de nincs szisztematikus audit. |
| Onboarding és új-user élmény | 2 | Nincs dedikált onboarding flow, üdvözlő képernyő vagy tooltip-vezérelt bemutató; az új felhasználó egyből a bejelentkezési oldalon találja magát, aztán a vezérlőpulton — kontextus nélkül. |
| Teljesítményérzet (gyorsaság, animációk) | 4 | Vite + ES modulok gyors HMR-t és kis bundle-t biztosítanak; a TanStack Query cache minimalizálja az újratöltéseket; a Framer Motion page transition és kártya animációk folyamatossá teszik a navigációt. |

---

## Szöveges értékelés

### Mire vagyunk büszkék a UI/UX-ben?

A leginkább büszkék az adat-állapot kezelés teljességére vagyunk: minden adatvezérelt képernyő egységesen kezeli a loading, error, empty és success állapotokat, és mindegyik állapothoz értelmes, akciókra hívó UI tartozik. Büszkék vagyunk a dual-theme implementációra is — a teljes light/dark mód localStorage-szal és rendszerpreferencia-figyelővel valóban gördülékeny élményt nyújt. Az interaktív Leaflet térkép és az Admin Panel Recharts grafikonjai funkcionálisan és vizuálisan is meghaladják az MVP elvárásait.

### Mit fejlesztenénk tovább, ha lenne még két hét?

Elsősorban a mobil élményt kellene javítani: a sidebar-t `variant="temporary"` Drawer-re cserélnénk mobilon, hamburger menüvel — ez önmagában sokat javítana a kis képernyős használhatóságon. Másodsorban egy rövid onboarding flow-t vezetnénk be az első bejelentkezés után (funkció-tour vagy üdvözlő kártya), hogy az új admin felhasználók ne legyjenek elveszve a vezérlőpulton.

### Mit nem sikerült megvalósítani abból, amit terveztünk?

Nem sikerült megvalósítani a valós idejű adatfrissítést (polling vagy WebSocket), ami parkolórendszernél elvárható lenne. A táblázatokban a teljes lapozás és az összes oszlopon való rendezés szintén elmaradt (jelenleg csak az „Updated" oszlopon elérhető, max 20 sor jelenik meg). A hozzáférhetőségi lefedettség sem teljes: a Recharts grafikonok és a Leaflet markerek screen reader számára nehézkes tartalmak, amelyekhez szöveges alternatívákat kellett volna biztosítani.
