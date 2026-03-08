import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

interface RouteParams {
  params: Promise<{ repo: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { repo } = await params;
    const repoName = decodeURIComponent(repo);
    
    // Fetch repo details
    const [repoRes, commitsRes, languagesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${USER}/${repoName}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Organic-OS'
        },
        next: { revalidate: 3600 }
      }),
      fetch(`https://api.github.com/repos/${USER}/${repoName}/commits?per_page=10`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Organic-OS'
        },
        next: { revalidate: 1800 }
      }),
      fetch(`https://api.github.com/repos/${USER}/${repoName}/languages`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Organic-OS'
        },
        next: { revalidate: 3600 }
      })
    ]);
    
    if (!repoRes.ok) {
      return NextResponse.json(
        { error: `Repository ${repoName} not found` },
        { status: repoRes.status }
      );
    }
    
    const repoData = await repoRes.json();
    const commitsData = commitsRes.ok ? await commitsRes.json() : [];
    const languagesData = languagesRes.ok ? await languagesRes.json() : {};
    
    return NextResponse.json({
      repo: {
        name: repoData.name,
        description: repoData.description,
        url: repoData.html_url,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.watchers_count,
        openIssues: repoData.open_issues_count,
        language: repoData.language,
        topics: repoData.topics || [],
        license: repoData.license?.name,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        pushedAt: repoData.pushed_at,
        defaultBranch: repoData.default_branch
      },
      commits: commitsData.map((c: any) => ({
        sha: c.sha.substring(0, 7),
        message: c.commit.message.split('\n')[0],
        author: c.commit.author.name,
        date: c.commit.author.date,
        url: c.html_url
      })),
      languages: Object.entries(languagesData).map(([lang, bytes]: [string, any]) => ({
        name: lang,
        bytes: bytes
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GitHub repo error:', error);
    return NextResponse.json({ error: 'Failed to fetch repository data' }, { status: 500 });
  }
}
