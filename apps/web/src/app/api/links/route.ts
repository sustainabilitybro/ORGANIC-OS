import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface LinkPreview {
  url: string
  title: string
  description: string | null
  image: string | null
  site_name: string | null
}

async function fetchLinkPreview(url: string): Promise<LinkPreview | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Organic-OS Link Preview Bot'
      },
      next: { revalidate: 3600 }
    })
    
    if (!res.ok) return null
    
    const html = await res.text()
    
    // Extract OG meta tags
    const getMeta = (pattern: RegExp): string | null => {
      const match = html.match(pattern)
      return match ? match[1] : null
    }
    
    const title = getMeta(/<meta property="og:title" content="([^"]*)"/) 
      || getMeta(/<title>([^<]*)<\/title>/)
      || new URL(url).hostname
    
    const description = getMeta(/<meta property="og:description" content="([^"]*)"/) 
      || getMeta(/<meta name="description" content="([^"]*)"/)
    
    const image = getMeta(/<meta property="og:image" content="([^"]*)"/)
    const siteName = getMeta(/<meta property="og:site_name" content="([^"]*)"/)
    
    return {
      url,
      title,
      description,
      image,
      site_name: siteName || new URL(url).hostname
    }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }
  
  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }
  
  const preview = await fetchLinkPreview(url)
  
  if (!preview) {
    return NextResponse.json({ error: 'Failed to fetch preview' }, { status: 404 })
  }
  
  return NextResponse.json(preview)
}
