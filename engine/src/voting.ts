import { GameState } from './types.js';
import { loadState, saveState } from './loader.js';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

/**
 * VOTING SYSTEM FOR RULES
 * 
 * Top coders can propose new rules
 * Community votes on rule proposals
 * Approved rules get added to the game
 */

export interface RuleProposal {
  id: string;
  proposed_by: string;  // player hash
  proposed_at: string;
  rule_file: string;
  rule_content: any;
  votes_for: Record<string, number>;  // playerHash -> voting power
  votes_against: Record<string, number>;
  total_for: number;
  total_against: number;
  status: 'voting' | 'approved' | 'rejected' | 'implemented';
  voting_ends: string;
}

/**
 * Propose a new rule
 */
export function proposeRule(
  state: GameState, 
  playerHash: string, 
  ruleContent: any
): { success: boolean; reason?: string; proposalId?: string } {
  
  // Check if player can propose
  const player = state.players[playerHash];
  if (!player) {
    return { success: false, reason: 'Player not found' };
  }
  
  const canPropose = 
    state.reputation?.top_coders?.includes(playerHash) ||
    (player.prs_merged >= 50 && (player.reputation || 0) > 50) ||
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
  
  // Check if rule ID already exists
  const existsActive = state.rules.active.includes(ruleContent.id);
  const existsProposed = state.rules.proposed?.some((p: RuleProposal) => p.id === ruleContent.id);
  
  if (existsActive || existsProposed) {
    return { success: false, reason: 'Rule ID already exists' };
  }
  
  // Create proposal
  const proposalId = `prop_${Date.now()}_${ruleContent.id}`;
  const votingEnds = new Date();
  votingEnds.setDate(votingEnds.getDate() + 7);  // 7 days voting period
  
  const proposal: RuleProposal = {
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
  const proposalPath = `proposals/${proposalId}.yaml`;
  fs.mkdirSync('proposals', { recursive: true });
  fs.writeFileSync(proposalPath, yaml.dump(proposal));
  
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
  
  const proposal = state.rules.proposed?.find((p: RuleProposal) => p.id === proposalId);
  
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
  } else if (player.prs_merged >= 10) {
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
  if (!state.rules.proposed) return;
  
  const now = new Date();
  
  for (const proposal of state.rules.proposed) {
    if (proposal.status !== 'voting') continue;
    
    // Check if voting period ended
    if (now > new Date(proposal.voting_ends)) {
      // Calculate result
      const totalVotes = proposal.total_for + proposal.total_against;
      const approval_percentage = totalVotes > 0 ? (proposal.total_for / totalVotes) * 100 : 0;
      
      // Approval threshold: 66% for, minimum 20 total voting power
      if (approval_percentage >= 66 && totalVotes >= 20) {
        proposal.status = 'approved';
        
        // Write rule file
        fs.writeFileSync(
          proposal.rule_file,
          yaml.dump(proposal.rule_content)
        );
        
        // Add to active rules
        state.rules.active.push(proposal.rule_content.id);
        
        // Move to implemented
        state.rules.proposed = state.rules.proposed.filter(p => p.id !== proposal.id);
        
        console.log(`✅ Rule ${proposal.rule_content.id} APPROVED and implemented!`);
        
      } else {
        proposal.status = 'rejected';
        
        // Move to archived
        state.rules.archived = state.rules.archived || [];
        state.rules.archived.push(proposal);
        state.rules.proposed = state.rules.proposed.filter(p => p.id !== proposal.id);
        
        console.log(`❌ Rule ${proposal.rule_content.id} rejected (${approval_percentage.toFixed(1)}% approval)`);
      }
    }
  }
}

/**
 * Get active proposals for a player to vote on
 */
export function getActiveProposals(state: GameState): RuleProposal[] {
  if (!state.rules.proposed) return [];
  
  return state.rules.proposed.filter((p: RuleProposal) => {
    return p.status === 'voting' && new Date() < new Date(p.voting_ends);
  });
}

/**
 * Get player's vote on a proposal
 */
export function getPlayerVote(proposal: RuleProposal, playerHash: string): 'for' | 'against' | null {
  if (proposal.votes_for[playerHash]) return 'for';
  if (proposal.votes_against[playerHash]) return 'against';
  return null;
}

/**
 * Create example rule proposal (for testing)
 */
export function createExampleProposal(): any {
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
