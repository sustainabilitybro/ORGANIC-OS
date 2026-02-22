import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();
  
  return NextResponse.json({
    iso: now.toISOString(),
    unix: Math.floor(now.getTime() / 1000),
    utc: now.toUTCString(),
    local: now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }),
    berlin: now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }),
    utc_offset: '+01:00',
    day_of_week: now.toLocaleDateString('en-US', { weekday: 'long' }),
    day_of_year: Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
  });
}
