import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetByParamsDto } from '@application/dto/request/get-by-params.dto';
import { Project } from '@domain/entities/project.entity';
import { PaginatedResult } from '@domain/ports/paginate.port';
import { ProjectRepositoryPort } from '@domain/ports/project.port';
import { ProjectMapper } from '@infrastructure/adapters/outbound/persistence/mappers/project.mapper';
import { ProjectModel } from '@infrastructure/adapters/outbound/persistence/models/project.model';
import { QueryFailedException } from '@infrastructure/adapters/outbound/persistence/exceptions/query-failed.exception';
import { SaveFailedException } from '@infrastructure/adapters/outbound/persistence/exceptions/save-failed.exception';

@Injectable()
export class TypeOrmProjectRepositoryImpl
  implements ProjectRepositoryPort
{
  constructor(
    @InjectRepository(ProjectModel)
    private readonly repo: Repository<ProjectModel>,
  ) {}

  async create(project: Project): Promise<Project> {
    try {
      const saved = await this.repo.save(ProjectMapper.toPersistence(project));
      return ProjectMapper.toDomain(saved);
    } catch {
      throw new SaveFailedException();
    }
  }

  async update(project: Project): Promise<Project> {
    try {
      const existing = await this.repo.findOneBy({ id: project.id });
      if (!existing) {
        throw new QueryFailedException();
      }

      const merged = this.repo.merge(
        existing,
        ProjectMapper.toPersistence(project),
      );
      const saved = await this.repo.save(merged);
      return ProjectMapper.toDomain(saved);
    } catch (error) {
      if (error instanceof QueryFailedException) {
        throw error;
      }

      throw new SaveFailedException();
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repo.delete({ id });
    } catch {
      throw new QueryFailedException();
    }
  }

  async findAll(
    params: GetByParamsDto,
  ): Promise<PaginatedResult<Project>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      order = 'asc',
    } = params;

    try {
      const qb = this.repo.createQueryBuilder('project');

      if (search) {
        qb.where(
          `project.title ILIKE :search
           OR project.group_name ILIKE :search
           OR project.description ILIKE :search`,
          { search: `%${search}%` },
        );
      }

      const sortFieldMap = {
        title: 'project.title',
        group: 'project.group_name',
        createdAt: 'project.createdAt',
        updatedAt: 'project.updatedAt',
      } as const;

      const safeSort =
        sortFieldMap[sortBy as keyof typeof sortFieldMap] ??
        sortFieldMap.createdAt;

      qb.orderBy(safeSort, order.toUpperCase() as 'ASC' | 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      const [rows, count] = await qb.getManyAndCount();
      const items = rows.map(ProjectMapper.toDomain);
      const nextPage =
        (page - 1) * limit + rows.length < count ? page + 1 : null;

      return { items, count, nextPage };
    } catch {
      throw new QueryFailedException();
    }
  }

  async findById(id: string): Promise<Project | null> {
    try {
      const model = await this.repo.findOneBy({ id });
      return model ? ProjectMapper.toDomain(model) : null;
    } catch {
      throw new QueryFailedException();
    }
  }
}
