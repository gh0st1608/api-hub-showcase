# monitoring

Creates CloudWatch log groups and low-cost Lambda alarms for development environments.

## What it provisions

- Lambda log group
- API Gateway access log group
- Basic Lambda `Errors` alarm
- Basic Lambda `Throttles` alarm

## Example

```hcl
module "monitoring" {
  source = "./modules/monitoring"

  project_name   = "api-hub-showcase"
  environment    = "dev"
  lambda_name    = "api-hub-showcase-dev-api"
  api_name       = "api-hub-showcase-dev-http-api"
  log_retention_days = 14
}
```

## Outputs

- `lambda_log_group_name`
- `lambda_log_group_arn`
- `api_access_log_group_name`
- `api_access_log_group_arn`
