locals {
  common_tags = merge({
    Project     = "apihub-showcase"
    Environment = var.aws_env
    Owner       = "ghost1608"
  }, var.tags)
}