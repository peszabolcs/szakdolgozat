# ADR‑0002: IaC stratégia — Terraform validate + plan a Sprint 02‑ben

**Status:** Accepted
**Date:** 2026‑01‑20 (Sprint 01)
**Decision makers:** Pesz Szabolcs

## Context

A ParkVision MVP‑hez szükség van infrastruktúrára (Vercel project + production domain). Két dilemma:
1. Milyen IaC eszköz? (Terraform / Pulumi / CloudFormation / kézi)
2. Mikor `apply`‑oljunk? (most, vagy később)

## Considered options

1. **Terraform + validate&plan most, apply Sprint 03‑ban** — declarative, vendor‑agnostic, audit trail.
2. **Pulumi (TypeScript)** — DSL‑mentes, de a Vercel provider kevésbé kiforrott.
3. **Manuális Vercel UI deploy** — egyszerűbb, de nincs reproducible audit trail.
4. **CloudFormation / AWS CDK** — nem releváns (Vercel‑re deployolunk).

## Decision

**1. opció — Terraform `validate + plan` a Sprint 02‑ben, `apply` a Sprint 03‑ban.**

Indoklás:
- A diplomamunka szakmai presentation‑jén az IaC‑artifact (plan output, `.tf` fájlok) demonstrálható, anélkül hogy production‑deploy‑t kellene végrehajtani.
- A `terraform validate` token nélkül is fut, és garantálja, hogy a `.tf` szintaktikailag és sémailag helyes. A `plan` csak akkor fut le, ha `VERCEL_API_TOKEN` GitHub secret megvan.
- Az `apply`‑t Sprint 03‑ra halasztjuk, hogy a deploy a backend‑integrációval együtt történjen.

## Consequences

- **+** Auditálható infrastruktúra-leírás `.tf` fájlokban, verziókövetve.
- **+** A CI lefut a workflow‑on (validate min., plan ha token van).
- **+** Vendor‑agnostic — későbbi migráció más providerre csak a `provider` blokkot érinti.
- **−** A Vercel Terraform provider third‑party (HashiCorp Verified, de a community is tartja).
- **−** State file (`terraform.tfstate`) management Sprint 03‑ban megoldandó (S3 backend vagy Terraform Cloud).

## References

- [Terraform docs](https://developer.hashicorp.com/terraform)
- [Vercel Terraform provider](https://registry.terraform.io/providers/vercel/vercel/latest/docs)
