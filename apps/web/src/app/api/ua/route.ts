import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const ua = request.headers.get('user-agent') || 'Unknown';
  
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(ua);
  const isBot = /bot|crawl|spider/i.test(ua);
  const browser = ua.includes('Chrome') ? 'Chrome' : 
                  ua.includes('Firefox') ? 'Firefox' : 
                  ua.includes('Safari') ? 'Safari' : 'Other';
  
  return NextResponse.json({
    ua,
    isMobile,
    isBot,
    browser,
    raw: ua
  });
}
