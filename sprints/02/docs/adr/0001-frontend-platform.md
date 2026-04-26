# ADR‑0001: Frontend platform és deployment választás

**Status:** Accepted
**Date:** 2026‑01‑15 (Sprint 01)
**Decision makers:** Pesz Szabolcs

## Context

A ParkVision MVP frontendjét úgy kell felépíteni, hogy:
- gyors fejlesztői feedback‑ciklust adjon (HMR),
- moderne, kompozálható komponens‑ekoszisztémája legyen,
- TypeScript‑first legyen, a strict mode‑dal,
- könnyen deployolható legyen (zero‑ops, vagy közel hozzá),
- a leadási határidőkre kompatibilis legyen az egyetemi diplomamunka kontextusával.

## Considered options

1. **React 18 + Vite + Vercel** — modern Vite buildchain, Vercel zero‑config deploy.
2. **Create React App (CRA) + Netlify** — kanonikus, de a Webpack legacy és a CRA nem aktívan karbantartott.
3. **Next.js 14 (App Router) + Vercel** — SSR/SSG out‑of‑box, de overkill az MVP‑hez (mockolt API‑val nem profitálunk az SSR‑ből).
4. **Vue 3 + Vite + Netlify** — alternatíva, de a JD‑felkészülésben erősebb a React.

## Decision

**1. opció — React 18 + Vite + Vercel.** A Vite ES‑module alapú dev server közel‑pillanatnyi HMR‑t ad, a build pedig optimalizált Rollup‑pal készül. A Vercel‑integráció `terraform apply`‑lal automatizálható (Sprint 03), de a manuális deploy is egy drag‑and‑drop a `dist/`‑ből. A React 18 + TypeScript 5 stabil, és minden third‑party library (MUI, TanStack Query, MSW) támogatja.

## Consequences

- **+** Sub‑secundum HMR a fejlesztés alatt — nagyobb iterációs sebesség.
- **+** A build < 30 másodperc kis projekten.
- **+** A Vercel‑deploy ingyenes hobby planre is, és HTTPS + CDN out‑of‑box.
- **−** SPA → kezdeti FCP magasabb, mint SSR‑nél (mitigation: PWA precache, code splitting Sprint 03+).
- **−** Vendor lock‑in Vercel‑re; mitigálva, mert a build statikus, és bármilyen object storage‑ra (S3, Netlify, GH Pages) deployolható.

## References

- [Vite docs](https://vitejs.dev)
- [Vercel deploy](https://vercel.com/docs)
