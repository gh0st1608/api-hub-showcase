import { Project } from "@domain/entities/project.entity";
import type { ProjectRepositoryPort } from "@domain/ports/project-repository-port";
import type { CreateProjectDto } from "@application/dto/project-dto";

export class CreateProjectUseCase {
  constructor(private readonly repository: ProjectRepositoryPort) {}

  async execute(dto: CreateProjectDto): Promise<Project> {
    return this.repository.create({
      group: dto.group.trim(),
      title: dto.title.trim(),
      description: dto.description.trim(),
      link: dto.link.trim(),

      html: dto.html,
      yaml: dto.yaml,

      tags: dto.tags.map((tag) => tag.trim()).filter(Boolean),
    });
  }
}
