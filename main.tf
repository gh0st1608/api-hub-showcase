# Importar roles
module "iam" {
  source = "./modules/iam-roles"
}

# Lambda Telemedicine
module "lambda_telemedicine" {
  source          = "./modules/lambda"
  name            = "telemedicine-service"
  handler         = "dist/main.handler"
  artifact_path   = "../dist/telemedicine.zip"
  lambda_role_arn = module.iam.lambda_exec_role_arn
}

# Lambda Reclamos
module "lambda_reclamos" {
  source          = "./modules/lambda"
  name            = "reclamos-service"
  handler         = "dist/main.handler"
  artifact_path   = "../dist/reclamos.zip"
  lambda_role_arn = module.iam.lambda_exec_role_arn
}

# API Gateway multi-servicio
module "api_gateway" {
  source            = "./modules/apigateway"
  name              = "main-api-gateway"
  path_part         = "v1"
  lambda_invoke_arn = module.lambda_telemedicine.lambda_arn
}

# Static sites (Hub + Showcase)
module "api_hub_site" {
  source             = "./modules/s3-static-site"
  bucket_name        = "hub.tudominio.com"
  cloudfront_oai_arn = var.cf_oai_arn
}

module "showcase_site" {
  source             = "./modules/s3-static-site"
  bucket_name        = "showcase.tudominio.com"
  cloudfront_oai_arn = var.cf_oai_arn
}

