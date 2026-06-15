# Frontend and backend integration notes

## Current frontend findings

- The frontend currently validates `VITE_API_BASE_URL` in `frontend-apihub/src/infrastructure/config/env.ts`.
- The README request mentions `VITE_API_URL`, but the running code expects `VITE_API_BASE_URL`.
- To avoid drift, the provided frontend workflow exports both names with the same value.

## Current backend findings

- The backend entrypoint in `backend-apihub/src/main.ts` starts an HTTP server with `app.listen(...)`.
- That is suitable for local/dev containers, but not yet Lambda-ready.
- The requested Lambda-ready version still needs:
  - `@codegenie/serverless-express`
  - a cached Nest bootstrap function
  - `handler.ts` exporting the AWS Lambda handler
  - packaging tuned for Lambda deployment

## Why these changes are documented here

- This workspace only grants write access to `infra-apihub`.
- The sibling worktrees `frontend-apihub` and `backend-apihub` were analyzed but not modified from this session.
- The workflows in `.github/workflows/frontend.yml` and `.github/workflows/backend.yml` are production-ready templates that should live in the frontend and backend repositories/worktrees respectively.

## Recommended backend shape

Expected file additions in the backend repo:

```text
src/
|-- application/
|-- domain/
|-- infrastructure/
|-- handler.ts
`-- main.ts
```

Recommended Lambda bootstrap approach:

1. Extract Nest app creation into a reusable function.
2. Wrap the Express app with `@codegenie/serverless-express`.
3. Keep `main.ts` for local development and `handler.ts` for AWS Lambda.
