import type { Project } from "@domain/entities/project.entity";
import type { ProjectRepositoryPort } from "@domain/ports/project-repository-port";

export class ListProjectsUseCase {
  constructor(private readonly repository: ProjectRepositoryPort) {}

  async execute(): Promise<Project[]> {
    const projects = await this.repository.findAll();
    return projects.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
