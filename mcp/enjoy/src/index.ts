#!/usr/bin/env node
/**
 * enjoy MCP Server
 *
 * Provides tools for managing the enjoy game repository:
 * - project_status: Health check and overview
 * - player_stats: Individual player information
 * - leaderboard: Current rankings
 * - recent_activity: Karma events and GitHub activity
 * - bounties: Bounty status and details
 * - pr_check: PR validation status
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { getProjectStatus } from './tools/status.js';
import { getPlayerStats, getFullLeaderboard, getPlayersOverview } from './tools/players.js';
import { getRecentActivity, getGitHubActivity } from './tools/activity.js';
import { getBountyStatus, getBountyDetails, getBountySummary } from './tools/bounties.js';
import { getPRDetails, listPRs } from './github.js';
import { invalidateCache } from './state.js';

// ═══════════════════════════════════════════════════════════════════════════
// TOOL DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

const TOOLS: Tool[] = [
  {
    name: 'project_status',
    description: 'Get comprehensive project health check: game state, repo stats, workflows, and open PRs',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'player_stats',
    description: 'Get stats for a specific player by username',
    inputSchema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'GitHub username of the player'
        }
      },
      required: ['username']
    }
  },
  {
    name: 'leaderboard',
    description: 'Get current karma leaderboard',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of players to show (default: 10)'
        }
      },
      required: []
    }
  },
  {
    name: 'players_overview',
    description: 'Get overview of all players: total count, active today, newest player',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'recent_activity',
    description: 'Get recent karma events and activity summary',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of events to show (default: 15)'
        }
      },
      required: []
    }
  },
  {
    name: 'github_activity',
    description: 'Get recent GitHub events: pushes, PRs, issues, stars, forks',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'bounties',
    description: 'Get bounty status: active, completed, karma available',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'bounty_details',
    description: 'Get details for a specific bounty by ID',
    inputSchema: {
      type: 'object',
      properties: {
        bounty_id: {
          type: 'string',
          description: 'Bounty ID (e.g., "bug_hunter", "docs_hero")'
        }
      },
      required: ['bounty_id']
    }
  },
  {
    name: 'pr_check',
    description: 'Get PR details and validation status',
    inputSchema: {
      type: 'object',
      properties: {
        pr_number: {
          type: 'number',
          description: 'PR number to check'
        }
      },
      required: ['pr_number']
    }
  },
  {
    name: 'open_prs',
    description: 'List all open PRs with their status',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of PRs to show (default: 10)'
        }
      },
      required: []
    }
  },
  {
    name: 'refresh_cache',
    description: 'Force refresh the state cache (use after manual state updates)',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// TOOL HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

async function handleToolCall(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'project_status':
      return await getProjectStatus();

    case 'player_stats':
      return await getPlayerStats(args.username as string);

    case 'leaderboard':
      return await getFullLeaderboard((args.limit as number) || 10);

    case 'players_overview':
      return await getPlayersOverview();

    case 'recent_activity':
      return await getRecentActivity((args.limit as number) || 15);

    case 'github_activity':
      return await getGitHubActivity();

    case 'bounties':
      return await getBountyStatus();

    case 'bounty_details':
      return await getBountyDetails(args.bounty_id as string);

    case 'pr_check': {
      const prNumber = args.pr_number as number;
      const result = getPRDetails(prNumber);
      if (!result.success) {
        return { error: result.error };
      }
      return {
        number: result.data.number,
        title: result.data.title,
        author: result.data.author?.login,
        state: result.data.state,
        files: result.data.files?.map((f: any) => f.path),
        checks: result.data.statusCheckRollup?.map((c: any) => ({
          name: c.name,
          status: c.conclusion || c.status
        })),
        labels: result.data.labels?.map((l: any) => l.name)
      };
    }

    case 'open_prs': {
      const result = listPRs('open', (args.limit as number) || 10);
      if (!result.success) {
        return { error: result.error };
      }
      return result.data;
    }

    case 'refresh_cache':
      invalidateCache();
      return { success: true, message: 'Cache invalidated. Next request will fetch fresh data.' };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVER SETUP
// ═══════════════════════════════════════════════════════════════════════════

const server = new Server(
  {
    name: 'enjoy-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await handleToolCall(name, args || {});
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: message }),
        },
      ],
      isError: true,
    };
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('enjoy MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
