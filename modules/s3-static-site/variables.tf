variable "bucket_name" {
  description = "Nombre del bucket S3 para el sitio estático"
  type        = string
}

variable "cloudfront_oai_arn" {
  description = "ARN del Origin Access Identity de CloudFront que tendrá acceso al bucket"
  type        = string
}

variable "tags" {
  type    = map(string)
  default = {}
}