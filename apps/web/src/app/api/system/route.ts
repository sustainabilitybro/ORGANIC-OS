import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    app: {
      name: 'Organic OS',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    },
    api: {
      status: 'operational',
      endpoints: [
        '/api/health',
        '/api/analytics',
        '/api/modules',
        '/api/progress',
        '/api/stats',
        '/api/github/repos',
        '/api/github/user',
        '/api/content',
        '/api/search',
        '/api/error',
        '/api/system'
      ]
    },
    features: {
      auth: true,
      analytics: true,
      modules: true,
      github_integration: true,
      search: true
    },
    timestamp: new Date().toISOString()
  });
}
