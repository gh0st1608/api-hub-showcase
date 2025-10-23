module "s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "4.1.2"

  bucket = var.bucket_name

  # ❌ No uses ACL pública
  acl = null

  control_object_ownership = true
  object_ownership         = "BucketOwnerEnforced"

  versioning = {
    enabled = true
  }

  # 🔹 (Opcional) si quieres mantener la estructura de sitio estático
  website = {
    index_document = "index.html"
    error_document = "index.html"
  }

  # 🔒 Bloquea acceso público total
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  # 🚫 Quita attach_policy (CloudFront manejará el acceso)
  attach_policy = false
}

# ✅ Política que permite acceso SOLO desde CloudFront OAI
data "aws_cloudfront_origin_access_identity" "this" {
  id = var.cloudfront_oai_id
}

data "aws_iam_policy_document" "allow_cf_access" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${module.s3_bucket.s3_bucket_arn}/*"]

    principals {
      type        = "CanonicalUser"
      identifiers = [data.aws_cloudfront_origin_access_identity.this.s3_canonical_user_id]
    }
  }
}

resource "aws_s3_bucket_policy" "cf_access_policy" {
  bucket = module.s3_bucket.s3_bucket_id
  policy = data.aws_iam_policy_document.allow_cf_access.json
}

