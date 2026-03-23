import Link from 'next/link';
import type { Agent, ReputationEntry } from '@/lib/types';

interface Props {
  agent: Agent;
  reputation?: ReputationEntry;
  compact?: boolean;
}

const CATEGORY_COLORS: Record<Agent['category'], string> = {
  general:       'bg-blue-900/40 border-blue-700/40 text-blue-300',
  architecture:  'bg-amber-900/40 border-amber-700/40 text-amber-300',
  governance:    'bg-emerald-900/40 border-emerald-700/40 text-emerald-300',
  documentation: 'bg-cyan-900/40 border-cyan-700/40 text-cyan-300',
  devops:        'bg-orange-900/40 border-orange-700/40 text-orange-300',
  security:      'bg-red-900/40 border-red-700/40 text-red-300',
};

const CATEGORY_LABELS: Record<Agent['category'], string> = {
  general:       'General',
  architecture:  'Architecture',
  governance:    'Governance',
  documentation: 'Documentation',
  devops:        'DevOps',
  security:      'Security',
};

export function AgentCard({ agent, reputation, compact = false }: Readonly<Props>) {
  return (
    <Link
      href={`/agents/${agent.agentId}`}
      className="group block bg-violet-900/20 border border-violet-700/30 rounded-xl p-5 hover:bg-violet-800/30 hover:border-violet-600/50 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-violet-100 group-hover:text-white transition-colors truncate">
            {agent.name}
          </h3>
          <p className="text-xs text-violet-400 font-mono mt-0.5 truncate">{agent.agentId}</p>
        </div>
        {reputation && (
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold text-violet-300">{reputation.score}</p>
            <p className="text-xs text-violet-400">score</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[agent.category]}`}>
          {CATEGORY_LABELS[agent.category]}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/30 border border-green-700/30 text-green-400">
          {agent.tlpClearance}
        </span>
      </div>

      {!compact && (
        <p className="text-sm text-violet-400 line-clamp-2">{agent.description}</p>
      )}

      {reputation && !compact && (
        <div className="mt-3 pt-3 border-t border-violet-800/40 flex items-center gap-4 text-xs text-violet-400">
          <span>★ {reputation.avgRating.toFixed(1)}</span>
          <span>{reputation.totalRatings} ratings</span>
          <span>{(reputation.successRate * 100).toFixed(0)}% success</span>
        </div>
      )}
    </Link>
  );
}
