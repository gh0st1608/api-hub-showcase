param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectName,

  [Parameter(Mandatory = $true)]
  [ValidateSet("dev", "qa", "prod")]
  [string]$Environment,

  [string]$AwsRegion = "us-east-1",
  [string]$StateBucketName = "",
  [string]$LockTableName = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Test-AwsCommand {
  param(
    [Parameter(Mandatory = $true)]
    [scriptblock]$Command
  )

  $previousErrorActionPreference = $ErrorActionPreference
  try {
    $ErrorActionPreference = "Continue"
    & $Command 2>$null | Out-Null
    return $LASTEXITCODE -eq 0
  }
  finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }
}

if ([string]::IsNullOrWhiteSpace($StateBucketName)) {
  $StateBucketName = "terraform-state-$ProjectName-$Environment"
}

if ([string]::IsNullOrWhiteSpace($LockTableName)) {
  $LockTableName = "terraform-locks-$ProjectName-$Environment"
}

Write-Host "Bootstraping Terraform state resources..."
Write-Host "Bucket: $StateBucketName"
Write-Host "Lock table: $LockTableName"
Write-Host "Region: $AwsRegion"

if (-not (Test-AwsCommand { aws s3api head-bucket --bucket $StateBucketName })) {
  if ($AwsRegion -eq "us-east-1") {
    aws s3api create-bucket --bucket $StateBucketName
  }
  else {
    aws s3api create-bucket --bucket $StateBucketName --create-bucket-configuration LocationConstraint=$AwsRegion
  }

  aws s3api put-bucket-versioning --bucket $StateBucketName --versioning-configuration Status=Enabled
  aws s3api put-bucket-encryption --bucket $StateBucketName --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
  aws s3api put-public-access-block --bucket $StateBucketName --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
}
else {
  Write-Host "State bucket already exists."
}

if (-not (Test-AwsCommand { aws dynamodb describe-table --table-name $LockTableName })) {
  aws dynamodb create-table `
    --table-name $LockTableName `
    --attribute-definitions AttributeName=LockID,AttributeType=S `
    --key-schema AttributeName=LockID,KeyType=HASH `
    --billing-mode PAY_PER_REQUEST

  aws dynamodb wait table-exists --table-name $LockTableName
}
else {
  Write-Host "Lock table already exists."
}

Write-Host ""
Write-Host "Create a backend file similar to:"
Write-Host "bucket         = `"$StateBucketName`""
Write-Host "key            = `"serverless/$Environment/terraform.tfstate`""
Write-Host "region         = `"$AwsRegion`""
Write-Host "dynamodb_table = `"$LockTableName`""
Write-Host "encrypt        = true"
