import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: 'Organic OS',
    short_name: 'OrganicOS',
    description: 'The Operating System for Being Human',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10b981',
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
    categories: ['health', 'fitness', 'lifestyle'],
    lang: 'en-US'
  };
  
  return NextResponse.json(manifest);
}
