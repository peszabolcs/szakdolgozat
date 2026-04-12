# GUI / UX Dokumentáció — ParkVision

ParkVision MVP — React 18 + Vite + TypeScript + Material-UI alapú okos parkolómenedzsment frontend.

**Sprint:** Sprint 2 — MVP implementáció (mock adatokkal)
**Dokumentáció dátuma:** 2026-04-08

---

## Tartalom

| Fájl | Leírás | Típus |
|------|--------|-------|
| [pageflow.mmd](./pageflow.mmd) | Képernyő-térkép: az összes egyedi képernyő és a köztük lévő navigáció | Mermaid forrás |
| [pageflow.png](./pageflow.png) | Képernyő-térkép renderelt képként | PNG (lásd lent) |
| [screens.csv](./screens.csv) | Képernyő-leírás táblázat — 8 képernyő, minden metaadat | CSV |
| [journeys.md](./journeys.md) | Top 3 user journey lépésről lépésre | Markdown |
| [design_system.md](./design_system.md) | Dizájnrendszer: színek, tipográfia, spacing, komponens overrides | Markdown |
| [self_assessment.md](./self_assessment.md) | Önértékelés 1–5 skálán + szöveges értékelés | Markdown |
| [screenshots/](./screenshots/) | Képernyőképek S## konvencióval | PNG |

---

## Képernyők áttekintése

| ID | Név | Route | Auth |
|----|-----|-------|------|
| S01 | Főoldal | `/` | nem |
| S02 | Bejelentkezés | `/login` | nem |
| S03 | Vezérlőpult | `/admin/dashboard` | igen |
| S04 | Bevásárlóközpontok | `/admin/shopping-centers` | igen |
| S05 | Térkép | `/admin/map` | igen |
| S06 | Admin Panel | `/admin/admin-panel` | igen |
| S07 | Parkolóhelyek | *(nincs aktív route)* | igen |
| S08 | Területek | *(nincs aktív route)* | igen |

---

## pageflow.png generálása

A `pageflow.mmd` fájl [Mermaid](https://mermaid.js.org/) szintaxisú. PNG exporthoz:

```bash
# CLI (npx)
npx @mermaid-js/mermaid-cli -i docs/ux/pageflow.mmd -o docs/ux/pageflow.png

# Vagy online: https://mermaid.live → fájl tartalmát beilleszteni → Export PNG
```

---

## Beadási checklist

- [x] `pageflow.mmd` — szerkeszthető Mermaid forrás
- [ ] `pageflow.png` — renderelt kép (generálandó a fenti utasítással)
- [ ] `screenshots/` — minden képernyőhöz S## konvenciós screenshot
- [x] `screens.csv` — minden képernyőre kitöltve
- [x] `journeys.md` — top 3 user journey
- [x] `design_system.md`
- [x] `self_assessment.md` táblázat + szöveges értékelés
- [ ] *(Ajánlott)* screen recording vagy GIF a fő journey-ről → `journey1.mp4`
- [ ] *(Opcionális)* mockup / Figma link
- [ ] *(Opcionális)* `inspirations/` benchmark képek
- [ ] PR megnyitva `docs(ux): GUI/UX dokumentáció` címmel, leírásba ez a README másolt be
