import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SampleModel } from '@infrastructure/adapters/outbound/persistence/models/sample.model';

/**
 * TypeORM CLI DataSource — used only by migration commands, not by the app.
 *
 *   npm run migration:generate -- src/infrastructure/database/migrations/CreateSamples
 *   npm run migration:run
 *   npm run migration:revert
 */
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [SampleModel],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
});
