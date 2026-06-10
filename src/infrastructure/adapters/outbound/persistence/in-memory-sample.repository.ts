import { Injectable } from '@nestjs/common';
import { Sample } from '@domain/entities/sample.entity';
import { SampleRepositoryPort } from '@domain/ports/sample.port';
import { GetByParamsDto } from '@application/dto/request/get-by-params.dto';
import { SaveFailedException } from './exceptions/save-failed.exception';

@Injectable()
export class InMemorySampleRepositoryImpl implements SampleRepositoryPort {
  private samples: Sample[] = [];

  async create(sample: Sample): Promise<Sample> {
    try {
      this.samples.push(sample);
      return sample;
    } catch {
      throw new SaveFailedException();
    }
  }

  async update(sample: Sample): Promise<Sample> {
    const idx = this.samples.findIndex(s => s.id === sample.id);
    if (idx === -1) throw new SaveFailedException();
    this.samples[idx] = sample;
    return sample;
  }

  async findById(id: string): Promise<Sample | null> {
    return this.samples.find(s => s.id === id) ?? null;
  }

  async findAll(params: GetByParamsDto) {
    const { page = 1, limit = 10, search } = params;

    let filtered = this.samples;

    if (search) {
      filtered = filtered.filter(
        s =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          (s.description?.toLowerCase().includes(search.toLowerCase()) ?? false),
      );
    }

    const count = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);
    const nextPage = start + limit < count ? page + 1 : null;

    return { items, count, nextPage };
  }
}
