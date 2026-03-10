import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

interface LanguageStats {
  [key: string]: number;
}

export async function GET() {
  try {
    const repos = [
      'ORGANIC-OS', 
      'atom-economy', 
      'Holistic-Alchemy',
      'Burnout',
      'emotional-mastery',
      'identity',
      'naturopath',
      'personal-os',
      'sensory-dictionary',
      'speaker'
    ];
    
    const allLanguages: LanguageStats = {};
    
    await Promise.all(
      repos.map(async (repo) => {
        try {
          const res = await fetch(
            `https://api.github.com/repos/${USER}/${repo}/languages`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Organic-OS'
              },
              next: { revalidate: 86400 } // Cache for 24 hours
            }
          );
          
          if (!res.ok) return;
          
          const data = await res.json();
          Object.entries(data).forEach(([lang, bytes]: [string, any]) => {
            allLanguages[lang] = (allLanguages[lang] || 0) + bytes;
          });
        } catch {
          // Skip failed repos
        }
      })
    );
    
    // Convert to percentages
    const total = Object.values(allLanguages).reduce((sum, v) => sum + v, 0);
    const languages = Object.entries(allLanguages)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: ((bytes / total) * 100).toFixed(2)
      }))
      .sort((a, b) => b.bytes - a.bytes);
    
    return NextResponse.json({
      languages,
      total_bytes: total,
      repo_count: repos.length
    });
  } catch (error) {
    console.error('GitHub languages error:', error);
    return NextResponse.json({ error: 'Failed to fetch languages' }, { status: 500 });
  }
}
