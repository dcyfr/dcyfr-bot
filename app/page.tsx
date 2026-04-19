import Link from 'next/link';
import type { Agent, ReputationEntry } from '@/lib/types';
import agentsData from '@/data/agents.json';
import reputationData from '@/data/reputation.json';
import { AgentCard } from '@/components/AgentCard';

const agents = agentsData as Agent[];
const reputation = reputationData as ReputationEntry[];

function getFeatured(): Array<{ agent: Agent; rep: ReputationEntry }> {
  return [...reputation]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 6)
    .flatMap((rep) => {
      const agent = agents.find((a) => a.agentId === rep.agentId);
      return agent ? [{ agent, rep }] : [];
    });
}

export default function HomePage() {
  const featured = getFeatured();
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-muted/40 border border-primary/60/40 rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-primary/80 animate-pulse" aria-hidden="true" />
            Launching Q4 2026
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            32 Production Agents.{' '}
            <span className="text-muted-foreground">One Marketplace.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Browse, deploy, and chat with battle-tested AI agents from the DCYFR workspace.
            Every agent is MIT licensed, TLP-GREEN, and production-validated.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Browse Agents
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 border border-primary/60/60 hover:border-primary/50 text-muted-foreground hover:text-foreground/80 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border/40 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '16', label: 'Public Agents' },
            { value: '32', label: 'Workspace Agents' },
            { value: '100%', label: 'MIT Licensed' },
            { value: 'Live', label: 'Chat Interface' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-muted-foreground">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground/80">Top Rated Agents</h2>
          <Link href="/agents" className="text-sm text-muted-foreground hover:text-muted-foreground transition-colors">
            View all 16 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(({ agent, rep }) => (
            <AgentCard key={agent.agentId} agent={agent} reputation={rep} />
          ))}
        </div>
      </section>
    </div>
  );
}
