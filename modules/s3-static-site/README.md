# s3-static-site

Creates a private S3 bucket for static frontend assets.

## What it provisions

- S3 bucket
- Versioning
- SSE-S3 encryption
- Public access block
- Ownership controls

## Example

```hcl
module "frontend_bucket" {
  source = "./modules/s3-static-site"

  bucket_name = "api-hub-showcase-dev-frontend"
  tags = {
    Project     = "api-hub-showcase"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}
```

## Outputs

- `bucket_id`
- `bucket_name`
- `bucket_arn`
- `bucket_regional_domain_name`
