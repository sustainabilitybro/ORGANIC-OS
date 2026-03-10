import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    services: {} as Record<string, { status: string; latency?: number; error?: string }>
  };

  // Check GitHub API (try a simple request)
  const ghStart = Date.now();
  try {
    const res = await fetch('https://api.github.com/repos/sustainabilitybro/ORGANIC-OS', {
      headers: { 'User-Agent': 'Organic-OS' },
      next: { revalidate: 60 }
    });
    checks.services.github = {
      status: res.ok ? 'operational' : 'degraded',
      latency: Date.now() - ghStart
    };
  } catch (e) {
    checks.services.github = { status: 'error', error: String(e) };
  }

  // Check Supabase (if configured)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    const sbStart = Date.now();
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }
      });
      checks.services.supabase = {
        status: res.ok || res.status === 404 ? 'operational' : 'degraded',
        latency: Date.now() - sbStart
      };
    } catch (e) {
      checks.services.supabase = { status: 'error', error: String(e) };
    }
  } else {
    checks.services.supabase = { status: 'not_configured' };
  }

  // Check Vercel (if running on Vercel)
  if (process.env.VERCEL) {
    checks.services.vercel = { status: 'operational' };
  } else {
    checks.services.vercel = { status: 'local' };
  }

  // Overall status
  const allOperational = Object.values(checks.services).every(
    s => s.status === 'operational' || s.status === 'local' || s.status === 'not_configured'
  );

  return NextResponse.json({
    ...checks,
    overall: allOperational ? 'operational' : 'degraded'
  });
}
