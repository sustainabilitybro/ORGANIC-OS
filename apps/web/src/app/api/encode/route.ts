import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text') || '';
  const type = searchParams.get('type') || 'base64';
  
  if (!text) {
    return NextResponse.json({
      usage: '/api/encode?text=hello&type=base64|url|hex',
      types: ['base64', 'url', 'hex']
    });
  }
  
  try {
    let encoded: string;
    switch (type) {
      case 'base64':
        encoded = Buffer.from(text).toString('base64');
        break;
      case 'url':
        encoded = encodeURIComponent(text);
        break;
      case 'hex':
        encoded = Buffer.from(text).toString('hex');
        break;
      default:
        return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    }
    
    return NextResponse.json({ original: text, encoded, type });
  } catch (e) {
    return NextResponse.json({ error: 'Encoding failed' }, { status: 500 });
  }
}
