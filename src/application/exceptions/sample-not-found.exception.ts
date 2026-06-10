import { ApplicationException } from './application.exception';

export class SampleNotFoundException extends ApplicationException {
  constructor() {
    super('SAMPLE_NOT_FOUND');
  }
}
