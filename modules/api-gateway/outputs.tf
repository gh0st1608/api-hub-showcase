output "api_id" {
  description = "API Gateway id."
  value       = aws_apigatewayv2_api.this.id
}

output "api_endpoint" {
  description = "API Gateway endpoint."
  value       = local.api_endpoint
}

output "api_execution_arn" {
  description = "API Gateway execution ARN."
  value       = aws_apigatewayv2_api.this.execution_arn
}

output "stage_name" {
  description = "API Gateway stage name."
  value       = aws_apigatewayv2_stage.this.name
}
