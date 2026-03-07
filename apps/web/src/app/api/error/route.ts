import { NextResponse } from 'next/server';

// Global error handler for API routes
export async function GET() {
  return NextResponse.json({
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: 'The requested API endpoint does not exist',
      hint: 'Check the API documentation for available endpoints',
      documentation: 'https://github.com/sustainabilitybro/ORGANIC-OS#api-reference',
      timestamp: new Date().toISOString()
    }
  }, { status: 404 });
}

export async function POST() {
  return GET();
}

export async function PUT() {
  return GET();
}

export async function DELETE() {
  return GET();
}

export async function PATCH() {
  return GET();
}
