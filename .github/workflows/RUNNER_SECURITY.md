# 🛡️ Runner Security Policy

## Self-Hosted Runner Configuration

### Label Setup
- **Label**: `proxmox-lxc` (or your custom label)
- **Only trusted workflows** should use this label

### ⚠️ CRITICAL: Never use self-hosted for external input!

These workflows process **untrusted external input** and MUST use `ubuntu-latest`:

| Workflow | Reason | Runner |
|----------|--------|--------|
| `validate-pr.yml` | Processes PR from forks | `ubuntu-latest` ONLY |
| `auto-merge.yml` | Merges external code | `ubuntu-latest` ONLY |
| `validate-issue.yml` | Processes issue body | `ubuntu-latest` ONLY |
| `welcome-bot.yml` | `pull_request_target` | `ubuntu-latest` ONLY |
| `translation-karma.yml` | Processes merged PRs | `ubuntu-latest` ONLY |
| `on-merge.yml` | Post-merge processing | `ubuntu-latest` ONLY |

### ✅ Safe for self-hosted runner

These workflows only run on **schedule** or **internal triggers**:

| Workflow | Trigger | Can use self-hosted |
|----------|---------|---------------------|
| `daily-maintenance.yml` | schedule | ✅ Yes |
| `weekly-report.yml` | schedule | ✅ Yes |
| `health-check.yml` | workflow_run | ✅ Yes |
| `update-readme-stats.yml` | workflow_run | ✅ Yes |
| `generate-art.yml` | workflow_run | ✅ Yes |
| `generate-metrics.yml` | workflow_run | ✅ Yes |
| `dynamic-header.yml` | schedule | ✅ Yes |
| `guardian-angel.yml` | schedule | ✅ Yes |
| `track-entropy.yml` | schedule | ✅ Yes |
| `time-capsule.yml` | schedule | ✅ Yes |
| `stale-issues.yml` | schedule | ✅ Yes |
| `update-leaderboard.yml` | schedule | ✅ Yes |
| `update-bounty-board.yml` | schedule | ✅ Yes |
| `celebrate-milestones.yml` | workflow_run | ✅ Yes |
| `deploy-pages.yml` | push to main | ✅ Yes (trusted) |
| `sync-repo-stats.yml` | watch/fork | ✅ Yes |
| `write-story.yml` | workflow_run | ✅ Yes |
| `translate.yml` | schedule | ✅ Yes |

### How to configure

1. Add runner with label: `proxmox-lxc`
2. Update safe workflows to use:
   ```yaml
   runs-on: [self-hosted, proxmox-lxc]
   ```
3. **NEVER** change dangerous workflows from `ubuntu-latest`

### Why this matters

A malicious PR could:
- Execute arbitrary code on your LXC container
- Access your Proxmox network
- Steal secrets/tokens
- Pivot to other systems

**Always treat PR content as untrusted code!**
