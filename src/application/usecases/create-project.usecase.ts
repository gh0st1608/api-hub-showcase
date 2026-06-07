import {
  Project,
  type CreateProjectInput,
} from "@domain/entities/project.entity";
import type { ProjectRepositoryPort } from "@domain/ports/project-repository-port";
import type { CreateProjectDto } from "@application/dto/project-dto";

function toFileName(value: File | string): string {
  return typeof value === "string" ? value : value.name;
}

export class CreateProjectUseCase {
  constructor(private readonly repository: ProjectRepositoryPort) {}

  async execute(dto: CreateProjectDto): Promise<Project> {
    const input: CreateProjectInput = {
      group: dto.group.trim(),
      title: dto.title.trim(),
      description: dto.description.trim(),
      link: dto.link.trim(),
      html: toFileName(dto.html),
      yaml: toFileName(dto.yaml),
      tags: dto.tags.map((tag) => tag.trim()).filter(Boolean),
    };

    Project.validate(input);
    return this.repository.create(input);
  }
}
