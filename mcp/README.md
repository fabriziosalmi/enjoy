# MCP Server for enjoy

This directory contains the **Model Context Protocol (MCP)** server that allows Claude Code and Claude Desktop to interact with the enjoy game directly.

## What is MCP?

[Model Context Protocol](https://modelcontextprotocol.io) is an open standard that enables AI assistants like Claude to interact with external tools, data sources, and systems. Think of it as a "plugin system" for Claude.

With the enjoy MCP server, you can:
- Check game status and health
- View player stats and leaderboards
- Monitor karma events and GitHub activity
- Track bounties and PRs
- Manage the game directly from Claude Code or Claude Desktop

## Quick Start

### For Claude Code (CLI)

1. Clone the repository:
```bash
git clone https://github.com/fabriziosalmi/enjoy.git
cd enjoy
```

2. Build the MCP server:
```bash
cd mcp/enjoy
npm install
npm run build
```

3. The `.mcp.json` file in the root is already configured. Claude Code will automatically detect and use the MCP server.

4. Start Claude Code in the repository:
```bash
cd ../..
claude
```

5. Try it out! Ask Claude:
```
What's the project status?
Show me the leaderboard
Check PR #23
```

### For Claude Desktop

Add this to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "enjoy": {
      "command": "node",
      "args": ["/path/to/enjoy/mcp/enjoy/dist/index.js"]
    }
  }
}
```

Replace `/path/to/enjoy` with the actual path to your cloned repository.

## Available Tools

| Tool | Description |
|------|-------------|
| `project_status` | Comprehensive health check: game state, repo stats, workflows, open PRs |
| `player_stats` | Get stats for a specific player by username |
| `leaderboard` | Current karma rankings |
| `players_overview` | Overview: total count, active today, newest player |
| `recent_activity` | Recent karma events and activity summary |
| `github_activity` | Recent GitHub events: pushes, PRs, issues, stars, forks |
| `bounties` | Active and completed bounties |
| `bounty_details` | Details for a specific bounty |
| `pr_check` | PR validation status and details |
| `open_prs` | List all open PRs with their status |
| `refresh_cache` | Force refresh the state cache |

## Architecture

```
mcp/enjoy/
├── src/
│   ├── index.ts          # Server entry point, tool definitions
│   ├── state.ts          # State management, GitHub API caching
│   ├── github.ts         # GitHub API interactions
│   └── tools/
│       ├── status.ts     # Project status tool
│       ├── players.ts    # Player stats and leaderboard
│       ├── activity.ts   # Activity tracking
│       └── bounties.ts   # Bounty management
├── dist/                 # Compiled JavaScript (generated)
├── package.json
└── tsconfig.json
```

### Key Concepts

1. **State as Source of Truth**: The `state.json` file in the repo root contains all game data. The MCP server fetches it from GitHub's raw content API.

2. **Caching**: State is cached for 30 seconds to avoid rate limits. Use `refresh_cache` to force an update.

3. **GitHub Integration**: The server uses `gh` CLI for some operations (PRs, workflows) and direct API calls for others.

## Creating Your Own Game MCP Server

Want to build something similar? Here's a template:

### 1. Project Setup

```bash
mkdir mcp/your-game
cd mcp/your-game
npm init -y
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node
```

### 2. TypeScript Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true
  },
  "include": ["src/**/*"]
}
```

### 3. Basic Server Template (`src/index.ts`)

```typescript
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// Define your tools
const TOOLS: Tool[] = [
  {
    name: 'game_status',
    description: 'Get current game status',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'player_score',
    description: 'Get score for a player',
    inputSchema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'Player username' }
      },
      required: ['username']
    }
  }
];

// Handle tool calls
async function handleToolCall(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'game_status':
      // Fetch and return your game state
      return { status: 'running', players: 42, level: 5 };

    case 'player_score':
      // Fetch player data
      const username = args.username as string;
      return { username, score: 100, rank: 1 };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Server setup
const server = new Server(
  { name: 'your-game-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await handleToolCall(name, args || {});
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: String(error) }) }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP server running on stdio');
}

main().catch(console.error);
```

### 4. Configure for Claude Code (`.mcp.json` in repo root)

```json
{
  "mcpServers": {
    "your-game": {
      "command": "node",
      "args": ["mcp/your-game/dist/index.js"]
    }
  }
}
```

### 5. Build and Run

```bash
npm run build
# Claude Code will auto-detect the .mcp.json
```

## Tips for Game MCP Servers

1. **Keep State Simple**: Use JSON files as your "database". Easy to debug, version control friendly.

2. **Cache Aggressively**: GitHub API has rate limits. Cache state for 30-60 seconds.

3. **Meaningful Tools**: Each tool should answer a common question. "What's the status?" "Who's winning?" "What can I do?"

4. **Error Handling**: Always return useful error messages. Claude will show them to users.

5. **Real-time Feel**: Use GitHub webhooks + workflows to update state automatically on events.

## Project Info

- **Owner**: [@fabriziosalmi](https://github.com/fabriziosalmi) (Founder)
- **Repository**: [fabriziosalmi/enjoy](https://github.com/fabriziosalmi/enjoy)
- **License**: MIT

## Resources

- [MCP Documentation](https://modelcontextprotocol.io/docs)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Code](https://claude.ai/claude-code)
- [enjoy Game README](../README.md)
