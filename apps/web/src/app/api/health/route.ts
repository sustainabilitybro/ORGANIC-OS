import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Get memory usage
  const memoryUsage = process.memoryUsage?.() || {
    rss: 0,
    heapTotal: 0,
    heapUsed: 0,
    external: 0
  };
  const cpuUsage = process.cpuUsage?.() || {
    user: 0,
    system: 0
  };
  
  // Calculate uptime in hours
  const uptime = process.uptime?.() || 0
  const uptimeHours = (uptime / 3600).toFixed(2)
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.round(uptime),
      hours: parseFloat(uptimeHours),
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
    },
    environment: process.env.NODE_ENV || 'development',
    memory: {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`
    },
    cpu: {
      user: cpuUsage.user || 0,
      system: cpuUsage.system || 0
    },
    version: process.env.npm_package_version || '1.0.0',
    services: {
      supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      minimax: !!process.env.MINIMAX_API_KEY,
      analytics: !!process.env.NEXT_PUBLIC_GA_ID
    }
  })
}
