# Bootstrap guide

## 1. Create Terraform remote state

PowerShell:

```powershell
.\scripts\bootstrap-terraform-state.ps1 -ProjectName api-hub-showcase -Environment dev -AwsRegion us-east-1
```

Bash:

```bash
./scripts/bootstrap-terraform-state.sh api-hub-showcase dev us-east-1
```

## 2. Prepare Terraform variables

1. Copy `environments/dev/terraform.tfvars.example` to `environments/dev/terraform.tfvars`.
2. Copy `environments/dev/backend.hcl.example` to `environments/dev/backend.hcl`.
3. Fill the real names for bucket, lambda and optional domain values.

## 3. Apply infrastructure

```bash
terraform init -backend-config=environments/dev/backend.hcl
terraform fmt -recursive
terraform validate
terraform plan -var-file=environments/dev/terraform.tfvars
terraform apply -var-file=environments/dev/terraform.tfvars
```

## 4. Configure GitHub secrets

Required secrets requested in the README:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `FRONTEND_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `LAMBDA_FUNCTION_NAME`

Additional repo variables recommended for the workflows in this repo:

- `PROJECT_NAME`
- `TF_STATE_BUCKET`
- `TF_LOCK_TABLE`
- `DOMAIN_NAME`
- `ACM_CERTIFICATE_ARN`
- `ROUTE53_HOSTED_ZONE_ID`
- `VITE_API_BASE_URL`

## 5. Deploy applications

- Frontend pipeline publishes `dist/` to S3 and invalidates CloudFront.
- Backend pipeline builds a Lambda ZIP and updates the function code.
- Terraform pipeline plans on PR and auto-applies on `develop`.
