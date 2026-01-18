# enjoy - Development Summary

## 🎮 What We Built

A GitHub-based game with:
- **100 levels** of progression (1 → 100)
- **Karma system** (good → amplify x2-3, bad → refuse)
- **Voting system** (top coders propose rules, community votes)
- **GitHub Pages as final boss** (level 95)
- **Community governance** (level 100 = max, infinite mode)

## 📁 Repository Structure

```
enjoy/
├── README.md              # Epic introduction, how to play
├── CONTRIBUTING.md        # Player + developer guide
├── LEVELS_ROADMAP.md      # All 100 levels documented
├── LICENSE                # MIT
├── state.json             # Game state (v3.0 with karma)
│
├── levels/                # Level definitions
│   ├── 001-hello-world.yaml       # Level 1
│   ├── 010-first-complexity.yaml  # Milestone
│   ├── 095-pages-unlock.yaml      # Boss fight
│   └── [98 more to create]
│
├── rules/                 # Active game rules
│   └── 001-first-word.yaml
│
├── proposals/             # Rule proposals (created by voting system)
│
├── engine/                # TypeScript game engine
│   ├── src/
│   │   ├── index.ts      # CLI entry point
│   │   ├── types.ts      # Type definitions
│   │   ├── parser.ts     # PR metadata parser
│   │   ├── validator.ts  # Rule validation
│   │   ├── executor.ts   # Effect application
│   │   ├── builder.ts    # Pages builder (level 95+)
│   │   ├── karma.ts      # ⭐ Karma & quality analysis
│   │   ├── voting.ts     # ⭐ Rule proposal & voting
│   │   └── sanitizers/   # HTML/CSS/JS validators (TODO)
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                  # GitHub Pages + VitePress
│   ├── index.html        # Game board (evolves with levels)
│   ├── style.css         # CGA arcade theme
│   ├── game.js           # State renderer
│   ├── .vitepress/       # Documentation
│   │   └── config.ts
│   ├── guide/
│   │   └── index.md
│   └── package.json
│
├── board/                 # Screenshot generator
│   ├── index.html        # Board template
│   ├── render.js         # Playwright screenshot
│   └── package.json
│
├── contributions/         # Player contributions by type
│   └── README.md
│
└── .github/
    └── workflows/              # 24 automated workflows
        │
        │ # Core Game Flow
        ├── validate-pr.yml       # Karma analysis + validation
        ├── auto-merge.yml        # Smart merge with amplification
        ├── on-merge.yml          # State updates (triggers chain)
        │
        │ # Stats & Health (workflow_run chain)
        ├── update-readme-stats.yml  # Live dashboard [skip ci]
        ├── health-check.yml      # Integrity checks [skip ci]
        │
        │ # Karma Tracking
        ├── track-karma.yml       # Multi-source karma [skip ci]
        ├── translation-karma.yml # Translation rewards [skip ci]
        │
        │ # Engagement & Community
        ├── welcome-bot.yml       # New player welcome
        ├── validate-issue.yml    # Issue karma [skip ci]
        ├── celebrate-milestones.yml # Level ups [skip ci]
        │
        │ # Scheduled Maintenance
        ├── daily-maintenance.yml # Backups, cleanup [skip ci]
        ├── weekly-report.yml     # Karma reports [skip ci]
        ├── stale-issues.yml      # Auto-close inactive
        │
        │ # Content Generation
        ├── generate-art.yml      # ASCII art [skip ci]
        ├── generate-metrics.yml  # Community stats [skip ci]
        ├── write-story.yml       # Chronicle [skip ci]
        ├── dynamic-header.yml    # Time-based header [skip ci]
        │
        │ # Special Features
        ├── guardian-angel.yml    # Community health [skip ci]
        ├── track-entropy.yml     # Randomness metrics [skip ci]
        ├── time-capsule.yml      # Future messages [skip ci]
        ├── translate.yml         # Translation stubs [skip ci]
        │
        │ # Infrastructure
        ├── deploy-pages.yml      # GitHub Pages
        ├── sync-repo-stats.yml   # Badge updates [skip ci]
        └── update-leaderboard.yml # Rankings
```

