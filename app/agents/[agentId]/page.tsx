import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Agent, ReputationEntry } from '@/lib/types';
import agentsData from '@/data/agents.json';
import reputationData from '@/data/reputation.json';
import { CapabilityBadge } from '@/components/CapabilityBadge';
import { ChatInterface } from '@/components/ChatInterface';

const agents = agentsData as Agent[];
const reputation = reputationData as ReputationEntry[];

interface PageProps {
  params: Promise<{ agentId: string }>;
}

export function generateStaticParams() {
  return agents.map((a) => ({ agentId: a.agentId }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { agentId } = await params;
  const agent = agents.find((a) => a.agentId === agentId);
  if (!agent) return { title: 'Agent Not Found' };
  return {
    title: `${agent.name} — DCYFR Agents`,
    description: agent.description,
  };
}

const CATEGORY_LABELS: Record<Agent['category'], string> = {
  general: 'General', architecture: 'Architecture', governance: 'Governance',
  documentation: 'Documentation', devops: 'DevOps', security: 'Security',
};

export default async function AgentDetailPage({ params }: PageProps) {
  const { agentId } = await params;
  const agent = agents.find((a) => a.agentId === agentId);
  if (!agent) notFound();

  const rep = reputation.find((r) => r.agentId === agentId);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: agent.name,
    description: agent.description,
    applicationCategory: 'AIApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    license: `https://opensource.org/licenses/${agent.license}`,
    version: agent.version,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/agents" className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 mb-8 transition-colors">
        ← Back to Agents
      </Link>

      <div className="bg-violet-900/30 border border-violet-700/40 rounded-xl p-6 sm:p-8 mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-violet-100 mb-1">{agent.name}</h1>
            <p className="text-violet-400 text-sm font-mono">{agent.agentId}</p>
          </div>
          {rep && (
            <div className="bg-violet-800/50 border border-violet-600/40 rounded-lg px-4 py-3 text-center">
              <p className="text-2xl font-bold text-violet-300">{rep.score}</p>
              <p className="text-xs text-violet-400 mt-0.5">Score</p>
            </div>
          )}
        </div>
        <p className="text-violet-200 mb-6">{agent.longDescription ?? agent.description}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: 'Category', value: CATEGORY_LABELS[agent.category] },
            { label: 'Version', value: agent.version },
            { label: 'License', value: agent.license },
            { label: 'TLP', value: agent.tlpClearance, green: true },
          ].map(({ label, value, green }) => (
            <div key={label}>
              <p className="text-violet-400 text-xs uppercase tracking-wide mb-1">{label}</p>
              <p className={`font-medium ${green ? 'text-green-400' : 'text-violet-200'}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {rep && (
        <div className="bg-violet-900/20 border border-violet-700/30 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-violet-100 mb-4">Reputation</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div><p className="text-2xl font-bold text-violet-300">#{rep.rank}</p><p className="text-xs text-violet-400 mt-0.5">Rank</p></div>
            <div><p className="text-2xl font-bold text-violet-300">{rep.avgRating.toFixed(1)}</p><p className="text-xs text-violet-400 mt-0.5">Avg Rating</p></div>
            <div><p className="text-2xl font-bold text-violet-300">{rep.totalRatings}</p><p className="text-xs text-violet-400 mt-0.5">Ratings</p></div>
            <div><p className="text-2xl font-bold text-violet-300">{(rep.successRate * 100).toFixed(0)}%</p><p className="text-xs text-violet-400 mt-0.5">Success Rate</p></div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-violet-100 mb-3">Capabilities</h2>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.map((cap) => <CapabilityBadge key={cap} label={cap} />)}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-violet-100 mb-3">Skill Tags</h2>
        <div className="flex flex-wrap gap-2">
          {agent.skillTags.map((tag) => (
            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-violet-800/40 border border-violet-700/40 text-violet-300">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold text-violet-100 mb-3">Tools</h2>
        <div className="flex flex-wrap gap-2">
          {agent.tools.map((tool) => (
            <span key={tool} className="inline-flex items-center px-3 py-1 rounded-md text-xs font-mono bg-violet-950 border border-violet-700/50 text-violet-400">
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-violet-100 mb-4">Chat with {agent.name}</h2>
        <ChatInterface agentId={agent.agentId} />
      </div>
    </div>
  );
}
