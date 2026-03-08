import { NextResponse } from 'next/server';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  // Basic health check
  const health = {
    status: 'ok',
    timestamp,
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    service: 'Organic OS API',
    version: '1.0.0'
  };
  
  return NextResponse.json(health);
}
