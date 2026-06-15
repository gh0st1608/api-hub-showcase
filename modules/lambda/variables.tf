variable "function_name" {
  description = "Lambda function name."
  type        = string
}

variable "role_arn" {
  description = "IAM role ARN assumed by Lambda."
  type        = string
}

variable "package_file" {
  description = "Optional local path to the deployment zip file."
  type        = string
  default     = ""
}

variable "handler" {
  description = "Lambda handler entrypoint."
  type        = string
  default     = "lambda.handler"
}

variable "runtime" {
  description = "Lambda runtime."
  type        = string
  default     = "nodejs20.x"
}

variable "memory_size" {
  description = "Lambda memory size in MB."
  type        = number
  default     = 512
}

variable "timeout" {
  description = "Lambda timeout in seconds."
  type        = number
  default     = 15
}

variable "architectures" {
  description = "Lambda CPU architectures."
  type        = list(string)
  default     = ["x86_64"]
}

variable "environment_variables" {
  description = "Lambda environment variables."
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Resource tags."
  type        = map(string)
  default     = {}
}
