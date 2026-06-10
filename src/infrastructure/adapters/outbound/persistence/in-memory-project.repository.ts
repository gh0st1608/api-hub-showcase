import { Injectable } from '@nestjs/common';

import { GetByParamsDto } from '@application/dto/request/get-by-params.dto';
import { SaveFailedException } from '@infrastructure/adapters/outbound/persistence/exceptions/save-failed.exception';
import { Project } from '@domain/entities/project.entity';
import { ProjectRepositoryPort } from '@domain/ports/project.port';
import { PaginatedResult } from '@domain/ports/paginate.port';

@Injectable()
export class InMemoryProjectRepositoryImpl implements ProjectRepositoryPort {
  private readonly projects = new Map<string, Project>();

  async create(project: Project): Promise<Project> {
    try {
      this.projects.set(project.id, project);
      return project;
    } catch {
      throw new SaveFailedException();
    }
  }

  async update(project: Project): Promise<Project> {
    if (!this.projects.has(project.id)) throw new SaveFailedException();
    this.projects.set(project.id, project);
    return project;
  }

  async delete(id: string): Promise<void> {
    this.projects.delete(id);
  }

  async findById(id: string): Promise<Project | null> {
    return this.projects.get(id) ?? null;
  }

  async findAll(params: GetByParamsDto): Promise<PaginatedResult<Project>> {
    const { page = 1, limit = 10, search } = params;

    let filtered = Array.from(this.projects.values());

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(term) ||
        project.group.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term),
      );
    }

    const count = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);
    const nextPage = start + limit < count ? page + 1 : null;

    return { items, count, nextPage };
  }
}
