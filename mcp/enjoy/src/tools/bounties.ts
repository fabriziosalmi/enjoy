/**
 * Bounty management tools
 */

import { getState, getActiveBounties, Bounty } from '../state.js';
import { listIssues } from '../github.js';

export interface BountyStatus {
  active: Array<Bounty & { issue_url?: string }>;
  completed: Bounty[];
  total_karma_available: number;
  total_karma_awarded: number;
}

export async function getBountyStatus(): Promise<BountyStatus> {
  const state = await getState();
  const issues = await listIssues('open', 20);

  // Map bounties to issues if possible
  const activeBounties = state.bounties.active.map(bounty => {
    // Try to find matching issue
    const matchingIssue = issues.data?.find(i =>
      i.title.toLowerCase().includes(bounty.title.toLowerCase()) ||
      i.labels.includes('bounty')
    );

    return {
      ...bounty,
      issue_url: matchingIssue
        ? `https://github.com/fabriziosalmi/enjoy/issues/${matchingIssue.number}`
        : undefined
    };
  });

  const totalAvailable = activeBounties
    .filter(b => !b.claimed_by)
    .reduce((sum, b) => sum + b.karma, 0);

  const totalAwarded = state.bounties.completed
    .reduce((sum, b) => sum + b.karma, 0);

  return {
    active: activeBounties,
    completed: state.bounties.completed,
    total_karma_available: totalAvailable,
    total_karma_awarded: totalAwarded
  };
}

export interface BountyDetails {
  found: boolean;
  bounty?: Bounty & {
    status: 'available' | 'claimed' | 'completed';
    issue?: {
      number: number;
      assignees: string[];
      comments_count: number;
    };
  };
  error?: string;
}

export async function getBountyDetails(bountyId: string): Promise<BountyDetails> {
  const state = await getState();

  // Check active bounties
  const activeBounty = state.bounties.active.find(b => b.id === bountyId);
  if (activeBounty) {
    return {
      found: true,
      bounty: {
        ...activeBounty,
        status: activeBounty.claimed_by ? 'claimed' : 'available'
      }
    };
  }

  // Check completed bounties
  const completedBounty = state.bounties.completed.find(b => b.id === bountyId);
  if (completedBounty) {
    return {
      found: true,
      bounty: {
        ...completedBounty,
        status: 'completed'
      }
    };
  }

  return {
    found: false,
    error: `Bounty "${bountyId}" not found`
  };
}

export interface BountySummary {
  total_bounties: number;
  available: number;
  in_progress: number;
  completed: number;
  highest_karma: { title: string; karma: number } | null;
  recently_completed: Bounty[];
}

export async function getBountySummary(): Promise<BountySummary> {
  const state = await getState();

  const available = state.bounties.active.filter(b => !b.claimed_by);
  const inProgress = state.bounties.active.filter(b => b.claimed_by);

  const allBounties = [...state.bounties.active, ...state.bounties.completed];
  const highest = allBounties.sort((a, b) => b.karma - a.karma)[0];

  return {
    total_bounties: allBounties.length,
    available: available.length,
    in_progress: inProgress.length,
    completed: state.bounties.completed.length,
    highest_karma: highest ? { title: highest.title, karma: highest.karma } : null,
    recently_completed: state.bounties.completed.slice(-3)
  };
}
