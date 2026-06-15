resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${var.lambda_name}"
  retention_in_days = var.log_retention_days
  tags              = var.tags
}

resource "aws_cloudwatch_log_group" "api_access" {
  name              = "/aws/apigateway/${var.api_name}/access"
  retention_in_days = var.log_retention_days
  tags              = var.tags
}

resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  count               = var.enable_basic_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-${var.lambda_name}-errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = var.lambda_error_alarm_threshold
  alarm_description   = "Basic alarm for Lambda errors."
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = var.lambda_name
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "lambda_throttles" {
  count               = var.enable_basic_alarms ? 1 : 0
  alarm_name          = "${var.project_name}-${var.environment}-${var.lambda_name}-throttles"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "Throttles"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = var.lambda_throttle_alarm_threshold
  alarm_description   = "Basic alarm for Lambda throttles."
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = var.lambda_name
  }

  tags = var.tags
}
