# iam

Creates the dedicated IAM role for the backend Lambda function following least-privilege logging permissions.

## What it provisions

- Lambda execution role
- Inline CloudWatch Logs policy

## Example

```hcl
module "iam" {
  source = "./modules/iam"

  project_name         = "api-hub-showcase"
  environment          = "dev"
  lambda_name          = "api-hub-showcase-dev-api"
  lambda_log_group_arn = module.monitoring.lambda_log_group_arn
}
```

## Outputs

- `lambda_execution_role_arn`
- `lambda_execution_role_name`
