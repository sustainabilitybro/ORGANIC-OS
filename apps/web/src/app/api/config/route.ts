import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    app: {
      name: 'Organic OS',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    },
    features: {
      auth: true,
      analytics: true,
      modules: true,
      github_integration: true,
      search: true,
      pwa: true
    },
    modules: [
      { id: 'identity', name: 'Identity' },
      { id: 'sensory', name: 'Sensory' },
      { id: 'emotional', name: 'Emotional' },
      { id: 'wellness', name: 'Wellness' },
      { id: 'recovery', name: 'Recovery' },
      { id: 'communication', name: 'Communication' },
      { id: 'video', name: 'Video' }
    ],
    api_version: 'v1',
    timestamp: new Date().toISOString()
  });
}
