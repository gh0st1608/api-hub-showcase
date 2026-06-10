import { Sample } from '@domain/entities/sample.entity';
import { SampleModel } from '@infrastructure/adapters/outbound/persistence/models/sample.model';

/**
 * Translates between the domain entity (`Sample`) and the TypeORM
 * persistence model (`SampleModel`). Neither class knows about the other —
 * this mapper is the only coupling point between the two layers.
 */
export const SampleMapper = {
  toDomain(model: SampleModel): Sample {
    return new Sample(model.id, model.name, model.description, model.createdAt);
  },

  toPersistence(domain: Sample): SampleModel {
    const model = new SampleModel();
    model.id = domain.id;
    model.name = domain.name;
    model.description = domain.description;
    model.createdAt = domain.createdAt;
    return model;
  },
};
