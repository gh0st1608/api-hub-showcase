import type { Project } from "@domain/entities/project.entity";
import type { ProjectRepositoryPort } from "@domain/ports/project-repository-port";
import { NotFoundError } from "@domain/errors";

export class GetProjectByIdUseCase {
  constructor(private readonly repository: ProjectRepositoryPort) {}

  async execute(id: string): Promise<Project> {
    const project = await this.repository.findById(id);
    if (!project) {
      throw new NotFoundError("Project", id);
    }
    return project;
  }
}
