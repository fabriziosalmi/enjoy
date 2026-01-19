/**
 * Activity tracking tools
 */

import { getState, getRecentKarmaLog } from '../state.js';
import { getRecentEvents, listPRs, listIssues } from '../github.js';

export interface KarmaEvent {
  actor: string;
  event: string;
  karma: number;
  timestamp: string;
  timeAgo: string;
}

function getTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export async function getRecentActivity(limit = 15): Promise<{
  karma_events: KarmaEvent[];
  summary: {
    total_karma_24h: number;
    most_active_user: string;
    event_count: number;
  };
}> {
  const karmaLog = await getRecentKarmaLog(limit);

  const events: KarmaEvent[] = karmaLog.map(e => ({
    ...e,
    timeAgo: getTimeAgo(e.timestamp)
  }));

  // Calculate 24h stats
  const oneDayAgo = Date.now() - 86400000;
  const recent24h = karmaLog.filter(e =>
    new Date(e.timestamp).getTime() > oneDayAgo
  );

  const total24h = recent24h.reduce((sum, e) => sum + e.karma, 0);

  // Most active user in 24h
  const userKarma: Record<string, number> = {};
  recent24h.forEach(e => {
    userKarma[e.actor] = (userKarma[e.actor] || 0) + e.karma;
  });

  const mostActive = Object.entries(userKarma)
    .sort((a, b) => b[1] - a[1])[0];

  return {
    karma_events: events,
    summary: {
      total_karma_24h: total24h,
      most_active_user: mostActive?.[0] || 'none',
      event_count: recent24h.length
    }
  };
}

export interface GitHubActivity {
  events: Array<{
    type: string;
    actor: string;
    timeAgo: string;
    details?: string;
  }>;
  prs: {
    open: number;
    recent_merged: number;
  };
  issues: {
    open: number;
  };
}

export async function getGitHubActivity(): Promise<GitHubActivity> {
  const [events, openPRs, mergedPRs, openIssues] = await Promise.all([
    getRecentEvents(15),
    listPRs('open', 10),
    listPRs('merged', 5),
    listIssues('open', 10)
  ]);

  return {
    events: events.data?.map(e => ({
      type: e.type.replace('Event', ''),
      actor: e.actor,
      timeAgo: getTimeAgo(e.createdAt),
      details: getEventDetails(e)
    })) || [],
    prs: {
      open: openPRs.data?.length || 0,
      recent_merged: mergedPRs.data?.length || 0
    },
    issues: {
      open: openIssues.data?.length || 0
    }
  };
}

function getEventDetails(event: any): string {
  switch (event.type) {
    case 'PushEvent':
      return `${event.payload?.commits?.length || 0} commits`;
    case 'PullRequestEvent':
      return event.payload?.action || '';
    case 'IssueCommentEvent':
      return 'commented';
    case 'WatchEvent':
      return 'starred';
    case 'ForkEvent':
      return 'forked';
    default:
      return '';
  }
}
