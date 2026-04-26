# Mesterséges intelligencia használata a fejlesztés során

> **Megjegyzés**: ez a fájl **vázlat** a szakdolgozat MI‑fejezetéhez. A felhasználó (Pesz Szabolcs) ezt beilleszti és átfogalmazza a Word formátumú thesis dokumentumba a "Összefoglalás" előtti önálló fejezetbe. Terjedelem ~ 2 oldal. A tanári körlevél 5 szempontját bontja ki konkrét példákkal.

---

## 1. Felhasznált eszközök

A projekt teljes életciklusa során több AI‑eszközt használtam, mindegyiket más fázisban és más célra:

- **Claude Code (Opus 4.7)** — a fejlesztés *karmestere*. Egy IDE‑integrált, agentikus CLI, amely fájlokat tud olvasni, írni, parancsokat futtatni, és a kontextust egy projektszinten meríti. Az architekturális döntések, a sprint deliverable‑ek (ADR‑ek, user storyk, traceability matrix) és a foglalási feature teljes vertikális szelete (`useReservations` hook, `ReservationModal`, `ReservationsPage`, tesztek) ezzel készült. *Miért ez:* az `Explore` subagent‑mintázattal párhuzamosan tudtam feltérképezni a kódbázis több területét, ami a refaktorhoz és a hiányosságok azonosításához (pl. plain `EmptyState`, virtuális `sprints/` mappa) elengedhetetlen volt.
- **GitHub Copilot** — line‑level autocomplete a JSX‑ben és a tesztekben. *Miért ez:* a repetitív MUI prop‑ok, az i18n kulcsok ismétlése, és a Gherkin scenario‑k Given‑When‑Then sablonjai esetén jelentős időmegtakarítás.
- **ChatGPT (GPT‑5)** — sebezhetőbb területeken (pl. Leaflet konfiguráció finomhangolás, Recharts API‑kérdések), és olyan szövegezési feladatoknál, ahol egy második modell véleménye perspektívát adott.

A Sprint 01 kutatási fázisában **Gemini 2.5 Pro** is szerepet kapott egy alkalommal a tech stack összehasonlító táblázatának generálásához (CRA vs. Vite vs. Next.js), de a feldolgozott kimenetet kézi átolvasás után jelentősen átírtam.

## 2. Konkrét feladatok, ahol AI‑t használtam

### Kódgenerálás
- **Komponensek scaffoldolása**: a `ReservationModal`, `ReservationsPage`, `useReservations` hook első verziója Claude Code segítségével generált, majd inkrementálisan finomhangolva.
- **SVG illusztrációk** az `EmptyState` komponensben (parking pin + üres rács) — a tanult AI‑slop érzet ellen tudatosan custom inline SVG‑k generáltam, hogy a stock MUI ikonok helyett brand‑specifikus vizuál legyen.
- **Skeleton variants** (`DashboardSkeleton`, `CardGridSkeleton`, `TableSkeleton`) generálása a meglévő MUI `<Skeleton>` API‑ra.

### Refaktorálás és kódreview
- A **`StatCard` komponenst** az AI segítségével refaktoráltam: a régi „flat" Material Card‑ból gradient háttér + accent border + trend ikon + `motion.div` hover‑rel ellátott változatra.
- A **`Layout` sidebar** active link highlight‑ja és a drawer micro‑animáció is AI‑javasolt minta, amit kézzel finomhangoltam a teal/orange brand identitásra.

### Architektúra‑tervezés
- A **foglalás‑perzisztencia** kérdésénél (localStorage vs. localforage vs. MSW state) egy strukturált trade‑off táblázatot generáltam Claude Code‑dal, amely végül az [ADR‑0003](../sprints/02/docs/adr/0003-reservation-storage.md) alapja lett.
- A **3‑sprintes ütemterv** (Apr 26 / May 3 / May 23) interaktív brainstorming session‑ben született, ahol az AI multiple‑choice kérdéseket tett fel a scope, a thesis sablon és a feature‑prioritás tisztázására — ez vezetett a „maximális push" + „polish + 1 új feature" döntéshez.

### Hibakeresés
- Egy `notistack` v3 + MUI v5 kompatibilitási kérdést Claude Code segítségével terveztünk meg (verzió‑pin, provider‑elhelyezés), és a futtatás megerősítette a választást.
- A **TypeScript strict mode** hibajavításai (pl. `act` import, `JSX.Element` típus elavulás) AI‑támogatottan diagnosztizáltak.

### Dokumentáció
- A **6 INVEST user story**, a **3 ADR**, a **Definition of Ready/Done**, és a **traceability matrix** mindegyike AI‑támogatottan strukturálódott, de a tartalom és a Why‑rész minden esetben saját mérnöki döntésem.
- A **Gherkin acceptance tesztek** Given‑When‑Then sablonját AI generálta, az AC‑k és a happy path / edge case lefedettsége saját döntés.

### Tesztgenerálás
- A **`useReservations.test.tsx`** strukturálisan AI‑javasolt (5 scenario: empty list, create, past slot, duplicate, cancel), de a logikai tesztpontok (mit asszertálok) saját tervezés szerint kerültek be.

