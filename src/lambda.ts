import 'dotenv/config';
import './bootstrap/otel';
import serverlessExpress from '@codegenie/serverless-express';
import {
  APIGatewayProxyEventV2,
  Callback,
  Context,
  Handler,
} from 'aws-lambda';
import { createApp } from './bootstrap/create-app';

let cachedServer:
  | Handler<APIGatewayProxyEventV2, unknown>
  | undefined;

async function bootstrap() {
  const { expressApp } = await createApp({
    serveLocalUploads: false,
  });

  return serverlessExpress({
    app: expressApp,
  });
}

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback,
) => {
  cachedServer ??= await bootstrap();
  return cachedServer(event, context, callback);
};
