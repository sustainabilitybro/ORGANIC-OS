import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

interface LanguageStats {
  [language: string]: number;
}

export async function GET() {
  try {
    // Fetch all repos
    const res = await fetch(
      `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Organic-OS'
        },
        next: { revalidate: 3600 }
      }
    );
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch repos' }, { status: res.status });
    }
    
    const repos = await res.json();
    
    // Aggregate language stats
    const languageStats: LanguageStats = {};
    let totalRepos = 0;
    
    for (const repo of repos) {
      if (repo.language) {
        if (!languageStats[repo.language]) {
          languageStats[repo.language] = 0;
        }
        languageStats[repo.language]++;
        totalRepos++;
      }
    }
    
    // Convert to percentages and sort
    const languages = Object.entries(languageStats)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalRepos > 0 ? Math.round((count / totalRepos) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
    
    return NextResponse.json({
      totalRepos: repos.length,
      totalLanguages: languages.length,
      languages,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('GitHub languages error:', error);
    return NextResponse.json({ error: 'Failed to fetch language data' }, { status: 500 });
  }
}
