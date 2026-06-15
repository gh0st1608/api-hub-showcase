data "archive_file" "placeholder" {
  count       = var.package_file == "" ? 1 : 0
  type        = "zip"
  output_path = "${path.root}/.terraform/${var.function_name}-placeholder.zip"

  source {
    content  = "exports.handler = async () => ({ statusCode: 200, body: 'Placeholder package. Deploy backend artifact through CI/CD.' });"
    filename = "handler.js"
  }
}

locals {
  package_file     = var.package_file != "" ? var.package_file : data.archive_file.placeholder[0].output_path
  source_code_hash = var.package_file != "" ? filebase64sha256(var.package_file) : data.archive_file.placeholder[0].output_base64sha256
}

resource "aws_lambda_function" "this" {
  function_name    = var.function_name
  role             = var.role_arn
  runtime          = var.runtime
  handler          = var.handler
  filename         = local.package_file
  source_code_hash = local.source_code_hash
  memory_size      = var.memory_size
  timeout          = var.timeout
  publish          = false
  architectures    = var.architectures
  tags             = var.tags

  environment {
    variables = var.environment_variables
  }
}
