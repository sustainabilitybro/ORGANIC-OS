import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
  type: string;
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
    
    const allContributors = await Promise.all(
      repos.map(async (repo) => {
        try {
          const res = await fetch(
            `https://api.github.com/repos/${USER}/${repo}/contributors?per_page=10`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Organic-OS'
              },
              next: { revalidate: 3600 }
            }
          );
          
          if (!res.ok) return [];
          
          const data = await res.json();
          return data.map((c: any) => ({
            login: c.login,
            avatar_url: c.avatar_url,
            contributions: c.contributions,
            html_url: c.html_url,
            type: c.type,
            repo
          }));
        } catch {
          return [];
        }
      })
    );
    
    const contributors = allContributors.flat();
    
    // Aggregate by user
    const byUser: Record<string, Contributor> = {};
    contributors.forEach((c: any) => {
      if (!byUser[c.login]) {
        byUser[c.login] = {
          login: c.login,
          avatar_url: c.avatar_url,
          contributions: 0,
          html_url: c.html_url,
          type: c.type
        };
      }
      byUser[c.login].contributions += c.contributions;
    });
    
    const sorted = Object.values(byUser).sort((a, b) => b.contributions - a.contributions);
    
    return NextResponse.json({
      top_contributors: sorted.slice(0, 20),
      total_contributors: sorted.length,
      repos_tracked: repos.length
    });
  } catch (error) {
    console.error('GitHub contributors error:', error);
    return NextResponse.json({ error: 'Failed to fetch contributors' }, { status: 500 });
  }
}
