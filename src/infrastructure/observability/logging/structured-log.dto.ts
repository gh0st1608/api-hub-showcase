export interface StructuredLogContext {
  traceId?: string;
  spanId?: string;
  service?: string;
  environment?: string;
  userId?: string;
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  [key: string]: any;
}

export interface StructuredLog {
  message: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  context?: StructuredLogContext;
  request?: any;
  response?: any;
  [key: string]: any;
}
