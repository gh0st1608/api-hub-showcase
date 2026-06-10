import { Inject, Injectable } from '@nestjs/common';
import { Sample } from '@domain/entities/sample.entity';
import { SampleRepositoryPort, SampleRepositoryPortSymbol } from '@domain/ports/sample.port';
import { MetricsPort, MetricsPortSymbol } from '@application/ports/metrics.port';
import { LoggingPort, LoggingPortSymbol } from '@application/ports/logging.port';
import { SampleNotFoundException } from '@application/exceptions/sample-not-found.exception';

@Injectable()
export class GetSampleByIdUseCase {
  constructor(
    @Inject(SampleRepositoryPortSymbol)
    private readonly sampleRepository: SampleRepositoryPort,

    @Inject(MetricsPortSymbol)
    private readonly metrics: MetricsPort,

    @Inject(LoggingPortSymbol)
    private readonly logger: LoggingPort,
  ) {}

  async execute(id: string): Promise<Sample> {
    try {
      const sample = await this.sampleRepository.findById(id);

      if (!sample) {
        this.logger.warn?.('SAMPLE_NOT_FOUND', { sampleId: id });
        this.metrics.increment('sample.get_by_id.not_found');
        throw new SampleNotFoundException();
      }

      this.metrics.increment('sample.get_by_id.success');
      this.logger.info('SAMPLE_FOUND', { sampleId: sample.id });

      return sample;
    } catch (error) {
      if (!(error instanceof SampleNotFoundException)) {
        this.metrics.increment('sample.get_by_id.error');
      }
      throw error;
    }
  }
}
