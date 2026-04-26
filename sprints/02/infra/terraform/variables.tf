variable "project_name" {
  description = "Vercel project name"
  type        = string
  default     = "parkvision-frontend-mvp"
}

variable "framework" {
  description = "Frontend framework preset for Vercel"
  type        = string
  default     = "vite"
}

variable "git_repository" {
  description = "GitHub repo in the form 'owner/repo'"
  type        = string
  default     = "peszabolcs/szakdolgozat"
}

variable "production_branch" {
  description = "Branch deployed to the production URL"
  type        = string
  default     = "main"
}
