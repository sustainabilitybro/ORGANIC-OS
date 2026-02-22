import { NextResponse } from 'next/server';

const USER = 'sustainabilitybro';

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/users/${USER}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Organic-OS'
      },
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const data = await res.json();
    return NextResponse.json({
      login: data.login,
      name: data.name,
      bio: data.bio,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      avatar_url: data.avatar_url,
      profile_url: data.html_url,
      created_at: data.created_at
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
