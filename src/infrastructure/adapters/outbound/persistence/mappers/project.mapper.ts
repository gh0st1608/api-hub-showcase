import { Project } from '@domain/entities/project.entity';

export interface ProjectPersistence {
  projectId: string;
  group: string;
  title: string;
  description: string;
  link: string;
  url: string;
  html?: string;
  yaml?: string;
  tags?: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export class ProjectMapper {
  static toDomain(item: ProjectPersistence): Project {
    return Project.hydrate({
      id: item.projectId,
      group: item.group,
      title: item.title,
      description: item.description,
      link: item.link,
      url: item.url,
      html: item.html ?? '',
      yaml: item.yaml ?? '',
      tags: item.tags ?? [],
      createdAt:
        item.createdAt instanceof Date
          ? item.createdAt.toISOString()
          : item.createdAt,
      updatedAt:
        item.updatedAt instanceof Date
          ? item.updatedAt.toISOString()
          : item.updatedAt,
    });
  }

  static toPersistence(project: Project): ProjectPersistence {
    return {
      projectId: project.id,
      group: project.group,
      title: project.title,
      description: project.description,
      link: project.link,
      url: project.url,
      html: project.html,
      yaml: project.yaml,
      tags: project.tags,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
