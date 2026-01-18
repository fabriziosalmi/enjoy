# Contributing to enjoy

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
- ✅ File must be named `word.txt` (or any name ending in `.txt`)
- ✅ File must contain exactly ONE word
- ✅ Word must be letters only (A-Z, max 20 characters)
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

As the community earns points, new levels unlock:

| Level | Name | Unlocks At | What You Can Contribute |
|-------|------|------------|------------------------|
| 0 | The Void | 0pts ✓ | Text words |
| 1 | HTML Awakening | 100pts | HTML elements |
| 2 | Chromatic Surge | 500pts | CSS styles |
| 3 | Sentience | 1500pts | JavaScript |
| 4 | Pixel Dimension | 5000pts | Canvas drawings |
| 5 | ??? | 10000pts | ??? |

---

## As a Developer

Want to improve the game engine, add new rules, or contribute to infrastructure?

### Setup Development Environment

```bash
# Install dependencies
cd engine
npm install

# Build
npm run build

# Test locally
npm run validate -- --pr-number=1
```

### Project Structure

```
enjoy/
├── docs/              # VitePress documentation + GitHub Pages
├── engine/            # TypeScript validation engine
│   ├── src/
│   │   ├── parser.ts      # Parse PR metadata
│   │   ├── validator.ts   # Validate against rules
│   │   ├── executor.ts    # Apply effects
│   │   └── builder.ts     # Build GitHub Pages
│   └── package.json
├── levels/            # Level definitions (YAML)
├── rules/             # Validation rules (YAML)
├── contributions/     # Player contributions by type
└── .github/
    └── workflows/     # GitHub Actions automation
```

### Adding a New Rule

1. Create `rules/XXX-your-rule.yaml`:

```yaml
id: "XXX"
name: "Your Rule"
description: "What this rule does"
version: 1
enabled: true
priority: 100

trigger:
  type: "file_added"
  conditions:
    - extension: ".ext"

validate:
  - some_check: true

effect:
  action: "add_to_board"
  element:
    type: "text"
    content: "{{file_content}}"

points:
  base: 10
```

2. Update validation logic in `engine/src/validator.ts` if needed
3. Test thoroughly
4. Submit PR with documentation

### Code Standards

- **TypeScript** for engine code
- **ESM** modules (not CommonJS)
- **Type safety** - no `any` types
- **Tests** - add tests for new validation logic
- **Comments** - document complex logic

### Testing

```bash
# Run tests
cd engine
npm test

# Test validation locally
echo "TEST" > test.txt
npm run validate -- --pr-number=999

# Test effect application
npm run apply-effect -- --pr-number=999
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
2. Email security@enjoy.game (or open a private security advisory)
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

- 📖 **Read the docs**: https://[USERNAME].github.io/enjoy/guide/
- 💬 **Discussions**: https://github.com/[USERNAME]/enjoy/discussions
- 🐛 **Issues**: https://github.com/[USERNAME]/enjoy/issues
- 🎮 **Discord**: [Link if you create one]

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Your code becomes part of the collective game, owned by everyone who plays it.

---

**The repo is the game. The game is the repo.**

Now go forth and create! 🚀
