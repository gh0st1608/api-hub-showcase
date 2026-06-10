import { GetByParamsDto } from '../../application/dto/request/get-by-params.dto';
import { Sample } from '../entities/sample.entity';
import { PaginatedResult } from './paginate.port';

export interface SampleRepositoryPort {
  create(sample: Sample): Promise<Sample>;
  update(sample: Sample): Promise<Sample>;
  findAll(query: GetByParamsDto): Promise<PaginatedResult<Sample>>;
  findById(id: string): Promise<Sample | null>;
}

export const SampleRepositoryPortSymbol = Symbol('SampleRepositoryPort');
