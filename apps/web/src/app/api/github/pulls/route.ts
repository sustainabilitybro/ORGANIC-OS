import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  body: string | null;
  user: string;
  labels: string[];
  is_draft: boolean;
  is_mergeable: boolean;
  merged: boolean;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  additions: number;
  deletions: number;
  changed_files: number;
  commits: number;
  reviews: number;
  repo: string;
}

export async function GET() {
  try {
    const repos = ['ORGANIC-OS', 'atom-economy', 'Holistic-Alchemy'];
    
    const allPRs = await Promise.all(
      repos.map(async (repo) => {
        try {
          const res = await fetch(
            `https://api.github.com/repos/${USER}/${repo}/pulls?state=open&per_page=10`,
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
            id: pr.id,
            number: pr.number,
            title: pr.title,
            state: pr.state,
            body: pr.body,
            user: pr.user.login,
            labels: pr.labels.map((l: any) => l.name),
            is_draft: pr.draft,
            is_mergeable: pr.mergeable,
            merged: pr.merged,
            created_at: pr.created_at,
            updated_at: pr.updated_at,
            closed_at: pr.closed_at,
            merged_at: pr.merged_at,
            additions: pr.additions,
            deletions: pr.deletions,
            changed_files: pr.changed_files,
            commits: pr.commits,
            reviews: pr.requested_reviewers?.length || 0,
            repo
          }));
        } catch {
          return [];
        }
      })
    );
    
    const prs = allPRs.flat();
    
    // Sort by updated date
    prs.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    
    const stats = {
      total: prs.length,
      drafts: prs.filter(pr => pr.is_draft).length,
      ready_to_merge: prs.filter(pr => !pr.is_draft && pr.is_mergeable).length
    };
    
    return NextResponse.json({
      total: prs.length,
      stats,
      pull_requests: prs.slice(0, 20)
    });
  } catch (error) {
    console.error('GitHub PRs error:', error);
    return NextResponse.json({ error: 'Failed to fetch pull requests' }, { status: 500 });
  }
}
