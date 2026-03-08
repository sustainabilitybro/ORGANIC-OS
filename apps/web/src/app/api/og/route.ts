import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Organic OS',
    tagline: 'The Operating System for Being Human',
    features: [
      'Identity & Values',
      'Emotional Intelligence',
      'Wellness Tracking',
      'Sensory Profiles',
      'Recovery & Burnout',
      'Communication Skills'
    ],
    tech: ['Next.js', 'React', 'Tailwind', 'Supabase'],
    links: {
      github: 'https://github.com/sustainabilitybro/ORGANIC-OS',
      demo: 'https://organic-os.vercel.app'
    },
    timestamp: new Date().toISOString()
  });
}
