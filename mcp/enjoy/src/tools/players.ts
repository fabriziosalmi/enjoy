/**
 * Player stats tools
 */

import { getState, getPlayer, getLeaderboard, Player } from '../state.js';

export interface PlayerStats {
  found: boolean;
  player?: Player & { name: string; rank: number };
  error?: string;
}

export async function getPlayerStats(username: string): Promise<PlayerStats> {
  const player = await getPlayer(username);

  if (!player) {
    return {
      found: false,
      error: `Player "${username}" not found`
    };
  }

  // Calculate rank
  const leaderboard = await getLeaderboard(100);
  const rank = leaderboard.findIndex(p => p.name === username) + 1;

  return {
    found: true,
    player: {
      ...player,
      name: username,
      rank: rank || 999
    }
  };
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  karma: number;
  prs: number;
  achievements: number;
}

export async function getFullLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const state = await getState();

  return Object.entries(state.players)
    .map(([name, player]) => ({
      name,
      karma: player.karma,
      prs: player.prs,
      achievements: player.achievements.length
    }))
    .sort((a, b) => b.karma - a.karma)
    .slice(0, limit)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));
}

export interface PlayersOverview {
  total: number;
  active_today: number;
  top_contributor: string;
  newest_player: string;
  players: Array<{ name: string; karma: number; joined: string }>;
}

export async function getPlayersOverview(): Promise<PlayersOverview> {
  const state = await getState();
  const today = new Date().toISOString().split('T')[0];

  const players = Object.entries(state.players).map(([name, p]) => ({
    name,
    karma: p.karma,
    joined: p.joined,
    lastContrib: p.last_contribution
  }));

  // Active today
  const activeToday = players.filter(p =>
    p.lastContrib && p.lastContrib.startsWith(today)
  ).length;

  // Top contributor
  const top = players.sort((a, b) => b.karma - a.karma)[0];

  // Newest player
  const newest = players.sort((a, b) =>
    new Date(b.joined).getTime() - new Date(a.joined).getTime()
  )[0];

  return {
    total: players.length,
    active_today: activeToday,
    top_contributor: top?.name || 'none',
    newest_player: newest?.name || 'none',
    players: players.map(p => ({
      name: p.name,
      karma: p.karma,
      joined: p.joined
    }))
  };
}
