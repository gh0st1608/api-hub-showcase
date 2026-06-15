output "cloudfront_url" {
  description = "CloudFront distribution domain name."
  value       = module.cloudfront.distribution_domain_name
}

output "frontend_bucket_name" {
  description = "Frontend private bucket name."
  value       = module.frontend_bucket.bucket_name
}

output "api_gateway_url" {
  description = "API Gateway invoke URL."
  value       = module.api_gateway.api_endpoint
}

output "lambda_name" {
  description = "Lambda function name."
  value       = module.backend_lambda.function_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution id, useful for cache invalidations."
  value       = module.cloudfront.distribution_id
}
