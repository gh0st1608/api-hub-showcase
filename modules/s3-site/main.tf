# Para hub.tudominio.com (Redocly) y showcase.tudominio.com (React):

resource "aws_s3_bucket" "site" {
  bucket = var.bucket_name
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_s3_bucket_policy" "site_policy" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.allow_cf_access.json
}

data "aws_iam_policy_document" "allow_cf_access" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]
    principals {
      type        = "AWS"
      identifiers = [var.cloudfront_oai_arn]
    }
  }
}

output "bucket_name" {
  value = aws_s3_bucket.site.bucket
}
