import { ApplicationException } from './application.exception';

export class ProjectNotFoundException extends ApplicationException {
  constructor() {
    super('PROJECT_NOT_FOUND');
  }
}
