import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: '1.0.0',
    modules: [
      { name: 'Identity', status: 'complete', progress: 85 },
      { name: 'Emotional', status: 'complete', progress: 72 },
      { name: 'Sensory', status: 'complete', progress: 45 },
      { name: 'Recovery', status: 'complete', progress: 90 },
      { name: 'Communication', status: 'complete', progress: 68 },
      { name: 'Wellness', status: 'complete', progress: 55 },
    ],
    features: {
      aiCoaching: true,
      analytics: true,
      dataExport: true,
      supabaseAuth: true,
    },
  });
}
