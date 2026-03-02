import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Return SVG OG image
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6B7F3B"/>
      <stop offset="100%" style="stop-color:#3A3226"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="280" font-family="system-ui" font-size="72" font-weight="bold" fill="white" text-anchor="middle">
    Organic OS
  </text>
  <text x="600" y="370" font-family="system-ui" font-size="32" fill="#D4E8A0" text-anchor="middle">
    The Operating System for Being Human
  </text>
  <text x="600" y="500" font-family="system-ui" font-size="24" fill="#FAF8F5" text-anchor="middle">
    Personal Development • Wellness • Sustainability
  </text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate'
    }
  })
}
