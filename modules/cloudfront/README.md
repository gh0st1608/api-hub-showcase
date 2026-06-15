# cloudfront

Creates a CloudFront distribution in front of a private S3 bucket using Origin Access Control.

## What it provisions

- CloudFront Origin Access Control
- CloudFront distribution
- S3 bucket policy restricted to CloudFront
- Optional Route53 alias records

## Example

```hcl
module "cloudfront" {
  source = "./modules/cloudfront"

  bucket_name                    = module.frontend_bucket.bucket_name
  s3_bucket_arn                  = module.frontend_bucket.bucket_arn
  s3_bucket_regional_domain_name = module.frontend_bucket.bucket_regional_domain_name
  aliases                        = ["app.example.com"]
  domain_name                    = "app.example.com"
  acm_certificate_arn            = "arn:aws:acm:us-east-1:123456789012:certificate/example"
  route53_hosted_zone_id         = "Z1234567890"
}
```

## Outputs

- `distribution_id`
- `distribution_arn`
- `distribution_domain_name`
- `origin_access_control_id`
