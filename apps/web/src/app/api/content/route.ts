import { NextResponse } from 'next/server';

const modules = [
  { id: 'identity', name: 'Identity', description: 'Discover your core values and life purpose', icon: 'user' },
  { id: 'sensory', name: 'Sensory', description: 'Map your sensory profile and preferences', icon: 'eye' },
  { id: 'emotional', name: 'Emotional', description: 'Track and regulate your emotions', icon: 'heart' },
  { id: 'wellness', name: 'Wellness', description: 'Monitor physical wellness and recovery', icon: 'activity' },
  { id: 'recovery', name: 'Recovery', description: 'Optimize rest and recovery', icon: 'battery' },
  { id: 'communication', name: 'Communication', description: 'Improve speaking and communication', icon: 'message' },
  { id: 'video', name: 'Video', description: 'Video practice and feedback', icon: 'video' },
  { id: 'atom-economy', name: 'Atom Economy', description: 'Chemical process efficiency', icon: 'flask' },
  { id: 'holistic-alchemy', name: 'Holistic Alchemy', description: 'Integrate wellness modules', icon: 'sparkles' }
];

export async function GET() {
  return NextResponse.json({
    modules,
    total: modules.length,
    version: '1.0.0'
  });
}
