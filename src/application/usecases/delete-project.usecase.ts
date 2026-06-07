import type { ProjectRepositoryPort } from "@domain/ports/project-repository-port";

export class DeleteProjectUseCase {
  constructor(private readonly repository: ProjectRepositoryPort) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
