import { GameState, PRMetadata } from './types.js';
import { loadState, saveState } from './loader.js';

/**
 * KARMA SYSTEM
 * 
 * Good contributions → karma up → amplification (runner fa 2-3x)
 * Bad contributions → karma down → refuse
 * 
 * Karma is GLOBAL (community) + PER-PLAYER
 */

export interface KarmaAnalysis {
  quality_score: number;  // 0-100
  is_good: boolean;
  is_excellent: boolean;
  is_bad: boolean;
  reasons: string[];
  amplification_factor: number;  // 1, 2, or 3
  action: 'accept' | 'amplify' | 'refuse';
}

/**
 * Analyze contribution quality
 */
export function analyzeContributionQuality(pr: PRMetadata, content: string, state: GameState): KarmaAnalysis {
  let score = 50;  // Start neutral
  const reasons: string[] = [];
  
  // CHECK 1: Word length (optimal 5-10 chars)
  if (content.length >= 5 && content.length <= 10) {
    score += 10;
    reasons.push('Optimal word length');
  } else if (content.length < 3) {
    score -= 15;
    reasons.push('Too short');
  } else if (content.length > 15) {
    score -= 10;
    reasons.push('Too long');
  }
  
  // CHECK 2: Common/boring words
  const boringWords = ['test', 'hello', 'world', 'foo', 'bar', 'spam', 'qwerty'];
  if (boringWords.includes(content.toLowerCase())) {
    score -= 20;
    reasons.push('Common/boring word');
  }
  
  // CHECK 3: Creativity (has vowels + consonants, not keyboard mash)
  const hasVowels = /[aeiou]/i.test(content);
  const hasConsonants = /[bcdfghjklmnpqrstvwxyz]/i.test(content);
  if (hasVowels && hasConsonants) {
    score += 10;
    reasons.push('Well-formed word');
  } else {
    score -= 15;
    reasons.push('Suspicious pattern');
  }
  
  // CHECK 4: Duplicate check (already penalized in validator but affects karma)
  const isDuplicate = state.board.elements.some(el => 
    el.content?.toLowerCase() === content.toLowerCase()
  );
  if (isDuplicate) {
    score -= 30;
    reasons.push('Duplicate word');
  }
  
  // CHECK 5: Commit message quality
  if (pr.commit_message && pr.commit_message.length > 20) {
    score += 5;
    reasons.push('Descriptive commit message');
  }
  
  // CHECK 6: Player history
  const playerHash = hashAuthor(pr.author);
  const player = state.players[playerHash];
  if (player && player.prs_merged > 10) {
    score += 5;
    reasons.push('Experienced contributor');
  }
  
  // CHECK 7: Recent spam check
  const recentPRs = Object.values(state.players).filter(p => {
    const lastPR = new Date(p.last_pr || 0);
    const now = new Date();
    return now.getTime() - lastPR.getTime() < 60000;  // Last minute
  }).length;
  
  if (recentPRs > 5) {
    score -= 25;
    reasons.push('Potential spam detected');
  }
  
  // DETERMINE QUALITY TIER
  const isExcellent = score >= 80;
  const isGood = score >= 60 && !isExcellent;
  const isBad = score < 40;
  
  // DETERMINE AMPLIFICATION
  let amplification = 1;
  let action: 'accept' | 'amplify' | 'refuse' = 'accept';
  
  if (isExcellent && state.karma.global > 500) {
    amplification = 3;  // TRIPLE EFFECT!
    action = 'amplify';
    reasons.push('🌟 EXCELLENT! Runner will amplify x3');
  } else if (isGood && state.karma.global > 100) {
    amplification = 2;  // DOUBLE EFFECT
    action = 'amplify';
    reasons.push('✨ Good quality! Runner will amplify x2');
  } else if (isBad) {
    amplification = 0;
    action = 'refuse';
    reasons.push('❌ Low quality - contribution refused');
  }
  
  return {
    quality_score: Math.max(0, Math.min(100, score)),
    is_good: isGood,
    is_excellent: isExcellent,
    is_bad: isBad,
    reasons,
    amplification_factor: amplification,
    action
  };
}

/**
 * Apply karma changes
 */
