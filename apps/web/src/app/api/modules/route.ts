import { NextResponse } from 'next/server';

const modules = [
  { id: 'identity', name: 'Identity', icon: '👤', color: 'emerald', progress: 85 },
  { id: 'sensory', name: 'Sensory', icon: '👁️', color: 'cyan', progress: 45 },
  { id: 'emotional', name: 'Emotional', icon: '💚', color: 'green', progress: 72 },
  { id: 'wellness', name: 'Wellness', icon: '🌿', color: 'lime', progress: 55 },
  { id: 'recovery', name: 'Recovery', icon: '🔋', color: 'amber', progress: 90 },
  { id: 'communication', name: 'Communication', icon: '🎤', color: 'purple', progress: 68 },
  { id: 'sustainability', name: 'Sustainability', icon: '🌱', color: 'emerald', progress: 100 },
  { id: 'holistic-alchemy', name: 'Holistic Alchemy', icon: '🧪', color: 'violet', progress: 100 },
  { id: 'atom-economy', name: 'Atom Economy', icon: '⚛️', color: 'blue', progress: 100 },
  { id: 'video', name: 'Video', icon: '📹', color: 'rose', progress: 40 },
];

export async function GET() {
  return NextResponse.json({
    modules,
    total: modules.length,
    averageProgress: Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length),
  });
}
