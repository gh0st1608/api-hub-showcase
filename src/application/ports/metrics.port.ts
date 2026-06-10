export interface MetricsPort {
  increment(name: string, attributes?: Record<string, any>): void;

  record(name: string, value: number, attributes?: Record<string, any>): void;

  timing?(name: string, duration: number, attributes?: Record<string, any>): void;
}

export const MetricsPortSymbol = Symbol('MetricsPort');