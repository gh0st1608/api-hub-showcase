import { useQuery } from "@tanstack/react-query";
import { catalogQueryKeys } from "./query-keys";
import { fetchCatalogManifest } from "@infrastructure/adapters/catalog-manifest-repository";

export function useCatalogManifest() {
  return useQuery({
    queryKey: catalogQueryKeys.manifest,
    queryFn: fetchCatalogManifest,
  });
}
