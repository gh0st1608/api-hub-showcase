import { FileStoragePort } from '@app/domain/ports/file-storage.port';
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class LocalFileStorageRepositoryImpl
  implements FileStoragePort
{
  private readonly uploadsRoot = join(
    process.cwd(),
    'uploads',
    'projects',
  );

  async saveHtml(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const folder = join(
      this.uploadsRoot,
      projectId,
    );

    await fs.mkdir(folder, {
      recursive: true,
    });

    const filePath = join(
      folder,
      'design.html',
    );

    await fs.writeFile(
      filePath,
      file.buffer,
    );

    return `/uploads/projects/${projectId}/design.html`;
  }

  async saveYaml(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const folder = join(
      this.uploadsRoot,
      projectId,
    );

    await fs.mkdir(folder, {
      recursive: true,
    });

    const filePath = join(
      folder,
      'openapi.yaml',
    );

    await fs.writeFile(
      filePath,
      file.buffer,
    );

    return `/uploads/projects/${projectId}/openapi.yaml`;
  }

  async deleteProject(
    projectId: string,
  ): Promise<void> {
    const folder = join(
      this.uploadsRoot,
      projectId,
    );

    await fs.rm(folder, {
      recursive: true,
      force: true,
    });
  }
}