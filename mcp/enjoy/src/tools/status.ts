/**
 * Project status tool - comprehensive health check
 */

import { getState, getKarmaBadge } from '../state.js';
import { getRepoStats, listWorkflowRuns, listPRs } from '../github.js';

export interface ProjectStatus {
  health: 'healthy' | 'warning' | 'error';
  summary: string;
  game: {
    karma: number;
    level: number;
    total_prs: number;
    total_players: number;
    last_pr: string;
    last_updated: string;
  };
  repo: {
    stars: number;
    forks: number;
    open_issues: number;
  };
  workflows: {
    status: 'all_passing' | 'some_failing' | 'unknown';
    recent: Array<{ name: string; conclusion: string }>;
  };
  prs: {
    open_count: number;
    recent: Array<{ number: number; title: string; author: string; status: string }>;
  };
}

export async function getProjectStatus(): Promise<ProjectStatus> {
  // Fetch all data in parallel
  const [state, badge, repoStats, workflows, openPRs] = await Promise.all([
    getState(),
    getKarmaBadge(),
    getRepoStats(),
    listWorkflowRuns(5),
    listPRs('open', 5)
  ]);

  // Determine health
  let health: ProjectStatus['health'] = 'healthy';
  const issues: string[] = [];

  // Check badge sync
  if (badge.karma !== state.score.total) {
    issues.push(`Badge out of sync (badge: ${badge.karma}, state: ${state.score.total})`);
    health = 'warning';
  }

  // Check workflows
  let workflowStatus: ProjectStatus['workflows']['status'] = 'unknown';
  if (workflows.success && workflows.data) {
    const failures = workflows.data.filter(w => w.conclusion === 'failure');
    if (failures.length === 0) {
      workflowStatus = 'all_passing';
    } else {
      workflowStatus = 'some_failing';
      health = 'warning';
      issues.push(`${failures.length} workflow(s) failing`);
    }
  }

  // Build summary
  const summary = health === 'healthy'
    ? `All systems operational. Karma: ${state.score.total}, Level: ${state.levels.current}`
    : `Issues detected: ${issues.join('; ')}`;

  return {
    health,
    summary,
    game: {
      karma: state.score.total,
      level: state.levels.current,
      total_prs: state.meta.total_prs,
      total_players: state.meta.total_players,
      last_pr: state.last_pr,
      last_updated: state.last_updated
    },
    repo: {
      stars: repoStats.data?.stars || 0,
      forks: repoStats.data?.forks || 0,
      open_issues: repoStats.data?.open_issues || 0
    },
    workflows: {
      status: workflowStatus,
      recent: workflows.data?.map(w => ({
        name: w.name,
        conclusion: w.conclusion
      })) || []
    },
    prs: {
      open_count: openPRs.data?.length || 0,
      recent: openPRs.data?.map(pr => ({
        number: pr.number,
        title: pr.title,
        author: pr.author,
        status: pr.checksStatus
      })) || []
    }
  };
}
