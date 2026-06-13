import { GetByParamsDto } from '@app/application/dto/request/get-by-params.dto';
import { Project } from '@app/domain/entities/project.entity';
import { PaginatedResult } from '@app/domain/ports/paginate.port';
import { ProjectRepositoryPort } from '@app/domain/ports/project.port';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable } from '@nestjs/common';
import { ProjectItem, ProjectMapper } from './mappers/project.mapper';
import { SaveFailedException } from './exceptions/save-failed.exception';
import { QueryFailedException } from './exceptions/query-failed.exception';

@Injectable()
export class DynamoProjectRepositoryImpl implements ProjectRepositoryPort {
  constructor(
    @Inject(DynamoDBDocumentClient)
    private readonly dynamoClient: DynamoDBDocumentClient,
  ) {}
  async findAll(params: GetByParamsDto): Promise<PaginatedResult<Project>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      order = 'asc',
    } = params;

    try {
      const result = await this.dynamoClient.send(
        new ScanCommand({
          TableName: this.tableName,
        }),
      );

      let items = (result.Items ?? []).map((item) =>
        ProjectMapper.toDomain(item as ProjectItem),
      );

      if (search) {
        const searchTerm = search.toLowerCase();

        items = items.filter(
          (project) =>
            project.title?.toLowerCase().includes(searchTerm) ||
            project.group?.toLowerCase().includes(searchTerm) ||
            project.description?.toLowerCase().includes(searchTerm),
        );
      }

      items.sort((a: any, b: any) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (aValue < bValue) {
          return order === 'asc' ? -1 : 1;
        }

        if (aValue > bValue) {
          return order === 'asc' ? 1 : -1;
        }

        return 0;
      });

      const count = items.length;

      const start = (page - 1) * limit;

      const paginatedItems = items.slice(start, start + limit);

      const nextPage = start + limit < count ? page + 1 : null;

      return {
        items: paginatedItems,
        count,
        nextPage,
      };
    } catch (error) {
      console.error('Error listing projects:', error);

      throw new QueryFailedException();
    }
  }

  private readonly tableName = process.env.PROJECTS_TABLE_NAME!;

  async create(project: Project): Promise<Project> {
    try {
      const item = ProjectMapper.toPersistence(project);

      await this.dynamoClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: item,
          ConditionExpression: 'attribute_not_exists(id)',
        }),
      );

      return project;
    } catch (error) {
      throw new SaveFailedException();
    }
  }

  async findById(id: string): Promise<Project | null> {
    try {
      const result = await this.dynamoClient.send(
        new GetCommand({
          TableName: this.tableName,
          Key: {
            projectId: id,
          },
        }),
      );

      if (!result.Item) {
        return null;
      }

      return ProjectMapper.toDomain(result.Item as ProjectItem);
    } catch {
      throw new QueryFailedException();
    }
  }

  async update(project: Project): Promise<Project> {
    try {
      const exists = await this.findById(project.id);

      if (!exists) {
        throw new QueryFailedException();
      }

      await this.dynamoClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: ProjectMapper.toPersistence(project),
        }),
      );

      return project;
    } catch (error) {
      if (error instanceof QueryFailedException) {
        throw error;
      }

      throw new SaveFailedException();
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.dynamoClient.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: {
            projectId: id,
          },
        }),
      );

    } catch (error) {
      throw new QueryFailedException();
    }
  }
}
