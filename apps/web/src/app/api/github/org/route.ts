import { NextResponse } from 'next/server';

const ORG = 'sustainabilitybro';

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/orgs/${ORG}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Organic-OS'
      },
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Org not found' }, { status: 404 });
    }
    
    const data = await res.json();
    return NextResponse.json({
      login: data.login,
      name: data.name,
      description: data.description,
      public_repos: data.public_repos,
      followers: data.followers,
      avatar_url: data.avatar_url,
      url: data.html_url
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch org data' }, { status: 500 });
  }
}
