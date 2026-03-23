import type { Metadata } from 'next';
import type { Agent, ReputationEntry } from '@/lib/types';
import agentsData from '@/data/agents.json';
import reputationData from '@/data/reputation.json';
import { AgentDirectory } from '@/components/AgentDirectory';

const agents = agentsData as Agent[];
const reputation = reputationData as ReputationEntry[];

export const metadata: Metadata = {
  title: 'All Agents — DCYFR Agent Marketplace',
  description: 'Browse all 16 public AI agents available on dcyfr.bot.',
};

export default function AgentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-violet-100 mb-2">Agent Directory</h1>
        <p className="text-violet-400">{agents.length} public agents — all MIT licensed, TLP-GREEN, workspace-validated.</p>
      </div>
      <AgentDirectory agents={agents} reputation={reputation} />
    </div>
  );
}
