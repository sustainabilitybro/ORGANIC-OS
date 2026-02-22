import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1';
  
  // Simple response - in production use MaxMind or IPAPI
  return NextResponse.json({
    ip,
    country: 'DE',
    region: 'Berlin',
    city: 'Berlin',
    timezone: 'Europe/Berlin',
    note: 'Use IPAPI or MaxMind for real geo data'
  });
}
