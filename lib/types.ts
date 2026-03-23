export interface Agent {
  agentId: string;
  name: string;
  description: string;
  longDescription?: string;
  category: 'general' | 'architecture' | 'governance' | 'documentation' | 'devops' | 'security';
  tier: 'workspace' | 'community';
  version: string;
  license: 'MIT' | 'Apache-2.0';
  tools: string[];
  capabilities: string[];
  skillTags: string[];
  tlpClearance: 'GREEN' | 'AMBER';
  public: boolean;
}

export interface ReputationEntry {
  agentId: string;
  score: number;
  totalRatings: number;
  avgRating: number;
  successRate: number;
  rank: number;
}
