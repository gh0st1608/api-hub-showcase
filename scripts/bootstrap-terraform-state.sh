#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="${1:?project name is required}"
ENVIRONMENT="${2:?environment is required}"
AWS_REGION="${3:-us-east-1}"
STATE_BUCKET_NAME="${4:-terraform-state-${PROJECT_NAME}-${ENVIRONMENT}}"
LOCK_TABLE_NAME="${5:-terraform-locks-${PROJECT_NAME}-${ENVIRONMENT}}"

echo "Bootstrapping Terraform state resources..."
echo "Bucket: ${STATE_BUCKET_NAME}"
echo "Lock table: ${LOCK_TABLE_NAME}"
echo "Region: ${AWS_REGION}"

if ! aws s3api head-bucket --bucket "${STATE_BUCKET_NAME}" >/dev/null 2>&1; then
  if [[ "${AWS_REGION}" == "us-east-1" ]]; then
    aws s3api create-bucket --bucket "${STATE_BUCKET_NAME}"
  else
    aws s3api create-bucket \
      --bucket "${STATE_BUCKET_NAME}" \
      --create-bucket-configuration "LocationConstraint=${AWS_REGION}"
  fi

  aws s3api put-bucket-versioning \
    --bucket "${STATE_BUCKET_NAME}" \
    --versioning-configuration Status=Enabled

  aws s3api put-bucket-encryption \
    --bucket "${STATE_BUCKET_NAME}" \
    --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

  aws s3api put-public-access-block \
    --bucket "${STATE_BUCKET_NAME}" \
    --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
else
  echo "State bucket already exists."
fi

if ! aws dynamodb describe-table --table-name "${LOCK_TABLE_NAME}" >/dev/null 2>&1; then
  aws dynamodb create-table \
    --table-name "${LOCK_TABLE_NAME}" \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

  aws dynamodb wait table-exists --table-name "${LOCK_TABLE_NAME}"
else
  echo "Lock table already exists."
fi

cat <<EOF

Create a backend file similar to:
bucket         = "${STATE_BUCKET_NAME}"
key            = "serverless/${ENVIRONMENT}/terraform.tfstate"
region         = "${AWS_REGION}"
dynamodb_table = "${LOCK_TABLE_NAME}"
encrypt        = true
EOF
