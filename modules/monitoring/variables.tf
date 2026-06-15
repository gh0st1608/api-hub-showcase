variable "project_name" {
  description = "Project identifier."
  type        = string
}

variable "environment" {
  description = "Deployment environment."
  type        = string
}

variable "lambda_name" {
  description = "Lambda function name."
  type        = string
}

variable "api_name" {
  description = "API Gateway name used for access log group naming."
  type        = string
}

variable "log_retention_days" {
  description = "CloudWatch Logs retention in days."
  type        = number
  default     = 14
}

variable "enable_basic_alarms" {
  description = "Whether to create basic Lambda alarms."
  type        = bool
  default     = true
}

variable "lambda_error_alarm_threshold" {
  description = "Threshold for Lambda Errors alarm."
  type        = number
  default     = 1
}

variable "lambda_throttle_alarm_threshold" {
  description = "Threshold for Lambda Throttles alarm."
  type        = number
  default     = 1
}

variable "tags" {
  description = "Resource tags."
  type        = map(string)
  default     = {}
}
