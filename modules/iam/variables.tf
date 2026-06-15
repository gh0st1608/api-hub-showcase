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

variable "lambda_log_group_arn" {
  description = "Lambda CloudWatch log group ARN."
  type        = string
}

variable "tags" {
  description = "Resource tags."
  type        = map(string)
  default     = {}
}
