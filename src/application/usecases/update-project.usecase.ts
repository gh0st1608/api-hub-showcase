import type {
  Project,
  UpdateProjectInput,
} from "@domain/entities/project.entity";

import type { ProjectRepositoryPort } from "@domain/ports/project-repository-port";
import type { UpdateProjectDto } from "@application/dto/project-dto";
import { NotFoundError } from "@domain/errors";

export class UpdateProjectUseCase {
  constructor(private readonly repository: ProjectRepositoryPort) {}

  async execute(id: string, dto: UpdateProjectDto): Promise<Project> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundError("Project", id);
    }

    const input: UpdateProjectInput = {
      group: dto.group?.trim(),
      title: dto.title?.trim(),
      description: dto.description?.trim(),
      link: dto.link?.trim(),

      html: dto.html,
      yaml: dto.yaml,

      tags: dto.tags?.map((tag) => tag.trim()).filter(Boolean),
    };

    return this.repository.update(id, input);
  }
}
