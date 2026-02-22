import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bytes = parseInt(searchParams.get('bytes') || '0');
  
  if (!bytes) {
    return NextResponse.json({
      usage: '/api/bytes?bytes=1024',
      example: 1024
    });
  }
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let size = bytes;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return NextResponse.json({
    bytes,
    formatted: `${size.toFixed(2)} ${units[unitIndex]}`,
    unit: units[unitIndex]
  });
}
