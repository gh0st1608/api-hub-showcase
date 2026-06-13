import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileStoragePort } from '@app/domain/ports/file-storage.port';
import { Inject, Injectable } from '@nestjs/common';
import { S3_CLIENT } from '@infrastructure/storage/s3.module';

@Injectable()
export class S3FileStorageRepositoryImpl
  implements FileStoragePort
{
  private readonly bucket = process.env.AWS_S3_BUCKET!;

  constructor(
    @Inject(S3_CLIENT)
    private readonly client: S3Client,
  ) {}

  async saveHtml(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const key = this.buildKey(
      projectId,
      'design.html',
    );

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType:
          file.mimetype ??
          'text/html; charset=utf-8',
      }),
    );

    return key;
  }

  async saveYaml(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const key = this.buildKey(
      projectId,
      'openapi.yaml',
    );

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType:
          file.mimetype ??
          'application/yaml',
      }),
    );

    return key;
  }

  async generateSignedUrl(
    key: string,
    expiresIn = 60,
  ): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
      {
        expiresIn,
      },
    );
  }

  async deleteProject(
    projectId: string,
  ): Promise<void> {
    const prefix = `projects/${projectId}/`;

    const listed = await this.client.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
      }),
    );

    const objects = listed.Contents?.flatMap(
      item =>
        item.Key
          ? [{ Key: item.Key }]
          : [],
    );

    if (!objects?.length) {
      return;
    }

    await this.client.send(
      new DeleteObjectsCommand({
        Bucket: this.bucket,
        Delete: {
          Objects: objects,
          Quiet: true,
        },
      }),
    );
  }

  private buildKey(
    projectId: string,
    fileName: string,
  ): string {
    return `projects/${projectId}/${fileName}`;
  }
}