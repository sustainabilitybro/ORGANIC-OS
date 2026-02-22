import { NextResponse } from 'next/server';

const links = {
  github: 'https://github.com/sustainabilitybro',
  vercel: 'https://vercel.com',
  supabase: 'https://supabase.com',
  notox: 'https://notox.fm',
  altlabs: 'https://altlaboratories.com',
  organic_os: 'https://organic-os.vercel.app',
  docs: 'https://github.com/sustainabilitybro/ORGANIC-OS#readme'
};

export async function GET() {
  return NextResponse.json({
    links,
    total: Object.keys(links).length
  });
}
