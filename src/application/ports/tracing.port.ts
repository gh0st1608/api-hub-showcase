export interface TracingPort {
  startSpan<T>(name: string, fn: () => Promise<T>): Promise<T>;
  addEvent(name: string, attributes?: Record<string, any>): void;
}

export const TracingPortSymbol = Symbol('TracingPort');