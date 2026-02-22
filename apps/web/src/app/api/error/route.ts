import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    error_codes: {
      AUTH_001: 'Invalid credentials',
      AUTH_002: 'Token expired',
      AUTH_003: 'User not found',
      DB_001: 'Database connection failed',
      DB_002: 'Query timeout',
      API_001: 'Rate limit exceeded',
      API_002: 'Invalid request',
      API_003: 'Service unavailable'
    },
    version: '1.0.0'
  });
}
