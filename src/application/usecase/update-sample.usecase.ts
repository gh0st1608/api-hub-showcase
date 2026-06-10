import { Inject, Injectable } from '@nestjs/common';
import { Sample } from '@domain/entities/sample.entity';
import { SampleRepositoryPort, SampleRepositoryPortSymbol } from '@domain/ports/sample.port';
import { UpdateSampleDto } from '@application/dto/request/update-sample.dto';
import { SampleNotFoundException } from '@application/exceptions/sample-not-found.exception';
import { MetricsPort, MetricsPortSymbol } from '@application/ports/metrics.port';
import { LoggingPort, LoggingPortSymbol } from '@application/ports/logging.port';
import { EventBusPort, EventBusPortSymbol } from '@application/ports/event-bus.port';
import { SampleUpdatedEvent } from '@domain/events/sample-updated.event';

@Injectable()
export class UpdateSampleUseCase {
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

  async execute(id: string, body: UpdateSampleDto): Promise<Sample> {
    const existing = await this.sampleRepository.findById(id);
    if (!existing) throw new SampleNotFoundException();

    const updated = new Sample(
      existing.id,
      body.name ?? existing.name,
      body.description !== undefined ? body.description : existing.description,
      existing.createdAt,
    );

    const result = await this.sampleRepository.update(updated);

    await this.eventBus.publish(
      new SampleUpdatedEvent({
        id: result.id,
        name: result.name,
        description: result.description,
      }),
    );

    this.metrics.increment('sample.updated.success');
    this.logger.info('SAMPLE_UPDATED', { sampleId: result.id });

    return result;
  }
}
