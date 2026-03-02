import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';
const REPO = 'ORGANIC-OS';

interface WorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  head_branch: string;
  head_sha: string;
  run_number: number;
  event: string;
  created_at: string;
  updated_at: string;
  actor: string;
}

export async function GET() {
  try {
    // Fetch recent workflow runs
    const res = await fetch(`https://api.github.com/repos/${USER}/${REPO}/actions/runs?per_page=10`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Organic-OS'
      },
      next: { revalidate: 600 } // Revalidate every 10 minutes
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch workflow runs' }, { status: res.status });
    }
    
    const data = await res.json();
    
    const runs: WorkflowRun[] = data.workflow_runs?.map((run: any) => ({
      id: run.id,
      name: run.name,
      status: run.status,
      conclusion: run.conclusion,
      head_branch: run.head_branch,
      head_sha: run.head_sha.substring(0, 7),
      run_number: run.run_number,
      event: run.event,
      created_at: run.created_at,
      updated_at: run.updated_at,
      actor: run.actor?.login || 'unknown'
    })) || [];
    
    // Calculate stats
    const stats = {
      total_runs: runs.length,
      successful: runs.filter(r => r.conclusion === 'success').length,
      failed: runs.filter(r => r.conclusion === 'failure').length,
      in_progress: runs.filter(r => r.status === 'in_progress').length,
      cancelled: runs.filter(r => r.conclusion === 'cancelled').length
    };
    
    return NextResponse.json({
      repo: REPO,
      owner: USER,
      workflow_runs: runs,
      stats
    });
  } catch (error) {
    console.error('GitHub actions error:', error);
    return NextResponse.json({ error: 'Failed to fetch workflow data' }, { status: 500 });
  }
}
