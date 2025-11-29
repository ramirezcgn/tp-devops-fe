/* eslint-disable @typescript-eslint/no-unused-vars */
import { trace } from '@opentelemetry/api';

export function initTelemetry() {
  if (typeof window === 'undefined') return;

  // Lazy load OpenTelemetry solo en el cliente
  import('@opentelemetry/sdk-trace-web').then(
    ({ WebTracerProvider, BatchSpanProcessor }) => {
      import('@opentelemetry/exporter-trace-otlp-http').then(
        ({ OTLPTraceExporter }) => {
          import('@opentelemetry/instrumentation').then(
            ({ registerInstrumentations }) => {
              import('@opentelemetry/instrumentation-fetch').then(
                ({ FetchInstrumentation }) => {
                  import('@opentelemetry/context-zone').then(
                    ({ ZoneContextManager }) => {
                      // Configuración del exportador OTLP
                      const exporter = new OTLPTraceExporter({
                        url: '/api/traces', // Usar la ruta API local como proxy
                      });

                      // Configuración del proveedor de trazas con el span processor
                      const provider = new WebTracerProvider({
                        spanProcessors: [new BatchSpanProcessor(exporter)],
                      });

                      // Registrar el proveedor
                      provider.register({
                        contextManager: new ZoneContextManager(),
                      });

                      // Instrumentación automática de fetch
                      registerInstrumentations({
                        instrumentations: [
                          new FetchInstrumentation({
                            propagateTraceHeaderCorsUrls: [/.*/],
                            clearTimingResources: true,
                            applyCustomAttributesOnSpan: (
                              span,
                              request,
                              result,
                            ) => {
                              if (request instanceof Request) {
                                span.setAttribute(
                                  'http.request.url',
                                  request.url,
                                );
                                span.setAttribute(
                                  'http.request.method',
                                  request.method,
                                );
                              }
                              if (result instanceof Response) {
                                span.setAttribute(
                                  'http.response.status_code',
                                  result.status,
                                );
                              }
                            },
                          }),
                        ],
                      });

                      console.log('✅ OpenTelemetry initialized for frontend');
                    },
                  );
                },
              );
            },
          );
        },
      );
    },
  );
}

export default { initTelemetry };
