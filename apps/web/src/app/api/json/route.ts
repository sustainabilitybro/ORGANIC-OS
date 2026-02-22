import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const data = searchParams.get('data');
  
  if (!data) {
    return NextResponse.json({ 
      valid: false, 
      error: 'No data provided',
      usage: '/api/json?data={"key":"value"}'
    });
  }
  
  try {
    const parsed = JSON.parse(data);
    return NextResponse.json({
      valid: true,
      data: parsed,
      stringified: JSON.stringify(parsed, null, 2),
      size: JSON.stringify(parsed).length
    });
  } catch (e) {
    return NextResponse.json({
      valid: false,
      error: 'Invalid JSON',
      provided: data
    });
  }
}
