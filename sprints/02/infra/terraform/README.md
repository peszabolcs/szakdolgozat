# Terraform — Vercel deploy (Sprint 02 = validate + plan only)

A Sprint 02‑ben **csak `terraform fmt` + `terraform validate`** futtatása van CI‑ben. Az `apply` Sprint 03 feladata, amikor backend‑integrációval együtt deployolunk.

## Helyi futtatás

```bash
cd sprints/02/infra/terraform
terraform init
terraform validate
# Opcionális, ha van Vercel token:
export VERCEL_API_TOKEN="..."
terraform plan -out=plan.out
```

## Fájlok

| Fájl | Tartalom |
|---|---|
| `providers.tf` | Vercel provider deklaráció |
| `variables.tf` | Bemeneti változók (projekt név, repo, branch) |
| `main.tf` | `vercel_project` resource a projekthez |
| `outputs.tf` | Project ID és név output‑ként |

## CI

`.github/workflows/terraform.yml` futtatja a fmt+init+validate lépéseket minden push‑on, ami érinti a `sprints/02/infra/terraform/**` mappát. A `plan` csak akkor fut le, ha a `VERCEL_API_TOKEN` GitHub secret meg van adva.
