import { NextRequest, NextResponse } from 'next/server';

async function hashString(str: string, algo: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text') || '';
  const algo = searchParams.get('algo') || 'SHA-256';
  
  if (!text) {
    return NextResponse.json({
      usage: '/api/hash?text=hello&algo=SHA-256',
      algorithms: ['SHA-256', 'SHA-384', 'SHA-512']
    });
  }
  
  try {
    const hash = await hashString(text, algo);
    return NextResponse.json({ text, algo, hash });
  } catch (e) {
    return NextResponse.json({ error: 'Hash failed' }, { status: 500 });
  }
}