export function applyKarma(state: GameState, pr: PRMetadata, analysis: KarmaAnalysis): void {
  const playerHash = hashAuthor(pr.author);
  
  // Update player karma
  if (!state.players[playerHash]) {
    state.players[playerHash] = {
      total_prs: 0,
      prs_merged: 0,
      karma: 0,
      reputation: 0,
      contributions: [],
      last_pr: pr.timestamp
    };
  }
  
  const player = state.players[playerHash];
  
  // Karma changes
  if (analysis.is_excellent) {
    player.karma = (player.karma || 0) + 25;
    state.karma.global += 25;
  } else if (analysis.is_good) {
    player.karma = (player.karma || 0) + 10;
    state.karma.global += 10;
  } else if (analysis.is_bad) {
    player.karma = (player.karma || 0) - 20;
    state.karma.global -= 5;  // Less impact on global
  }
  
  // Reputation (slower to change, affects voting power)
  if (player.prs_merged > 10) {
    player.reputation = (player.reputation || 0) + (analysis.quality_score - 50) / 10;
  }
  
  // Track recent quality
  if (!state.karma.recent_quality) state.karma.recent_quality = [];
  state.karma.recent_quality.push(analysis.quality_score);
  
  // Keep only last 100
  if (state.karma.recent_quality.length > 100) {
    state.karma.recent_quality.shift();
  }
  
  // Update global multiplier
  const avgQuality = state.karma.recent_quality.reduce((a: number, b: number) => a + b, 0) / state.karma.recent_quality.length;
  state.karma.multiplier_active = avgQuality / 50;  // 0.5x to 2x based on avg quality
  
  // Update top coders list
  updateTopCoders(state);
}

/**
 * Amplify contribution (for good karma)
 */
export function amplifyContribution(pr: PRMetadata, analysis: KarmaAnalysis, originalContent: string): string[] {
  if (analysis.amplification_factor <= 1) {
    return [originalContent];
  }
  
  const amplified: string[] = [originalContent];
  
  // Generate related words based on original
  if (analysis.amplification_factor >= 2) {
    amplified.push(generateRelatedWord(originalContent, 1));
  }
  
  if (analysis.amplification_factor >= 3) {
    amplified.push(generateRelatedWord(originalContent, 2));
  }
  
  return amplified;
}

/**
 * Generate related word (simple algorithm for now)
 */
function generateRelatedWord(original: string, variant: number): string {
  const prefixes = ['SUPER', 'MEGA', 'ULTRA', 'HYPER', 'NEO'];
  const suffixes = ['MAX', 'PLUS', 'PRO', 'PRIME', 'X'];
  
  if (variant === 1) {
    return prefixes[Math.floor(Math.random() * prefixes.length)] + original.toUpperCase();
  } else {
    return original.toUpperCase() + suffixes[Math.floor(Math.random() * suffixes.length)];
  }
}

/**
 * Update top coders list
 */
function updateTopCoders(state: GameState): void {
  const players = Object.entries(state.players)
    .map(([hash, player]) => ({
      hash,
      reputation: player.reputation || 0,
      karma: player.karma || 0,
      prs: player.prs_merged
    }))
    .filter(p => p.prs >= 10)  // Min 10 PRs to qualify
    .sort((a, b) => b.reputation - a.reputation)
    .slice(0, 10);  // Top 10
  
  state.reputation = state.reputation || { top_coders: [], voting_power: {} };
  state.reputation.top_coders = players.map(p => p.hash);
  
  // Assign voting power (1-10 based on rank)
  players.forEach((p, index) => {
    state.reputation.voting_power[p.hash] = 10 - index;
  });
}

/**
 * Hash author name
 */
