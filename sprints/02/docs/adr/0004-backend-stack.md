# ADR‑0004: Backend stack — Express + better‑sqlite3

**Status:** Accepted
**Date:** 2026‑04‑26 (Sprint 02 / M1 push)
**Decision makers:** Pesz Szabolcs

## Context

A 2026‑04‑15‑i tech értékelés (2.0/5) sürgős kritikus hiányként jelölte meg a backend és adatbázis hiányát. A Sprint 02 keretében ezt orvosolnunk kell úgy, hogy:
- a frontend hookok (TanStack Query) kódkompatibilisek maradjanak,
- ne legyen szükség külső szolgáltatás regisztrációra (Postgres‑hosting account, stb.) a leadás éjszakáján,
- Vercel serverless‑re deployolható legyen,
- Docker‑rel lokálisan / sajátszerveren is fusson,
- gyors fejlesztői feedback‑ciklust adjon (HMR a backendhez is).

## Considered options

1. **Express 4 + better‑sqlite3** — szinkron sqlite, tszbox‑os bcryptjs + jsonwebtoken, minimális fügőség.
2. **Fastify + Prisma + PostgreSQL** — modern, gyors, de a Postgres‑hez Vercel‑Postgres / Neon / Supabase regisztráció kell.
3. **NestJS + TypeORM + PostgreSQL** — túl nagy boilerplate egy MVP‑hez.
4. **Next.js API routes + Prisma** — keveredik a frontenddel, nagyobb refaktor a jelenlegi Vite‑ról.
5. **Hono (edge‑compatible) + Cloudflare D1** — modern, de új ekoszisztéma a csapatnak.

## Decision

**1. opció — Express 4 + better‑sqlite3.** Indok:
- A `better‑sqlite3` szinkron API‑ja egyszerűbben tesztelhető, mint az aszinkron Prisma client.
- SQLite **file‑alapú** lokálisan + Docker‑ben (perzisztens), **in‑memory** módban Vercel serverless‑en (ephemeral filesystem korlátja miatt) — egyetlen `DB_MODE` env switch.
- Express stabil, mindenki ismeri, a Vercel `api/index.ts`‑szel közvetlenül exportálható (`export default app`).
- `jsonwebtoken` + `bcryptjs` az ipari szabvány JWT auth‑hoz.
- `zod` runtime request validation + a TypeScript típusinferenciával egységes.

## Consequences

- **+** ~120 KB Express + ~7 MB better‑sqlite3 binaries.
- **+** SQL séma `server/src/db/schema.ts`‑ben verziókezelt; migráció kézi `applySchema()`‑val (Sprint 03‑ban Drizzle Kit / TypeORM lehet).
- **+** Vercel cold start ≤ 200 ms (in‑memory SQLite + seed).
- **−** Vercel ephemeral filesystem miatt a foglalások nem perzisztensek **production** ideig — viszont minden cold‑startkor reseedel a `seed.ts` reális Budapest centerekkel. Sprint 03‑ban Vercel Postgres / Turso integrálható az adatbázis‑adapter cseréjével (a hookok és a routes változatlanok).
- **−** A `better‑sqlite3` natív build (Python + g++) — a Dockerfile multi‑stage erre felkészítve.

## References

- [Express 4 docs](https://expressjs.com/en/4x/api.html)
- [better‑sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [Vercel serverless functions](https://vercel.com/docs/functions)
