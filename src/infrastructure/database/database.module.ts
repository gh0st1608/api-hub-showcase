import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleModel } from '@infrastructure/adapters/outbound/persistence/models/sample.model';

/**
 * Owns the TypeORM connection. Import once in AppModule.
 *
 * Behaviour per environment:
 *   development → synchronize: true  (auto-creates / alters tables — never use in prod)
 *   production  → synchronize: false (migrations own the schema; SSL enforced)
 *   test        → synchronize: true, migrationsRun: false
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const isProd = process.env.NODE_ENV === 'production';
        const isDev = process.env.NODE_ENV === 'development';

        return {
          type: 'postgres',
          host: process.env.DB_HOST ?? 'localhost',
          port: Number(process.env.DB_PORT ?? 5432),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,

          entities: [SampleModel],

          migrations: ['dist/src/infrastructure/database/migrations/*.js'],
          migrationsRun: isProd,

          // Auto-sync only in dev. Never in production.
          synchronize: isDev,

          ssl: isProd ? { rejectUnauthorized: true } : false,
          logging: isDev ? ['query', 'error'] : ['error'],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
