import { z } from "zod";

const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1).default("API Hub Showcase"),
  VITE_MANIFEST_URL: z
    .string()
    .refine((v) => v === "" || /^(https?:\/\/.+|\/.+|\..+)/.test(v), {
      message: "Must be empty or a valid relative/absolute URL",
    })
    .default("/manifest.json"),
  VITE_API_BASE_URL: z
    .string()
    .refine((v) => v === "" || /^https?:\/\/.+/.test(v), {
      message:
        "Must be an empty string (use Vite proxy) or a valid http/https URL",
    })
    .default(""),
});

const parsed = envSchema.safeParse({
  VITE_APP_NAME: import.meta.env["VITE_APP_NAME"],
  VITE_MANIFEST_URL: import.meta.env["VITE_MANIFEST_URL"],
  VITE_API_BASE_URL: import.meta.env["VITE_API_BASE_URL"],
});

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;
