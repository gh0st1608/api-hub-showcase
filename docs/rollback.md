# Rollback instructions

## Frontend rollback

1. Re-run the last known-good frontend workflow from the commit you want to restore.
2. Or sync the previous `dist/` artifact back into the frontend bucket.
3. Invalidate CloudFront after restoring assets.

## Backend rollback

1. Re-run the backend workflow from the last known-good commit.
2. Or upload the previous `backend.zip` artifact with:

```bash
aws lambda update-function-code \
  --function-name "<lambda-name>" \
  --zip-file "fileb://backend.zip"
```

## Infrastructure rollback

1. Review the previous Terraform plan from CI.
2. Checkout the last good infra commit.
3. Run:

```bash
terraform init -backend-config=environments/dev/backend.hcl
terraform plan -var-file=environments/dev/terraform.tfvars
terraform apply -var-file=environments/dev/terraform.tfvars
```

## Safe rollback practice

- Roll back app code before rolling back shared infrastructure unless infra is the root cause.
- Keep `frontend` and `backend` artifacts versioned in CI artifacts or releases.
- Avoid destroying the state bucket and lock table during rollback.
