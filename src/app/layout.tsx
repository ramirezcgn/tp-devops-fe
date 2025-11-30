import 'reflect-metadata';
import '../styles/app.scss';
import { ReactNode } from 'react';
import { TelemetryProvider } from '../components/TelemetryProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>React - Boilerplate</title>
        <meta name="description" content="A simple todo list application" />
      </head>
      <body>
        <TelemetryProvider>{children}</TelemetryProvider>
      </body>
    </html>
  );
}
