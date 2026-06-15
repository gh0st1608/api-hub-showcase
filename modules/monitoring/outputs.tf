output "lambda_log_group_name" {
  description = "Lambda log group name."
  value       = aws_cloudwatch_log_group.lambda.name
}

output "lambda_log_group_arn" {
  description = "Lambda log group ARN."
  value       = aws_cloudwatch_log_group.lambda.arn
}

output "api_access_log_group_name" {
  description = "API access log group name."
  value       = aws_cloudwatch_log_group.api_access.name
}

output "api_access_log_group_arn" {
  description = "API access log group ARN."
  value       = aws_cloudwatch_log_group.api_access.arn
}
