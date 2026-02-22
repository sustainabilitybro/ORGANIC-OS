import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    uptime: process.uptime?.() || 0,
    memory: process.memoryUsage?.() || {},
    platform: process.platform,
    timestamp: new Date().toISOString()
  });
}
