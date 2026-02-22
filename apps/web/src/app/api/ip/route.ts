import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1';
  
  return NextResponse.json({
    ip,
    version: 'IPv4',
    timestamp: new Date().toISOString()
  });
}
