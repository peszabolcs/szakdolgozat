terraform {
  required_version = ">= 1.5"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }
}

provider "vercel" {
  # API token is read from the VERCEL_API_TOKEN environment variable.
  # In CI, set it as a GitHub Actions secret. Locally:
  #   export VERCEL_API_TOKEN="..."
  # See: https://vercel.com/account/tokens
}
