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
                        url: '/v1/traces', // Enviar directamente a Jaeger a través de nginx
                      });

                      // Crear un SpanProcessor personalizado que modifique el resource
                      class ServiceNameProcessor {
                        forceFlush() {
                          return Promise.resolve();
                        }
                        onStart() {}
                        onEnd(span: any) {
                          // Modificar el resource del span para incluir service.name
                          if (span.resource && span.resource.attributes) {
                            span.resource.attributes['service.name'] =
                              'devops-fe';
                          }
                        }
                        shutdown() {
                          return Promise.resolve();
                        }
                      }

                      // Configuración del proveedor de trazas
                      const provider = new WebTracerProvider({
                        spanProcessors: [
                          new ServiceNameProcessor() as any,
                          new BatchSpanProcessor(exporter),
                        ],
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
