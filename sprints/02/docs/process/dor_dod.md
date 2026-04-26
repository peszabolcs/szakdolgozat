# Definition of Ready & Definition of Done — Sprint 02

## Definition of Ready (DoR)

Egy user story akkor **Ready**, ha:

- [ ] INVEST‑kompliant (Independent, Negotiable, Valuable, Estimable, Small, Testable).
- [ ] Adott Given‑When‑Then formátumú AC, legalább 1 happy path + 1 edge case.
- [ ] Wireframe vagy ASCII‑mockup csatolva (`sprints/02/wireframes/`).
- [ ] Hatóköre 1 sprintbe fér, becsült méret ≤ 8 storypoint (vagy ≤ 1 nap kódolás).
- [ ] Függőségek (más story, library, API) felmérve és nem blokkolóak.
- [ ] Mockoláshoz szükséges adatok meghatározva (`src/mocks/data/`).
- [ ] A traceability‑mátrixban a story megjelenik tervezett tesztekkel.

## Definition of Done (DoD)

Egy story akkor **Done**, ha:

### Kód
- [ ] Implementálva, lokálisan futtatva, manuálisan smoke‑tesztelve mindkét témán + mindkét nyelven.
- [ ] TypeScript strict — `npm run build` zöld (`tsc && vite build`).
- [ ] ESLint — `npm run lint` zöld (zero warning policy).

### Teszt
- [ ] Unit teszt(ek) az új komponensekhez / hookokhoz (`*.test.tsx`/`*.test.ts`).
- [ ] AC‑hez legalább 1 Gherkin scenario a `tests/acceptance/`‑ben.
- [ ] `npm test` zöld.
- [ ] Coverage nem csökken az új kódhoz képest.

### Dokumentáció
- [ ] Releváns ADR‑ek (ha új architektúra‑döntés született).
- [ ] Wireframe (ha új UI‑elem).
- [ ] User story és AC commitolva a `sprints/02/docs/stories/user_stories.md`‑be.
- [ ] Traceability mátrix (`sprints/02/docs/traceability.md`) frissítve.
- [ ] AI log entry (ha AI‑támogatott munka volt).

### Process
- [ ] PR címében story ID (`US-XX`) és commit‑típus (`feat/`, `fix/`, `docs/`).
- [ ] CI zöld (test.yml, build.yml, terraform.yml ha érintett).
- [ ] Self‑review PR description‑nel ("Mit, miért, hogyan tesztelhető").

## Sprint Review checklist

A sprint zárásakor:

- [ ] Minden Done story commitolva a fő branch‑re (vagy mergelve PR‑rel).
- [ ] CI history zöld a 3 legutóbbi push‑ra.
- [ ] AI log a sprint összes session‑jét tartalmazza.
- [ ] `SPRINT_02_SUMMARY.md` frissítve a sprint deliverable listával.
