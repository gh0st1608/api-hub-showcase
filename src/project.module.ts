import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateProjectUseCase } from '@application/usecase/create-project.usecase';
import { DeleteProjectUseCase } from '@application/usecase/delete-project.usecase';
import { GetProjectByIdUseCase } from '@application/usecase/get-project-by-id.usecase';
import { ListProjectsUseCase } from '@application/usecase/list-projects.usecase';
import { UpdateProjectUseCase } from '@application/usecase/update-project.usecase';
import { ProjectController } from '@infrastructure/adapters/inbound/http/controllers/project.controller';
import { InMemoryProjectRepositoryImpl } from '@infrastructure/adapters/outbound/persistence/in-memory-project.repository';
import { S3FileStorageRepositoryImpl } from '@infrastructure/adapters/outbound/persistence/s3-file-storage.repository';
//import { TypeOrmProjectRepositoryImpl } from '@infrastructure/adapters/outbound/persistence/typeorm-project.repository';
//import { ProjectModel } from '@infrastructure/adapters/outbound/persistence/models/project.model';
import { ProjectRepositoryPortSymbol } from '@domain/ports/project.port';
import { FileStoragePortSymbol } from './domain/ports/file-storage.port';
import { LocalFileStorageRepositoryImpl } from './infrastructure/adapters/outbound/persistence/local-file-storage.repository';
import { DynamoProjectRepositoryImpl } from './infrastructure/adapters/outbound/persistence/dynamo-project.repository';
import { DynamoDbModule } from '@infrastructure/database/dynamo.module';
import { S3Module } from '@infrastructure/storage/s3.module';
import { GetProjectPreviewUseCase } from './application/usecase/get-project-preview.usecase';

const projectRepositoryDriver = process.env.PROJECT_REPOSITORY_DRIVER;

const fileStorageDriver = process.env.FILE_STORAGE_DRIVER;

const repositoryProviders =
  projectRepositoryDriver === 'dynamo'
    ? [
        DynamoProjectRepositoryImpl,
        {
          provide: ProjectRepositoryPortSymbol,
          useExisting: DynamoProjectRepositoryImpl,
        },
      ]
    : [
        InMemoryProjectRepositoryImpl,
        {
          provide: ProjectRepositoryPortSymbol,
          useExisting: InMemoryProjectRepositoryImpl,
        },
      ];

const fileStorageProviders =
  fileStorageDriver === 's3'
    ? [
        S3FileStorageRepositoryImpl,
        {
          provide: FileStoragePortSymbol,
          useExisting: S3FileStorageRepositoryImpl,
        },
      ]
    : [
        LocalFileStorageRepositoryImpl,
        {
          provide: FileStoragePortSymbol,
          useExisting: LocalFileStorageRepositoryImpl,
        },
      ];
const moduleImports = [
  ...(projectRepositoryDriver === 'dynamo' ? [DynamoDbModule] : []),

  ...(fileStorageDriver === 's3' ? [S3Module] : []),
];

@Module({
  imports: moduleImports,
  controllers: [ProjectController],
  providers: [
    CreateProjectUseCase,
    ListProjectsUseCase,
    GetProjectByIdUseCase,
    UpdateProjectUseCase,
    DeleteProjectUseCase,
    GetProjectPreviewUseCase,
    ...repositoryProviders,
    ...fileStorageProviders,
  ],
})
export class ProjectModule {}
