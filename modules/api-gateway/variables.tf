variable "api_name" {
  description = "HTTP API name."
  type        = string
}

variable "lambda_function_name" {
  description = "Lambda function name used by the invoke permission."
  type        = string
}

variable "lambda_invoke_arn" {
  description = "Lambda invoke ARN."
  type        = string
}

variable "stage_name" {
  description = "API Gateway stage name."
  type        = string
  default     = "$default"
}

variable "cors_allowed_origins" {
  description = "Allowed origins for CORS."
  type        = list(string)
  default     = ["*"]
}

variable "access_log_group_arn" {
  description = "CloudWatch log group ARN for API access logs."
  type        = string
}

variable "tags" {
  description = "Resource tags."
  type        = map(string)
  default     = {}
}
