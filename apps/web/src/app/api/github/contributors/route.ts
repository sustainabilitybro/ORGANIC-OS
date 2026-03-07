import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export async function GET() {
  try {
    // Get contributors across all repos
    const repos = [
      'ORGANIC-OS', 
      'atom-economy', 
      'Holistic-Alchemy',
      'Burnout',
      'emotional-mastery',
      'identity',
      'personal-os'
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
          return data.map((contributor: any) => ({
            ...contributor,
            repo
          }));
        } catch {
          return [];
        }
      })
    );
    
    const contributors = allContributors.flat();
    
    // Aggregate by user
    const aggregated = contributors.reduce((acc, c) => {
      if (!acc[c.login]) {
        acc[c.login] = {
          login: c.login,
          avatar_url: c.avatar_url,
          contributions: 0,
          html_url: c.html_url,
          repos: []
        };
      }
      acc[c.login].contributions += c.contributions;
      acc[c.login].repos.push(c.repo);
      return acc;
    }, {} as Record<string, any>);
    
    const sortedContributors = Object.values(aggregated)
      .sort((a: any, b: any) => b.contributions - a.contributions)
      .slice(0, 20);
    
    return NextResponse.json({
      total: sortedContributors.length,
      contributors: sortedContributors
    });
  } catch (error) {
    console.error('GitHub contributors error:', error);
    return NextResponse.json({ error: 'Failed to fetch contributors' }, { status: 500 });
  }
}
