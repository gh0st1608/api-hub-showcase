locals {
  fqdn        = var.fqdn
  common_tags = merge({
    Project     = "forms-serverless"
    Environment = "dev"
    Owner       = "erick"
  }, var.tags)
}