function hashAuthor(author: string): string {
  let hash = 0;
  for (let i = 0; i < author.length; i++) {
    hash = ((hash << 5) - hash) + author.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Check if player can propose rules
 */
export function canProposeRules(state: GameState, playerHash: string): boolean {
  const player = state.players[playerHash];
  if (!player) return false;
  
  // Requirements:
  // - Top 10 coder OR
  // - 50+ PRs + reputation > 50 OR
  // - Karma > 500
  
  const isTopCoder = state.reputation?.top_coders?.includes(playerHash);
  const hasExperience = player.prs_merged >= 50 && (player.reputation || 0) > 50;
  const hasKarma = (player.karma || 0) > 500;
  
  return isTopCoder || hasExperience || hasKarma;
}

/**
 * Get player's voting power
 */
export function getVotingPower(state: GameState, playerHash: string): number {
  // Top coders have power 1-10
  if (state.reputation?.voting_power?.[playerHash]) {
    return state.reputation.voting_power[playerHash];
  }
  
  // Others have power based on reputation
  const player = state.players[playerHash];
  if (!player) return 0;
  
  const reputation = player.reputation || 0;
  return Math.min(5, Math.floor(reputation / 20));  // Max 5 for non-top-coders
}

/**
 * REFERRAL SYSTEM
 */

export interface ReferralChain {
  inviter: string;
  invited: string[];
  chain_depth: number;
  referral_karma: number;
  total_contributions: number;
}

export function trackReferral(state: GameState, inviter: string, invitee: string): void {
  if (!state.referrals) {
    state.referrals = { chains: {}, stats: { total_invites: 0, active_chains: 0, deepest_chain: 0 } };
  }
  
  if (!state.referrals.chains[inviter]) {
    state.referrals.chains[inviter] = {
      inviter,
      invited: [],
      chain_depth: 1,
      referral_karma: 0,
      total_contributions: 0
    };
  }
  
  const chain = state.referrals.chains[inviter];
  if (!chain.invited.includes(invitee)) {
    chain.invited.push(invitee);
    state.referrals.stats.total_invites++;
    
    // Check if invitee was invited by someone else (chain)
    const inviteeChain = state.referrals.chains[invitee];
    if (inviteeChain) {
      const newDepth = inviteeChain.chain_depth + 1;
      chain.chain_depth = Math.max(chain.chain_depth, newDepth);
      
      if (newDepth > state.referrals.stats.deepest_chain) {
        state.referrals.stats.deepest_chain = newDepth;
      }
    }
  }
}

export function applyReferralKarma(
  state: GameState,
  invitee: string,
  contributionQuality: number,
  amplification: number
): string[] {
  const achievements: string[] = [];
  
  if (!state.referrals?.chains) return achievements;
  
  // Find who invited this player
  for (const [inviter, chain] of Object.entries(state.referrals.chains)) {
    if (chain.invited.includes(invitee)) {
      let referralBonus = 0;
      
      // Base referral karma based on contribution amplification
      if (amplification === 1) referralBonus = 2;
      if (amplification === 2) referralBonus = 5;
      if (amplification === 3) referralBonus = 15;
      
      // Chain bonus: +1 karma per chain level
      const chainBonus = (chain.chain_depth - 1) * 1;
      referralBonus += chainBonus;
      
      // Apply to inviter
      chain.referral_karma += referralBonus;
      chain.total_contributions++;
      
      // Update inviter's personal karma
      if (!state.players[inviter]) {
        state.players[inviter] = {
          total_prs: 0,
          prs_merged: 0,
          karma: 0,
          reputation: 0,
          contributions: []
        };
      }
      state.players[inviter].karma = (state.players[inviter].karma || 0) + referralBonus;
      
      // Propagate up the chain (50% to grandparent inviter)
      propagateChainKarma(state, inviter, Math.floor(referralBonus / 2));
      
      // Check for achievements
      const newAchievements = checkAchievements(state, inviter);
      achievements.push(...newAchievements);
      
      break;
    }
  }
  
  return achievements;
}

function propagateChainKarma(state: GameState, player: string, karma: number): void {
  if (karma <= 0 || !state.referrals?.chains) return;
  
  // Find who invited this player
  for (const [inviter, chain] of Object.entries(state.referrals.chains)) {
    if (chain.invited.includes(player)) {
      chain.referral_karma += karma;
      
      if (!state.players[inviter]) {
        state.players[inviter] = {
          total_prs: 0,
          prs_merged: 0,
          karma: 0,
          reputation: 0,
          contributions: []
        };
      }
      state.players[inviter].karma = (state.players[inviter].karma || 0) + karma;
      
      // Continue propagation (halve each time)
      propagateChainKarma(state, inviter, Math.floor(karma / 2));
      break;
    }
  }
}

export function checkAchievements(state: GameState, player: string): string[] {
  const newAchievements: string[] = [];
  const chain = state.referrals?.chains?.[player];
  
  if (!state.achievements) {
    state.achievements = { players: {} };
  }
  
  if (!state.achievements.players[player]) {
    state.achievements.players[player] = [];
  }
  
  const playerAchievements = state.achievements.players[player];
  
  if (chain) {
    const invitedCount = chain.invited.length;
    const chainDepth = chain.chain_depth;
    
    // First Recruit
    if (invitedCount >= 1 && !playerAchievements.includes('first_recruit')) {
      playerAchievements.push('first_recruit');
      newAchievements.push('🌱 First Recruit');
    }
    
    // Community Builder
    if (invitedCount >= 5 && !playerAchievements.includes('community_builder')) {
      playerAchievements.push('community_builder');
      newAchievements.push('🌿 Community Builder');
    }
    
    // Network Effect
    if (chainDepth >= 3 && !playerAchievements.includes('network_effect')) {
      playerAchievements.push('network_effect');
      newAchievements.push('🌳 Network Effect');
    }
    
    // Viral Master
    if (invitedCount >= 10 && !playerAchievements.includes('viral_master')) {
      playerAchievements.push('viral_master');
      newAchievements.push('🌲 Viral Master');
    }
  }
  
  return newAchievements;
}
