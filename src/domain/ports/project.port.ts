import { GetByParamsDto } from '@application/dto/request/get-by-params.dto';
import { PaginatedResult } from './paginate.port';
import { Project } from '../entities/project.entity';

export interface ProjectRepositoryPort {
  create(project: Project): Promise<Project>;
  update(project: Project): Promise<Project>;
  delete(id: string): Promise<void>;
  findAll(query: GetByParamsDto): Promise<PaginatedResult<Project>>;
  findById(id: string): Promise<Project | null>;
}

export const ProjectRepositoryPortSymbol = Symbol('ProjectRepositoryPort');
