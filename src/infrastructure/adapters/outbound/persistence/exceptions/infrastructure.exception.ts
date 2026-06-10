import { ErrorRegistry } from '@domain/errors/error-registry';

export abstract class InfrastructureException extends Error {
  public readonly httpStatus: number;
  public readonly errorCode: number;
  public readonly title: string;
  public readonly message: string;
  public readonly layer: string;

  constructor(key: keyof typeof ErrorRegistry) {
    const err = ErrorRegistry[key];

    super(err.message);

    this.httpStatus = err.httpStatus;
    this.errorCode = err.code;
    this.title = err.title;
    this.message = err.message;
    this.layer = err.layer;
  }
}