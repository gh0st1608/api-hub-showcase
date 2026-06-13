import type { ProjectRepositoryPort } from "@domain/ports/project-repository-port";

export class GetProjectPreviewUseCase {
  constructor(private readonly repository: ProjectRepositoryPort) {}

  async execute(projectId: string): Promise<string> {
    return this.repository.getPreviewUrl(projectId);
  }
}
