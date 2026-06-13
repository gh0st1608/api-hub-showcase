import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "@domain/entities/project.entity";

export interface ProjectRepositoryPort {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  create(input: CreateProjectInput): Promise<Project>;
  update(id: string, input: UpdateProjectInput): Promise<Project>;
  delete(id: string): Promise<void>;
  getPreviewUrl(id: string): Promise<string>;
}
