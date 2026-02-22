import { NextRequest, NextResponse } from 'next/server';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomInt(0, chars.length - 1));
  }
  return result;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'uuid';
  const count = Math.min(parseInt(searchParams.get('count') || '1'), 100);
  
  const results: string[] = [];
  
  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'uuid':
        results.push(crypto.randomUUID());
        break;
      case 'string':
        results.push(randomString(10));
        break;
      case 'number':
        results.push(String(randomInt(1, 1000)));
        break;
      case 'hex':
        results.push(randomString(16));
        break;
      default:
        results.push(crypto.randomUUID());
    }
  }
  
  return NextResponse.json({
    type,
    count: results.length,
    results: count === 1 ? results[0] : results
  });
}
