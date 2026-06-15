variable "bucket_name" {
  description = "S3 bucket name."
  type        = string
}

variable "s3_bucket_arn" {
  description = "S3 bucket ARN."
  type        = string
}

variable "s3_bucket_regional_domain_name" {
  description = "S3 bucket regional domain name."
  type        = string
}

variable "aliases" {
  description = "Optional CloudFront aliases."
  type        = list(string)
  default     = []
}

variable "domain_name" {
  description = "Primary custom domain to create in Route53."
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "Optional ACM certificate ARN in us-east-1."
  type        = string
  default     = ""
}

variable "route53_hosted_zone_id" {
  description = "Optional Route53 hosted zone id."
  type        = string
  default     = ""
}

variable "price_class" {
  description = "CloudFront price class."
  type        = string
  default     = "PriceClass_100"
}

variable "tags" {
  description = "Resource tags."
  type        = map(string)
  default     = {}
}
