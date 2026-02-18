// Sitemap generator utility
const pages = [
  '/',
  '/analytics',
  '/atom-economy',
  '/auth',
  '/communication',
  '/dashboard',
  '/emotional',
  '/holistic-alchemy',
  '/identity',
  '/progress',
  '/recovery',
  '/sensory',
  '/settings',
  '/sustainability',
  '/video',
  '/wellness',
];

export function generateSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://organic-os.com';
  
  const sitemap = pages.map(page => {
    return `  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap}
</urlset>`;
}
