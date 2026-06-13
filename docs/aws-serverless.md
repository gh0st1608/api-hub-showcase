# AWS Serverless deployment

## What changed

- The NestJS app now has a Lambda entrypoint at `dist/src/lambda.handler`.
- `projects` can use persistent storage through TypeORM instead of in-memory state.
- uploaded HTML and YAML files can be stored in S3 instead of `uploads/`.

## Required runtime configuration

For AWS Lambda, use these values at minimum:

```env
NODE_ENV=production
PROJECT_REPOSITORY_DRIVER=typeorm
FILE_STORAGE_DRIVER=s3
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
DB_HOST=your-postgres-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
```

If your S3 objects are served through CloudFront or a public bucket URL, also set:

```env
AWS_S3_PUBLIC_BASE_URL=https://cdn.example.com
```

For local S3 emulation such as LocalStack:

```env
AWS_S3_ENDPOINT=http://localhost:4566
AWS_S3_FORCE_PATH_STYLE=true
```

## Lambda handler

Set the function handler to:

```text
dist/src/lambda.handler
```

## Build artifact

The deployment artifact must include:

- `dist/`
- `node_modules/`
- `package.json`
- `package-lock.json`

The GitHub Actions workflow in `.github/workflows/backend.yml` now packages exactly that and updates the Lambda handler before uploading code.

## Database notes

- In Lambda, `PROJECT_REPOSITORY_DRIVER=typeorm` is enforced.
- A migration was added for the `projects` table at `src/infrastructure/database/migrations/2026061200000-CreateProjectsTable.ts`.
- In production, the existing `DatabaseModule` runs migrations on startup.

## Storage notes

- In Lambda, `FILE_STORAGE_DRIVER=s3` is enforced.
- Files are stored under `projects/<projectId>/design.html` and `projects/<projectId>/openapi.yaml`.
- Deleting a project also attempts to delete its S3 objects.
