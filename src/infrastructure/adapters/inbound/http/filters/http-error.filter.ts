import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';
import { HttpErrorMapper } from '@infrastructure/adapters/inbound/http/filters/http-error.mapper';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const error = HttpErrorMapper.map(exception, req);

    return res.status(error.httpStatus).json(error.body);
  }
}