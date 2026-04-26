resource "vercel_project" "parkvision" {
  name      = var.project_name
  framework = var.framework

  git_repository = {
    type = "github"
    repo = var.git_repository
  }

  build_command    = "npm run build"
  output_directory = "dist"
  install_command  = "npm install"

  environment = [
    {
      key    = "VITE_MOCK_SCENARIO"
      value  = "normal"
      target = ["production", "preview"]
    }
  ]
}
