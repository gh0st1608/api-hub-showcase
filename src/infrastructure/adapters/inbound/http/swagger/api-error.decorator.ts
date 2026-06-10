import { applyDecorators } from '@nestjs/common';
import { ApiResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { ErrorRegistry } from '@domain/errors/error-registry';
import { ErrorResponseDto } from '@application/dto/response/error-response.dto';

type RegistryKey = keyof typeof ErrorRegistry;

/**
 * Documents one or more error responses on a controller method using the
 * canonical envelope returned by `HttpExceptionFilter`. Examples are
 * generated automatically from `ErrorRegistry`, so docs and runtime
 * errors stay in sync.
 *
 * Usage:
 *   @ApiAppError('SAMPLE_NOT_FOUND', 'INVALID_PAYLOAD')
 */
export function ApiAppError(...keys: RegistryKey[]) {
  // Group keys by HTTP status — Swagger requires one @ApiResponse per status.
  const byStatus = keys.reduce<Record<number, RegistryKey[]>>((acc, key) => {
    const status = ErrorRegistry[key].httpStatus;
    (acc[status] ??= []).push(key);
    return acc;
  }, {});

  const decorators = Object.entries(byStatus).map(([status, statusKeys]) =>
    ApiResponse({
      status: Number(status),
      description: statusKeys
        .map((k) => `\`${ErrorRegistry[k].code}\` ${ErrorRegistry[k].title} — ${ErrorRegistry[k].message}`)
        .join('\n\n'),
      schema: { $ref: getSchemaPath(ErrorResponseDto) },
    }),
  );

  return applyDecorators(ApiExtraModels(ErrorResponseDto), ...decorators);
}
