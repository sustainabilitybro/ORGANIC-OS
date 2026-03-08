import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

interface Event {
  type: string;
  repo: string;
  actor: string;
  created_at: string;
  payload: any;
}

export async function GET() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${USER}/events?per_page=30`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Organic-OS'
        },
        next: { revalidate: 600 } // 10 minutes cache
      }
    );
    
    if (!res.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch events',
        status: res.status 
      }, { status: res.status });
    }
    
    const data = await res.json();
    
    const events: Event[] = data.map((event: any) => ({
      type: event.type,
      repo: event.repo.name,
      actor: event.actor.login,
      created_at: event.created_at,
      payload: event.payload
    }));
    
    // Group by type
    const byType = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return NextResponse.json({
      events,
      count: events.length,
      byType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GitHub events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
