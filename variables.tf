variable "aws_region" {
  description = "AWS region for most resources. Note: CloudFront ACM cert must be in us-east-1."
  type        = string
  default     = "us-east-1"
}

variable "aws_env" {
  description = "Environment."
  type        = string
  default     = "dev"
}

variable "fqdn" {
  description = "Nombre del bucket del frontend"
  type        = string
}

variable "certificate_arn" {
  description = "ACM certificate ARN for CloudFront (must be in us-east-1)"
  type        = string
  default     = ""
}


variable "tags" {
  description = "Common tags map"
  type        = map(string)
  default     = {}
}

variable "aliases" {
  description = "Lista de subdominios/dominios adicionales para el certificado"
  type = list(string)
  default     = []
}

variable "repository_form" {
  description = "Repositorio del proyecto"
  type        = string
}

variable "dynamodb_tables" {
  type    = list(string)
  default = ["claim", "claim_counter"]
}
