import 'reflect-metadata';
import '../styles/app.scss';
import { ReactNode } from 'react';
import { TelemetryProvider } from '../components/TelemetryProvider';

export const metadata = {
  title: 'Todo App - DevOps',
  description: 'A simple todo list application',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✓</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>React - Boilerplate</title>
        <meta name="description" content="A simple todo list application" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✓</text></svg>"
          type="image/svg+xml"
        />
      </head>
      <body>
        <TelemetryProvider>{children}</TelemetryProvider>
      </body>
    </html>
  );
}
