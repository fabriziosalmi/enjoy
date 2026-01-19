import { GameState, RuleProposalState, RuleProposalContent } from './types.js';
import { sanitizePath, logError } from './utils.js';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

/**
 * VOTING SYSTEM FOR RULES
 *
 * Top coders can propose new rules
 * Community votes on rule proposals
 * Approved rules get added to the game
 */

// Re-export types for backward compatibility
export type RuleContent = RuleProposalContent;
export type RuleProposal = RuleProposalState;

/**
 * Propose a new rule
 */
export function proposeRule(
  state: GameState,
  playerHash: string,
  ruleContent: RuleProposalContent
): { success: boolean; reason?: string; proposalId?: string } {
  
  // Check if player can propose
  const player = state.players[playerHash];
  if (!player) {
    return { success: false, reason: 'Player not found' };
  }
  
  const canPropose = 
    state.reputation?.top_coders?.includes(playerHash) ||
    ((player.prs_merged || 0) >= 50 && (player.reputation || 0) > 50) ||
    (player.karma || 0) > 500;
  
  if (!canPropose) {
    return { 
      success: false, 
      reason: 'Insufficient reputation. Need: Top 10 coder OR 50+ PRs with rep>50 OR karma>500' 
    };
  }
  
  // Validate rule structure
  if (!ruleContent.id || !ruleContent.name || !ruleContent.description) {
    return { success: false, reason: 'Invalid rule structure' };
  }

  // Validate rule ID format (alphanumeric, underscore, hyphen only)
  if (!/^[a-zA-Z0-9_-]+$/.test(ruleContent.id)) {
    return { success: false, reason: 'Invalid rule ID format. Use only alphanumeric characters, underscores, and hyphens.' };
  }

  // Validate rule name for path safety
  if (!/^[a-zA-Z0-9_\s-]+$/.test(ruleContent.name)) {
    return { success: false, reason: 'Invalid rule name format. Use only alphanumeric characters, spaces, underscores, and hyphens.' };
  }
  
  // Check if rule ID already exists
  const existsActive = state.rules.active.includes(ruleContent.id);
  const existsProposed = state.rules.proposed?.some((p) => p.rule_content.id === ruleContent.id);

  if (existsActive || existsProposed) {
    return { success: false, reason: 'Rule ID already exists' };
  }
  
  // Create proposal
  const proposalId = `prop_${Date.now()}_${ruleContent.id}`;
  const votingEnds = new Date();
  votingEnds.setDate(votingEnds.getDate() + 7);  // 7 days voting period
  
  const proposal: RuleProposalState = {
    id: proposalId,
    proposed_by: playerHash,
    proposed_at: new Date().toISOString(),
    rule_file: `rules/${ruleContent.id}-${ruleContent.name.toLowerCase().replace(/\s+/g, '-')}.yaml`,
    rule_content: ruleContent,
    votes_for: {},
    votes_against: {},
    total_for: 0,
    total_against: 0,
    status: 'voting',
    voting_ends: votingEnds.toISOString()
  };
  
  // Add to proposed rules
  state.rules.proposed = state.rules.proposed || [];
  state.rules.proposed.push(proposal);
  
  // Save proposal as YAML in proposals/ directory
  try {
    const proposalPath = sanitizePath(`proposals/${proposalId}.yaml`, 'proposals');
    fs.mkdirSync('proposals', { recursive: true });
    fs.writeFileSync(proposalPath, yaml.dump(proposal));
  } catch (e) {
    logError('proposeRule: Failed to save proposal file', e);
    return { success: false, reason: 'Failed to save proposal file' };
  }
  
  return { success: true, proposalId };
}

/**
 * Vote on a rule proposal
 */
export function voteOnProposal(
  state: GameState,
  proposalId: string,
  playerHash: string,
  voteFor: boolean
): { success: boolean; reason?: string } {
  
  const proposal = state.rules.proposed?.find((p) => p.id === proposalId);
  
  if (!proposal) {
    return { success: false, reason: 'Proposal not found' };
  }
  
  if (proposal.status !== 'voting') {
    return { success: false, reason: 'Voting has ended' };
  }
  
  // Check voting period
  if (new Date() > new Date(proposal.voting_ends)) {
    return { success: false, reason: 'Voting period has ended' };
  }
  
  // Get player's voting power
  const player = state.players[playerHash];
  if (!player) {
    return { success: false, reason: 'Player not found' };
  }
  
  // Voting power calculation
  let votingPower = 1;  // Base
  
  if (state.reputation?.voting_power?.[playerHash]) {
    votingPower = state.reputation.voting_power[playerHash];  // Top coder power
  } else if ((player.prs_merged || 0) >= 10) {
    votingPower = Math.min(5, Math.floor((player.reputation || 0) / 20));
  }
  
  // Can't vote if no power
  if (votingPower === 0) {
    return { success: false, reason: 'Insufficient voting power. Contribute more to gain voting rights.' };
  }
  
  // Remove previous vote if exists
  delete proposal.votes_for[playerHash];
  delete proposal.votes_against[playerHash];
  
  // Add new vote
  if (voteFor) {
    proposal.votes_for[playerHash] = votingPower;
  } else {
    proposal.votes_against[playerHash] = votingPower;
  }
  
  // Recalculate totals
  proposal.total_for = Object.values(proposal.votes_for as Record<string, number>).reduce((sum: number, v: number) => sum + v, 0);
  proposal.total_against = Object.values(proposal.votes_against as Record<string, number>).reduce((sum: number, v: number) => sum + v, 0);
  
  return { success: true };
}

