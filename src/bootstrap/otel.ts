import { NodeSDK } from '@opentelemetry/sdk-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  ATTR_SERVICE_NAMESPACE,
  ATTR_SERVICE_INSTANCE_ID,
} from '@opentelemetry/semantic-conventions';

import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';

import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';

import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { logs } from '@opentelemetry/api-logs';

// =============================
// 🔧 MODE DETECTION
// =============================
const isUsingCollector = !!process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const baseUrl = isUsingCollector
  ? process.env.OTEL_EXPORTER_OTLP_ENDPOINT!
  : 'https://otlp.nr-data.net:4318';

const headers = isUsingCollector
  ? {}
  : {
      'api-key': process.env.NEW_RELIC_LICENSE_KEY || '',
    };

// 👉 DEBUG (clave para troubleshooting)
console.log(
  `🔭 OTel mode: ${isUsingCollector ? 'COLLECTOR' : 'DIRECT_TO_NEW_RELIC'}`,
);
console.log(`🔗 OTel endpoint: ${baseUrl}`);

// =============================
// RESOURCE
// =============================
const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'user-service',
  [ATTR_SERVICE_VERSION]: process.env.OTEL_SERVICE_VERSION || '1.0.0',
  [ATTR_SERVICE_NAMESPACE]: process.env.OTEL_SERVICE_NAMESPACE || 'backend',
  [ATTR_SERVICE_INSTANCE_ID]: process.env.HOSTNAME || 'local-instance',

  'runtime.name': 'nodejs',
  'runtime.version': process.version,
});

// =============================
// EXPORTERS (DINÁMICOS)
// =============================
const traceExporter = new OTLPTraceExporter({
  url: `${baseUrl}/v1/traces`,
  headers,
});

const metricExporter = new OTLPMetricExporter({
  url: `${baseUrl}/v1/metrics`,
  headers,
});

const logExporter = new OTLPLogExporter({
  url: `${baseUrl}/v1/logs`,
  headers,
});

// =============================
// LOGGER PROVIDER (LOGS)
// =============================
const loggerProvider = new LoggerProvider({
  resource,
  processors: [new BatchLogRecordProcessor(logExporter)],
});

logs.setGlobalLoggerProvider(loggerProvider);

// =============================
// NODE SDK (TRACES + METRICS)
// =============================
const sdk = new NodeSDK({
  contextManager: new AsyncLocalStorageContextManager(),
  resource,

  traceExporter,

  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis:
      Number(process.env.OTEL_METRIC_EXPORT_INTERVAL) || 10000,
  }),

  instrumentations: [getNodeAutoInstrumentations()],
});

// =============================
// START
// =============================
async function startTelemetry() {
  try {
    await sdk.start();
    console.log('✅ OpenTelemetry iniciado correctamente');
  } catch (error) {
    console.error('❌ Error iniciando OpenTelemetry', error);
  }
}

startTelemetry();