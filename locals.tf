locals {
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    },
    var.tags,
  )

  frontend_aliases = distinct(
    compact(
      concat(
        var.domain_name != "" ? [var.domain_name] : [],
        var.frontend_aliases,
      ),
    ),
  )

  lambda_environment = merge(
    {
      NODE_ENV = var.environment
    },
    var.lambda_environment_variables,
  )
}
