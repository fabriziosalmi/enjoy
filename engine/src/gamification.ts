/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENJOY GAMIFICATION ENGINE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Systems:
 * - Daily Challenges: rotating tasks with bonus karma
 * - Streak System: consecutive contribution multipliers
 * - Achievements: unlockable badges
 * - Mystery Box: random rewards every N contributions
 * - Bounties: specific tasks that help the project
 */

import { GameState, Player } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface AchievementContext {
  karma?: number;
  timestamp?: string | number;
  merge_time_seconds?: number;
}

export interface ChallengeContext {
  timestamp?: string | number;
}

export interface ContributionContext {
  karma?: number;
  timestamp?: string | number;
  merge_time_seconds?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// ACHIEVEMENTS DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  karma_reward: number;
  secret?: boolean;
  check: (player: Player, state: GameState, context?: AchievementContext) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── ONBOARDING ──────────────────────────────────────────────────────────
  {
    id: 'first_blood',
    name: 'First Blood',
    emoji: '🩸',
    description: 'First merged PR',
    karma_reward: 10,
    check: (p) => p.prs >= 1
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    emoji: '🌱',
    description: '5 merged PRs',
    karma_reward: 25,
    check: (p) => p.prs >= 5
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    emoji: '💪',
    description: '25 merged PRs',
    karma_reward: 100,
    check: (p) => p.prs >= 25
  },
  {
    id: 'legend',
    name: 'Legend',
    emoji: '👑',
    description: '100 merged PRs',
    karma_reward: 500,
    check: (p) => p.prs >= 100
  },
  
  // ── KARMA ───────────────────────────────────────────────────────────────
  {
    id: 'karma_hunter',
    name: 'Karma Hunter',
    emoji: '💎',
    description: 'Earn 100 karma',
    karma_reward: 20,
    check: (p) => p.karma >= 100
  },
  {
    id: 'karma_master',
    name: 'Karma Master',
    emoji: '💠',
    description: 'Earn 500 karma',
    karma_reward: 75,
    check: (p) => p.karma >= 500
  },
  {
    id: 'karma_god',
    name: 'Karma God',
    emoji: '🌟',
    description: 'Earn 1000 karma',
    karma_reward: 200,
    check: (p) => p.karma >= 1000
  },

  // ── STREAKS ─────────────────────────────────────────────────────────────
  {
    id: 'streak_3',
    name: 'On Fire',
    emoji: '🔥',
    description: '3-day contribution streak',
    karma_reward: 15,
    check: (p) => (p.streak || 0) >= 3
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    emoji: '⚡',
    description: '7-day contribution streak',
    karma_reward: 50,
    check: (p) => (p.streak || 0) >= 7
  },
  {
    id: 'streak_30',
    name: 'Unstoppable',
    emoji: '🌪️',
    description: '30-day contribution streak',
    karma_reward: 300,
    check: (p) => (p.streak || 0) >= 30
  },

  // ── SOCIAL ──────────────────────────────────────────────────────────────
  {
    id: 'recruiter',
    name: 'Recruiter',
    emoji: '🔗',
    description: 'Invite 1 person who contributes',
    karma_reward: 25,
    check: (p) => (p.referrals || 0) >= 1
  },
  {
    id: 'influencer',
    name: 'Influencer',
    emoji: '📣',
    description: 'Invite 5 people who contribute',
    karma_reward: 100,
    check: (p) => (p.referrals || 0) >= 5
  },
  {
    id: 'viral',
    name: 'Viral',
    emoji: '🦠',
    description: 'Invite 20 people who contribute',
    karma_reward: 500,
    check: (p) => (p.referrals || 0) >= 20
  },

  // ── QUALITY ─────────────────────────────────────────────────────────────
  {
    id: 'wordsmith',
    name: 'Wordsmith',
    emoji: '✍️',
    description: 'Get 80+ karma on a single contribution',
    karma_reward: 30,
    check: (_p, _s, ctx) => (ctx?.karma ?? 0) >= 80
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    emoji: '💯',
    description: '5 contributions with 70+ karma each',
    karma_reward: 75,
    check: (p) => (p.high_quality_count || 0) >= 5
  },

  // ── BUG HUNTING ─────────────────────────────────────────────────────────
  {
    id: 'bug_finder',
    name: 'Bug Finder',
    emoji: '🐛',
    description: 'Report 1 valid bug',
    karma_reward: 20,
    check: (p) => (p.bugs_reported || 0) >= 1
  },
  {
    id: 'exterminator',
    name: 'Exterminator',
    emoji: '🔫',
    description: 'Report 10 valid bugs',
    karma_reward: 100,
    check: (p) => (p.bugs_reported || 0) >= 10
  },

