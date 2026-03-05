import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface ServiceStatus {
  name: string
  status: 'healthy' | 'degraded' | 'down'
  latency_ms: number
  last_check: string
  details?: string
}

async function checkGitHub(): Promise<ServiceStatus> {
  const start = Date.now()
  let status: 'healthy' | 'degraded' | 'down' = 'healthy'
  let details = 'API responding'
  try {
    const res = await fetch('https://api.github.com', {
      method: 'HEAD',
      next: { revalidate: 0 }
    })
    if (!res.ok) {
      status = 'degraded'
      details = `HTTP ${res.status}`
    }
  } catch (e) {
    status = 'down'
    details = e instanceof Error ? e.message : 'Connection failed'
  }
  return {
    name: 'GitHub API',
    status,
    latency_ms: Date.now() - start,
    last_check: new Date().toISOString(),
    details
  }
}

async function checkVercel(): Promise<ServiceStatus> {
  const start = Date.now()
  let status: 'healthy' | 'degraded' | 'down' = 'healthy'
  let details = 'API responding'
  try {
    const res = await fetch('https://api.vercel.com', {
      method: 'HEAD',
      next: { revalidate: 0 }
    })
    if (!res.ok) {
      status = 'degraded'
      details = `HTTP ${res.status}`
    }
  } catch (e) {
    status = 'down'
    details = e instanceof Error ? e.message : 'Connection failed'
  }
  return {
    name: 'Vercel API',
    status,
    latency_ms: Date.now() - start,
    last_check: new Date().toISOString(),
    details
  }
}

async function checkSupabase(): Promise<ServiceStatus> {
  const start = Date.now()
  let status: 'healthy' | 'degraded' | 'down' = 'healthy'
  let details = 'Service available'
  try {
    // Just check if we can reach supabase
    const res = await fetch('https://api.supabase.com', {
      method: 'HEAD',
      next: { revalidate: 0 }
    })
    if (!res.ok) {
      status = 'degraded'
      details = `HTTP ${res.status}`
    }
  } catch (e) {
    // Supabase might not be configured - this is OK for local dev
    status = 'degraded'
    details = 'Not configured (OK for local dev)'
  }
  return {
    name: 'Supabase',
    status,
    latency_ms: Date.now() - start,
    last_check: new Date().toISOString(),
    details
  }
}

export async function GET() {
  const start = Date.now()
  
  // Run all checks in parallel
  const [github, vercel, supabase] = await Promise.all([
    checkGitHub(),
    checkVercel(),
    checkSupabase()
  ])
  
  const services: ServiceStatus[] = [github, vercel, supabase]
  
  const overall = services.every(s => s.status === 'healthy') 
    ? 'healthy' 
    : services.some(s => s.status === 'down') 
      ? 'degraded' 
      : 'degraded'
  
  const responseTime = Date.now() - start
  
  return NextResponse.json({
    status: overall,
    version: '2.2.0',
    timestamp: new Date().toISOString(),
    services,
    response_time_ms: responseTime,
    environment: process.env.NODE_ENV || 'development'
  })
}
