variable "project_name" {
  description = "Project identifier used in names and tags."
  type        = string
}

variable "environment" {
  description = "Deployment environment. Allowed values: dev, qa, prod."
  type        = string

  validation {
    condition     = contains(["dev", "qa", "prod"], var.environment)
    error_message = "environment must be one of: dev, qa, prod."
  }
}

variable "aws_region" {
  description = "AWS region where the stack will be deployed."
  type        = string
}

variable "frontend_bucket_name" {
  description = "Private S3 bucket name for frontend assets."
  type        = string
}

variable "lambda_name" {
  description = "Lambda function name."
  type        = string
}

variable "lambda_memory" {
  description = "Lambda memory size in MB."
  type        = number
  default     = 512
}

variable "lambda_timeout" {
  description = "Lambda timeout in seconds."
  type        = number
  default     = 15
}

variable "lambda_handler" {
  description = "Lambda handler entrypoint."
  type        = string
  default     = "handler.handler"
}

variable "lambda_runtime" {
  description = "Lambda runtime."
  type        = string
  default     = "nodejs20.x"
}

variable "lambda_package_path" {
  description = "Optional path to the backend deployment zip. Leave empty to create a placeholder package during infra bootstrap."
  type        = string
  default     = ""
}

variable "lambda_environment_variables" {
  description = "Environment variables injected into the Lambda function."
  type        = map(string)
  default     = {}
}

variable "domain_name" {
  description = "Optional primary custom domain for CloudFront."
  type        = string
  default     = ""
}

variable "frontend_aliases" {
  description = "Additional CloudFront aliases."
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "Optional ACM certificate ARN in us-east-1 for CloudFront custom domains."
  type        = string
  default     = ""
}

variable "route53_hosted_zone_id" {
  description = "Optional Route53 hosted zone id for alias records."
  type        = string
  default     = ""
}

variable "api_stage_name" {
  description = "API Gateway stage name. Use $default for a stage-less URL."
  type        = string
  default     = "$default"
}

variable "cors_allowed_origins" {
  description = "Allowed origins for the HTTP API CORS configuration."
  type        = list(string)
  default     = ["*"]
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days."
  type        = number
  default     = 14
}

variable "enable_basic_alarms" {
  description = "Whether to create basic Lambda CloudWatch alarms."
  type        = bool
  default     = true
}

variable "lambda_error_alarm_threshold" {
  description = "Lambda Errors alarm threshold."
  type        = number
  default     = 1
}

variable "lambda_throttle_alarm_threshold" {
  description = "Lambda Throttles alarm threshold."
  type        = number
  default     = 1
}

variable "cloudfront_price_class" {
  description = "CloudFront price class tuned for low-cost environments."
  type        = string
  default     = "PriceClass_100"
}

variable "frontend_force_destroy" {
  description = "Allow destroying non-empty frontend buckets."
  type        = bool
  default     = false
}

variable "tags" {
  description = "Additional resource tags."
  type        = map(string)
  default     = {}
}
