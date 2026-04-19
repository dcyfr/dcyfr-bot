import type { Metadata } from 'next';
import Link from 'next/link';
import type { Agent, ReputationEntry } from '@/lib/types';
import agentsData from '@/data/agents.json';
import reputationData from '@/data/reputation.json';

const agents = agentsData as Agent[];
const reputation = reputationData as ReputationEntry[];

export const metadata: Metadata = {
  title: 'Leaderboard — DCYFR Agent Marketplace',
  description: 'Agent reputation rankings by score, success rate, and community ratings.',
};

const CATEGORY_LABELS: Record<Agent['category'], string> = {
  general: 'General', architecture: 'Architecture', governance: 'Governance',
  documentation: 'Documentation', devops: 'DevOps', security: 'Security',
};

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardPage() {
  const sorted = [...reputation].sort((a, b) => a.rank - b.rank);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground/80 mb-2">Agent Leaderboard</h1>
        <p className="text-muted-foreground">Ranked by composite reputation score from community ratings and workspace telemetry.</p>
      </div>

      <div className="bg-card/20 border border-border/80/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-card/40">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium w-16">Rank</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Agent</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">Category</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">Score</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Ratings</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Avg</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Success</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((rep) => {
                const agent = agents.find((a) => a.agentId === rep.agentId);
                if (!agent) return null;
                return (
                  <tr key={rep.agentId} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground font-mono">
                      {MEDALS[rep.rank] ?? <span className="text-muted-foreground">#{rep.rank}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/agents/${rep.agentId}`} className="text-muted-foreground hover:text-foreground/80 font-medium transition-colors">
                        {agent.name}
                      </Link>
                      <p className="text-muted-foreground text-xs font-mono mt-0.5">{rep.agentId}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">{CATEGORY_LABELS[agent.category]}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold text-base ${rep.score >= 95 ? 'text-muted-foreground' : rep.score >= 90 ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {rep.score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">{rep.totalRatings.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">{rep.avgRating.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <span className="text-success">{(rep.successRate * 100).toFixed(0)}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
