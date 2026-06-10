import { ErrorRegistry } from '@domain/errors/error-registry';

export abstract class ApplicationException extends Error {
  public readonly httpStatus: number;
  public readonly errorCode: number;
  public readonly title: string;
  public readonly message: string;
  public readonly layer: string;

  constructor(key: keyof typeof ErrorRegistry) {
    const err = ErrorRegistry[key];

    super(err.message);

    // Required when extending built-in classes (Error) in TypeScript/esbuild:
    // without this, instanceof checks fail because the prototype chain is broken.
    Object.setPrototypeOf(this, new.target.prototype);

    this.httpStatus = err.httpStatus;
    this.errorCode = err.code;
    this.title = err.title;
    this.message = err.message;
    this.layer = err.layer;
  }
}