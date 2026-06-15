data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_execution" {
  name               = "${var.project_name}-${var.environment}-lambda-execution"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
  tags               = var.tags
}

data "aws_iam_policy_document" "lambda_logging" {
  statement {
    sid = "AllowCreateLogGroup"

    actions = [
      "logs:CreateLogGroup",
    ]

    resources = ["*"]
  }

  statement {
    sid = "AllowWriteApplicationLogs"

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = [
      var.lambda_log_group_arn,
      "${var.lambda_log_group_arn}:*",
    ]
  }
}

data "aws_iam_policy_document" "lambda_dynamodb" {
  statement {
    sid = "AllowProjectsTableAccess"

    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
    ]

    resources = ["*"]
  }
}

data "aws_iam_policy_document" "lambda_s3" {
  statement {
    sid = "AllowS3Access"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject"
    ]

    resources = [
      "arn:aws:s3:::api-hub-showcase-dev-frontend/*"
    ]
  }
}

resource "aws_iam_role_policy" "lambda_logging" {
  name   = "${var.project_name}-${var.environment}-lambda-logging"
  role   = aws_iam_role.lambda_execution.id
  policy = data.aws_iam_policy_document.lambda_logging.json
}

resource "aws_iam_role_policy" "lambda_dynamodb" {
  name   = "${var.project_name}-${var.environment}-lambda-dynamodb"
  role   = aws_iam_role.lambda_execution.id
  policy = data.aws_iam_policy_document.lambda_dynamodb.json
}

resource "aws_iam_role_policy" "lambda_s3" {
  name   = "${var.project_name}-${var.environment}-lambda-s3"
  role   = aws_iam_role.lambda_execution.id
  policy = data.aws_iam_policy_document.lambda_s3.json
}
