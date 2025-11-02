import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();

  // Add custom header with the pod hostname from environment variable
  const podName = process.env.HOSTNAME || 'unknown-pod';
  response.headers.set('X-Pod-Name', podName);
  response.headers.set('X-Served-By', `pod-${podName}`);

  return response;
}

export const config = {
  matcher: '/:path*',
};
