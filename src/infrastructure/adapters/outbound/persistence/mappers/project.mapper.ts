import { Project } from '@domain/entities/project.entity';

export interface ProjectItem {
  projectId: string;
  group: string;
  title: string;
  description: string;
  link: string;
  html: string;
  yaml: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export class ProjectMapper {
  static toDomain(item: ProjectItem): Project {
    return Project.hydrate({
      id: item.projectId,
      group: item.group,
      title: item.title,
      description: item.description,
      link: item.link,
      html: item.html ?? '',
      yaml: item.yaml ?? '',
      tags: item.tags ?? [],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  }

  static toPersistence(project: Project): ProjectItem {
    return {
      projectId: project.id,
      group: project.group,
      title: project.title,
      description: project.description,
      link: project.link,
      html: project.html,
      yaml: project.yaml,
      tags: project.tags,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}