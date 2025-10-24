# Rol de servicio para CodeBuild
resource "aws_iam_role" "codebuild_service_role" {
  name = "codebuild-service-role-apihub-showcase"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "codebuild.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Políticas mínimas necesarias
resource "aws_iam_role_policy_attachment" "codebuild_basic" {
  role       = aws_iam_role.codebuild_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSCodeBuildDeveloperAccess"
}

# (Opcional) si subes archivos a S3
resource "aws_iam_role_policy_attachment" "codebuild_s3_access" {
  role       = aws_iam_role.codebuild_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

# (Opcional) si publicas logs en CloudWatch
resource "aws_iam_role_policy_attachment" "codebuild_logs" {
  role       = aws_iam_role.codebuild_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

resource "aws_iam_role_policy" "codebuild_cloudfront_invalidation" {
  name = "CodeBuildCloudFrontInvalidation"
  role = aws_iam_role.codebuild_service_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation"
        ]
        Resource = "arn:aws:cloudfront::248268265208:distribution/E1VD9H39FYQZIE"
      }
    ]
  })
}

# Permisos para usar CodeConnections (GitHub)
resource "aws_iam_policy" "codeconnections_policy" {
  name        = "AllowUseCodeConnections"
  description = "Permite a CodeBuild usar la conexión de CodeConnections con GitHub"
  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "codeconnections:UseConnection",
          "codeconnections:GetConnection",
          "codeconnections:ListConnections"
        ]
        Resource = "arn:aws:codeconnections:us-east-1:248268265208:connection/a1e7bba0-3f3b-4399-a9e1-5b1e6f710c99"
      }
    ]
  })
}

# Asociar la política al rol de CodeBuild
resource "aws_iam_role_policy_attachment" "attach_codeconnections_policy_to_codebuild" {
  role       = aws_iam_role.codebuild_service_role.name
  policy_arn = aws_iam_policy.codeconnections_policy.arn
}


output "codebuild_service_role_arn" {
  value = aws_iam_role.codebuild_service_role.arn
}