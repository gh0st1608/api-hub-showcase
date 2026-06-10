import { ErrorLayer } from '@app/domain/errors/error-layer';
import { InfrastructureException } from '@infrastructure/adapters/outbound/persistence/exceptions/infrastructure.exception';
import { ApplicationException } from '@application/exceptions/application.exception';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

type ErrorLayerValue = keyof typeof ErrorLayer;

export interface HttpErrorResponse {
  httpStatus: number;
  body: {
    Error: {
      code: number;
      httpStatus: number;
      dateTime: string;
      title: string;
      message: string;
      layer: ErrorLayerValue;
      path?: string;
      method?: string;
    };
    Data: null;
  };
}

export const HttpErrorMapper = {
  map(exception: any, req?: Request): HttpErrorResponse {
    const classification = classify(exception);

    return {
      httpStatus: classification.httpStatus,
      body: {
        Error: {
          code: classification.errorCode,
          httpStatus: classification.httpStatus,
          dateTime: new Date().toISOString(),
          title: classification.title,
          message: classification.message,
          layer: classification.layer,
          path: req?.url,
          method: req?.method,
        },
        Data: null,
      },
    };
  },
};

/* -----------------------------
   CLASSIFICATION ENGINE
------------------------------*/
function classify(exception: any): {
  httpStatus: number;
  errorCode: number;
  message: string;
  title: string;
  layer: ErrorLayerValue;
} {

  if (exception instanceof ApplicationException) {
    return {
      httpStatus: exception.httpStatus,
      errorCode: exception.errorCode,
      message: exception.message,
      title: exception.title,
      layer: exception.layer as ErrorLayerValue,
    };
  }

  if (exception instanceof InfrastructureException) {
    return {
      httpStatus: exception.httpStatus,
      errorCode: exception.errorCode,
      message: exception.message,
      title: exception.title,
      layer: exception.layer as ErrorLayerValue,
    };
  }

  // Manejo explícito de errores de validación (BadRequestException)
  if (exception instanceof BadRequestException) {
    const response = exception.getResponse() as any;
    return {
      httpStatus: 400,
      errorCode: 1001, // Código propio para validación
      message: Array.isArray(response.message) ? response.message.join('; ') : response.message,
      title: 'Validation error',
      layer: 'APPLICATION' as ErrorLayerValue,
    };
  }

  // ⚪ UNKNOWN (bugs / runtime / null pointer)
  return {
    httpStatus: 500,
    errorCode: 9999,
    message: 'Internal server error',
    title: 'Unexpected error',
    layer: 'UNKNOWN' as ErrorLayerValue,
  };
}
