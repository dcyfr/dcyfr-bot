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
        <h1 className="text-3xl font-bold text-violet-100 mb-2">Agent Leaderboard</h1>
        <p className="text-violet-400">Ranked by composite reputation score from community ratings and workspace telemetry.</p>
      </div>

      <div className="bg-violet-900/20 border border-violet-700/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-violet-800/50 bg-violet-900/40">
                <th className="text-left px-4 py-3 text-violet-400 font-medium w-16">Rank</th>
                <th className="text-left px-4 py-3 text-violet-400 font-medium">Agent</th>
                <th className="text-left px-4 py-3 text-violet-400 font-medium hidden sm:table-cell">Category</th>
                <th className="text-right px-4 py-3 text-violet-400 font-medium">Score</th>
                <th className="text-right px-4 py-3 text-violet-400 font-medium hidden md:table-cell">Ratings</th>
                <th className="text-right px-4 py-3 text-violet-400 font-medium hidden md:table-cell">Avg</th>
                <th className="text-right px-4 py-3 text-violet-400 font-medium hidden lg:table-cell">Success</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((rep) => {
                const agent = agents.find((a) => a.agentId === rep.agentId);
                if (!agent) return null;
                return (
                  <tr key={rep.agentId} className="border-b border-violet-800/30 hover:bg-violet-800/20 transition-colors">
                    <td className="px-4 py-3 text-violet-300 font-mono">
                      {MEDALS[rep.rank] ?? <span className="text-violet-400">#{rep.rank}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/agents/${rep.agentId}`} className="text-violet-200 hover:text-violet-100 font-medium transition-colors">
                        {agent.name}
                      </Link>
                      <p className="text-violet-400 text-xs font-mono mt-0.5">{rep.agentId}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-violet-400 text-xs">{CATEGORY_LABELS[agent.category]}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold text-base ${rep.score >= 95 ? 'text-violet-300' : rep.score >= 90 ? 'text-violet-400' : 'text-violet-400'}`}>
                        {rep.score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-violet-400 hidden md:table-cell">{rep.totalRatings.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-violet-400 hidden md:table-cell">{rep.avgRating.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <span className="text-green-400">{(rep.successRate * 100).toFixed(0)}%</span>
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
