import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Track stats in memory (for demo - use database in production)
const stats = {
  pageViews: 0,
  apiCalls: 0,
  startTime: Date.now()
};

export async function GET() {
  // Increment API calls
  stats.apiCalls++;
  
  const uptimeMs = Date.now() - stats.startTime;
  const uptimeHours = uptimeMs / (1000 * 60 * 60);
  
  return NextResponse.json({
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: {
      started: new Date(stats.startTime).toISOString(),
      hours: parseFloat(uptimeHours.toFixed(2)),
      days: parseFloat((uptimeHours / 24).toFixed(2))
    },
    stats: {
      pageViews: stats.pageViews,
      apiCalls: stats.apiCalls,
      requestsPerHour: uptimeHours > 0 ? Math.round(stats.apiCalls / uptimeHours) : 0
    },
    modules: [
      { name: 'Identity', status: 'complete', progress: 100, description: 'Values, purpose, legacy' },
      { name: 'Emotional', status: 'complete', progress: 100, description: 'EQ skills, coping strategies' },
      { name: 'Sensory', status: 'complete', progress: 100, description: '5 senses exercises' },
      { name: 'Recovery', status: 'complete', progress: 100, description: 'Burnout assessment, stress' },
      { name: 'Communication', status: 'complete', progress: 100, description: 'Public speaking, listening' },
      { name: 'Wellness', status: 'complete', progress: 100, description: 'Sleep, nutrition, exercise' },
      { name: 'Sustainability', status: 'complete', progress: 100, description: 'Carbon footprint, eco-living' },
      { name: 'Holistic Alchemy', status: 'complete', progress: 100, description: 'Mental health, anxiety, depression' },
      { name: 'Atom Economy', status: 'complete', progress: 100, description: 'Productivity, focus optimization' },
      { name: 'Video', status: 'complete', progress: 100, description: 'On-camera skills, presentation' }
    ],
    features: {
      aiCoaching: true,
      analytics: !!process.env.NEXT_PUBLIC_GA_ID,
      dataExport: true,
      supabaseAuth: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      pwa: true,
      rss: true,
      openGraph: true,
      sitemap: true
    },
    integrations: {
      github: true,
      weather: true,
      quotes: true,
      moonPhase: true,
      sunriseSunset: true
    }
  });
}
