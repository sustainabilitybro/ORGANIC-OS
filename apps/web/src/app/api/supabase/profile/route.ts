import { NextResponse } from 'next/server';

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== '' && supabaseAnonKey !== '' &&
    supabaseUrl !== 'https://your-project.supabase.co');
}

export async function GET() {
  return NextResponse.json({
    configured: isSupabaseConfigured(),
    message: isSupabaseConfigured() 
      ? 'Supabase is configured' 
      : 'Supabase credentials not configured'
  });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: body.email || 'demo@example.com',
        full_name: body.name || 'Demo User'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create profile' },
      { status: 500 }
    );
  }
}
