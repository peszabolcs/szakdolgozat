# ADR‑0005: Autentikáció — JWT + bcrypt, kliens‑oldali token tárolás

**Status:** Accepted
**Date:** 2026‑04‑26 (Sprint 02 / M1 push)
**Decision makers:** Pesz Szabolcs

## Context

A 2026‑04‑15‑i értékelés rögzítette: „Autentikáció megvalósítása (jelenleg nincs)". A korábbi mock auth (`AuthContext`) csak frontend‑oldalon ellenőrzött, a backend hiányozott. A Sprint 02 keretében bevezetjük a **valódi JWT auth**‑ot úgy, hogy:
- a backend stateless legyen (Vercel serverless‑hez illeszkedjen),
- a frontend minden API‑hívást a Bearer header‑rel küldjön,
- a 401 globálisan lekezelődjön (auto‑logout + redirect),
- a jelszavak ne legyenek plain text‑ben tárolva.

## Considered options

1. **JWT (HS256) + bcryptjs** — stateless, kliens‑oldali token tárolás localStorage‑ben.
2. **Session cookie (HttpOnly)** — szerver‑oldali állapot, CSRF védelem szükséges.
3. **OAuth2 / OIDC (Auth0, Keycloak)** — külső identitásszolgáltató, regisztráció + config.
4. **NextAuth.js** — keveredik a Next.js‑sel, amit nem használunk.

## Decision

**1. opció — JWT (HS256) + bcryptjs.**

- **Token tárolás**: localStorage `parkvision.auth.token` kulcs alatt. Trade‑off: XSS sebezhetőség elméleti kockázat — a jelenlegi MVP‑ben elfogadható; production‑re javasolt áttérni HttpOnly cookie‑ra.
- **Lejárat**: 7 nap (`expiresIn: '7d'`).
- **Jelszó hash**: `bcryptjs` 10‑es saltrounds — a seed user‑ek (`admin@parkvision.hu` / `admin123`, `visitor@parkvision.hu` / `visitor123`) jelszava is bcrypt‑elt.
- **Middleware**: `requireAuth` (`Bearer` header parse + `verifyToken`), `requireRole('admin')` szerepköri védelem.
- **Frontend interceptor**: `axios` request interceptor a Bearer header injektálására, response interceptor a 401‑re globális `parkvision:unauthorized` event‑et tüzel → AuthContext logout + redirect a `/login`‑ra.

## Consequences

- **+** Stateless backend → tetszőleges replikák, Vercel serverless cold‑start barát.
- **+** Egységes axios kliens (`src/utils/apiClient.ts`) az összes hookban.
- **+** `useAuth` kontextus `isHydrating` állapotot is mutat (avoid flash‑of‑unauthenticated‑content).
- **−** XSS esetén a token kompromittálódhat. **Mitigáció**: rövidebb expiresIn (Sprint 03‑ban refresh token), HttpOnly cookie áttérés production‑re, CSP headerek bekapcsolása.
- **−** Token revocation csak lejárattal (server‑side blacklist Sprint 03‑ban kerülhet, Redis‑szel).

## Migration to OAuth (Sprint 03+)

Az auth réteg interface‑e (`AuthContext.login` + `requireAuth` middleware) változatlanul marad; csak a token‑szerző mechanizmus cserélődik OAuth provider‑re (pl. Google, GitHub).
