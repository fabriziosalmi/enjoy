// Type definitions for the enjoy game engine

export interface Rule {
  id: string;
  name: string;
  description: string;
  version: number;
  enabled: boolean;
  priority: number;
  trigger: {
    type: string;
    conditions: Array<Record<string, any>>;
  };
  validate: Array<Record<string, boolean>>;
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
  players: Record<string, {
    total_prs: number;
    prs_merged: number;
    karma: number;
    reputation: number;
    contributions: string[];
    last_pr?: string;
  }>;
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
    proposed?: any[];
    voting?: any[];
    archived?: any[];
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
}

export interface ValidationResult {
  valid: boolean;
  matched_rules: string[];
  points: number;
  reason?: string;
  effects?: any[];
}
