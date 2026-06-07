import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input:
    process.env["OPENAPI_SPEC_URL"] ?? "http://localhost:3001/openapi.json",
  output: "src/infrastructure/api/generated",
  plugins: ["@hey-api/client-fetch", "@hey-api/typescript"],
});
