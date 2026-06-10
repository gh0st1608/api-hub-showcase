import { Inject, Injectable } from '@nestjs/common';

import { Project } from '@domain/entities/project.entity';
import { ProjectRepositoryPort, ProjectRepositoryPortSymbol } from '@domain/ports/project.port';
import { ProjectNotFoundException } from '@application/exceptions/project-not-found.exception';

@Injectable()
export class GetProjectByIdUseCase {
  constructor(
    @Inject(ProjectRepositoryPortSymbol)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(id: string): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new ProjectNotFoundException();

    return project;
  }
}