## 3. Validáció — hogyan ellenőriztem

Az AI kimenetét **mindig hipotézisként** kezeltem, soha nem fogadtam el „ahogy jött":

- **Futtatással** — minden új komponens / hook / oldal után `npm run dev`, kézi smoke teszt mindkét nyelven és mindkét témán; minden új teszt után `npm test`.
- **Statikus ellenőrzéssel** — `npm run lint` (zero warnings policy), `npm run build` (TypeScript strict).
- **Kódolvasással** — minden generált fájlt soronként átolvastam, mielőtt commit‑oltam volna.
- **Második modell** — egy‑két kritikus döntésnél (pl. localStorage vs. IndexedDB) a választást ChatGPT‑vel is verifikáltam.

### Konkrét példák, amikor az AI által javasolt megoldás *hibás* volt

1. **`EmptyState` SVG generálás** — a Claude Code első verzióban egy túl bonyolult SVG‑t adott (8 path elem, gradient‑mask), ami sötét módban rosszul nézett ki. **Saját megoldás**: egyszerűsítettem 4 elemre, és a `theme.palette.primary.main` / `secondary.main` dinamikus injektálásával biztosítottam a téma‑konzisztens megjelenést.
2. **`useReservations.test.ts` kiterjesztés** — az AI `.ts`‑re mentette a teszt fájlt, de a JSX‑es `createWrapper` miatt `.tsx` kellett. **Saját javítás**: észrevettem a build‑futtatás alatt, és átírtam a kiterjesztést.
3. **`SnackbarProvider` elhelyezés** — az AI a `BrowserRouter` alá tette volna, de így a `useSnackbar` egyes konténer‑renderelt komponensekben (modal portál) nem érte el. **Saját javítás**: a `ThemeProvider` és `QueryClientProvider` közé helyeztem.

## 4. Hol *nem* használtam AI‑t — és miért

- **A szakdolgozat dolgozat‑fő szövegét** (motiváció, kontextus, eredmények, értékelés, kitekintés) **kézzel írom**, mert ez a saját mérnöki‑szakmai gondolatmenetem reflektálása, és nem szeretném, hogy az MI által szokásosan használt fordulatok (pl. „in conclusion, this thesis demonstrates that...") elszínezzék a saját stílusomat.
- **A védés‑felkészítő demó‑forgatókönyv** szintén saját mérnöki narratíva — milyen sorrendben mutatok meg dolgokat, melyik döntésnél állok meg, és milyen kérdésekre vagyok felkészülve.
- **A traceability matrix konkrét sorai** — bár a struktúrát AI generálta, az hogy *melyik* user story milyen tesztre / kódra mutat, az ténybeli ismeret a kódbázisomról, amit én magam ellenőriztem.
- **A kritikus algoritmus** — ebben a sprintben a `useReservations` hook validation logikája. Bár az AI segített a struktúra felépítésében, a múltidős és duplikációs ellenőrzés precíz feltételeit én írtam, mert hibás validation production‑ban felhasználói foglalásvesztést okozhat.

## 5. Mit tanultam a folyamatból

**Miben gyorsított**:
- A repetitív kód (MUI prop‑ok, i18n kulcsok, Gherkin sablonok, ADR struktúra) ~3‑5x gyorsabban készült.
- A **párhuzamos feltérképezés** — egyszerre 3 Explore subagent indítása frontend / docs / git státuszra — drámaian csökkentette a „hol állok most?" overhead‑et.
- Az `AskUserQuestion` interaktív kérdéssel az AI proaktívan tisztázta a scope‑ot, mielőtt félrement volna.

**Miben lassított vagy félrevezetett**:
- Két alkalommal (a fenti 1. és 2. pontban) a generált kód *működött*, de **nem volt téma‑konzisztens** vagy **nem fordított le** TypeScript‑ben — a hibát csak a futtatás derítette ki, ami picit „adós‑szindrómát" okozott (úgy érződött, kész van, pedig még nem).
- A `notistack` API‑t az első verzióban a **v2** szerint generálta az AI, miközben én v3‑at telepítettem — fél óra debug‑gal jött ki a verzióeltérés.

**Mit csinálnék másképp a következő projektben**:
- **Verzió‑lock korábban**: a kritikus dependency‑ket (notistack, MUI, react‑query) a session elején explicit a session contextbe töltöm, hogy az AI ne a betanítási adatok régebbi verziójára támaszkodjon.
- **Teszt‑first AI use** — az új feature‑öknél előbb a Gherkin AC‑t, majd a unit teszteket írom AI‑val, és csak utána az implementációt — így a generált kód automatikusan az AC‑t teljesíti.
- **Skill‑rendszer kihasználása** — Claude Code‑ban a `/brainstorming` és `/writing-plans` skill‑ek explicit hívása strukturáltabb terveket eredményez, mint a „beszélgetős" megközelítés.

---

*A szakdolgozat AI usage log‑ja, amelyre ez a fejezet épül, a [`sprints/02/ai/ai_log.jsonl`](../sprints/02/ai/ai_log.jsonl) fájlban található. Strukturált JSONL séma: tool, fázis, feladat, döntés, hatás, humán validáció.*
