variable "name" {}
variable "description" {}
variable "repo_url" {}
variable "buildspec_path" {}
variable "branch" {}
variable "service_role_arn" {}
variable "build_timeout" {
  default = 15
}
variable "codeconnection_arn" {
  description = "ARN de la conexión de CodeConnections existente"
  type        = string
}
