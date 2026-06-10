import { Inject, Injectable } from '@nestjs/common';

import { GetByParamsDto } from '@application/dto/request/get-by-params.dto';
import { ProjectRepositoryPort, ProjectRepositoryPortSymbol } from '@domain/ports/project.port';
import { PaginatedResult } from '@domain/ports/paginate.port';
import { Project } from '@domain/entities/project.entity';

@Injectable()
export class ListProjectsUseCase {
  constructor(
    @Inject(ProjectRepositoryPortSymbol)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(query: GetByParamsDto): Promise<PaginatedResult<Project>> {
    return this.projectRepository.findAll(query);
  }
}
