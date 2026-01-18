# Enjoy and contribute!

## *The repo is the game. The game is 100 levels.*

[![Level](https://img.shields.io/badge/Level-1-blue?style=for-the-badge)](https://github.com/fabriziosalmi/enjoy)
[![Score](https://img.shields.io/badge/Score-0-green?style=for-the-badge)](https://github.com/fabriziosalmi/enjoy)
[![Karma](https://img.shields.io/badge/Karma-0-purple?style=for-the-badge)](https://github.com/fabriziosalmi/enjoy)

---

## 🎮 What is this?

**enjoy** is a game with **100 levels** played entirely through GitHub Pull Requests.

Start simple: add a word.  
Level up: unlock new capabilities.  
Build karma: good contributions get **amplified 2-3x** by the runner.  
Vote on rules: shape the game itself.  
**Reach level 95:** GitHub Pages awakens. Everything you've built becomes a living website.

**The game has no end. But it has a climax at level 100.**

---

## 🌟 Current Status

**Level 1: Hello World**

> One word. Just one. Make it count.

### Progress to Level 2

```
Score:     [░░░░░░░░░] 0/50
PRs:       [░░░░░░░░░] 0/5
Karma:     [░░░░░░░░░] 0 (neutral)
```

**Next unlock:** Level 2 - Second Word

---

## 🎯 How to Play

### 1. Add a word
AURORA" > aurora.txt
```

### 2. Open a PR

```bash
git checkout -b add-aurora
git add aurora.txt
git commit -m "Add AURORA"
git push origin add-aurora
```

### 3. The Karma System Judges

Your PR is analyzed:

- ✅ **Good contribution** → Auto-merge + points + karma
- 🌟 **Excellent contribution** → Auto-merge + **AMPLIFIED 2-3x** (runner adds more!)
- ❌ **Low quality** → Refused with explanation

### 4. Level Up

As the community earns points, levels unlock. Each level unlocks new capabilities.

**At level 95, GitHub Pages activates. The game becomes a website.**

---

## ⚡ The Karma System

Good contributions get **amplified**. Bad ones get **refused**.

### How It Works

Your contribution is analyzed for:
- Word quality (5-10 chars optimal)
- Creativity (not "test", "hello", "foo")
- Pattern (not keyboard mash)
- No duplicates
- Commit message quality

### Amplification

| Quality | Karma | Effect |
|---------|-------|--------|
| Excellent (80+) | +25 | **x3 AMPLIFICATION** 🌟 |
| Good (60-79) | +15 | **x2 AMPLIFICATION** ✨ |
| Okay (40-59) | +5 | Normal (x1) |
| Bad (<40) | -20 | **REFUSED** ❌ |

**Example:** You submit "PHOENIX". It's creative, good length, excellent quality.

→ Karma system gives you +25 karma  
→ Runner **amplifies x3**  
→ Your one word becomes THREE: "PHOENIX", "SUPERPHOENIX", "PHOENIXMAX"

**That's the game. Quality over quantity.**

---

## 🌟 Referral System

**Build chains. Invite players. Earn karma exponentially.**

### How It Works

1. **Invite someone** - Add to your PR description:
   ```markdown
   Invited by @username
   ```

2. **Earn referral karma**:
   - Your invitee makes x1 contribution → **+2 karma** to you
   - Your invitee makes x2 contribution → **+5 karma** to you  
   - Your invitee makes x3 contribution → **+15 karma** to you

3. **Chain bonus**: Each chain level adds **+1 karma** per contribution

4. **Propagation**: Karma flows up the chain at 50% per level

### Example Chain

```
@alice invites @bob (Level 1)
  └─ @bob invites @charlie (Level 2)
      └─ @charlie invites @diana (Level 3)
```

When @diana makes an **x3 contribution**:
- @charlie gets **15 + 2 (chain bonus)** = **17 karma** 
- @bob gets **8 karma** (50% propagation)
- @alice gets **4 karma** (25% propagation)

### Achievements

- 🌱 **First Recruit** - Invite 1 active player
- 🌿 **Community Builder** - Invite 5 active players  
- 🌳 **Network Effect** - Build a 3-level chain
- 🌲 **Viral Master** - Invite 10+ active players

**Viral growth = Exponential karma!** 🚀

---

## 🔓 The 100 Levels

### Phase 1: Foundation (1-20)
Simple, safe, building blocks. One word → two words → patterns.

**Milestone: Level 10** - Two files allowed, relationships matter

### Phase 2: Complexity (21-40)  
Logic, dependencies, player interactions, voting begins.

**Milestone: Level 25** - Pattern recognition system activates

### Phase 3: Metamorphosis (41-60)
JSON, YAML, SVG, mini-languages, templates, macros.

**Milestone: Level 50** - The board transforms completely

### Phase 4: Consciousness (61-80)
Rules that learn, meta-rules, AI suggestions, self-modification.

**Milestone: Level 75** - The game becomes self-aware

### Phase 5: The Final Ascent (81-94)
HTML fragments (not rendered), CSS fragments (not applied), JS fragments (not executed).

**You're building a website without knowing it.**

### Phase 6: Transcendence (95-100)

**Level 95: 🌐 GITHUB PAGES UNLOCK**

All the HTML, CSS, JS you've contributed?  
It assembles. It deploys. It becomes **real**.

https://[username].github.io/enjoy

**Level 100: 🌌 TRANSCENDENCE**

Maximum level. No more unlocks.  
The community governs everything.  
The game is complete but never finished.

[See full roadmap →](LEVELS_ROADMAP.md)

---

## 🗳️ The Voting System

**Top coders can propose new rules. The community votes.**

### Who Can Propose Rules?

- Top 10 contributors (    # GitHub Pages (level 95+)
├── state.json             # Game state (levels, karma, votes)
├── levels/                # 100 level definitions
│   ├── 001-hello-world.yaml
│   ├── 010-first-complexity.yaml
│   ├── 095-pages-unlock.yaml
│   └── ...
├── rules/                 # Active rules
├── proposals/             # Rule proposals awaiting vote
├── engine/                # TypeScript engine
│   ├── karma.ts          # Karma system
│   ├── voting.ts         # Voting system
│   ├── validator.ts      # Validation
│   └── executor.ts       # Effect application
└── .github/workflows/     # Automation

```

### The Magic

1. **PR opened** → GitHub Actions
2. **Karma analysis** → Quality score calculated
3. **Validation** → Against current level rules
4. **Decision**:
   - Excellent → Amplify x2-3
   - Good → Accept x1
   - Bad → Refuse
5. **Auto-merge** (if accepted)
6. **State update** → Points, karma, level progress  
7. **Amplification** (if excellent) → Runner adds bonus elements
8. **Screenshot** → Board updates (every 5 min)

**At level 95:** All fragments assemble → GitHub Pages deploys → 🌐

```txt
AURORA
```

**Requirements:**
- ✅ Single `.txt` file  
- ✅ One word (letters only, 5-20 chars optimal)
- ✅ Not a boring word (no "test", "hello", "foo")
- ✅ Not a duplicate

### Scoring

- **Base:** +10 points
- **First PR ever:** +50 points  
- **Good karma:** +10 points
- **Excellent contribution:** x2 or x3 amplification!

---

## 🎨 The Board

<div align="center">

![The Board](board.png)

_Updates every 5 minutes_

**Current state:** The Void (Level 1-94)  
**Final form:** Living Website (Level 95+)

</div>

---

## 🏆 Reputation System

This game has **100 levels**.

It starts with one word. "HELLO".

It ends with a living, breathing website at level 95, and complete community governance at level 100.

**But here's the thing:**

The game is designed to resist being finished.  
The better you play, the more it amplifies.  
The more you contribute, the more power you gain.  
The top coders literally shape the rules.

**This is not a game you beat. This is a game you become.**

Every word you add. Every rule you propose. Every vote you cast.  
You're not just playing. You're building.

And at level 95, when GitHub Pages awakens...  
Everything you've contributed becomes real.
Level:** 1 / 100
- **Score:** 0  
- **Karma:** 0 (neutral)
- **PRs:** 0
- **Players:** 0
- **Next Milestone:** Level 10 (First Complexity)
- **Boss Fight:** Level 95 (GitHub Pages Unlock)
- **Max Level:** 100 (Transcendence
```
enjoy/
├── docs/              # GitHub Pages site (evolves with levels)
├── state.json         # Game state (score, elements, levels)
├── levels/            # Level definitions
├── rules/             # Validation rules
├── engine/            # TypeScript validation engine
├── contributions/     # Player contributions organized by type
│   ├── html/
│   ├── css/
│   ├── js/
│   └── canvas/
└── .github/
    └── workflows/     # Auto-validation & merge
```

### How it works

1. **PR opened** → GitHub Actions triggers
2. **Validation** → Engine checks rules for current level
3. **Label** → PR tagged with `valid` or `invalid` + reason
4. **Auto-merge** → Valid PRs merge automatically
5. **State update** → `state.json` updated with new element/score
6. **Builder** → Assembles `docs/` from contributions
7. **Screenshot** → Self-hosted runner generates board image (Level 0)
8. **Pages deploy** → GitHub Pages updates (Level 1+)

---

## 🚀 Contributing

### As a Player

Just add your word! See [How to Play](#-how-to-play) above.

### As a Developer

Want to improve the engine, add new rules, or suggest new levels?

1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Check [docs/guide/](https://[USERNAME].github.io/enjoy/guide/) for full documentation
3. Open an issue or PR

---

## 📚 Documentation

Full docs powered by VitePress: **[Read the Docs →](https://[USERNAME].github.io/enjoy/guide/)**

- 📖 [Player Guide](https://[USERNAME].github.io/enjoy/guide/)
- 📜 [Rules Reference](https://[USERNAME].github.io/enjoy/rules/)
- 🔧 [API Documentation](https://[USERNAME].github.io/enjoy/api/)
- 🎨 [Level Specifications](https://[USERNAME].github.io/enjoy/levels/)

---

## 🎪 Philosophy

> "The best games are the ones we make together."

**enjoy** is an experiment in:

- 🎮 **Collective creativity** - The game emerges from contributions
- 🔓 **Progressive enhancement** - Unlock capabilities as community grows
- 🎨 **Constraint-driven art** - CGA palette, validation rules = creative fuel
- 🌐 **Radical transparency** - Game state is public, forkable, remixable
- 🚀 **Evolution** - The game changes as it's played

---

## 🌌 The Vision

**Level 0** is just a screenshot. Words in the void.

**Level 1** brings HTML. Structure emerges.

**Level 2** adds CSS. Color explodes.

**Level 3** introduces JS. The board becomes alive.

**Level 4** unlocks Canvas. Pixel art collaboration.

**Level 5** is... _we don't know yet_. The community will decide.

The game has no end state. It evolves forever.

**The repo is the game.**

---

## 🏆 Leaderboards

### Top Contributors

| Rank | Player | Karma | Badge |
|------|--------|-------|-------|
| - | *No players yet* | - | - |

### Top Recruiters

| Rank | Player | Invites | Chain | Karma | Badge |
|------|--------|---------|-------|-------|-------|
| - | *No recruiters yet* | - | - | - | - |

*Be the first to appear here! 🚀*

---

## ⚠️ Level Decay System

**Inactivity has consequences!**

- No activity for **7 days** → Karma starts decaying (-2%/day)
- No activity for **14 days** → Level drops by 1
- Never drops below Level 1

**Keep the game alive or watch it fade!**

---

## 📊 Stats

- **Score:** 0
- **Level:** 0 (The Void)
- **PRs:** 0
- **Players:** 0
- **Unlocked Levels:** image
- **Next Unlock:** HTML Awakening (100 pts)

---

## 🙏 Credits

**Created by:** [Your Name]

**Powered by:**
- GitHub Actions
- GitHub Pages  
- TypeScript
- Playwright
- VitePress
- Collective imagination

---

## 📜 License

MIT - Fork it, remix it, make it yours.

The game belongs to everyone who plays it.

---

<div align="center">

**🎮 [Start Playing](https://github.com/[USERNAME]/enjoy/fork) • 📖 [Read the Docs](https://[USERNAME].github.io/enjoy/guide/) • 🌟 [Star the Repo](https://github.com/[USERNAME]/enjoy)**

_The repo is the game. The game is the repo._

</div>
