import {
  MigrationInterface,
  QueryRunner,
  Table,
} from 'typeorm';

export class CreateProjectsTable2026061200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'projects',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'group_name',
            type: 'varchar',
            length: '120',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'link',
            type: 'text',
          },
          {
            name: 'html',
            type: 'text',
            default: `''`,
          },
          {
            name: 'yaml',
            type: 'text',
            default: `''`,
          },
          {
            name: 'tags',
            type: 'jsonb',
            default: `'[]'::jsonb`,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('projects');
  }
}