> **Note**: Workflows marked `[skip ci]` use this commit flag to prevent
> infinite loops. Only `on-merge.yml` commits without it to trigger the
> `workflow_run` chain for stats synchronization.

## ✨ Key Features Implemented

### 1. 100-Level System
- Granular progression (not 5 big levels, but 100 micro-levels)
- Milestones at 10, 25, 50, 75, 95, 100
- GitHub Pages unlocks at level 95 (not level 1!)
- Community governance at level 100

### 2. Karma System (`engine/src/karma.ts`)
- **Quality analysis** of each contribution
- **Score 0-100** based on:
  - Word length (5-10 optimal)
  - Creativity (not "test", "hello", etc.)
  - Pattern quality
  - No duplicates
  - Commit message quality
- **Amplification**:
  - Excellent (80+) → x3 amplification + 25 karma
  - Good (60-79) → x2 amplification + 15 karma
  - Okay (40-59) → x1 + 5 karma
  - Bad (<40) → REFUSED + -20 karma
- **Global karma** affects multipliers
- **Player reputation** tracked separately

### 3. Voting System (`engine/src/voting.ts`)
- **Rule proposals** by top coders (or high-karma players)
- **Voting power** based on:
  - Top 10 = 1-10 votes
  - Others = 0-5 votes based on reputation
- **Approval**: 66% yes + min 20 voting power
- **7-day voting period**
- **Auto-implementation** of approved rules

### 4. Security
- HTML sanitization (DOMPurify) - TODO: implement
- CSS validation (CGA palette only) - TODO: implement
- JS sandboxing (AST validation) - TODO: implement
- Rate limiting
- Manual approval gate for level 95

### 5. Anti-Ban Strategy
- Level 1-20 are SUPER safe (just text files)
- No spam possible (karma system refuses low quality)
- Self-regulating community
- Gradual complexity increase

## 🚀 Next Steps

### Immediate (To Launch)
1. **Install dependencies**:
   ```bash
   cd engine && npm install
   cd ../board && npm install
   cd ../docs && npm install
   ```

2. **Build engine**:
   ```bash
   cd engine && npm run build
   ```

3. **Test locally**:
   ```bash
   cd engine
   echo "PHOENIX" > ../phoenix.txt
   npm run validate -- --pr-number=1
   npm run apply-effect -- --pr-number=1
   ```

4. **Generate initial screenshot**:
   ```bash
   cd board && npm run render
   ```

5. **Setup GitHub**:
   - Push to GitHub
   - Enable GitHub Actions
   - Configure self-hosted runner (for screenshots)
   - Enable GitHub Pages (but set to level 95 requirement)

### Short Term (Week 1)
- Create levels 2-20 (safe foundation)
- Test karma amplification
- Invite first contributors
- Monitor for spam/abuse

### Medium Term (Month 1)
- Create levels 21-50
- First rule proposals from community
- First voting rounds
- Refine karma algorithm

### Long Term (Year 1)
- Reach level 95
- GitHub Pages activation
- Level 100 transcendence
- Full community governance

## 🎯 Philosophy

> **Execution first. Perfection later.**

The game is designed to:
1. Start SAFE (no way GitHub bans us)
2. Self-regulate (karma system prevents spam)
3. Reward quality (amplification for good work)
4. Empower community (voting on rules)
5. Build to crescendo (level 95 = Pages unlock)
6. Never truly end (level 100 = infinite mode)

## 🔥 Why This Will Work

1. **Progressive disclosure**: Game reveals itself slowly
2. **Immediate feedback**: Karma system tells you why
3. **Power fantasy**: Amplification feels AMAZING
4. **Community ownership**: Players literally vote on rules
5. **Viral moment**: Level 95 Pages unlock will be HUGE
6. **No endpoint**: Level 100 isn't the end, it's the beginning

## 📝 Notes

- **Repo owner maintains veto** (your repo, your rules)
- **Forks welcome** (they can evolve differently)
- **GitHub won't ban** (we start safe, stay safe)
- **Community will self-police** (karma + voting)
- **This is an art project** (disguised as a game)

---

**The repo is the game.**  
**The game is 100 levels.**  
**Let's fucking GO.** 🚀
