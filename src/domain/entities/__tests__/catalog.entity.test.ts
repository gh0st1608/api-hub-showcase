import { CatalogManifestEntity } from "@domain/entities/catalog.entity";
import { ValidationError } from "@domain/errors";

const validManifest = {
  updatedAt: "2026-01-01T00:00:00.000Z",
  projects: [
    {
      id: "foodstore",
      name: "Foodstore",
      summary: "Demo project",
      href: "/projects/foodstore",
      lastUpdated: "2026-01-01T00:00:00.000Z",
      tags: ["demo"],
    },
  ],
  designs: [
    {
      id: "design-1",
      name: "Main Design",
      group: "Foodstore",
      project: "Foodstore",
      summary: "Main design",
      html: "./designs/foodstore.html",
      yaml: "./designs/foodstore.yaml",
      lastUpdated: "2026-01-01T00:00:00.000Z",
      tags: ["ui"],
    },
  ],
};

describe("CatalogManifestEntity", () => {
  it("hydrates from primitives correctly", () => {
    const manifest = CatalogManifestEntity.hydrate(validManifest);

    expect(manifest.updatedAt).toBe(validManifest.updatedAt);
    expect(manifest.designs).toHaveLength(1);
    expect(manifest.projects?.[0].id).toBe("foodstore");
  });

  it("toPrimitives returns the original shape", () => {
    const manifest = CatalogManifestEntity.hydrate(validManifest);

    expect(manifest.toPrimitives()).toEqual(validManifest);
  });

  it("validate rejects an empty manifest", () => {
    expect(() =>
      CatalogManifestEntity.validate({
        updatedAt: "",
        designs: [],
      })
    ).toThrow(ValidationError);
  });

  it("validate accepts a valid manifest", () => {
    expect(() => CatalogManifestEntity.validate(validManifest)).not.toThrow();
  });
});
