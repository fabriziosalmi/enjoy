# enjoy MCP Server

MCP (Model Context Protocol) server for managing the enjoy game repository.

## Tools Available

| Tool | Description |
|------|-------------|
| `project_status` | Comprehensive health check: game state, repo stats, workflows, PRs |
| `player_stats` | Get stats for a specific player by username |
| `leaderboard` | Current karma leaderboard |
| `players_overview` | Overview of all players |
| `recent_activity` | Recent karma events and activity summary |
| `github_activity` | Recent GitHub events: pushes, PRs, issues, stars |
| `bounties` | Bounty status: active, completed, karma available |
| `bounty_details` | Details for a specific bounty by ID |
| `pr_check` | PR details and validation status |
| `open_prs` | List all open PRs with status |
| `refresh_cache` | Force refresh state cache |

## Setup

### 1. Build

```bash
cd mcp/enjoy
npm install
npm run build
```

### 2. Configure Claude Code

Add to your Claude Code MCP settings (`~/.claude/claude_desktop_config.json` or project settings):

```json
{
  "mcpServers": {
    "enjoy": {
      "command": "node",
      "args": ["/path/to/enjoy/mcp/enjoy/dist/index.js"],
      "env": {}
    }
  }
}
```

### 3. Prerequisites

- `gh` CLI installed and authenticated (`gh auth login`)
- Node.js 18+

## Architecture

```
src/
├── index.ts          # MCP server entry point
├── github.ts         # GitHub CLI wrapper (no hardcoded tokens)
├── state.ts          # State fetcher with GitHub source + cache
└── tools/
    ├── status.ts     # Project health check
    ├── players.ts    # Player stats and leaderboard
    ├── activity.ts   # Karma events and GitHub activity
    └── bounties.ts   # Bounty management
```

## Data Sources

- **State**: Fetched from GitHub raw content (`state.json`) with 30s cache
- **GitHub API**: Uses `gh` CLI (ambient authentication, no tokens stored)

## Example Usage

Once configured, in Claude Code you can use:

```
Use project_status to check the game health
```

```
Get player stats for fabriziosalmi
```

```
Show me the current leaderboard
```

```
Check PR #23 validation status
```
