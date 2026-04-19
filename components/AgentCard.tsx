import Link from 'next/link';
import type { Agent, ReputationEntry } from '@/lib/types';

interface Props {
  agent: Agent;
  reputation?: ReputationEntry;
  compact?: boolean;
}

// CATEGORY_COLORS — 6 agent categories mapped to semantic tokens where the
// intent matches, with 2 deliberate carveouts (documentation=cyan, devops=
// orange) that have no matching semantic on the violet+purple identity
// palette. See openspec/changes/dcyfr-bot-onboarding §2 for the mapping
// rationale.
// Lint exception recorded in the openspec change (carveouts intentional).
const CATEGORY_COLORS: Record<Agent['category'], string> = {
  general:       'bg-secure/20 border-secure/40 text-secure',
  architecture:  'bg-warning/40 border-warning/40 text-warning',
  governance:    'bg-success/20 border-success/40 text-success',
  documentation: 'bg-cyan-900/40 border-cyan-700/40 text-cyan-300',
  devops:        'bg-orange-900/40 border-orange-700/40 text-orange-300',
  security:      'bg-destructive/40 border-destructive/40 text-destructive',
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
      className="group block bg-card/20 border border-border/80/30 rounded-xl p-5 hover:bg-muted/30 hover:border-primary/60/50 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground/80 group-hover:text-foreground transition-colors truncate">
            {agent.name}
          </h3>
          <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">{agent.agentId}</p>
        </div>
        {reputation && (
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold text-muted-foreground">{reputation.score}</p>
            <p className="text-xs text-muted-foreground">score</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[agent.category]}`}>
          {CATEGORY_LABELS[agent.category]}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/30 border border-success/30 text-success">
          {agent.tlpClearance}
        </span>
      </div>

      {!compact && (
        <p className="text-sm text-muted-foreground line-clamp-2">{agent.description}</p>
      )}

      {reputation && !compact && (
        <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-4 text-xs text-muted-foreground">
          <span>★ {reputation.avgRating.toFixed(1)}</span>
          <span>{reputation.totalRatings} ratings</span>
          <span>{(reputation.successRate * 100).toFixed(0)}% success</span>
        </div>
      )}
    </Link>
  );
}
