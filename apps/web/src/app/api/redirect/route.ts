import { NextRequest, NextResponse } from 'next/server';

const redirects: Record<string, string> = {
  'github': 'https://github.com/sustainabilitybro',
  'vercel': 'https://vercel.com',
  'supabase': 'https://supabase.com',
  'notox': 'https://notox.fm',
  'altlabs': 'https://altlaboratories.com'
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get('key');
  
  if (!key) {
    return NextResponse.json({ 
      available_redirects: Object.keys(redirects) 
    });
  }
  
  const url = redirects[key.toLowerCase()];
  
  if (!url) {
    return NextResponse.json({ 
      error: 'Redirect not found',
      available_redirects: Object.keys(redirects)
    }, { status: 404 });
  }
  
  return NextResponse.redirect(url);
}
