import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface FeedItem {
  title: string
  description: string
  link: string
  pubDate: string
  category?: string
}

async function getGitHubActivity(): Promise<FeedItem[]> {
  try {
    const res = await fetch('https://api.github.com/users/sustainabilitybro/events', {
      next: { revalidate: 1800 }
    })
    if (!res.ok) return []
    
    const events = await res.json()
    return events.slice(0, 5).map((event: any) => ({
      title: `${event.type} in ${event.repo.name}`,
      description: `Recent activity on GitHub`,
      link: `https://github.com/${event.repo.name}`,
      pubDate: event.created_at,
      category: 'GitHub'
    }))
  } catch {
    return []
  }
}

export async function GET() {
  const baseUrl = 'https://organic-os.com'
  
  // Get GitHub activity
  const githubActivity = await getGitHubActivity()
  
  const staticItems: FeedItem[] = [
    {
      title: 'Welcome to Organic OS',
      description: 'The Operating System for Being Human - A comprehensive platform for personal development and wellness tracking.',
      link: `${baseUrl}/`,
      pubDate: new Date().toISOString(),
      category: 'General'
    },
    {
      title: 'Identity Module',
      description: 'Discover and define your core values and life purpose with AI-powered guidance.',
      link: `${baseUrl}/identity`,
      pubDate: new Date().toISOString(),
      category: 'Module'
    },
    {
      title: 'Wellness Tracking',
      description: 'Track your sleep, nutrition, exercise, and mindfulness with comprehensive wellness tools.',
      link: `${baseUrl}/wellness`,
      pubDate: new Date().toISOString(),
      category: 'Module'
    },
    {
      title: 'Atom Economy',
      description: 'Learn about sustainable chemistry and resource efficiency with our interactive tools.',
      link: `${baseUrl}/sustainability/atom-economy`,
      pubDate: new Date().toISOString(),
      category: 'Sustainability'
    },
    {
      title: 'Holistic Alchemy',
      description: 'Explore personal transformation with our comprehensive framework.',
      link: `${baseUrl}/sustainability/holistic-alchemy`,
      pubDate: new Date().toISOString(),
      category: 'Sustainability'
    },
    {
      title: 'GitHub Dashboard',
      description: 'Track your open-source projects and development workflows in real-time.',
      link: `${baseUrl}/github`,
      pubDate: new Date().toISOString(),
      category: 'Developer'
    }
  ]

  // Combine static items with GitHub activity
  const items = [...githubActivity, ...staticItems].slice(0, 15)

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Organic OS</title>
    <description>The Operating System for Being Human</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/feed" rel="self" type="application/rss+xml"/>
    ${items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
      <guid>${item.link}</guid>
      ${item.category ? `<category>${item.category}</category>` : ''}
    </item>`).join('')}
  </channel>
</rss>`

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 's-maxage=1800, stale-while-revalidate'
    }
  })
}
