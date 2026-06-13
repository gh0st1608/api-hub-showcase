// src/main.ts
import 'dotenv/config';
import './bootstrap/otel';
import { createApp } from './bootstrap/create-app';

async function init() {
  const { app } = await createApp({
    serveLocalUploads: (process.env.FILE_STORAGE_DRIVER ?? 'local') === 'local',
  });

  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);

  // Graceful shutdown — ECS sends SIGTERM before SIGKILL (default stopTimeout: 30s)
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received — shutting down gracefully`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

init().catch(err => {
  console.error('Fatal error during bootstrap', err);
  process.exit(1);
});

