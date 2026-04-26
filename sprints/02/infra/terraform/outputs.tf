output "project_id" {
  description = "Vercel project identifier"
  value       = vercel_project.parkvision.id
}

output "project_name" {
  description = "Vercel project name"
  value       = vercel_project.parkvision.name
}