  // ── TIME-BASED ──────────────────────────────────────────────────────────
  {
    id: 'night_owl',
    name: 'Night Owl',
    emoji: '🦉',
    description: 'Contribute between 2-5 AM',
    karma_reward: 15,
    secret: true,
    check: (p, s, ctx) => {
      const hour = new Date(ctx?.timestamp || Date.now()).getUTCHours();
      return hour >= 2 && hour < 5;
    }
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    emoji: '🐦',
    description: 'Contribute between 5-7 AM',
    karma_reward: 15,
    secret: true,
    check: (p, s, ctx) => {
      const hour = new Date(ctx?.timestamp || Date.now()).getUTCHours();
      return hour >= 5 && hour < 7;
    }
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    emoji: '💨',
    description: 'PR merged within 60 seconds',
    karma_reward: 25,
    secret: true,
    check: (p, s, ctx) => (ctx?.merge_time_seconds || 999) < 60
  },

  // ── SPECIAL ─────────────────────────────────────────────────────────────
  {
    id: 'og',
    name: 'OG',
    emoji: '🏛️',
    description: 'Among first 10 contributors',
    karma_reward: 100,
    check: (p, s) => {
      // Check if total players < 10 means this could be an OG
      return Object.keys(s.players || {}).length <= 10;
    }
  },
  {
    id: 'centurion',
    name: 'Centurion',
    emoji: '🎖️',
    description: 'Be the 100th contributor',
    karma_reward: 200,
    secret: true,
    check: (p, s) => Object.keys(s.players || {}).length === 100
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// DAILY CHALLENGES
// ═══════════════════════════════════════════════════════════════════════════

export interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  check: (word: string, context?: ChallengeContext) => boolean;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'seven_letters',
    name: 'Lucky Seven',
    description: 'Word with exactly 7 letters',
    multiplier: 2,
    check: (word) => word.length === 7
  },
  {
    id: 'starts_with_vowel',
    name: 'Vowel Start',
    description: 'Word starting with a vowel',
    multiplier: 1.5,
    check: (word) => /^[aeiou]/i.test(word)
  },
  {
    id: 'nature_word',
    name: 'Nature\'s Call',
    description: 'Word related to nature',
    multiplier: 2,
    check: (word) => {
      const nature = ['sun', 'moon', 'star', 'tree', 'river', 'ocean', 'mountain', 'forest', 'wind', 'rain', 'flower', 'earth', 'sky', 'cloud', 'leaf', 'seed', 'root', 'bloom', 'wave', 'stone'];
      return nature.some(n => word.toLowerCase().includes(n));
    }
  },
  {
    id: 'double_letter',
    name: 'Double Trouble',
    description: 'Word with double letters',
    multiplier: 1.5,
    check: (word) => /(.)\1/.test(word)
  },
  {
    id: 'palindrome',
    name: 'Mirror Mirror',
    description: 'Palindrome word',
    multiplier: 3,
    check: (word) => {
      const clean = word.toLowerCase();
      return clean === clean.split('').reverse().join('') && clean.length >= 3;
    }
  },
  {
    id: 'no_e',
    name: 'E-Free',
    description: 'Word without the letter E',
    multiplier: 1.5,
    check: (word) => !/e/i.test(word) && word.length >= 5
  },
  {
    id: 'ten_plus',
    name: 'Big Words',
    description: 'Word with 10+ letters',
    multiplier: 2,
    check: (word) => word.length >= 10
  }
];

/**
 * Get today's challenge based on date
 */
export function getTodayChallenge(): DailyChallenge {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[index];
}

// ═══════════════════════════════════════════════════════════════════════════
// STREAK SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 30) {
    return 3.0;
  }
  if (streakDays >= 14) {
    return 2.5;
  }
  if (streakDays >= 7) {
    return 2.0;
  }
  if (streakDays >= 3) {
    return 1.5;
  }
  return 1.0;
}

export function updateStreak(player: Player, lastContribution: string): Player {
  const now = new Date();
  const last = new Date(lastContribution);
  const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
  
  if (diffDays === 0) {
    // Same day, no change
    return player;
  } else if (diffDays === 1) {
    // Consecutive day!
    return { ...player, streak: (player.streak || 0) + 1 };
  } else {
    // Streak broken
    return { ...player, streak: 1 };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MYSTERY BOX
// ═══════════════════════════════════════════════════════════════════════════

export interface MysteryReward {
  type: 'karma' | 'achievement' | 'multiplier';
  value: number | string;
  name: string;
  emoji: string;
}

const MYSTERY_REWARDS: MysteryReward[] = [
  { type: 'karma', value: 10, name: 'Small Karma Boost', emoji: '💫' },
  { type: 'karma', value: 25, name: 'Medium Karma Boost', emoji: '✨' },
  { type: 'karma', value: 50, name: 'Large Karma Boost', emoji: '🌟' },
  { type: 'karma', value: 100, name: 'JACKPOT!', emoji: '🎰' },
  { type: 'multiplier', value: 2, name: 'Double Next PR', emoji: '⚡' },
  { type: 'multiplier', value: 3, name: 'Triple Next PR', emoji: '🔥' },
];

/**
 * Check if player earned a mystery box (every 5 contributions)
 */
export function checkMysteryBox(totalContributions: number): boolean {
  return totalContributions > 0 && totalContributions % 5 === 0;
}

/**
 * Open mystery box - weighted random reward
 */
export function openMysteryBox(): MysteryReward {
  const weights = [30, 25, 15, 5, 15, 10]; // Weighted probabilities
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return MYSTERY_REWARDS[i];
    }
  }
  
  return MYSTERY_REWARDS[0];
}

