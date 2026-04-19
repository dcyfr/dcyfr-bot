import type { MetadataRoute } from 'next';
import agents from '@/data/agents.json';

const BASE = 'https://dcyfr.bot';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/agents`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  const agentRoutes: MetadataRoute.Sitemap = (agents as { agentId: string; public: boolean }[])
    .filter((a) => a.public)
    .map((a) => ({
      url: `${BASE}/agents/${a.agentId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...agentRoutes];
}
