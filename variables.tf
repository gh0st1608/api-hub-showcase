variable "aws_region" {
  description = "AWS region for most resources. Note: CloudFront ACM cert must be in us-east-1."
  type        = string
  default     = "us-east-1"
}

variable "aws_env" {
  description = "Ambiente de despliegue (dev, stage, prod)"
  type        = string
}

variable "cf_cert_arn" {
  description = "ARN del certificado ACM usado por CloudFront"
  type        = string
}

variable "tags" {
  description = "Common tags map"
  type        = map(string)
  default     = {}
}

variable "aliases" {
  description = "Lista de subdominios/dominios adicionales para el certificado"
  type        = list(string)
  default     = []
}