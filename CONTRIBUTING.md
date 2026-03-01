# Contributing to enjoy

> **⚠️ IMPORTANT NOTE ON BOUNTIES:** This is a purely collaborative open-source game. Any "bounties" or "rewards" mentioned in this repository (or related issues) refer exclusively to **in-game Karma points**. There is **NO monetary compensation**, cryptocurrency, or financial reward for any contributions.

Thank you for your interest in contributing to **enjoy**! This document explains how you can participate in the game.

## As a Player

### Quick Start

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/enjoy.git
   cd enjoy
   ```
3. **Create a contribution** (see current level rules below)
4. **Open a Pull Request**

Your PR will be automatically validated. If it passes, it will be auto-merged! 🎉

### Current Level: 1 (Genesis)

**What you can contribute:** Single words in `.txt` files

**Requirements:**
- ✅ File must be named `yourword.txt` (any name ending in `.txt`)
- ✅ File must contain exactly ONE word
- ✅ Word must be 3-30 characters (letters only)
- ✅ **5-10 characters = optimal karma bonus!**
- ✅ No profanity
- ✅ Word must not already exist on the board

**Example:**

```bash
# Create your contribution
echo "AURORA" > aurora.txt

# Commit and push
git checkout -b add-aurora
git add aurora.txt
git commit -m "Add AURORA to the void"
git push origin add-aurora

# Open PR on GitHub
```

### What Happens Next?

1. **GitHub Actions validates** your PR (takes ~30 seconds)
2. **Labels are added**: `auto-merge` (if valid) or `invalid` (if not)
3. **Comment appears** explaining the result
4. **If valid**: PR auto-merges, points are awarded, board updates
5. **If invalid**: Instructions on how to fix

### Scoring

- **Base points:** +10 per valid contribution
- **First PR bonus:** +50 points
- **First PR of the day:** +5 points

### Level Progression

The game has **100 levels** organized in phases. Here's the progression:

| Phase | Levels | What You Can Contribute |
|-------|--------|------------------------|
| **Foundation** | 1-20 | Words, emoji, ASCII art |
| **Complexity** | 21-40 | Math, zones, voting |
| **Metamorphosis** | 41-60 | JSON, YAML, CSV, SVG |
| **Consciousness** | 61-80 | Rules AI, time travel |
| **Final Ascent** | 81-94 | HTML/CSS/JS fragments |
| **Transcendence** | 95-100 | GitHub Pages unlock, portal |

**Unlock formula:** Every 50 karma + 5 PRs = Level up

See [LEVELS_ROADMAP.md](LEVELS_ROADMAP.md) for complete details.

---

## 🛡️ Security & File Restrictions

### ALLOWLIST System

For security, player contributions are **strictly limited** to specific file patterns:

| Level | Allowed Files | Pattern |
|-------|--------------|--------|
| 1+ | Word files | `words/YOURWORD.txt` |
| 5+ | Emoji files | `emoji/YOUREMOJI.txt` *(coming soon)* |
| 10+ | ASCII art | `ascii/YOURART.txt` *(coming soon)* |

### Blocked Files (Security)

The following are **always blocked** for non-maintainers:

- 🚫 Hidden files (`.gitignore`, `.env`, etc.)
- 🚫 GitHub folder (`.github/*`)
- 🚫 Executable files (`.sh`, `.py`, `.js`, `.exe`, etc.)
- 🚫 Config files (`package.json`, `Dockerfile`, etc.)
- 🚫 Path traversal (`../` attempts)
- 🚫 Auto-generated folders (`art/`, `badges/`, `metrics/`)

### Why?

To prevent:
- Malicious code injection
- Workflow modifications
- Game state manipulation
- Security vulnerabilities

**If your PR is blocked**, check that you only modified allowed files!

---

## As a Developer

Want to improve the game engine, add new rules, or contribute to infrastructure?

### Setup Development Environment

### Setup Development Environment

```bash
# Install dependencies
cd engine
npm install

# Build
npm run build

# Run tests
npm test
```

### Project Structure

```
enjoy/
├── docs/              # VitePress documentation + GitHub Pages
├── engine/            # TypeScript game engine & validation
│   ├── src/
│   │   ├── index.ts       # CLI Entry point
│   │   ├── executor.ts    # Game logic & State updates
│   │   ├── gamification.ts # Karma, streaks, achievements
│   │   ├── parser.ts      # PR metadata parsing
│   │   ├── validator.ts   # Rule validation
│   │   └── time-system.ts # Time-based logic
│   └── package.json
├── levels/            # Level definitions (YAML)
├── rules/             # Validation rules (YAML)
├── .github/
    └── workflows/     # GitHub Actions automation
```

### Testing

```bash
# Run unit tests
cd engine
npm test

# Validate a PR (Dry Run)
npm run validate -- --pr-number=1

# Apply a contribution (Simulation)
# Simulates a full merge event including karma & state updates
export PR_NUMBER="9999"
export PR_AUTHOR="test-user"
export PR_TITLE="Add word: TESTING"
node dist/index.js apply
```

---

## Proposing New Levels

Have an idea for a new level or capability? Open an issue with:

- **Level concept** - What it unlocks
- **Unlock requirements** - Points/PRs/players needed
- **Validation rules** - How contributions are checked
- **Security considerations** - How to prevent abuse

The community votes on new level proposals!

---

## Security

### Reporting Vulnerabilities

If you discover a security vulnerability (XSS, code injection, etc.), please:

1. **DO NOT** open a public issue
2. [Open a private security advisory](https://github.com/fabriziosalmi/enjoy/security/advisories/new)
3. Include details: reproduction steps, impact, suggested fix

### Security Best Practices

- All HTML is **sanitized** with DOMPurify
- JavaScript is **sandboxed** and AST-validated
- CSS is **restricted** to CGA colors and safe properties
- Canvas operations are **rate-limited**
- No external resources can be loaded

---

## Code of Conduct

### Be Cool

- 🎮 **Play creatively** - but respect the rules
- 🤝 **Help others** - answer questions, share tips
- 🎨 **Respect the art** - don't vandalize others' contributions
- 🚫 **No spam** - quality over quantity
- 💬 **Be kind** - this is a collaborative game

### Not Cool

- ❌ Profanity or offensive content
- ❌ Spam PRs to farm points
- ❌ Attempting to break validation
- ❌ Harassment of other players

Violations may result in PRs being blocked or accounts being banned from the repo.

---

## Getting Help

- 📖 **Read the docs**: [HUB.md](HUB.md) - Complete guide hub
- 💬 **Discussions**: https://github.com/fabriziosalmi/enjoy/discussions
- 🐛 **Issues**: https://github.com/fabriziosalmi/enjoy/issues
- 🎮 **More info**: [GAMEPLAY.md](GAMEPLAY.md) - Full karma guide

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Your code becomes part of the collective game, owned by everyone who plays it.

---

**The repo is the game. The game is the repo.**

Now go forth and create! 🚀
