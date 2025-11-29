'use client';

import { useEffect } from 'react';

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Inicializar OpenTelemetry solo en el cliente
    import('../../config/telemetry').then(({ initTelemetry }) => {
      initTelemetry();
    });
  }, []);

  return <>{children}</>;
}
