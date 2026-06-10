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
  items?: ProjectApiResponse[];
  count?: number;
  nextPage?: number | null;
  projects?: ProjectApiResponse[];
  statusCode?: number;
  message?: string;
}

interface SingleProjectResponse {
  project?: ProjectApiResponse;
  item?: ProjectApiResponse;
  statusCode?: number;
  message?: string;
}

interface CreateProjectResponse {
  project?: ProjectApiResponse;
  item?: ProjectApiResponse;
  projectId?: string;
  statusCode?: number;
  message?: string;
}

function extractProject(response: unknown): ProjectApiResponse | null {
  if (!response || typeof response !== "object") return null;

  const candidate = response as {
    project?: ProjectApiResponse;
    item?: ProjectApiResponse;
    id?: string;
    title?: string;
    group?: string;
  };

  if (candidate.project) return candidate.project;
  if (candidate.item) return candidate.item;
  if (candidate.id && candidate.title) return candidate as ProjectApiResponse;

  return null;
}

export class ProjectApiRepository implements ProjectRepositoryPort {
  constructor(private readonly httpClient: HttpClientPort) {}

  async findAll(): Promise<Project[]> {
    const response =
      await this.httpClient.get<ListProjectsResponse>("/projects");

    const items = response.items ?? response.projects ?? [];
    return items.map((item) =>
      Project.hydrate({
        ...item,
        tags: typeof item.tags === "string" ? JSON.parse(item.tags) : item.tags,
      })
    );
  }

  async findById(id: string): Promise<Project | null> {
    try {
      const response = await this.httpClient.get<SingleProjectResponse>(
        `/projects/${id}`
      );
      const project = extractProject(response);

      return project ? Project.hydrate(project) : null;
    } catch {
      return null;
    }
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const formData = new FormData();

    formData.append("group", input.group);
    formData.append("title", input.title);
    formData.append("description", input.description);
    formData.append("link", input.link);

    formData.append("html", input.html);
    formData.append("yaml", input.yaml);

    formData.append("tags", JSON.stringify(input.tags));

    const createResponse = await this.httpClient.post<CreateProjectResponse>(
      "/projects",
      formData
    );

    const project =
      extractProject(createResponse) ??
      (createResponse.projectId
        ? await this.httpClient
            .get<SingleProjectResponse>(`/projects/${createResponse.projectId}`)
            .then((response) => extractProject(response))
        : null);

    if (!project) {
      throw new Error("No project returned from backend");
    }

    return Project.hydrate(project);
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const formData = new FormData();

    if (input.group) formData.append("group", input.group);

    if (input.title) formData.append("title", input.title);

    if (input.description) formData.append("description", input.description);

    if (input.link) formData.append("link", input.link);

    if (input.html) {
      formData.append("html", input.html);
    }

    if (input.yaml) {
      formData.append("yaml", input.yaml);
    }

    if (input.tags) {
      formData.append("tags", JSON.stringify(input.tags));
    }

    const response = await this.httpClient.patch<SingleProjectResponse>(
      `/projects/${id}`,
      formData
    );

    const project = extractProject(response);

    if (!project) {
      throw new Error("No project returned from backend");
    }

    return Project.hydrate(project);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete<unknown>(`/projects/${id}`);
  }
}
