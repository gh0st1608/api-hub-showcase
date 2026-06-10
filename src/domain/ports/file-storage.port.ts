export interface FileStoragePort {
  saveHtml(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<string>;

  saveYaml(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<string>;

  deleteProject(
    projectId: string,
  ): Promise<void>;
}

export const FileStoragePortSymbol =
  Symbol('FileStoragePort');