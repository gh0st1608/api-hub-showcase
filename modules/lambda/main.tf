# Lambdas reutilizables (para microservicios telemedicine, reclamos, etc.)
variable "name" {}
variable "handler" {}
variable "artifact_path" {}
variable "lambda_role_arn" {}
variable "env_vars" {
  type    = map(string)
  default = {}
}


resource "aws_lambda_function" "this" {
  function_name = var.name
  handler       = var.handler
  runtime       = "nodejs18.x"
  role          = var.lambda_role_arn
  filename      = var.artifact_path
  timeout       = 15

  environment {
    variables = var.env_vars
  }
}

output "lambda_arn" {
  value = aws_lambda_function.this.arn
}
