# AI Usage Log — Sprint 02

A `ai_log.jsonl` minden AI‑támogatott munkamenet (Claude Code session, ChatGPT konzultáció, Copilot ülés) strukturált bejegyzését tartalmazza.

## Séma

Egy bejegyzés = egy JSON sor:

```json
{
  "timestamp": "ISO-8601 timestamp tz-vel",
  "tool": "konkrét eszköz neve és verziója (pl. 'Claude Code (Opus 4.7)')",
  "phase": "planning | discovery | implementation | review | debugging | docs",
  "task": "rövid leírás, mit csináltunk a session-ben",
  "decision": "milyen döntés/output született",
  "impact": "mit érint a kódbázisban / dokumentációban (fájlpath, modul)",
  "human_validation": "hogyan ellenőriztük a kimenetet (teszt, kódolvasás, futtatás, pending)"
}
```

## Karbantartás

- **Minden AI‑session** legalább 1 bejegyzést kap.
- A `human_validation` mező nem lehet üres — ha még nem validáltunk, "pending" + indok.
- A bejegyzések chronologikusan vannak rendezve (ISO timestamp alapján).

## Felhasználás a thesisben

A `docs/ai-usage-draft.md` egy strukturált 2 oldalas vázlat a thesis MI‑fejezetéhez, amely a tanári követelmények szerinti 5 szempontot bontja ki konkrét példákkal a `ai_log.jsonl`‑ből.
