import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const ua = request.headers.get('user-agent') || '';
  
  const info = {
    raw: ua,
    isBot: /bot|crawl|spider/i.test(ua),
    isMobile: /mobile|android|iphone|ipad/i.test(ua),
    isTablet: /tablet|ipad/i.test(ua),
    browser: {
      chrome: ua.includes('Chrome'),
      firefox: ua.includes('Firefox'),
      safari: ua.includes('Safari') && !ua.includes('Chrome'),
      edge: ua.includes('Edg')
    },
    os: {
      windows: ua.includes('Windows'),
      mac: ua.includes('Mac'),
      linux: ua.includes('Linux'),
      android: ua.includes('Android'),
      ios: ua.includes('iPhone') || ua.includes('iPad')
    }
  };
  
  return NextResponse.json(info);
}
