import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

interface WorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  branch: string;
  event: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  actor: string;
}

export async function GET() {
  try {
    const repo = process.env.GITHUB_ACTIONS_REPO || 'ORGANIC-OS';
    
    const res = await fetch(
      `https://api.github.com/repos/${USER}/${repo}/actions/runs?per_page=10`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Organic-OS'
        },
        next: { revalidate: 300 } // 5 minutes cache
      }
    );
    
    if (!res.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch GitHub Actions',
        status: res.status 
      }, { status: res.status });
    }
    
    const data = await res.json();
    
    const runs: WorkflowRun[] = (data.workflow_runs || []).map((run: any) => ({
      id: run.id,
      name: run.name,
      status: run.status,
      conclusion: run.conclusion,
      branch: run.head_branch,
      event: run.event,
      created_at: run.created_at,
      updated_at: run.updated_at,
      html_url: run.html_url,
      actor: run.actor?.login || 'unknown'
    }));
    
    return NextResponse.json({
      repo,
      runs,
      count: runs.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GitHub Actions error:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub Actions' }, { status: 500 });
  }
}
