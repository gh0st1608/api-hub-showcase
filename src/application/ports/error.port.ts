export interface ErrorPort {
  captureError(error: Error, context?: Record<string, any>): void;
}
export const ErrorPortSymbol = Symbol('ErrorPort');