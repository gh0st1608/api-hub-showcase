import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Sample } from '@domain/entities/sample.entity';
import { SampleRepositoryPort } from '@domain/ports/sample.port';
import { PaginatedResult } from '@domain/ports/paginate.port';
import { GetByParamsDto } from '@application/dto/request/get-by-params.dto';

import { SampleModel } from '@infrastructure/adapters/outbound/persistence/models/sample.model';
import { SampleMapper } from '@infrastructure/adapters/outbound/persistence/mappers/sample.mapper';
import { SaveFailedException } from '@infrastructure/adapters/outbound/persistence/exceptions/save-failed.exception';
import { QueryFailedException } from '@infrastructure/adapters/outbound/persistence/exceptions/query-failed.exception';

@Injectable()
export class TypeOrmSampleRepositoryImpl implements SampleRepositoryPort {
  constructor(
    @InjectRepository(SampleModel)
    private readonly repo: Repository<SampleModel>,
  ) {}

  async create(sample: Sample): Promise<Sample> {
    try {
      const model = SampleMapper.toPersistence(sample);
      const saved = await this.repo.save(model);
      return SampleMapper.toDomain(saved);
    } catch {
      throw new SaveFailedException();
    }
  }

  async update(sample: Sample): Promise<Sample> {
    try {
      const existing = await this.repo.findOneBy({ id: sample.id });
      if (!existing) throw new QueryFailedException();
      const merged = this.repo.merge(existing, SampleMapper.toPersistence(sample));
      const saved = await this.repo.save(merged);
      return SampleMapper.toDomain(saved);
    } catch (err) {
      if (err instanceof QueryFailedException) throw err;
      throw new SaveFailedException();
    }
  }

  async findById(id: string): Promise<Sample | null> {
    try {
      const model = await this.repo.findOneBy({ id });
      return model ? SampleMapper.toDomain(model) : null;
    } catch {
      throw new QueryFailedException();
    }
  }

  async findAll(params: GetByParamsDto): Promise<PaginatedResult<Sample>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', order = 'asc' } = params;

    try {
      const qb = this.repo.createQueryBuilder('sample');

      if (search) {
        qb.where(
          'sample.name ILIKE :search OR sample.description ILIKE :search',
          { search: `%${search}%` },
        );
      }

      const validSortFields = ['name', 'createdAt'] as const;
      const safeSort = validSortFields.includes(sortBy as typeof validSortFields[number])
        ? sortBy
        : 'createdAt';

      qb.orderBy(`sample.${safeSort}`, order.toUpperCase() as 'ASC' | 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      const [rows, count] = await qb.getManyAndCount();
      const items = rows.map(SampleMapper.toDomain);
      const nextPage = (page - 1) * limit + rows.length < count ? page + 1 : null;

      return { items, count, nextPage };
    } catch {
      throw new QueryFailedException();
    }
  }
}
