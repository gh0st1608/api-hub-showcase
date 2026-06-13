import { FileStoragePort, FileStoragePortSymbol } from "@app/domain/ports/file-storage.port";
import { ProjectRepositoryPort, ProjectRepositoryPortSymbol } from "@app/domain/ports/project.port";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ProjectPreviewResponseDto } from "../dto/response/response-custom.dto";
import { ProjectNotFoundException } from "../exceptions/project-not-found.exception";

@Injectable()
export class GetProjectPreviewUseCase {
  constructor(
    @Inject(ProjectRepositoryPortSymbol)
    private readonly projectRepository: ProjectRepositoryPort,

    @Inject(FileStoragePortSymbol)
    private readonly fileStorage: FileStoragePort,
  ) {}

  async execute(
    id: string,
  ): Promise<ProjectPreviewResponseDto> {
    const project =
      await this.projectRepository.findById(id);

    if (!project) throw new ProjectNotFoundException();

    const url =
      await this.fileStorage.generateSignedUrl(
        project.html,
      );

    return {
      url,
    };
  }
}