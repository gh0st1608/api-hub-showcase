import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ErrorPort, ErrorPortSymbol } from '@application/ports/error.port';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAppError } from '@infrastructure/adapters/inbound/http/swagger/api-error.decorator';
import { ApiBearer } from '@infrastructure/adapters/inbound/http/swagger/api-bearer-auth.decorator';
import { CurrentUser } from '@infrastructure/adapters/inbound/http/auth/decorators/current-user.decorator';
import { Authorize } from '@infrastructure/adapters/inbound/http/auth/decorators/authorize.decorator';
import { RequireCognitoGroups } from '@infrastructure/adapters/inbound/http/auth/decorators/require-cognito-groups.decorator';
import { RequireAzureRoles } from '@infrastructure/adapters/inbound/http/auth/decorators/require-azure-roles.decorator';
import { AuthenticatedUser } from '@domain/entities/authenticated-user.entity';
import { CreateSampleUseCase } from '@application/usecase/create-sample.usecase';
import { ListSamplesUseCase } from '@application/usecase/list-samples.usecase';
import { GetSampleByIdUseCase } from '@application/usecase/get-sample-by-id.usecase';
import { UpdateSampleUseCase } from '@application/usecase/update-sample.usecase';
import { CreateSampleDto } from '@application/dto/request/create-sample.dto';
import { UpdateSampleDto } from '@application/dto/request/update-sample.dto';
import { GetByParamsDto } from '@application/dto/request/get-by-params.dto';
import { Sample } from '@domain/entities/sample.entity';
import { GetSamplesResult } from '@application/dto/response/response-custom.dto';

@ApiTags('Samples')
@ApiBearer()
@Controller('samples')
export class SampleController {
  constructor(
    @Inject(CreateSampleUseCase)
    private readonly createSample: CreateSampleUseCase,

    @Inject(ListSamplesUseCase)
    private readonly listSamples: ListSamplesUseCase,

    @Inject(GetSampleByIdUseCase)
    private readonly getSample: GetSampleByIdUseCase,

    @Inject(UpdateSampleUseCase)
    private readonly updateSample: UpdateSampleUseCase,
    @Inject(ErrorPortSymbol)
    private readonly errorPort: ErrorPort,
  ) {}
  // Endpoint para forzar un error y probar la visualización en New Relic
  @Get('force-error')
  @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
  @ApiOperation({ summary: 'Forzar un error', description: 'Endpoint para probar la captura y visualización de errores en New Relic.' })
  async forceError(): Promise<void> {
    try {
      throw new Error('Error forzado para prueba de observabilidad');
    } catch (error) {
      this.errorPort.captureError(error as Error, { customKey: 'valor de prueba' });
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireCognitoGroups('viewer', 'admin')
  @RequireAzureRoles('viewer', 'admin')
  @Authorize({ action: 'create', resource: 'sample' })
  @ApiOperation({ summary: 'Create a sample', description: 'Creates a new sample resource and returns it.' })
  @ApiCreatedResponse({ type: Sample, description: 'Sample created successfully' })
  @ApiAppError('INVALID_PAYLOAD', 'SAVE_FAILED')
  async create(@Body() body: CreateSampleDto): Promise<Sample> {
    return this.createSample.execute(body);
  }

  @Get('claims/probe/cognito')
  @Authorize({ action: 'read', resource: 'sample' })
  @RequireCognitoGroups('viewer', 'admin')
  @ApiOperation({
    summary: 'Probe Cognito claim validation',
    description: 'Returns 200 only if cognito:groups contains viewer or admin.',
  })
  @ApiOkResponse({
    description: 'Cognito claim validated',
    schema: {
      example: {
        ok: true,
        provider: 'cognito',
        requiredClaim: 'cognito:groups',
      },
    },
  })
  async probeCognitoClaim(): Promise<{ ok: boolean; provider: 'cognito'; requiredClaim: 'cognito:groups' }> {
    return {
      ok: true,
      provider: 'cognito',
      requiredClaim: 'cognito:groups',
    };
  }

  @Get('claims/probe/azure')
  @Authorize({ action: 'read', resource: 'sample' })
  @RequireAzureRoles('viewer', 'admin')
  @ApiOperation({
    summary: 'Probe Azure claim validation',
    description: 'Returns 200 only if roles contains viewer or admin.',
  })
  @ApiOkResponse({
    description: 'Azure claim validated',
    schema: {
      example: {
        ok: true,
        provider: 'azure',
        requiredClaim: 'roles',
      },
    },
  })
  async probeAzureClaim(): Promise<{ ok: boolean; provider: 'azure'; requiredClaim: 'roles' }> {
    return {
      ok: true,
      provider: 'azure',
      requiredClaim: 'roles',
    };
  }

  @Get()
  @Authorize({ action: 'read', resource: 'sample' })
  @ApiOperation({ summary: 'List samples', description: 'Returns a paginated, optionally filtered list of samples.' })
  @ApiOkResponse({ type: GetSamplesResult, description: 'Paginated list of samples' })
  @ApiAppError('QUERY_FAILED', 'DATABASE_ERROR')
  async findAll(@Query() query: GetByParamsDto): Promise<GetSamplesResult> {
    return this.listSamples.execute(query);
  }

  @Get(':id')
  @Authorize({ action: 'read', resource: 'sample' })
  @ApiOperation({ summary: 'Get sample by ID', description: 'Fetches a single sample by its UUID. Returns 404 (error code 1000) when not found.' })
  @ApiOkResponse({ type: Sample, description: 'Sample found' })
  @ApiAppError('SAMPLE_NOT_FOUND', 'QUERY_FAILED')
  async getById(
    @Param('id') id: string,
    @CurrentUser() _user: AuthenticatedUser,
  ): Promise<Sample> {
    return this.getSample.execute(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Authorize({ action: 'write', resource: 'sample' })
  @ApiOperation({ summary: 'Update a sample', description: 'Partially updates an existing sample and publishes a sample.updated event.' })
  @ApiOkResponse({ type: Sample, description: 'Sample updated successfully' })
  @ApiAppError('SAMPLE_NOT_FOUND', 'SAVE_FAILED')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateSampleDto,
  ): Promise<Sample> {
    return this.updateSample.execute(id, body);
  }
}

