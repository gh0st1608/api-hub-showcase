import { Inject, Injectable } from '@nestjs/common';
import { Sample } from '@domain/entities/sample.entity';
import { SampleRepositoryPort, SampleRepositoryPortSymbol } from '@domain/ports/sample.port';
import { CreateSampleDto } from '@application/dto/request/create-sample.dto';
import { MetricsPort, MetricsPortSymbol } from '@application/ports/metrics.port';
import { LoggingPort, LoggingPortSymbol } from '@application/ports/logging.port';
import { EventBusPort, EventBusPortSymbol } from '@application/ports/event-bus.port';
import { SampleCreatedEvent } from '@domain/events/sample-created.event';

@Injectable()
export class CreateSampleUseCase {
  constructor(
    @Inject(SampleRepositoryPortSymbol)
    private readonly sampleRepository: SampleRepositoryPort,

    @Inject(MetricsPortSymbol)
    private readonly metrics: MetricsPort,

    @Inject(LoggingPortSymbol)
    private readonly logger: LoggingPort,

    @Inject(EventBusPortSymbol)
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(body: CreateSampleDto): Promise<Sample> {
    try {
      const sample = new Sample(
        crypto.randomUUID(),
        body.name,
        body.description,
      );

      const result = await this.sampleRepository.create(sample);
      await this.eventBus.publish(
        new SampleCreatedEvent({
          id: result.id,
          name: result.name,
          description: result.description,
          createdAt: result.createdAt.toISOString(),
        }),
      );


      this.metrics.increment('sample.created.success');
      this.logger.info('SAMPLE_CREATED', { sampleId: result.id });

      return result;
    } catch (error) {
      this.metrics.increment('sample.created.error');
      throw error;
    }
  }
}
