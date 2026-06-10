import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateProjectDto } from '@application/dto/request/create-project.dto';
import { GetByParamsDto } from '@application/dto/request/get-by-params.dto';
import { UpdateProjectDto } from '@application/dto/request/update-project.dto';
import { CreateProjectUseCase } from '@application/usecase/create-project.usecase';
import { DeleteProjectUseCase } from '@application/usecase/delete-project.usecase';
import { GetProjectByIdUseCase } from '@application/usecase/get-project-by-id.usecase';
import { ListProjectsUseCase } from '@application/usecase/list-projects.usecase';
import { UpdateProjectUseCase } from '@application/usecase/update-project.usecase';
import { Project } from '@domain/entities/project.entity';
import { PaginatedResult } from '@domain/ports/paginate.port';
import { multerConfig } from '@app/infrastructure/multer/config';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(
    @Inject(CreateProjectUseCase)
    private readonly createProject: CreateProjectUseCase,

    @Inject(ListProjectsUseCase)
    private readonly listProjects: ListProjectsUseCase,

    @Inject(GetProjectByIdUseCase)
    private readonly getProject: GetProjectByIdUseCase,

    @Inject(UpdateProjectUseCase)
    private readonly updateProject: UpdateProjectUseCase,

    @Inject(DeleteProjectUseCase)
    private readonly deleteProject: DeleteProjectUseCase,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'html', maxCount: 1 },
        { name: 'yaml', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a project',
    description: 'Creates a new project in the in-memory store.',
  })
  @ApiCreatedResponse({
    type: Project,
    description: 'Project created successfully',
  })
  async create(
    @UploadedFiles()
    files: {
      html?: Express.Multer.File[];
      yaml?: Express.Multer.File[];
    },
    @Body() body: CreateProjectDto,
  ): Promise<Project> {
    return this.createProject.execute({
      ...body,
      html: files.html?.[0],
      yaml: files.yaml?.[0],
    });
  }

  @Get()
  @ApiOperation({
    summary: 'List projects',
    description: 'Returns a paginated list of projects stored in memory.',
  })
  @ApiOkResponse({ description: 'Projects retrieved successfully' })
  async findAll(
    @Query() query: GetByParamsDto,
  ): Promise<PaginatedResult<Project>> {
    return this.listProjects.execute(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project by ID',
    description: 'Returns a single project by ID.',
  })
  @ApiOkResponse({ type: Project, description: 'Project found' })
  async getById(@Param('id') id: string): Promise<Project> {
    return this.getProject.execute(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a project',
    description: 'Updates a project stored in memory.',
  })
  @ApiOkResponse({ type: Project, description: 'Project updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProjectDto,
  ): Promise<Project> {
    return this.updateProject.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a project',
    description: 'Deletes a project from the in-memory store.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteProject.execute(id);
  }
}
