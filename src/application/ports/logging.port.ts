export interface LoggingPort {
  info(message: string, meta?: Record<string, any>): void;
  error(message: string, meta?: Record<string, any>): void;
  warn?(message: string, meta?: Record<string, any>): void;
}

export const LoggingPortSymbol = Symbol('LoggingPort');