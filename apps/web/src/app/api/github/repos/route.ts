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
      updated_at: data.updated_at
    };
  } catch {
    return null;
  }
}

export async function GET() {
  // Featured repos to track
  const repoNames = ['ORGANIC-OS', 'atom-economy', 'holistic-alchemy'];
  
  const repos = await Promise.all(
    repoNames.map(name => fetchRepo(USER, name.toLowerCase()))
  );
  
  const validRepos = repos.filter((r): r is Repo => r !== null);
  
  return NextResponse.json({ 
    repos: validRepos, 
    total: validRepos.length 
  });
}
