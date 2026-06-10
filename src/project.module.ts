import { Module } from '@nestjs/common';

import { CreateProjectUseCase } from '@application/usecase/create-project.usecase';
import { DeleteProjectUseCase } from '@application/usecase/delete-project.usecase';
import { GetProjectByIdUseCase } from '@application/usecase/get-project-by-id.usecase';
import { ListProjectsUseCase } from '@application/usecase/list-projects.usecase';
import { UpdateProjectUseCase } from '@application/usecase/update-project.usecase';
import { ProjectController } from '@infrastructure/adapters/inbound/http/controllers/project.controller';
import { InMemoryProjectRepositoryImpl } from '@infrastructure/adapters/outbound/persistence/in-memory-project.repository';
import { ProjectRepositoryPortSymbol } from '@domain/ports/project.port';
import { FileStoragePortSymbol } from './domain/ports/file-storage.port';
import { LocalFileStorageRepositoryImpl } from './infrastructure/adapters/outbound/persistence/local-file-storage.repository';

@Module({
  controllers: [ProjectController],
  providers: [
    CreateProjectUseCase,
    ListProjectsUseCase,
    GetProjectByIdUseCase,
    UpdateProjectUseCase,
    DeleteProjectUseCase,
    {
      provide: ProjectRepositoryPortSymbol,
      useClass: InMemoryProjectRepositoryImpl,
    },
    {
      provide: FileStoragePortSymbol,
      useClass: LocalFileStorageRepositoryImpl,
    },
  ],
})
export class ProjectModule {}
