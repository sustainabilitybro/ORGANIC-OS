import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const value = searchParams.get('value');
  
  if (!type || !value) {
    return NextResponse.json({ 
      valid: false, 
      error: 'Missing type or value parameter' 
    }, { status: 400 });
  }
  
  let valid = false;
  let formatted = value;
  
  switch (type) {
    case 'email':
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      break;
    case 'url':
      try {
        new URL(value);
        valid = true;
      } catch {
        valid = false;
      }
      break;
    case 'uuid':
      valid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
      break;
    case 'date':
      valid = !isNaN(Date.parse(value));
      if (valid) formatted = new Date(value).toISOString();
      break;
    default:
      return NextResponse.json({ 
        valid: false, 
        error: 'Unknown validation type' 
      }, { status: 400 });
  }
  
  return NextResponse.json({ valid, formatted, type });
}
