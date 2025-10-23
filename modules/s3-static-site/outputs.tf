output "bucket_name" {
  description = "Nombre del bucket S3 creado"
  value       = module.s3_bucket.s3_bucket_id
}