import { Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Module({
  providers: [
    {
      provide: DynamoDBDocumentClient,
      useFactory: () => {
        const client = new DynamoDBClient({
          region: process.env.AWS_REGION,
        });

        return DynamoDBDocumentClient.from(client);
      },
    },
  ],
  exports: [DynamoDBDocumentClient],
})
export class DynamoDbModule {}