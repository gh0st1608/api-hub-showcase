import {
  Project,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "@domain/entities/project.entity";
import type { ProjectRepositoryPort } from "@domain/ports/project-repository-port";
import type { HttpClientPort } from "@domain/ports/http-client-port";

interface ProjectApiResponse {
  id: string;
  group: string;
  title: string;
  description: string;
  link: string;
  html: string;
  yaml: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ListProjectsResponse {
  projects: ProjectApiResponse[];
  statusCode: number;
  message: string;
}

interface SingleProjectResponse {
  project: ProjectApiResponse;
  statusCode: number;
  message: string;
}

interface CreateProjectResponse {
  project: { projectId: string };
  statusCode: number;
  message: string;
}

function normalizeFileValue(value: File | string | undefined): string {
  if (value instanceof File) {
    return `/designs/sdc/${value.name}`;
  }

  if (typeof value !== "string") return "";

  if (/^(\/|https?:)/.test(value)) return value;
  return `/designs/sdc/${value.replace(/^\.\//, "")}`;
}

export class ProjectApiRepository implements ProjectRepositoryPort {
  constructor(private readonly httpClient: HttpClientPort) {}

  async findAll(): Promise<Project[]> {
    const response =
      await this.httpClient.get<ListProjectsResponse>("/projects");
    return response.projects.map((item) => Project.hydrate(item));
  }

  async findById(id: string): Promise<Project | null> {
    try {
      const response = await this.httpClient.get<SingleProjectResponse>(
        `/projects/${id}`
      );
      return Project.hydrate(response.project);
    } catch {
      return null;
    }
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const createResponse = await this.httpClient.post<CreateProjectResponse>(
      "/projects",
      {
        ...input,
        html: normalizeFileValue(input.html),
        yaml: normalizeFileValue(input.yaml),
      }
    );
    const projectId = createResponse.project.projectId;
    const response = await this.httpClient.get<SingleProjectResponse>(
      `/projects/${projectId}`
    );
    return Project.hydrate(response.project);
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const response = await this.httpClient.patch<SingleProjectResponse>(
      `/projects/${id}`,
      {
        ...input,
        html:
          input.html === undefined ? undefined : normalizeFileValue(input.html),
        yaml:
          input.yaml === undefined ? undefined : normalizeFileValue(input.yaml),
      }
    );
    return Project.hydrate(response.project);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete<unknown>(`/projects/${id}`);
  }
}
