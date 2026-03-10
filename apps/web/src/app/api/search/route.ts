import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all'; // all, images, news, videos
  
  // Since we don't have a real search API, return mock data for demo
  const results = {
    query,
    type,
    results: [
      { title: 'Organic OS', url: 'https://organic-os.com', description: 'Personal operating system for wellness' },
      { title: 'Atom Economy', url: 'https://organic-os.com/atom-economy', description: 'Green chemistry calculations' },
      { title: 'Holistic Alchemy', url: 'https://organic-os.com/holistic-alchemy', description: 'Personal transformation framework' }
    ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.description.toLowerCase().includes(query.toLowerCase())),
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json(results);
}