/**
 * Process voting results (called periodically)
 */
export function processVotingResults(state: GameState): void {
  if (!state.rules.proposed) {
    return;
  }

  const now = new Date();
  const proposalsToRemove: string[] = [];
  const proposalsToArchive: RuleProposalState[] = [];

  // First pass: process all proposals without modifying the array
  for (const proposal of state.rules.proposed) {
    if (proposal.status !== 'voting') {
      continue;
    }

    // Check if voting period ended
    if (now > new Date(proposal.voting_ends)) {
      // Calculate result
      const totalVotes = proposal.total_for + proposal.total_against;
      const approval_percentage = totalVotes > 0 ? (proposal.total_for / totalVotes) * 100 : 0;

      // Approval threshold: 66% for, minimum 20 total voting power
      if (approval_percentage >= 66 && totalVotes >= 20) {
        proposal.status = 'approved';

        // Write rule file with path sanitization
        try {
          const safeRulePath = sanitizePath(proposal.rule_file, 'rules');
          fs.mkdirSync('rules', { recursive: true });
          fs.writeFileSync(safeRulePath, yaml.dump(proposal.rule_content));
        } catch (e) {
          logError(`processVotingResults: Failed to write rule file ${proposal.rule_file}`, e);
          continue;
        }

        // Add to active rules
        state.rules.active.push(proposal.rule_content.id);

        // Mark for removal
        proposalsToRemove.push(proposal.id);

        console.log(`✅ Rule ${proposal.rule_content.id} APPROVED and implemented!`);

      } else {
        proposal.status = 'rejected';

        // Mark for archiving and removal
        proposalsToArchive.push(proposal);
        proposalsToRemove.push(proposal.id);

        console.log(`❌ Rule ${proposal.rule_content.id} rejected (${approval_percentage.toFixed(1)}% approval)`);
      }
    }
  }

  // Second pass: remove processed proposals and archive rejected ones
  if (proposalsToRemove.length > 0) {
    state.rules.archived = state.rules.archived || [];
    state.rules.archived.push(...proposalsToArchive);
    state.rules.proposed = state.rules.proposed.filter(p => !proposalsToRemove.includes(p.id));
  }
}

/**
 * Get active proposals for a player to vote on
 */
export function getActiveProposals(state: GameState): RuleProposalState[] {
  if (!state.rules.proposed) {
    return [];
  }

  return state.rules.proposed.filter((p) => {
    return p.status === 'voting' && new Date() < new Date(p.voting_ends);
  });
}

/**
 * Get player's vote on a proposal
 */
export function getPlayerVote(proposal: RuleProposalState, playerHash: string): 'for' | 'against' | null {
  if (proposal.votes_for[playerHash]) {
    return 'for';
  }
  if (proposal.votes_against[playerHash]) {
    return 'against';
  }
  return null;
}

/**
 * Create example rule proposal (for testing)
 */
export function createExampleProposal(): RuleProposalContent {
  return {
    id: "042",
    name: "Emoji Explosion",
    description: "Allow emoji in contributions alongside words",
    version: 1,
    enabled: true,
    priority: 90,
    trigger: {
      type: "file_added",
      conditions: [
        { extension: ".txt" },
        { max_files: 1 },
        { pattern: "^[a-zA-Z\\s🎮🎯🚀💻🔥⭐]+$" }
      ]
    },
    validate: [
      { not_profanity: true },
      { max_emoji: 3 }
    ],
    effect: {
      action: "add_to_board",
      element: {
        type: "text",
        content: "{{file_content}}",
        position: "random",
        color: "random_cga",
        size: 20
      }
    },
    points: {
      base: 15,
      bonuses: [
        { condition: "creative_emoji_use", points: 10 }
      ]
    }
  };
}
