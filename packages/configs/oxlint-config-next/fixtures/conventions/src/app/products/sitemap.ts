import type { MetadataRoute } from 'next';

type SitemapProps = { id: Promise<string> };

export function generateSitemaps(): { id: string }[] {
  return [{ id: 'all' }];
}

export default async function sitemap({ id }: SitemapProps): Promise<MetadataRoute.Sitemap> {
  return [{ url: `https://example.com/products/${await id}` }];
}
