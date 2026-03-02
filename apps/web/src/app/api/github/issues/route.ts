import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

interface Issue {
  id: number;
  number: number;
  title: string;
  state: string;
  body: string | null;
  user: string;
  labels: string[];
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

export async function GET() {
  try {
    // Fetch issues across all repos
    const repos = ['ORGANIC-OS', 'atom-economy', 'Holistic-Alchemy'];
    
    const allIssues = await Promise.all(
      repos.map(async (repo) => {
        try {
          const res = await fetch(
            `https://api.github.com/repos/${USER}/${repo}/issues?state=open&per_page=10`,
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
          return data
            .filter((issue: any) => !issue.pull_request) // Filter out PRs
            .map((issue: any) => ({
              id: issue.id,
              number: issue.number,
              title: issue.title,
              state: issue.state,
              body: issue.body,
              user: issue.user.login,
              labels: issue.labels.map((l: any) => l.name),
              comments: issue.comments,
              created_at: issue.created_at,
              updated_at: issue.updated_at,
              closed_at: issue.closed_at,
              repo
            }));
        } catch {
          return [];
        }
      })
    );
    
    const issues = allIssues.flat();
    
    // Sort by updated date
    issues.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    
    return NextResponse.json({
      total: issues.length,
      issues: issues.slice(0, 20) // Return top 20
    });
  } catch (error) {
    console.error('GitHub issues error:', error);
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}
