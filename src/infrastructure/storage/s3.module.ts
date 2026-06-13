import { Module } from '@nestjs/common';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

export const S3_CLIENT = 'S3_CLIENT';

@Module({
  providers: [
    {
      provide: S3_CLIENT,
      useFactory: () => {
        const config: S3ClientConfig = {
          region: process.env.AWS_REGION ?? 'us-east-1',
          forcePathStyle:
            process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
        };

        if (process.env.AWS_S3_ENDPOINT) {
          config.endpoint = process.env.AWS_S3_ENDPOINT;
        }

        return new S3Client(config);
      },
    },
  ],
  exports: [S3_CLIENT],
})
export class S3Module {}