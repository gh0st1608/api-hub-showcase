locals {
  common_tags = merge({
    Project     = "apihub-showcase"
    Environment = var.aws_env
    Owner       = "emga-terraform"
  }, var.tags)
}