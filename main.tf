module "frontend_bucket" {
  source = "./modules/s3-static-site"

  bucket_name   = var.frontend_bucket_name
  force_destroy = var.frontend_force_destroy
  tags          = local.common_tags
}

module "monitoring" {
  source = "./modules/monitoring"

  project_name                    = var.project_name
  environment                     = var.environment
  lambda_name                     = var.lambda_name
  api_name                        = "${local.name_prefix}-http-api"
  log_retention_days              = var.log_retention_days
  enable_basic_alarms             = var.enable_basic_alarms
  lambda_error_alarm_threshold    = var.lambda_error_alarm_threshold
  lambda_throttle_alarm_threshold = var.lambda_throttle_alarm_threshold
  tags                            = local.common_tags
}

module "iam" {
  source = "./modules/iam"

  project_name         = var.project_name
  environment          = var.environment
  lambda_name          = var.lambda_name
  lambda_log_group_arn = module.monitoring.lambda_log_group_arn
  tags                 = local.common_tags
}

module "backend_lambda" {
  source = "./modules/lambda"

  function_name         = var.lambda_name
  role_arn              = module.iam.lambda_execution_role_arn
  package_file          = var.lambda_package_path
  handler               = var.lambda_handler
  runtime               = var.lambda_runtime
  memory_size           = var.lambda_memory
  timeout               = var.lambda_timeout
  environment_variables = local.lambda_environment
  tags                  = local.common_tags
}

module "api_gateway" {
  source = "./modules/api-gateway"

  api_name             = "${local.name_prefix}-http-api"
  lambda_function_name = module.backend_lambda.function_name
  lambda_invoke_arn    = module.backend_lambda.invoke_arn
  stage_name           = var.api_stage_name
  cors_allowed_origins = var.cors_allowed_origins
  access_log_group_arn = module.monitoring.api_access_log_group_arn
  tags                 = local.common_tags
}

module "cloudfront" {
  source = "./modules/cloudfront"

  bucket_name                    = module.frontend_bucket.bucket_name
  s3_bucket_arn                  = module.frontend_bucket.bucket_arn
  s3_bucket_regional_domain_name = module.frontend_bucket.bucket_regional_domain_name
  aliases                        = local.frontend_aliases
  domain_name                    = var.domain_name
  acm_certificate_arn            = var.acm_certificate_arn
  route53_hosted_zone_id         = var.route53_hosted_zone_id
  price_class                    = var.cloudfront_price_class
  tags                           = local.common_tags
}
