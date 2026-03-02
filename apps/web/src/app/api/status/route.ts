import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface ServiceStatus {
  name: string
  status: 'healthy' | 'degraded' | 'down'
  latency_ms: number
  last_check: string
}

export async function GET() {
  const start = Date.now()
  
  // Check GitHub API
  const githubStart = Date.now()
  let githubStatus: 'healthy' | 'degraded' | 'down' = 'healthy'
  try {
    const res = await fetch('https://api.github.com', {
      method: 'HEAD',
      next: { revalidate: 0 }
    })
    if (!res.ok) githubStatus = 'degraded'
  } catch {
    githubStatus = 'down'
  }
  const githubLatency = Date.now() - githubStart
  
  const services: ServiceStatus[] = [
    {
      name: 'GitHub API',
      status: githubStatus,
      latency_ms: githubLatency,
      last_check: new Date().toISOString()
    }
  ]
  
  const overall = services.every(s => s.status === 'healthy') 
    ? 'healthy' 
    : services.some(s => s.status === 'down') 
      ? 'degraded' 
      : 'degraded'
  
  const responseTime = Date.now() - start
  
  return NextResponse.json({
    status: overall,
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    services,
    response_time_ms: responseTime
  })
}
