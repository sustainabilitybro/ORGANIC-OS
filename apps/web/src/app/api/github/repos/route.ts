import { NextResponse } from 'next/server';

const mockRepos = [
  { name: 'ORGANIC-OS', description: 'Sustainable OS', stars: 42, forks: 12, language: 'TypeScript' },
  { name: 'atom-economy', description: 'Chemical efficiency', stars: 15, forks: 3, language: 'Python' },
  { name: 'holistic-alchemy', description: 'Wellness module', stars: 8, forks: 2, language: 'TypeScript' }
];

export async function GET() {
  return NextResponse.json({ repos: mockRepos, total: 3 });
}
