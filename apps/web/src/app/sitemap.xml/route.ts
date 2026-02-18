import { NextResponse } from 'next/server';

const pages = [
  '/',
  '/analytics',
  '/atom-economy',
  '/auth',
  '/communication',
  '/dashboard',
  '/emotional',
  '/holistic-alchemy',
  '/identity',
  '/progress',
  '/recovery',
  '/sensory',
  '/settings',
  '/sustainability',
  '/video',
  '/wellness',
];

export async function GET() {
  const baseUrl = 'https://organic-os.com';
  
  const sitemap = pages.map(page => {
    return `  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`;
  }).join('\n');

  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap}
</urlset>`, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
