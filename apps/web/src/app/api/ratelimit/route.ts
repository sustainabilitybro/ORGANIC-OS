import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  
  // In production, implement actual rate limiting with Redis or similar
  return NextResponse.json({
    limit: 100,
    remaining: 99,
    reset: Math.floor(Date.now() / 1000) + 3600,
    ip,
    message: 'Rate limit info - implement with Redis in production'
  });
}
