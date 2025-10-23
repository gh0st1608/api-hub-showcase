variable "aliases" {
  type        = list(string)
  description = "Lista de dominios (CNAMEs) asociados al CloudFront"
}

variable "cf_cert_arn" {
  description = "ARN del certificado ACM"
}

variable "sites" {
  type = list(object({
    name   = string
    bucket = string
  }))
  description = "Lista de sitios y buckets asociados"
}

variable "tags" {
  type    = map(string)
  default = {}
}