// ═══════════════════════════════════════════════════════════════════════════
// BOUNTIES
// ═══════════════════════════════════════════════════════════════════════════

export interface Bounty {
  id: string;
  title: string;
  description: string;
  karma_reward: number;
  type: 'bug' | 'feature' | 'docs' | 'review';
  difficulty: 'easy' | 'medium' | 'hard';
  claimed_by?: string;
  completed?: boolean;
}

export const DEFAULT_BOUNTIES: Bounty[] = [
  {
    id: 'bounty_first_bug',
    title: 'Find a Bug',
    description: 'Find and report any bug in the game',
    karma_reward: 50,
    type: 'bug',
    difficulty: 'easy'
  },
  {
    id: 'bounty_improve_docs',
    title: 'Improve Documentation',
    description: 'Fix typos or improve clarity in README/CONTRIBUTING',
    karma_reward: 30,
    type: 'docs',
    difficulty: 'easy'
  },
  {
    id: 'bounty_review_5',
    title: 'Review 5 PRs',
    description: 'Leave helpful comments on 5 open PRs',
    karma_reward: 75,
    type: 'review',
    difficulty: 'medium'
  },
  {
    id: 'bounty_security',
    title: 'Security Audit',
    description: 'Find a security vulnerability',
    karma_reward: 200,
    type: 'bug',
    difficulty: 'hard'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GAMIFICATION PROCESSOR
// ═══════════════════════════════════════════════════════════════════════════

export interface GamificationResult {
  base_karma: number;
  streak_multiplier: number;
  challenge_multiplier: number;
  total_karma: number;
  
  new_achievements: Achievement[];
  mystery_box?: MysteryReward;
  challenge_completed: boolean;
  
  streak_days: number;
  message: string;
}

export function processContribution(
  player: Player,
  state: GameState,
  baseKarma: number,
  word: string,
  context: ContributionContext = {}
): GamificationResult {
  const result: GamificationResult = {
    base_karma: baseKarma,
    streak_multiplier: 1,
    challenge_multiplier: 1,
    total_karma: baseKarma,
    new_achievements: [],
    challenge_completed: false,
    streak_days: player.streak || 1,
    message: ''
  };
  
  // 1. Update streak
  if (player.last_contribution) {
    const updated = updateStreak(player, player.last_contribution);
    result.streak_days = updated.streak || 1;
  }
  result.streak_multiplier = getStreakMultiplier(result.streak_days);
  
  // 2. Check daily challenge
  const challenge = getTodayChallenge();
  if (challenge.check(word, context)) {
    result.challenge_multiplier = challenge.multiplier;
    result.challenge_completed = true;
  }
  
  // 3. Calculate total karma
  result.total_karma = Math.round(baseKarma * result.streak_multiplier * result.challenge_multiplier);
  
  // 4. Check mystery box
  const totalContribs = (player.prs || 0) + (player.issues || 0) + 1;
  if (checkMysteryBox(totalContribs)) {
    result.mystery_box = openMysteryBox();
    if (result.mystery_box.type === 'karma') {
      result.total_karma += result.mystery_box.value as number;
    }
  }
  
  // 5. Check new achievements
  const playerAchievements = player.achievements || [];
  const tempPlayer = { 
    ...player, 
    karma: player.karma + result.total_karma,
    prs: (player.prs || 0) + 1,
    streak: result.streak_days
  };
  
  for (const achievement of ACHIEVEMENTS) {
    if (!playerAchievements.includes(achievement.id)) {
      if (achievement.check(tempPlayer, state, { ...context, karma: baseKarma })) {
        result.new_achievements.push(achievement);
        result.total_karma += achievement.karma_reward;
      }
    }
  }
  
  // 6. Build message
  const parts = [`+${result.total_karma} karma`];
  if (result.streak_multiplier > 1) {
    parts.push(`🔥 ${result.streak_days}-day streak (x${result.streak_multiplier})`);
  }
  if (result.challenge_completed) {
    parts.push(`🎯 Daily challenge complete! (x${result.challenge_multiplier})`);
  }
  if (result.mystery_box) {
    parts.push(`🎁 Mystery Box: ${result.mystery_box.emoji} ${result.mystery_box.name}!`);
  }
  if (result.new_achievements.length > 0) {
    parts.push(`🏆 New: ${result.new_achievements.map(a => a.emoji + ' ' + a.name).join(', ')}`);
  }
  result.message = parts.join(' · ');
  
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// LEADERBOARD UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

export function getLeaderboard(state: GameState, limit: number = 10): Array<{
  rank: number;
  name: string;
  karma: number;
  achievements: string[];
  streak: number;
}> {
  const players = Object.entries(state.players || {})
    .map(([name, data]) => ({
      name,
      karma: data.karma || 0,
      achievements: data.achievements || [],
      streak: data.streak || 0
    }))
    .sort((a, b) => b.karma - a.karma)
    .slice(0, limit)
    .map((p, i) => ({ ...p, rank: i + 1 }));
  
  return players;
}
