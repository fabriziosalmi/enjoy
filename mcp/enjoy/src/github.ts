import { execSync } from 'child_process';

const REPO_OWNER = 'fabriziosalmi';
const REPO_NAME = 'enjoy';

export interface GHResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Execute gh CLI command - uses ambient authentication (no hardcoded tokens)
 */
function gh<T>(args: string): GHResult<T> {
  try {
    const result = execSync(`gh ${args}`, {
      encoding: 'utf-8',
      timeout: 30000,
      env: { ...process.env }
    });
    return { success: true, data: JSON.parse(result) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error'
    };
  }
}

/**
 * Execute gh CLI command returning raw text
 */
function ghRaw(args: string): GHResult<string> {
  try {
    const result = execSync(`gh ${args}`, {
      encoding: 'utf-8',
      timeout: 30000,
      env: { ...process.env }
    });
    return { success: true, data: result.trim() };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// REPOSITORY
// ═══════════════════════════════════════════════════════════════════════════

export interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  open_issues: number;
}

export function getRepoStats(): GHResult<RepoStats> {
  return gh<RepoStats>(
    `repo view ${REPO_OWNER}/${REPO_NAME} --json stargazerCount,forkCount,watchers,issues ` +
    `--jq '{stars: .stargazerCount, forks: .forkCount, watchers: .watchers, open_issues: .issues | length}'`
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PULL REQUESTS
// ═══════════════════════════════════════════════════════════════════════════

export interface PRInfo {
  number: number;
  title: string;
  author: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  labels: string[];
  checksStatus: string;
}

export function listPRs(state: 'open' | 'closed' | 'merged' | 'all' = 'open', limit = 10): GHResult<PRInfo[]> {
  const result = gh<any[]>(
    `pr list --repo ${REPO_OWNER}/${REPO_NAME} --state ${state} --limit ${limit} ` +
    `--json number,title,author,state,createdAt,updatedAt,labels,statusCheckRollup`
  );

  if (!result.success || !result.data) return result as GHResult<PRInfo[]>;

  return {
    success: true,
    data: result.data.map(pr => ({
      number: pr.number,
      title: pr.title,
      author: pr.author?.login || 'unknown',
      state: pr.state,
      createdAt: pr.createdAt,
      updatedAt: pr.updatedAt,
      labels: pr.labels?.map((l: any) => l.name) || [],
      checksStatus: pr.statusCheckRollup?.[0]?.conclusion || 'pending'
    }))
  };
}

export function getPRDetails(prNumber: number): GHResult<any> {
  return gh(
    `pr view ${prNumber} --repo ${REPO_OWNER}/${REPO_NAME} ` +
    `--json number,title,author,state,body,files,comments,statusCheckRollup,labels`
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ISSUES
// ═══════════════════════════════════════════════════════════════════════════

export interface IssueInfo {
  number: number;
  title: string;
  author: string;
  state: string;
  labels: string[];
  assignees: string[];
}

export function listIssues(state: 'open' | 'closed' | 'all' = 'open', limit = 10): GHResult<IssueInfo[]> {
  const result = gh<any[]>(
    `issue list --repo ${REPO_OWNER}/${REPO_NAME} --state ${state} --limit ${limit} ` +
    `--json number,title,author,state,labels,assignees`
  );

  if (!result.success || !result.data) return result as GHResult<IssueInfo[]>;

  return {
    success: true,
    data: result.data.map(issue => ({
      number: issue.number,
      title: issue.title,
      author: issue.author?.login || 'unknown',
      state: issue.state,
      labels: issue.labels?.map((l: any) => l.name) || [],
      assignees: issue.assignees?.map((a: any) => a.login) || []
    }))
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOWS
// ═══════════════════════════════════════════════════════════════════════════

export interface WorkflowRun {
  name: string;
  status: string;
  conclusion: string;
  event: string;
  createdAt: string;
  url: string;
}

export function listWorkflowRuns(limit = 10): GHResult<WorkflowRun[]> {
  const result = gh<any[]>(
    `run list --repo ${REPO_OWNER}/${REPO_NAME} --limit ${limit} ` +
    `--json name,status,conclusion,event,createdAt,url`
  );

  if (!result.success || !result.data) return result as GHResult<WorkflowRun[]>;

  return {
    success: true,
    data: result.data.map(run => ({
      name: run.name,
      status: run.status,
      conclusion: run.conclusion || 'running',
      event: run.event,
      createdAt: run.createdAt,
      url: run.url
    }))
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════════════════════

export interface RepoEvent {
  type: string;
  actor: string;
  createdAt: string;
  payload?: any;
}

export function getRecentEvents(limit = 20): GHResult<RepoEvent[]> {
  const result = gh<any[]>(
    `api repos/${REPO_OWNER}/${REPO_NAME}/events --jq '.[:${limit}]'`
  );

  if (!result.success || !result.data) return result as GHResult<RepoEvent[]>;

  return {
    success: true,
    data: result.data.map(event => ({
      type: event.type,
      actor: event.actor?.login || 'unknown',
      createdAt: event.created_at,
      payload: event.payload
    }))
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// RAW FILE ACCESS
// ═══════════════════════════════════════════════════════════════════════════

export function getRawFile(path: string, branch = 'main'): GHResult<string> {
  return ghRaw(
    `api repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${branch} ` +
    `--jq '.content' | base64 -d`
  );
}
