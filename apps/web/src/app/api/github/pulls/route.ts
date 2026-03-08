import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

export async function GET() {
  try {
    const repos = [
      'ORGANIC-OS', 
      'atom-economy', 
      'Holistic-Alchemy',
      'Burnout',
      'emotional-mastery',
      'identity',
      'personal-os'
    ];
    
    const allPulls = await Promise.all(
      repos.map(async (repo) => {
        try {
          const res = await fetch(
            `https://api.github.com/repos/${USER}/${repo}/pulls?state=all&per_page=10`,
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Organic-OS'
              },
              next: { revalidate: 1800 }
            }
          );
          
          if (!res.ok) return [];
          
          const data = await res.json();
          return data.map((pr: any) => ({
            number: pr.number,
            title: pr.title,
            state: pr.state,
            merged: pr.merged_at !== null,
            repo,
            author: pr.user.login,
            created: pr.created_at,
            updated: pr.updated_at,
            url: pr.html_url
          }));
        } catch {
          return [];
        }
      })
    );
    
    const pulls = allPulls.flat();
    
    // Sort by updated
    pulls.sort((a, b) => 
      new Date(b.updated).getTime() - new Date(a.updated).getTime()
    );
    
    return NextResponse.json({
      total: pulls.length,
      open: pulls.filter(p => p.state === 'open').length,
      closed: pulls.filter(p => p.state === 'closed').length,
      merged: pulls.filter(p => p.merged).length,
      pulls: pulls.slice(0, 30),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GitHub PRs error:', error);
    return NextResponse.json({ error: 'Failed to fetch PRs' }, { status: 500 });
  }
}
