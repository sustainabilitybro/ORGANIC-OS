import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  // Simple check - in production use proper auth
  if (!authHeader) {
    return NextResponse.json({ 
      error: 'Authorization required',
      usage: 'Set CRON_SECRET in environment'
    }, { status: 401 });
  }
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Cron job executed'
  });
}
