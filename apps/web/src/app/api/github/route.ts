import { NextResponse } from 'next/server';

// GitHub Dashboard Overview - combines all GitHub data
const USER = 'sustainabilitybro';

export async function GET() {
  try {
    // Fetch all data in parallel
    const [reposRes, userRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Organic-OS'
        },
        next: { revalidate: 1800 }
      }),
      fetch(`https://api.github.com/users/${USER}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Organic-OS'
        },
        next: { revalidate: 3600 }
      })
    ]);
    
    const repos = reposRes.ok ? await reposRes.json() : [];
    const user = userRes.ok ? await userRes.json() : null;
    
    // Calculate stats
    const stats = {
      totalRepos: repos.length,
      totalStars: repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0),
      totalForks: repos.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0),
      totalWatchers: repos.reduce((sum: number, r: any) => sum + (r.watchers_count || 0), 0),
      totalIssues: repos.reduce((sum: number, r: any) => sum + (r.open_issues_count || 0), 0)
    };
    
    // Get recent activity
    const recentRepos = repos
      .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 10)
      .map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        updated: repo.updated_at,
        url: repo.html_url
      }));
    
    return NextResponse.json({
      user: user ? {
        login: user.login,
        name: user.name,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        avatarUrl: user.avatar_url,
        profileUrl: user.html_url
      } : null,
      stats,
      recentRepos,
      repos: recentRepos,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GitHub overview error:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
