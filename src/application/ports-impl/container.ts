import { FetchHttpClient } from "@infrastructure/api/fetch-http-client";
import { ProjectApiRepository } from "@infrastructure/adapters/project-api-repository";
import { ListProjectsUseCase } from "@application/usecases/list-projects.usecase";
import { GetProjectByIdUseCase } from "@application/usecases/get-project-by-id.usecase";
import { CreateProjectUseCase } from "@application/usecases/create-project.usecase";
import { UpdateProjectUseCase } from "@application/usecases/update-project.usecase";
import { DeleteProjectUseCase } from "@application/usecases/delete-project.usecase";

const httpClient = new FetchHttpClient();
const projectRepository = new ProjectApiRepository(httpClient);

export const container = {
  projects: {
    list: new ListProjectsUseCase(projectRepository),
    getById: new GetProjectByIdUseCase(projectRepository),
    create: new CreateProjectUseCase(projectRepository),
    update: new UpdateProjectUseCase(projectRepository),
    delete: new DeleteProjectUseCase(projectRepository),
  },
};
