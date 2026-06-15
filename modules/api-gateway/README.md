# api-gateway

Creates an AWS API Gateway HTTP API wired to a Lambda function.

## What it provisions

- HTTP API
- Lambda proxy integration
- Default route
- Stage with access logs
- Lambda invoke permission

## Example

```hcl
module "api_gateway" {
  source = "./modules/api-gateway"

  api_name             = "api-hub-showcase-dev-http-api"
  lambda_function_name = module.backend_lambda.function_name
  lambda_invoke_arn    = module.backend_lambda.invoke_arn
  access_log_group_arn = module.monitoring.api_access_log_group_arn
}
```

## Outputs

- `api_id`
- `api_endpoint`
- `api_execution_arn`
- `stage_name`
