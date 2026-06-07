export interface DesignCatalogItem {
  id: string;
  name: string;
  group?: string;
  project?: string;
  summary?: string;
  html: string;
  yaml: string;
  lastUpdated: string;
  tags?: string[];
}

export interface CatalogProjectItem {
  id: string;
  name: string;
  group?: string;
  summary?: string;
  href?: string;
  lastUpdated?: string;
  tags?: string[];
}

import { ValidationError } from "@domain/errors";

export interface CatalogManifest {
  updatedAt: string;
  projects?: CatalogProjectItem[];
  designs: DesignCatalogItem[];
}

export class CatalogManifestEntity {
  readonly updatedAt: string;
  readonly projects?: CatalogProjectItem[];
  readonly designs: DesignCatalogItem[];

  private constructor(props: CatalogManifest) {
    this.updatedAt = props.updatedAt;
    this.projects = props.projects;
    this.designs = props.designs;
  }

  static validate(input: CatalogManifest): void {
    if (!input.updatedAt?.trim()) {
      throw new ValidationError("Manifest updatedAt is required");
    }
    if (!Array.isArray(input.designs)) {
      throw new ValidationError("Manifest designs must be an array");
    }
  }

  static hydrate(props: CatalogManifest): CatalogManifestEntity {
    CatalogManifestEntity.validate(props);
    return new CatalogManifestEntity(props);
  }

  toPrimitives(): CatalogManifest {
    return {
      updatedAt: this.updatedAt,
      projects: this.projects,
      designs: this.designs,
    };
  }
}

export interface DesignCatalogGroup {
  id: string;
  label: string;
  designs: DesignCatalogItem[];
}

export interface CatalogProjectSummary extends CatalogProjectItem {
  href: string;
  lastUpdated: string;
  designCount: number;
}

export function getDesignGroupLabel(design: DesignCatalogItem) {
  return design.project?.trim() || design.group?.trim() || "general";
}

export function groupCatalogDesigns(
  designs: DesignCatalogItem[]
): DesignCatalogGroup[] {
  const groups = new Map<string, DesignCatalogItem[]>();

  for (const design of designs) {
    const label = getDesignGroupLabel(design);
    groups.set(label, [...(groups.get(label) ?? []), design]);
  }

  return Array.from(groups.entries())
    .map(([label, items]) => ({
      id: label.toLowerCase().replace(/\s+/g, "-"),
      label,
      designs: items.sort((left, right) => {
        return Date.parse(right.lastUpdated) - Date.parse(left.lastUpdated);
      }),
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

export function filterCatalogDesigns(
  designs: DesignCatalogItem[],
  query: string
) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return designs;
  }

  return designs.filter((design) => {
    const haystack = [
      design.id,
      design.name,
      design.group,
      design.project,
      design.summary,
      ...(design.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function getProjectKeyFromDesign(design: DesignCatalogItem) {
  return normalizeKey(
    design.project?.trim() || design.group?.trim() || design.id
  );
}

function getProjectLabelFromDesign(design: DesignCatalogItem) {
  return design.project?.trim() || design.group?.trim() || design.name;
}

function mergeTags(...groups: Array<string[] | undefined>) {
  return Array.from(new Set(groups.flatMap((group) => group ?? [])));
}

function getMostRecentDate(left: string, right: string) {
  const leftTime = Date.parse(left);
  const rightTime = Date.parse(right);

  if (Number.isNaN(leftTime)) {
    return right;
  }

  if (Number.isNaN(rightTime)) {
    return left;
  }

  return leftTime >= rightTime ? left : right;
}

export function deriveCatalogProjects(
  manifest: CatalogManifest,
  designs: DesignCatalogItem[] = manifest.designs
) {
  const projects = new Map<string, CatalogProjectSummary>();

  for (const project of manifest.projects ?? []) {
    projects.set(normalizeKey(project.id), {
      ...project,
      href: project.href ?? "#",
      lastUpdated: project.lastUpdated ?? manifest.updatedAt,
      designCount: 0,
    });
  }

  for (const design of designs) {
    const key = getProjectKeyFromDesign(design);
    const existing = projects.get(key);

    if (!existing) {
      projects.set(key, {
        id: key,
        name: getProjectLabelFromDesign(design),
        group: design.group,
        summary: design.summary,
        href: design.html,
        lastUpdated: design.lastUpdated,
        designCount: 1,
        tags: design.tags,
      });
      continue;
    }

    projects.set(key, {
      ...existing,
      group: existing.group ?? design.group,
      summary: existing.summary ?? design.summary,
      href: existing.href === "#" ? design.html : existing.href,
      lastUpdated: getMostRecentDate(existing.lastUpdated, design.lastUpdated),
      designCount: existing.designCount + 1,
      tags: mergeTags(existing.tags, design.tags),
    });
  }

  return Array.from(projects.values()).sort((left, right) =>
    left.name.localeCompare(right.name)
  );
}
