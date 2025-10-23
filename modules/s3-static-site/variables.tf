variable "bucket_name" {
  description = "Nombre del bucket S3 para el sitio estático"
  type        = string
}

variable "cloudfront_oai_id" {
  description = "ID of the CloudFront Origin Access Identity"
  type        = string
}

variable "tags" {
  type    = map(string)
  default = {}
}