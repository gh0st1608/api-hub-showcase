import { Global, Module } from '@nestjs/common';
import { EventBusPortSymbol } from '@application/ports/event-bus.port';
import { SnsEventBusAdapter } from '@infrastructure/adapters/outbound/event-bus/sns.event-bus.adapter';
import { EventBusHandlerAdapter } from '@infrastructure/adapters/inbound/event-bus/event-handler.adapter';
import { SampleCreatedHandler } from '@application/event-handlers/sample-created.handler';
import { SampleUpdatedHandler } from '@application/event-handlers/sample-updated.handler';

@Global()
@Module({
  controllers: [EventBusHandlerAdapter],
  providers: [
    SnsEventBusAdapter,
    // ── Step 1: register handlers as providers ────────────────────────────
    SampleCreatedHandler,
    SampleUpdatedHandler,
    // ── Bind EventBusPort → SNS implementation ─────────────────────────────
    {
      provide: EventBusPortSymbol,
      useClass: SnsEventBusAdapter,
    },
  ],
  exports: [EventBusPortSymbol],
})
export class EventModule {}
