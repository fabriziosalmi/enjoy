# 📖 Documentation Index

> Everything you need to know about enjoy

---

## 🚀 Getting Started

| Document | Description | Audience |
|----------|-------------|----------|
| [README.md](README.md) | Project overview | Everyone |
| [QUICKSTART.md](QUICKSTART.md) | ⚡ **Start here!** 2-minute guide | New players |
| [LORE.md](LORE.md) | Game rules & Guardian secret | New players |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Detailed contribution guide | All players |

---

## 🎮 Gameplay Guides

| Document | Description | Karma Info |
|----------|-------------|------------|
| [HUB.md](HUB.md) | Central navigation hub | All sources |
| [GAMEPLAY.md](GAMEPLAY.md) | Complete karma system | +1 to +100 |
| [LEVELS_ROADMAP.md](LEVELS_ROADMAP.md) | All 100 levels explained | Unlock requirements |

---

## 💰 Earning Karma

| Document | Focus Area | Karma Range |
|----------|------------|-------------|
| [bounties.md](bounties.md) | Special missions | +30 to +200 |
| [ENGAGEMENT.md](ENGAGEMENT.md) | Stars, Forks, Shares | +1 to +50 |
| [COMMITS.md](COMMITS.md) | Commit magic & streaks | +1 to +500 |
| [PROJECTS.md](PROJECTS.md) | Project board quests | +1 to +100 |
| [RELEASES.md](RELEASES.md) | Release participation | +3 to +200 |
| [WIKI.md](WIKI.md) | Wiki contributions | +3 to +100 |

---

## 🌌 Universe & Lore

| Document | Content |
|----------|---------|
| [LORE.md](LORE.md) | The story, rules, Guardian |
| [SECRETS.md](SECRETS.md) | 🥚 Easter eggs (find them!) |
| [levels/](levels/) | All 100 level definitions |

---

## 🔧 Technical

| Document | Content |
|----------|---------|
| [IMPLEMENTATION.md](IMPLEMENTATION.md) | Architecture overview |
| [game-config.yaml](game-config.yaml) | Game settings |
| [state.json](state.json) | Current game state |
| [engine/](engine/) | TypeScript validation engine |

---

## 🤖 Automation (24 Workflows)

> All automation runs via GitHub Actions. Bot commits use `[skip ci]` to prevent loops.

### Core Game Flow
| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `validate-pr.yml` | PR opened | Validates contributions |
| `auto-merge.yml` | Label `auto-merge` | Merges valid PRs |
| `on-merge.yml` | PR merged | Updates game state |

### Stats & Monitoring
| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `update-readme-stats.yml` | workflow_run | Syncs live dashboard |
| `health-check.yml` | workflow_run + schedule | Integrity checks |
| `generate-metrics.yml` | state change | Community metrics |

### Karma Tracking
| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `track-karma.yml` | Various events | Multi-source karma |
| `translation-karma.yml` | Translation PR | +100/+50 karma |
| `validate-issue.yml` | Issue opened | Issue karma |

### Maintenance
| Workflow | Schedule | Purpose |
|----------|----------|---------|
| `daily-maintenance.yml` | Daily | Backups, cleanup |
| `weekly-report.yml` | Weekly | Karma reports |
| `stale-issues.yml` | Daily | Auto-close inactive (44 days) |

### Content Generation
| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `generate-art.yml` | state change | ASCII art |
| `write-story.yml` | state change | Chronicle entries |
| `dynamic-header.yml` | Schedule | Time-based themes |

---

## 📋 Templates

### Issue Templates
| Template | Purpose | Karma |
|----------|---------|-------|
| [Bug Report](.github/ISSUE_TEMPLATE/bug-report.yml) | Report bugs | +5 |
| [Contribution Idea](.github/ISSUE_TEMPLATE/contribution-idea.yml) | Suggest features | +5 |
| [Prophecy](.github/ISSUE_TEMPLATE/prophecy.md) | Predict future | +25-75 |
| [Art Submission](.github/ISSUE_TEMPLATE/art-submission.md) | Submit art | +15-50 |
| [Lore Addition](.github/ISSUE_TEMPLATE/lore-addition.md) | Expand universe | +15-85 |
| [Challenge Creation](.github/ISSUE_TEMPLATE/challenge-creation.md) | Create challenges | +10+ |

### Discussion Templates
| Template | Purpose | Karma |
|----------|---------|-------|
| [Ideas](.github/DISCUSSION_TEMPLATE/ideas.yml) | Share ideas | +5 |
| [Polls](.github/DISCUSSION_TEMPLATE/polls.yml) | Community voting | +5 |
| [Q&A](.github/DISCUSSION_TEMPLATE/q-and-a.yml) | Ask questions | +3/+10 |
| [Show & Tell](.github/DISCUSSION_TEMPLATE/show-and-tell.yml) | Share creations | +8 |

---

## 🗺️ Navigation

```
START HERE
    │
    ▼
┌─────────────────┐
│  QUICKSTART.md  │ ◄── 2 minutes to play!
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    LORE.md      │ ◄── Find the Guardian's name
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Open a PR!     │ ◄── Your first contribution
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   GAMEPLAY.md   │ ◄── Learn karma system
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    HUB.md       │ ◄── Explore everything
└─────────────────┘
```

---

## 📊 Document Stats

| Metric | Count |
|--------|-------|
| Core docs | 12 |
| Guides | 7 |
| Templates | 10 |
| Level files | 100 |
| Total | ~130 files |

---

## 🔄 Updates

Documents are updated continuously. Check `git log` for recent changes.

Last major update: January 2026

---

*Get lost in the docs? Start with [QUICKSTART.md](QUICKSTART.md)!*
