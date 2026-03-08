import { NextResponse } from 'next/server';

const GITHUB_USER = 'sustainabilitybro';

export async function GET() {
  try {
    // Get all repos
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Organic-OS'
        },
        next: { revalidate: 1800 }
      }
    );
    
    if (!reposRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch repos' }, { status: reposRes.status });
    }
    
    const repos = await reposRes.json();
    
    // Calculate stats
    const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0);
    const totalIssues = repos.reduce((sum: number, r: any) => sum + (r.open_issues_count || 0), 0);
    
    // Language breakdown
    const languages: Record<string, number> = {};
    repos.forEach((repo: any) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });
    
    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRepos = repos.filter((r: any) => new Date(r.updated_at) > sevenDaysAgo);
    
    // Stats by topic
    const topics: Record<string, number> = {};
    repos.forEach((repo: any) => {
      (repo.topics || []).forEach((topic: string) => {
        topics[topic] = (topics[topic] || 0) + 1;
      });
    });
    
    return NextResponse.json({
      overview: {
        totalRepos: repos.length,
        totalStars,
        totalForks,
        totalIssues,
        avgStars: repos.length > 0 ? Math.round(totalStars / repos.length) : 0
      },
      languages: Object.entries(languages)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      recentActivity: {
        reposUpdated: recentRepos.length,
        lastUpdate: repos[0]?.updated_at || null
      },
      topics: Object.entries(topics)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
