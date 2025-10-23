# Importar roles
module "iam" {
  source = "./modules/iam-roles"
}

# Lambda Telemedicine
/* module "lambda_telemedicine" {
  source          = "./modules/lambda"
  name            = "telemedicine-service"
  handler         = "dist/main.handler"
  artifact_path   = "../dist/telemedicine.zip"
  lambda_role_arn = module.iam.lambda_exec_role_arn
} */

# Lambda Reclamos
/* module "lambda_reclamos" {
  source          = "./modules/lambda"
  name            = "reclamos-service"
  handler         = "dist/main.handler"
  artifact_path   = "../dist/reclamos.zip"
  lambda_role_arn = module.iam.lambda_exec_role_arn
} */

# API Gateway multi-servicio
/* module "api_gateway" {
  source            = "./modules/apigateway"
  name              = "main-api-gateway"
  path_part         = "v1"
  lambda_invoke_arn = module.lambda_telemedicine.lambda_arn
} */

module "hub_site" {
  source              = "./modules/s3-static-site"
  bucket_name         = "hub.solutionserj.com"
  cloudfront_oai_id   = module.cloudfront_multisite.cf_oai_id  # ✅ usar ID, no path
  tags                = local.common_tags
}

module "showcase_site" {
  source              = "./modules/s3-static-site"
  bucket_name         = "showcase.solutionserj.com"
  cloudfront_oai_id   = module.cloudfront_multisite.cf_oai_id  # ✅ usar ID, no path
  tags                = local.common_tags
}

module "designs_bucket" {
  source  = "./modules/s3-bucket"
  bucket_name = "apihub-designs"
  tags         = local.common_tags

  # Si tu módulo requiere el parámetro, puedes pasar null o comentarlo
  cloudfront_oai_id = null
}

module "cloudfront_multisite" {
  source             = "./modules/cloudfront-multisite"
  aliases            = var.aliases
  cf_cert_arn        = var.cf_cert_arn

  sites = [
    {
      name   = "hub"
      bucket = module.hub_site.bucket_name
    },
    {
      name   = "showcase"
      bucket = module.showcase_site.bucket_name
    }
  ]

  tags = local.common_tags
}


