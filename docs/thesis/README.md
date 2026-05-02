# Szakdolgozat — ParkVision

Ez a mappa a ParkVision szakdolgozatának forrásait, generált fájljait és kapcsolódó eszközeit tartalmazza.

## Fájlok

- **`szakdolgozat_v0.1.md`** — a szakdolgozat teljes szövege Markdown-ban, ez a *forrás*. ~10.000 szó, 22 fejezet (címlap, feladatkiírás, tartalmi összefoglaló, bevezetés, 1–12. fejezet, irodalomjegyzék, nyilatkozat, köszönet, elektronikus és vizuális mellékletek). Verziókövetett.
- **`szakdolgozat_v0.1.docx`** — a Markdown-ból `pandoc`-kal generált Word-dokumentum, beágyazott képekkel (6 diagram + 6 screenshot). Ezt kell megnyitni Word-ben, formázni, és PDF-be exportálni.
- **`diagrams/`** — Mermaid forrásfájlok (`.mmd`) + render-elt PNG-k. Hat diagram: használati eset, architektúra, ER, két szekvencia (foglalás + IoT), routing fa.
- **`screenshots/`** — az élő alkalmazásból készült képernyőképek (publikus oldal, bejelentkezés, vezérlőpult, központok lista, térkép, admin panel).

## Munkafolyamat (pandoc → Word → PDF)

1. **Markdown szerkesztése**: `szakdolgozat_v0.1.md`-t bármely szövegszerkesztőben módosíthatod.
2. **Docx újragenerálása**:
   ```bash
   cd docs/thesis
   pandoc szakdolgozat_v0.1.md -o szakdolgozat_v0.1.docx --resource-path=. --toc --toc-depth=2
   ```
3. **Word-ben megnyitás**: a tartalomjegyzéket frissítsd (References → Update Table), a stílusokat finomhangold, az oldalszámozást állítsd be.
4. **PDF export**: File → Save As → PDF (vagy macOS-en: File → Export → PDF).

## Diagram regenerálás

Ha módosítasz egy `.mmd` fájlt:

```bash
cd docs/thesis/diagrams
npx --yes @mermaid-js/mermaid-cli -i NEV.mmd -o NEV.png -w 1600 -b white
```

A 6 diagram egyszerre:

```bash
for f in use_case architecture er_diagram sequence_reservation sequence_iot routing_tree; do
  npx --yes @mermaid-js/mermaid-cli -i "$f.mmd" -o "$f.png" -w 1600 -b white
done
```

## Leadási státusz

- **2026-05-03 (vasárnap, 23:59)** — első teljes verzió a témavezetőhöz review-ra. ✅ A `szakdolgozat_v0.1.docx` és a Word-ben PDF-be exportált változat a szállítandó.
- **2026-05-23 (szombat)** — hivatalos szakdolgozat-leadási határidő. A v0.1 review-jának javításai után készül a végső verzió.

## Mit kell még finomhangolni a v0.1-en (a Word-megnyitás után)

- A címlapot a hivatalos SZTE-sablon stílusa szerint formálni (ha a témavezető más sablont igényelne).
- A tartalomjegyzéket frissíteni (Word automatikusan generálja a fejezetcímekből).
- Az oldalszámokat beállítani (címlap nem számoz, római számozás a tartalmi részig, arab számozás a Bevezetéstől).
- Az aláírás-helyét a Nyilatkozatban kézzel ellenőrizni.
- A képeket szükség szerint átméretezni (egyes diagramok, screenshotok keskenyebbek lehetnek, hogy a sortörés ne nyúljon rosszul).

## Kapcsolódó forrásfájlok a repo gyökerében

- `docs/ai-usage-draft.md` — az MI-fejezet eredeti vázlata (a 12. fejezet ezen alapszik).
- `sprints/02/docs/` — ADR-ek, user storyk, scope contract, traceability matrix (forrás-anyag a 2., 4., 5. fejezethez).
- `sprints/02/ai/ai_log.jsonl` — az MI-használat strukturált logja (16 bejegyzés).
- `README.md` (gyökér) — tech stack és quickstart (forrás a 4. fejezethez).
