import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface SearchResult {
  title: string
  description: string
  url: string
  category: string
}

// In-memory search index (in production, use a proper search engine)
const searchIndex: SearchResult[] = [
  { title: 'Home', description: 'Welcome to Organic OS - The Operating System for Being Human', url: '/', category: 'pages' },
  { title: 'Identity Module', description: 'Discover your core values and life purpose', url: '/identity', category: 'modules' },
  { title: 'Wellness Tracking', description: 'Track sleep, nutrition, exercise, and mindfulness', url: '/wellness', category: 'modules' },
  { title: 'Dashboard', description: 'Your personal development dashboard', url: '/dashboard', category: 'pages' },
  { title: 'Progress', description: 'Track your progress across all modules', url: '/progress', category: 'pages' },
  { title: 'Settings', description: 'Configure your Organic OS experience', url: '/settings', category: 'pages' },
  { title: 'Atom Economy', description: 'Sustainable chemistry and resource efficiency', url: '/atom-economy', category: 'tools' },
  { title: 'Holistic Alchemy', description: 'Transform your life with holistic practices', url: '/holistic-alchemy', category: 'tools' },
  { title: 'Sustainability', description: 'Sustainable living tips and resources', url: '/sustainability', category: 'topics' },
  { title: 'Recovery', description: 'Rest and recovery techniques', url: '/recovery', category: 'modules' },
  { title: 'Sensory', description: 'Sensory awareness and mindfulness', url: '/sensory', category: 'modules' },
  { title: 'Emotional', description: 'Emotional intelligence development', url: '/emotional', category: 'modules' },
  { title: 'Communication', description: 'Effective communication skills', url: '/communication', category: 'modules' },
  { title: 'GitHub Dashboard', description: 'Track your open-source projects', url: '/github', category: 'developer' },
  { title: 'Analytics', description: 'View your usage analytics', url: '/analytics', category: 'pages' },
  { title: 'Video', description: 'Video content and resources', url: '/video', category: 'media' },
]

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.toLowerCase() || ''
  const category = request.nextUrl.searchParams.get('category')
  
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], total: 0 })
  }
  
  let results = searchIndex.filter(item => 
    item.title.toLowerCase().includes(query) || 
    item.description.toLowerCase().includes(query)
  )
  
  if (category) {
    results = results.filter(item => item.category === category)
  }
  
  return NextResponse.json({
    results: results.slice(0, 10),
    total: results.length,
    query
  })
}
