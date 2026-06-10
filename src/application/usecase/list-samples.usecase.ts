import { Inject, Injectable } from '@nestjs/common';
import { SampleRepositoryPort, SampleRepositoryPortSymbol } from '@domain/ports/sample.port';
import { GetByParamsDto } from '@application/dto/request/get-by-params.dto';
import { GetSamplesResult } from '@application/dto/response/response-custom.dto';

@Injectable()
export class ListSamplesUseCase {
  constructor(
    @Inject(SampleRepositoryPortSymbol)
    private readonly sampleRepository: SampleRepositoryPort,
  ) {}

  async execute(query: GetByParamsDto): Promise<GetSamplesResult> {
    return this.sampleRepository.findAll(query);
  }
}
