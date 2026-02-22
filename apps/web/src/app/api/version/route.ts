import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    app: 'Organic OS',
    version: '1.0.0',
    api_version: 'v1',
    build: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    node: process.version,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
}
