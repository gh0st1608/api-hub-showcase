import { Inject, Injectable } from '@nestjs/common';

import { UpdateProjectDto } from '@application/dto/request/update-project.dto';
import { ProjectNotFoundException } from '@application/exceptions/project-not-found.exception';
import { LoggingPort, LoggingPortSymbol } from '@application/ports/logging.port';
import { MetricsPort, MetricsPortSymbol } from '@application/ports/metrics.port';
import { Project } from '@domain/entities/project.entity';
import { ProjectRepositoryPort, ProjectRepositoryPortSymbol } from '@domain/ports/project.port';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(ProjectRepositoryPortSymbol)
    private readonly projectRepository: ProjectRepositoryPort,

    @Inject(MetricsPortSymbol)
    private readonly metrics: MetricsPort,

    @Inject(LoggingPortSymbol)
    private readonly logger: LoggingPort,
  ) {}

  async execute(id: string, body: UpdateProjectDto): Promise<Project> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) throw new ProjectNotFoundException();

    const { html, yaml, ...rest } = body;
    const updated = existing.update({
      ...rest,
      ...(typeof html === 'string' ? { html } : {}),
      ...(typeof yaml === 'string' ? { yaml } : {}),
    });
    const result = await this.projectRepository.update(updated);

    this.metrics.increment('project.updated.success');
    this.logger.info('PROJECT_UPDATED', { projectId: result.id });

    return result;
  }
}
