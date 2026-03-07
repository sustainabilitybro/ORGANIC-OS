import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

interface Repo {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  updated_at: string;
  open_issues: number;
  watchers: number;
  topics: string[];
}

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

async function fetchRepo(owner: string, repo: string): Promise<Repo | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Organic-OS'
      },
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return {
      name: data.name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      url: data.html_url,
      updated_at: data.updated_at,
      open_issues: data.open_issues_count,
      watchers: data.watchers_count,
      topics: data.topics || []
    };
  } catch {
    return null;
  }
}

async function fetchRecentCommits(owner: string, repo: string): Promise<Commit[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Organic-OS'
      },
      next: { revalidate: 1800 }
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.map((commit: any) => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message.split('\n')[0],
      author: commit.commit.author.name,
      date: commit.commit.author.date
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  // All repos from sustainabilitybro
  const repoNames = [
    'ORGANIC-OS', 
    'atom-economy', 
    'Holistic-Alchemy',
    'Burnout',
    'emotional-mastery',
    'identity',
    'naturopath',
    'personal-os',
    'sensory-dictionary',
    'speaker'
  ];
  
  const repos = await Promise.all(
    repoNames.map(name => fetchRepo(USER, name))
  );
  
  const validRepos = repos.filter((r): r is Repo => r !== null);
  
  // Sort by stars (most popular first)
  validRepos.sort((a, b) => b.stars - a.stars);
  
  // Also fetch recent commits for each repo
  const reposWithCommits = await Promise.all(
    validRepos.map(async (repo) => {
      const commits = await fetchRecentCommits(USER, repo.name);
      return { ...repo, recent_commits: commits };
    })
  );
  
  // Calculate totals
  const totals = {
    stars: reposWithCommits.reduce((sum, r) => sum + r.stars, 0),
    forks: reposWithCommits.reduce((sum, r) => sum + r.forks, 0),
    issues: reposWithCommits.reduce((sum, r) => sum + r.open_issues, 0),
    watchers: reposWithCommits.reduce((sum, r) => sum + r.watchers, 0)
  };
  
  return NextResponse.json({ 
    repos: reposWithCommits, 
    total: reposWithCommits.length,
    totals,
    username: USER
  });
}
