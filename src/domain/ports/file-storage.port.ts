export interface FileStoragePort {
  saveHtml(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<string>;

  saveYaml(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<string>;

  generateSignedUrl(
    key: string,
    expiresIn?: number,
  ): Promise<string>;

  deleteProject(
    projectId: string,
  ): Promise<void>;
}

export const FileStoragePortSymbol =
  Symbol('FileStoragePort');