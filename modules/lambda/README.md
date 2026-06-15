# lambda

Creates the backend Lambda function and can bootstrap with a placeholder ZIP before the real NestJS artifact exists.

## What it provisions

- Lambda function
- Placeholder package support for first apply

## Example

```hcl
module "backend_lambda" {
  source = "./modules/lambda"

  function_name = "api-hub-showcase-dev-api"
  role_arn      = module.iam.lambda_execution_role_arn
  package_file  = "../artifacts/backend.zip"
  handler       = "handler.handler"
  runtime       = "nodejs20.x"
  memory_size   = 512
  timeout       = 15
}
```

## Outputs

- `function_name`
- `function_arn`
- `invoke_arn`
