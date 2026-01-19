/**
 * State management with GitHub as source of truth
 * Fetches from GitHub raw content with local caching
 */

const REPO_OWNER = 'fabriziosalmi';
const REPO_NAME = 'enjoy';
const STATE_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/state.json`;
const KARMA_BADGE_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/badges/karma.json`;

// Cache TTL: 30 seconds
const CACHE_TTL_MS = 30_000;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES (mirroring engine/src/types.ts)
// ═══════════════════════════════════════════════════════════════════════════

export interface Player {
  karma: number;
  prs: number;
  streak: number;
  achievements: string[];
  high_quality_count: number;
  referrals: number;
  bugs_reported: number;
  bounties_completed: number;
  mystery_boxes: number;
  last_contribution: string;
  joined: string;
  name: string;
  time_stats?: Record<string, number>;
}

export interface Bounty {
  id: string;
  title: string;
  karma: number;
  claimed_by: string | null;
}

export interface GameState {
  version: string;
  last_updated: string;
  last_pr: string;
  score: {
    total: number;
    today: number;
    streak_days: number;
    all_time_high: number;
  };
  levels: {
    current: number;
    max_level: number;
    unlocked: number[];
  };
  karma: {
    global: number;
    multiplier_active: number;
  };
  players: Record<string, Player>;
  bounties: {
    active: Bounty[];
    completed: Bounty[];
  };
  meta: {
    total_prs: number;
    total_players: number;
    game_started: string;
  };
  time_system: {
    current_period: string;
    most_active_period: string;
  };
  engagement: {
    karma_log: Array<{
      actor: string;
      event: string;
      karma: number;
      timestamp: string;
    }>;
    by_user: Record<string, { total: number; history: any[] }>;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CACHE
// ═══════════════════════════════════════════════════════════════════════════

interface Cache<T> {
  data: T | null;
  timestamp: number;
}

const stateCache: Cache<GameState> = { data: null, timestamp: 0 };

function isCacheValid<T>(cache: Cache<T>): boolean {
  if (!cache.data) return false;
  return Date.now() - cache.timestamp < CACHE_TTL_MS;
}

// ═══════════════════════════════════════════════════════════════════════════
// FETCHERS
// ═══════════════════════════════════════════════════════════════════════════

export async function getState(bypassCache = false): Promise<GameState> {
  if (!bypassCache && isCacheValid(stateCache) && stateCache.data) {
    return stateCache.data;
  }

  try {
    const response = await fetch(STATE_URL, {
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch state: ${response.status}`);
    }

    const state = await response.json() as GameState;

    // Update cache
    stateCache.data = state;
    stateCache.timestamp = Date.now();

    return state;
  } catch (error) {
    // If fetch fails and we have cached data, return stale cache
    if (stateCache.data) {
      console.error('Fetch failed, returning stale cache:', error);
      return stateCache.data;
    }
    throw error;
  }
}

export async function getKarmaBadge(): Promise<{ karma: number }> {
  try {
    const response = await fetch(KARMA_BADGE_URL);
    if (!response.ok) throw new Error(`Failed to fetch badge: ${response.status}`);
    const badge = await response.json();
    return { karma: parseInt(badge.message, 10) || 0 };
  } catch {
    return { karma: 0 };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export async function getPlayer(username: string): Promise<Player | null> {
  const state = await getState();
  return state.players[username] || null;
}

export async function getLeaderboard(limit = 10): Promise<Array<{ name: string; karma: number; prs: number }>> {
  const state = await getState();

  return Object.entries(state.players)
    .map(([name, player]) => ({
      name,
      karma: player.karma,
      prs: player.prs
    }))
    .sort((a, b) => b.karma - a.karma)
    .slice(0, limit);
}

export async function getActiveBounties(): Promise<Bounty[]> {
  const state = await getState();
  return state.bounties.active.filter(b => !b.claimed_by);
}

export async function getRecentKarmaLog(limit = 20): Promise<GameState['engagement']['karma_log']> {
  const state = await getState();
  return state.engagement.karma_log.slice(-limit).reverse();
}

export function invalidateCache(): void {
  stateCache.data = null;
  stateCache.timestamp = 0;
}
