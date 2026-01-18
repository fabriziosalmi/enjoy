# 🎮 How to Play enjoy

> Complete guide for players. Every step, every trigger, every possible outcome documented.

## 📋 Table of Contents

1. [Quick Start (30 seconds)](#-quick-start-30-seconds)
2. [The Complete Flow](#-the-complete-flow)
3. [Validation Requirements](#-validation-requirements)
4. [Karma System](#-karma-system)
5. [Time Bonuses](#-time-bonuses)
6. [Error Messages & Fixes](#-error-messages--fixes)
7. [FAQ](#-faq)

---

## ⚡ Quick Start (30 seconds)

### Option A: GitHub Web (Easiest)

1. **Fork this repo** (top right button)
2. **Create a new file**: `words/YOURWORD.txt`
3. **Content**: Just your word (e.g., `PHOENIX`)
4. **Commit** to a new branch
5. **Open Pull Request** → Use the template!

### Option B: Command Line

```bash
# 1. Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/enjoy.git
cd enjoy

# 2. Create branch
git checkout -b play/your-word

# 3. Add your word
echo "PHOENIX" > words/PHOENIX.txt

# 4. Commit with emoji
git add .
git commit -m "🎮 Add word: PHOENIX"

# 5. Push
git push origin play/your-word

# 6. Open PR on GitHub with the template!
```

---

## 🔄 The Complete Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         enjoy GAME FLOW                                     │
└─────────────────────────────────────────────────────────────────────────────┘

PLAYER ACTION                 WORKFLOW TRIGGERED           OUTCOME
═══════════════════════════════════════════════════════════════════════════════

1. Create PR                 ┌──────────────────────┐
   └──────────────────────>  │  validate-pr.yml     │
                             │  (pull_request:      │
                             │   opened/synchronize)│
                             └──────────┬───────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
            [FORMAT CHECK]      [ENGINE VALIDATE]    [KARMA ANALYSIS]
                    │                   │                   │
                    └───────────────────┼───────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
                    ▼                                       ▼
            ❌ INVALID                               ✅ VALID
            - Comment with errors                   - Add 'auto-merge' label
            - Add 'needs-fix' label                 - Comment with karma preview
            - Add 'format-error' label              - Show time bonuses
            - WORKFLOW FAILS                        - WORKFLOW SUCCEEDS
                    │                                       │
                    │                                       ▼
                    │                              ┌────────────────────┐
                    │                              │  auto-merge.yml    │
                    │                              │  (label: auto-merge)│
                    │                              └─────────┬──────────┘
                    │                                        │
                    │                                        ▼
                    │                              [MERGE PR TO MAIN]
                    │                                        │
                    │                                        ▼
                    │                              ┌────────────────────┐
                    │                              │  on-merge.yml      │
                    │                              │  (pull_request:    │
                    │                              │   closed + merged) │
                    │                              └─────────┬──────────┘
                    │                                        │
                    │                                        ▼
                    │                              [UPDATE state.json]
                    │                              - Calculate karma
                    │                              - Apply time multiplier
                    │                              - Check achievements
                    │                              - Update streak
                    │                              - Maybe mystery box!
                    │                                        │
                    │                                        ▼
                    │                              ┌────────────────────┐
                    │                              │  deploy-pages.yml  │
                    │                              │  (push: main)      │
                    │                              └─────────┬──────────┘
                    │                                        │
                    │                                        ▼
                    │                              [DEPLOY TO GITHUB PAGES]
                    │                              - index.html updated
                    │                              - You appear on leaderboard!
                    │                                        │
                    ▼                                        ▼
             ┌──────────┐                           ┌──────────────┐
             │  RETRY   │                           │   SUCCESS!   │
             │  Fix PR  │                           │   +X karma   │
             │  Push    │                           │   🎉         │
             └──────────┘                           └──────────────┘


PARALLEL WORKFLOWS (don't affect the main flow):
═══════════════════════════════════════════════════════════════════════════════

┌──────────────────────────┐    ┌──────────────────────────┐
│  welcome-bot.yml         │    │  track-karma.yml         │
│  (first PR only)         │    │  (engagement tracking)   │
│  - Welcomes new player   │    │  - PR comments           │
│  - Shows tips            │    │  - Reactions             │
└──────────────────────────┘    └──────────────────────────┘
```

---

## ✅ Validation Requirements

### 1. PR Format (checked by `validate-pr.yml`)

Your PR body MUST include:

| Requirement | How to Pass | Example |
|-------------|-------------|---------|
| **Guardian Answer** | Answer "Karmiel" | `**What is the name of the First Guardian?** Karmiel` |
| **Word Field** | Not empty, 3-30 chars | `**Word:** PHOENIX` |
| **Checklist** | ≥3 boxes checked | `- [x] I read the rules` |

### 2. File Requirements (checked by engine)

| Requirement | Details |
|-------------|---------|
| **File location** | `words/YOURWORD.txt` |
| **File content** | Your word (matches filename) |
| **Word length** | 3-30 characters |
| **Word quality** | Not "test", "hello", "foo", etc. |
| **Uniqueness** | Word not already submitted |

### 3. PR Template (copy this!)

```markdown
## 🎮 PLAY enjoy - Your Contribution

### 🔐 Proof of Humanity

**What is the name of the First Guardian?** Karmiel

**Word:** YOURWORD

### ✅ Checklist

- [x] I read the rules (the answer above is correct!)
- [x] My word is 3-20 characters
- [x] My word is creative (not test, hello, foo)
- [x] I added only ONE .txt file (like MYWORD.txt)

---

**Referred by:** @username
```

---

## 💜 Karma System

### Base Karma Calculation

```
TOTAL = BASE × STREAK × TIME × CHALLENGE + ACHIEVEMENTS + MYSTERY + RARE_EVENTS
```

| Component | Values |
|-----------|--------|
| **Base** | 10 karma |
| **Streak Multiplier** | 1.0 (day 1) → 1.5 (3d) → 2.0 (7d) → 2.5 (14d) → 3.0 (30d) |
| **Time Multiplier** | 1.15 - 1.5 (depends on CET time) |
| **Challenge Bonus** | x1.5 - x3.0 if daily challenge matches |
| **Achievements** | +10 to +500 karma each |
| **Mystery Box** | Every 5th contribution, +10 to +100 random |
| **Rare Events** | +100 to +333 (specific times) |

### Achievements

| Achievement | Requirement | Karma |
|-------------|-------------|-------|
| `first_blood` | 1 PR merged | +10 |
| `getting_started` | 5 PRs merged | +25 |
| `dedicated` | 25 PRs merged | +100 |
| `legend` | 100 PRs merged | +500 |
| `karma_hunter` | 100 total karma | +20 |
| `karma_master` | 500 total karma | +75 |
| `karma_god` | 1000 total karma | +200 |
| `streak_3` | 3 day streak | +15 |
| `streak_7` | 7 day streak | +50 |
| `streak_30` | 30 day streak | +300 |
| `og` | Among first 10 players | +100 |
| `night_owl` | 5 night contributions | +25 |
| `early_bird` | 3 dawn contributions | +25 |
| `around_the_clock` | Contribute in all 6 time periods | +200 |

---

## 🕐 Time Bonuses

The game uses **CET (Central European Time)** for all time calculations.

### Time Periods

| Period | Hours (CET) | Multiplier | Emoji |
|--------|-------------|------------|-------|
| **Dawn** | 05:00 - 07:59 | x1.2 | 🌅 |
| **Morning** | 08:00 - 11:59 | x1.3 | ☀️ |
| **Noon** | 12:00 - 14:59 | x1.5 | 🌞 |
| **Afternoon** | 15:00 - 17:59 | x1.25 | 🌤️ |
| **Sunset** | 18:00 - 20:59 | x1.15 | 🌆 |
| **Night** | 21:00 - 04:59 | x1.4 | 🌙 |

### Rare Time Events (JACKPOT!)

| Event | Exact Time (CET) | Bonus |
|-------|------------------|-------|
| 🔮 **Witching Hour** | 00:00 | +200 karma |
| ☀️ **Solar Peak** | 12:00 | +100 karma |
| ✨ **Triple Time** | 11:11 or 22:22 | +111 karma |
| 👹 **Devil's Hour** | 03:33 | +333 karma |

---

## ❌ Error Messages & Fixes

### "PR Format validation failed!"

**Cause**: Your PR body is missing required fields.

**Fix**:
1. Edit your PR
2. Add the Guardian answer: `**What is the name of the First Guardian?** Karmiel`
3. Add your word: `**Word:** YOURWORD`
4. Check at least 3 boxes in the checklist

### "Word too short/long"

**Cause**: Word must be 3-30 characters.

**Fix**: Choose a different word with appropriate length.

### "Invalid contribution"

**Cause**: Engine rejected the word (duplicate, banned word, etc.)

**Fix**:
- Check if word already exists in `words/` folder
- Avoid test words like "test", "hello", "foo"
- Use creative, meaningful words

### "Contribution Refused"

**Cause**: Karma score too low (low quality).

**Fix**:
- Use unique, creative words
- Words 5-10 characters tend to score best
- Avoid very common words

### Labels on your PR

| Label | Meaning | Action |
|-------|---------|--------|
| `auto-merge` | ✅ Valid! Will merge soon | Wait |
| `needs-fix` | ❌ Needs changes | Edit PR |
| `format-error` | ❌ Template not followed | Edit PR body |
| `invalid` | ❌ Engine rejected | Fix and re-push |
| `refused` | ❌ Low quality | Choose better word |
| `karma-x2` | 🌟 Excellent quality | Bonus! |
| `karma-x3` | 💫 Legendary quality | Big bonus! |

---

## ❓ FAQ

### Q: Why didn't my PR merge automatically?

**A**: Check these things:
1. Does your PR have the `auto-merge` label?
2. Did validation pass? (green check)
3. Is there a queue? (concurrency control)

### Q: My word wasn't detected. Why?

**A**: The word is extracted from:
1. PR title (format: `🎮 Add word: YOURWORD`)
2. File name (`words/YOURWORD.txt`)
3. PR body (`**Word:** YOURWORD`)

Make sure at least one matches!

### Q: When do I get karma?

**A**: Karma is calculated and added when:
1. PR is merged (not just approved)
2. `on-merge.yml` workflow runs
3. `state.json` is updated

### Q: Why is my streak 1 even though I contributed yesterday?

**A**: Streaks are calculated on PR **merge** date, not creation date. Also:
- Streak resets if >24h between merges
- Time is calculated in CET

### Q: Can I submit multiple words?

**A**: Yes! Each word = separate PR = separate karma.

### Q: What timezone is used?

**A**: All times are **CET (Central European Time, GMT+1)**. This affects:
- Time period bonuses
- Rare time events
- Daily challenge reset

### Q: How do referrals work?

**A**: Add `**Referred by:** @username` in your PR. Both players get +25% karma bonus when merged!

---

## 🏗️ Technical Details

### Workflow Triggers

| Workflow | Trigger | Condition |
|----------|---------|-----------|
| `validate-pr.yml` | `pull_request: opened, synchronize, reopened` | Always |
| `welcome-bot.yml` | `pull_request_target: opened` | First PR only |
| `auto-merge.yml` | `pull_request: labeled` | Label = `auto-merge` |
| `on-merge.yml` | `pull_request: closed` | `merged == true` |
| `deploy-pages.yml` | `push: main` | Always |

### Concurrency

All game-related workflows use:
```yaml
concurrency:
  group: enjoy-game-state
  cancel-in-progress: false
```

This ensures:
- Only one workflow modifies `state.json` at a time
- PRs are queued, not cancelled
- No race conditions

### Files Modified

| File | Modified By | When |
|------|-------------|------|
| `state.json` | `on-merge.yml` | On merge |
| `words/*.txt` | Player | PR creation |
| `index.html` | `deploy-pages.yml` | On push to main |

---

## 🎯 Pro Tips

1. **Best time to play**: Noon (12:00-15:00 CET) for x1.5 multiplier
2. **JACKPOT hunting**: Try to merge exactly at 00:00, 12:00, 11:11, 22:22, or 03:33 CET
3. **Streak building**: Contribute daily to maximize multiplier (up to x3.0 at 30 days)
4. **Mystery boxes**: Every 5th contribution gives bonus karma
5. **Referrals**: Invite friends for +25% bonus on both sides

---

## 🔍 Troubleshooting Checklist

If something goes wrong, check these in order:

### Pre-PR Checklist

- [ ] File is in `words/` folder (not root)
- [ ] File name matches content (`PHOENIX.txt` contains `PHOENIX`)
- [ ] File has `.txt` extension
- [ ] Word is 3-30 characters
- [ ] Word is alphanumeric only (A-Z, a-z, 0-9)
- [ ] Word isn't already in `words/` folder

### PR Template Checklist

- [ ] PR title starts with `🎮` emoji
- [ ] Guardian answer says `Karmiel` (exact spelling)
- [ ] `**Word:**` field is filled (not empty, no comment markers)
- [ ] At least 3 checkboxes are `[x]` (not `[ ]`)
- [ ] Only ONE `.txt` file is added

### Post-PR Checklist

- [ ] `validate-pr` workflow shows ✅ green check
- [ ] PR has `auto-merge` label
- [ ] No `needs-fix` or `format-error` labels

### Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| `MYWORD.txt` in root | File not in `words/` folder | Move to `words/MYWORD.txt` |
| `**Word:** <!-- comment -->` | Word field has HTML comment | Remove `<!-- -->` |
| Only 2 checkboxes | Need at least 3 | Check more boxes |
| Word is "Karmiel" | Can't use Guardian name | Choose different word |
| Pushed without template | PR body empty | Edit PR, add template |
| Multiple files added | Only 1 `.txt` allowed | Remove extra files |

---

## 🧪 Edge Cases Documented

### What happens if...

| Scenario | Result |
|----------|--------|
| **Same word, different case** (phoenix vs PHOENIX) | ❌ Rejected as duplicate |
| **Word with spaces** | ❌ Invalid pattern |
| **Word with emojis** | ❌ Invalid pattern |
| **Very fast merge** (<60s) | 🏆 `speed_demon` achievement |
| **PR edited after validation** | New validation runs (sync trigger) |
| **Two PRs at same time** | Queue (concurrency control) |
| **Bot submits PR** | Skipped format check, normal validation |
| **PR closed without merge** | No karma awarded |
| **PR merged by maintainer** | Same karma as auto-merge |
| **Profanity in word** | ❌ Rejected by bad-words filter |
| **Word already on board** | ❌ Duplicate detected |

### Workflow Dependencies

```
validate-pr.yml
    ├── Reads: PR body, PR files, state.json
    ├── Writes: Labels on PR, Comment on PR
    └── Triggers: auto-merge.yml (via label)

auto-merge.yml  
    ├── Requires: 'auto-merge' label
    ├── Reads: PR branch, state.json
    ├── Writes: Merge commit to main
    └── Triggers: on-merge.yml (via PR close)

on-merge.yml
    ├── Requires: PR merged == true
    ├── Reads: state.json, PR metadata
    ├── Writes: state.json (karma, achievements, etc.)
    └── Triggers: update-readme-stats.yml, health-check.yml (via workflow_run)

update-readme-stats.yml (+ health-check.yml)
    ├── Requires: workflow_run completion
    ├── Reads: state.json
    ├── Writes: README.md stats, badges/*.json, health-report.json
    └── Commits with: [skip ci] (prevents loops)

deploy-pages.yml
    ├── Requires: Push to main
    ├── Reads: All files
    └── Writes: GitHub Pages deployment
```

> **Loop Prevention**: All bot commits use `[skip ci]` in their commit message.
> Only `on-merge.yml` commits without it to trigger the stats sync chain.

### 📫 Issue & Translation Policies

| Policy | Details |
|--------|---------|
| **Stale Issues** | Inactive 30 days → "stale" label → 14 days grace → auto-close |
| **Exempt Labels** | 📌 pinned, 🔒 security, 🎯 help wanted, 💰 bounty, 🔥 hot |
| **Translation Karma** | New language: +100 · Update: +50 · Extra file: +15 |
| **Translation PR** | Title with "translation" or flag emoji → separate karma tracking |

### Blockers

| Blocker | How to Detect | How to Fix |
|---------|---------------|------------|
| Concurrency queue | Another PR processing | Wait 30-60 seconds |
| Rate limit | GitHub API errors | Wait 1 minute |
| Branch protection | Can't merge | Maintainer intervention |
| Workflow disabled | No checks run | Enable in repo settings |

---

*Built by humans (mostly). Played by humans (definitely). Understood by neither.* 💜
