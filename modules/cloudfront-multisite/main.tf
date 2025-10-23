resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for multi-site CloudFront"
}

resource "aws_cloudfront_distribution" "multi_site" {
  enabled = true
  comment = "CloudFront multi-site"
  default_root_object = "index.html"

  aliases = var.aliases

  dynamic "origin" {
    for_each = var.sites
    content {
      domain_name = "${origin.value.bucket}.s3.amazonaws.com"
      origin_id   = "${origin.value.name}-origin"

      s3_origin_config {
        origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
      }
    }
  }

  default_cache_behavior {
    target_origin_id       = "${var.sites[0].name}-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  dynamic "ordered_cache_behavior" {
    for_each = slice(var.sites, 1, length(var.sites))
    content {
      path_pattern           = "/${ordered_cache_behavior.value.name}/*"
      target_origin_id       = "${ordered_cache_behavior.value.name}-origin"
      viewer_protocol_policy = "redirect-to-https"

      allowed_methods = ["GET", "HEAD"]
      cached_methods  = ["GET", "HEAD"]

      forwarded_values {
        query_string = false
        cookies {
          forward = "none"
        }
      }
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.cf_cert_arn
    ssl_support_method  = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}


output "cf_oai_id" {
  value = aws_cloudfront_origin_access_identity.oai.id
}
