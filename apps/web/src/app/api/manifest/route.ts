import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const manifest = {
    name: 'Organic OS',
    short_name: 'OrganicOS',
    description: 'The Operating System for Being Human',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF8F5',
    theme_color: '#6B7F3B',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    categories: ['lifestyle', 'health', 'productivity'],
    lang: 'en-US',
    scope: '/',
    prefer_related_applications: false
  }

  return NextResponse.json(manifest, {
    headers: {
      'Cache-Control': 's-maxage=86400, stale-while-revalidate'
    }
  })
}
