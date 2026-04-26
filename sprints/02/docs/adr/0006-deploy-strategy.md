# ADR‑0006: Deploy stratégia — Vercel serverless + Docker

**Status:** Accepted
**Date:** 2026‑04‑26 (Sprint 02 / M1 push)
**Decision makers:** Pesz Szabolcs

## Context

A 2026‑04‑15‑i tech értékelés a deploy hiányát is sürgős hiányosságként jelölte (1/5). A Sprint 02 keretében meg kell oldani úgy, hogy:
- a tanár a repó URL‑jét megnyitva éles, futó alkalmazást lásson,
- legyen alternatív futtatás lokálisan (Docker compose), ha a hosting nem elérhető,
- a CI/CD rögzítse a deploy folyamatot,
- a backend és a frontend ugyanazon URL alól hozzáférhető legyen (CORS gond nélkül).

## Considered options

1. **Vercel serverless functions** — frontend Vite SPA + backend Express egy projektben, `api/` mappa konvencióval, `vercel.json` rewrites‑szal.
2. **Render.com** (külön Node service + Static Site) — két service, két URL, CORS proxy.
3. **Fly.io** (egyetlen Docker container) — egyszerű, de fizetős a 3+ regionra.
4. **Railway** (Docker compose alapú) — Docker‑barát, fizetős hobby‑n túl.
5. **Csak Docker Compose** (helyi futtatás) — nincs hosting, a tanár `docker-compose up`‑pal próbálja.

## Decision

**1. opció — Vercel serverless** mint elsődleges, **Docker compose** mint alternatív futtatás.

### Vercel architektúra

- **`api/index.ts`** — Vercel a `/api/**` mintára ezt a fájlt futtatja serverless function‑ként; importálja a `server/src/app.ts` `createApp()` factory‑t.
- **`vercel.json`** — `rewrites: [{ source: '/api/:path*', destination: '/api/index' }]` minden `/api/*` URL‑t a serverless‑re irányít.
- **Frontend Vite build** → `dist/` → Vercel statikus hosting.
- **Cold start**: ~200 ms (in‑memory SQLite + bcrypt seed).
- **Env**: `DB_MODE=memory`, `JWT_SECRET` (Vercel secret).

### Docker architektúra

- **`Dockerfile`** — multi‑stage Node 20 alpine, Python+g++ az `better‑sqlite3` build‑hez, runtime stage csak prod deps + `dist/` + `server/dist/`.
- **`docker-compose.yml`** — két service:
  - `api` (port 3001, perzisztens SQLite volume `parkvision-data:/data`),
  - `web` (nginx alpine, port 8080, statikus `dist/`, `/api/*` proxy az `api`‑ra).
- **`docker/nginx.conf`** — SPA fallback (`try_files $uri /index.html`), API proxy, asset cache.

## Consequences

- **+** Vercel ingyenes hobby tier elég a thesis‑demóhoz. Egy URL: `https://parkvision-frontend-mvp.vercel.app` (vagy custom domain).
- **+** Docker compose alternatíva: `docker compose up` → `http://localhost:8080`. Demonstrálható offline / self‑hosted környezetben.
- **+** A backend kódja **nem változik** a két cél között — ugyanaz a `createApp()` Express factory mindkét helyen.
- **−** Vercel ephemeral filesystem miatt a foglalások nem perzisztensek a Vercel‑deploymentben (cold start után reseedel). Sprint 03 → Vercel Postgres / Turso integráció.
- **−** A serverless cold start ~200 ms latency az első request‑re minden 5 perc inaktivitás után. A tanári demo‑ban elfogadható.
- **−** `terraform apply` Sprint 03‑ra halasztva (a Vercel‑project Terraform‑mal írt, de az `apply` kézi vagy Sprint 03‑ban CI‑automatizált).

## References

- [Vercel serverless docs](https://vercel.com/docs/functions)
- `vercel.json` schema: https://vercel.com/docs/projects/project-configuration
- [Docker multi‑stage builds](https://docs.docker.com/build/building/multi-stage/)
