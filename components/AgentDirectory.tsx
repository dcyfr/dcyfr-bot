'use client';

import { useState } from 'react';
import type { Agent, ReputationEntry } from '@/lib/types';
import { AgentCard } from '@/components/AgentCard';

interface Props {
  agents: Agent[];
  reputation: ReputationEntry[];
}

type CategoryFilter = 'all' | Agent['category'];

const CATEGORIES: Array<{ value: CategoryFilter; label: string }> = [
  { value: 'all',           label: 'All' },
  { value: 'general',       label: 'General' },
  { value: 'architecture',  label: 'Architecture' },
  { value: 'governance',    label: 'Governance' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'devops',        label: 'DevOps' },
  { value: 'security',      label: 'Security' },
];

export function AgentDirectory({ agents, reputation }: Readonly<Props>) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filtered = activeCategory === 'all'
    ? agents
    : agents.filter((a) => a.category === activeCategory);

  function getRep(agentId: string): ReputationEntry | undefined {
    return reputation.find((r) => r.agentId === agentId);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === cat.value
                ? 'bg-primary border-primary/50 text-white'
                : 'bg-card/20 border-border/80/40 text-muted-foreground hover:text-muted-foreground hover:border-primary/60/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Showing {filtered.length} agent{filtered.length !== 1 ? 's' : ''}
        {activeCategory !== 'all' ? ` in ${activeCategory}` : ''}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((agent) => (
          <AgentCard key={agent.agentId} agent={agent} reputation={getRep(agent.agentId)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-16 text-muted-foreground">No agents in this category yet.</p>
      )}
    </div>
  );
}
