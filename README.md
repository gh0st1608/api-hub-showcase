# API Hub Showcase Infrastructure

Infraestructura como codigo para desplegar:

- Frontend React/Vite en `S3 + CloudFront`
- Backend NestJS en `Lambda + API Gateway HTTP API`
- CI/CD con `GitHub Actions`
- Estado remoto de Terraform en `S3 + DynamoDB`

## Estructura

```text
.
|-- .github/
|   `-- workflows/
|       |-- backend.yml
|       |-- frontend.yml
|       `-- terraform.yml
|-- docs/
|   |-- bootstrap-guide.md
|   |-- frontend-backend-integration.md
|   `-- rollback.md
|-- environments/
|   |-- dev/
|   `-- prod/
|-- modules/
|   |-- api-gateway/
|   |-- cloudfront/
|   |-- iam/
|   |-- lambda/
|   |-- monitoring/
|   `-- s3-static-site/
|-- scripts/
|   |-- bootstrap-terraform-state.ps1
|   `-- bootstrap-terraform-state.sh
|-- backend.tf
|-- locals.tf
|-- main.tf
|-- outputs.tf
|-- providers.tf
|-- variables.tf
`-- versions.tf
```

## Uso local

```bash
cp environments/dev/terraform.tfvars.example environments/dev/terraform.tfvars
cp environments/dev/backend.hcl.example environments/dev/backend.hcl
terraform init -backend-config="environments/dev/backend.hcl"
terraform fmt -recursive
terraform validate
terraform plan -var-file="environments/dev/terraform.tfvars"
terraform apply -var-file="environments/dev/terraform.tfvars"
terraform output #opcional
```

En PowerShell sobre Windows, usa comillas en `-backend-config` para evitar el error `Too many command line arguments`.

## Variables requeridas

- `project_name`
- `environment`
- `aws_region`
- `frontend_bucket_name`
- `lambda_name`
- `lambda_memory`
- `lambda_timeout`
- `domain_name`

## Outputs

- `cloudfront_url`
- `frontend_bucket_name`
- `api_gateway_url`
- `lambda_name`
- `cloudfront_distribution_id`

## Notas de integracion

- Este workspace me permite escribir en `infra-apihub`, no en los worktrees hermanos `frontend-apihub` y `backend-apihub`.
- Por eso deje la infraestructura, pipelines y la documentacion de integracion listas aqui.
- Los ajustes detectados para backend/frontend quedaron documentados en [docs/frontend-backend-integration.md](/C:/Users/Administrador/Desktop/Proyectos/api-hub-showcase/infra-apihub/docs/frontend-backend-integration.md).

## Siguiente paso recomendado

1. Crear el backend remoto con [scripts/bootstrap-terraform-state.ps1](/C:/Users/Administrador/Desktop/Proyectos/api-hub-showcase/infra-apihub/scripts/bootstrap-terraform-state.ps1).
2. Completar variables y secrets con apoyo de [docs/bootstrap-guide.md](/C:/Users/Administrador/Desktop/Proyectos/api-hub-showcase/infra-apihub/docs/bootstrap-guide.md).
3. Aplicar Terraform para `dev`.
4. Copiar `frontend.yml` al repo/worktree del frontend y `backend.yml` al del backend.
