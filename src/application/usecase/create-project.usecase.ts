import { Inject, Injectable } from '@nestjs/common';

import { CreateProjectDto } from '@application/dto/request/create-project.dto';
import {
  LoggingPort,
  LoggingPortSymbol,
} from '@application/ports/logging.port';
import {
  MetricsPort,
  MetricsPortSymbol,
} from '@application/ports/metrics.port';
import { Project, CreateProjectInput } from '@domain/entities/project.entity';
import {
  ProjectRepositoryPort,
  ProjectRepositoryPortSymbol,
} from '@domain/ports/project.port';
import {
  FileStoragePort,
  FileStoragePortSymbol,
} from '@app/domain/ports/file-storage.port';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(ProjectRepositoryPortSymbol)
    private readonly projectRepository: ProjectRepositoryPort,

    @Inject(FileStoragePortSymbol)
    private readonly fileStorage: FileStoragePort,

    @Inject(MetricsPortSymbol)
    private readonly metrics: MetricsPort,

    @Inject(LoggingPortSymbol)
    private readonly logger: LoggingPort,
  ) {}

  async execute(body: CreateProjectDto): Promise<Project> {
    try {
      const { group, title, description, link, tags } = body;

      const input: CreateProjectInput = {
        group,
        title,
        description,
        link,
        tags,
        html: '',
        yaml: '',
      }

      const project = Project.create(input);

      const htmlUrl = body.html
        ? await this.fileStorage.saveHtml(project.id, body.html)
        : '';

      const yamlUrl = body.yaml
        ? await this.fileStorage.saveYaml(project.id, body.yaml)
        : '';

      const completedProject = Project.hydrate({
        ...project.toPrimitives(),

        html: htmlUrl,
        yaml: yamlUrl,
      });

      const result = await this.projectRepository.create(completedProject);

      this.metrics.increment('project.created.success');

      this.logger.info('PROJECT_CREATED', {
        projectId: result.id,
      });

      return result;
    } catch (error) {
      this.metrics.increment('project.created.error');

      throw error;
    }
  }
}
