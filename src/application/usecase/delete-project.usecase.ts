import { Inject, Injectable } from '@nestjs/common';

import { ProjectNotFoundException } from '@application/exceptions/project-not-found.exception';
import { LoggingPort, LoggingPortSymbol } from '@application/ports/logging.port';
import { MetricsPort, MetricsPortSymbol } from '@application/ports/metrics.port';
import { ProjectRepositoryPort, ProjectRepositoryPortSymbol } from '@domain/ports/project.port';

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject(ProjectRepositoryPortSymbol)
    private readonly projectRepository: ProjectRepositoryPort,

    @Inject(MetricsPortSymbol)
    private readonly metrics: MetricsPort,

    @Inject(LoggingPortSymbol)
    private readonly logger: LoggingPort,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) throw new ProjectNotFoundException();

    await this.projectRepository.delete(id);

    this.metrics.increment('project.deleted.success');
    this.logger.info('PROJECT_DELETED', { projectId: id });
  }
}
