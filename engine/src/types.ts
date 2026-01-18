// Type definitions for the enjoy game engine

export interface Player {
  // Core stats
  karma: number;
  prs: number;
  total_prs?: number;
  prs_merged?: number;
  issues?: number;
  streak: number;
  achievements: string[];
  joined: string;
  
  // Optional tracking
  high_quality_count?: number;
  referrals?: number;
  bugs_reported?: number;
  bounties_completed?: number;
  mystery_boxes?: number;
  last_contribution?: string;
  reputation?: number;
  contributions?: string[];
  last_pr?: string;
  name?: string;
}

export interface TriggerCondition {
  extension?: string;
  max_files?: number;
  max_lines?: number;
  max_chars?: number;
  pattern?: string;
}

export interface ValidationCondition {
  not_profanity?: boolean;
  not_duplicate?: boolean;
  max_emoji?: number;
}

export interface RuleEffect {
  rule_id: string;
  effect: {
    action: string;
    element: {
      type: string;
      content: string;
      position: string;
      color: string;
      size: number;
    };
  };
}

export interface RuleProposalContent {
  id: string;
  name: string;
  description: string;
  version?: number;
  enabled?: boolean;
  priority?: number;
  trigger?: {
    type: string;
    conditions: Array<Record<string, unknown>>;
  };
  validate?: Array<Record<string, unknown>>;
  effect?: Record<string, unknown>;
  points?: {
    base: number;
    bonuses?: Array<{ condition: string; points: number }>;
  };
}

export interface RuleProposalState {
  id: string;
  proposed_by: string;
  proposed_at: string;
  rule_file: string;
  rule_content: RuleProposalContent;
  votes_for: Record<string, number>;
  votes_against: Record<string, number>;
  total_for: number;
  total_against: number;
  status: 'voting' | 'approved' | 'rejected' | 'implemented';
  voting_ends: string;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  version: number;
  enabled: boolean;
  priority: number;
  trigger: {
    type: string;
    conditions: TriggerCondition[];
  };
  validate: ValidationCondition[];
  effect: {
    action: string;
    element: {
      type: string;
      content: string;
      position: string;
      color: string;
      size: number;
    };
  };
  points: {
    base: number;
    bonus?: Array<{
      condition: string;
      points: number;
    }>;
  };
}

export interface BoardElement {
  id: string;
  type: string;
  content?: string;
  x: number;
  y: number;
  color: string;
  size?: number;
  added_by_pr: string;
  added_at: string;
  rule_id: string;
}

export interface GameState {
  version: string;
  last_updated: string;
  last_pr: string | null;
  score: {
    total: number;
    today: number;
    streak_days: number;
  };
  levels: {
    current: number;
    max_level: number;
    unlocked: number[];
    next_unlock: {
      level_id: number;
      requires_score: number;
      requires_prs: number;
      progress: {
        score: number;
        prs: number;
      };
    } | null;
    unlocked_at?: Record<number, string>;
  };
  board: {
    width: number;
    height: number;
    elements: BoardElement[];
  };
  players: Record<string, Player>;
  karma: {
    global: number;
    threshold_good: number;
    multiplier_active: number;
    recent_quality?: number[];
  };
  reputation: {
    top_coders: string[];
    voting_power: Record<string, number>;
  };
  rules: {
    active: string[];
    proposed?: RuleProposalState[];
    voting?: RuleProposalState[];
    archived?: RuleProposalState[];
  };
  referrals?: {
    chains: Record<string, {
      inviter: string;
      invited: string[];
      chain_depth: number;
      referral_karma: number;
      total_contributions: number;
    }>;
    stats: {
      total_invites: number;
      active_chains: number;
      deepest_chain: number;
    };
  };
  achievements?: {
    players: Record<string, string[]>;
  };
  rules_triggered: Record<string, number>;
  meta: {
    total_prs: number;
    total_players: number;
    game_started: string;
    pages_enabled?: boolean;
    last_build?: string | null;
  };
}

export interface PRMetadata {
  number: number;
  author: string;
  files_added: string[];
  files_modified: string[];
  files_removed: string[];
  commit_message: string;
  timestamp: string;
  body?: string;
}

export interface ValidationResult {
  valid: boolean;
  matched_rules: string[];
  points: number;
  reason?: string;
  effects?: RuleEffect[];
}
