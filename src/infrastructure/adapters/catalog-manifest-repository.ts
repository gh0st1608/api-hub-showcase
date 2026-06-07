import { z } from "zod";
import { env } from "@infrastructure/config/env";
import type { CatalogManifest } from "@domain/entities/catalog.entity";

const designSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  group: z.string().optional(),
  project: z.string().optional(),
  summary: z.string().optional(),
  html: z.string().min(1),
  yaml: z.string().min(1),
  lastUpdated: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  group: z.string().optional(),
  summary: z.string().optional(),
  href: z.string().min(1).optional(),
  lastUpdated: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
});

const manifestSchema = z.object({
  updatedAt: z.string().min(1),
  projects: z.array(projectSchema).optional(),
  designs: z.array(designSchema),
});

export async function fetchCatalogManifest(): Promise<CatalogManifest> {
  const response = await fetch(env.VITE_MANIFEST_URL || "/manifest.json", {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch catalog manifest: ${response.status}`);
  }

  const payload = await response.json();

  return manifestSchema.parse(payload);
}
