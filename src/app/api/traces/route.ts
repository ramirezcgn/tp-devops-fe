import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Reenviar las trazas al collector de Jaeger
    const jaegerUrl =
      process.env.JAEGER_OTLP_ENDPOINT ||
      'http://jaeger-collector:4318/v1/traces';

    const response = await fetch(jaegerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Failed to send traces to Jaeger:', await response.text());
      return NextResponse.json(
        { error: 'Failed to send traces' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error proxying traces:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
