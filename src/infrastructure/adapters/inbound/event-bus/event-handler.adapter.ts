import { Controller, Post, Body, Headers, Res, HttpStatus, Inject } from '@nestjs/common';
import { Response } from 'express';
import { SampleUpdatedHandler } from '@application/event-handlers/sample-updated.handler';
import { SampleCreatedHandler } from '@application/event-handlers/sample-created.handler';
import { Public } from '../http/auth/decorators/public.decorator';
import { HTTP } from 'cloudevents';

/**
 * EventBusHandlerAdapter
 * Controlador para recibir eventos del event bus y delegar al dominio.
 * Puedes inyectar aquí tus use cases o handlers de dominio.
 */
@Controller('eventbus')
export class EventBusHandlerAdapter {
  constructor(
    @Inject(SampleCreatedHandler)
    private readonly sampleCreatedHandler: SampleCreatedHandler,
    @Inject(SampleUpdatedHandler)
    private readonly sampleUpdatedHandler: SampleUpdatedHandler,
  ) {}

  /**
   * Recibe eventos sample-updated en formato CloudEvent, envelope o plano.
   * Soporta HTTP binding profesional usando la librería oficial.
   */
  @Post('sample-updated')
  @Public()
  async handleSampleUpdated(@Body() body: any, @Headers() headers: any, @Res() res: Response) {
    let payload = body;
    let eventId = undefined;
    try {
      console.log('🔍 Intentando parsear evento como CloudEvent usando HTTP binding...');
      const ce = HTTP.toEvent({ headers, body });
      const eventObj = Array.isArray(ce) ? ce[0] : ce;
      payload = eventObj.data;
      eventId = eventObj.id;
    } catch {
      payload = body?.specversion && body?.data ? body.data : (body.payload || body);
      eventId = body?.id || body?.eventId;
    }
    await this.sampleUpdatedHandler.handle({ ...payload, eventId });
    res.status(HttpStatus.OK).send();
  }


  /**
   * Recibe eventos sample-created en formato CloudEvent, envelope o plano.
   * Soporta HTTP binding profesional usando la librería oficial.
   */
  @Post('sample-created')
  @Public()
  async handleSampleCreated(@Body() body: any, @Headers() headers: any, @Res() res: Response) {
    let payload = body;
    let eventId = undefined;
    try {
      const ce = HTTP.toEvent({ headers, body });
      const eventObj = Array.isArray(ce) ? ce[0] : ce;
      payload = eventObj.data;
      eventId = eventObj.id;
    } catch {
      payload = body?.specversion && body?.data ? body.data : (body.payload || body);
      eventId = body?.id || body?.eventId;
    }
    await this.sampleCreatedHandler.handle({ ...payload, eventId });
    res.status(HttpStatus.OK).send();
  }
}
