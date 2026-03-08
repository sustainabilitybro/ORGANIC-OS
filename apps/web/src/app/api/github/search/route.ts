import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'repos'; // repos, issues, code
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
    }
    
    // Search across user's repos
    const searchQuery = `${query} repo:${USER}/*`;
    
    const res = await fetch(
      `https://api.github.com/search/code?q=${encodeURIComponent(searchQuery)}&per_page=20`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Organic-OS'
        },
        next: { revalidate: 600 }
      }
    );
    
    if (!res.ok) {
      // Fall back to repo search
      const repoRes = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+user:${USER}&per_page=10`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Organic-OS'
          },
          next: { revalidate: 600 }
        }
      );
      
      if (!repoRes.ok) {
        return NextResponse.json({ error: 'Search failed' }, { status: repoRes.status });
      }
      
      const data = await repoRes.json();
      return NextResponse.json({
        type: 'repositories',
        query,
        results: (data.items || []).map((repo: any) => ({
          name: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          language: repo.language,
          url: repo.html_url,
          updated: repo.updated_at
        })),
        total: data.total_count
      });
    }
    
    const data = await res.json();
    
    return NextResponse.json({
      type: 'code',
      query,
      results: (data.items || []).slice(0, 20).map((item: any) => ({
        name: item.name,
        path: item.path,
        repo: item.repository.name,
        url: item.html_url,
        score: item.score
      })),
      total: data.total_count
    });
  } catch (error) {
    console.error('GitHub search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
