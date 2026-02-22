import { NextRequest, NextResponse } from 'next/server';

const searchableContent = [
  { type: 'module', id: 'identity', title: 'Identity Module', description: 'Core values and life purpose' },
  { type: 'module', id: 'sensory', title: 'Sensory Module', description: 'Sensory profile mapping' },
  { type: 'module', id: 'emotional', title: 'Emotional Module', description: 'Emotion tracking and regulation' },
  { type: 'module', id: 'wellness', title: 'Wellness Module', description: 'Physical wellness monitoring' },
  { type: 'module', id: 'recovery', title: 'Recovery Module', description: 'Rest and recovery optimization' },
  { type: 'module', id: 'communication', title: 'Communication', description: 'Speaking and communication' },
  { type: 'module', id: 'video', title: 'Video Practice', description: 'Video feedback and practice' },
  { type: 'page', id: 'dashboard', title: 'Dashboard', description: 'Main dashboard' },
  { type: 'page', id: 'analytics', title: 'Analytics', description: 'Progress analytics' },
  { type: 'page', id: 'settings', title: 'Settings', description: 'App settings' },
  { type: 'page', id: 'progress', title: 'Progress', description: 'Track your progress' },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase() || '';
  
  if (query.length < 2) {
    return NextResponse.json({ results: [], message: 'Query too short' });
  }
  
  const results = searchableContent.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  );
  
  return NextResponse.json({ results, total: results.length });
}
