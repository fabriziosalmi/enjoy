# ⏰ Time Capsules

> *"Messages from the past to the future. The repository remembers."*

## What Are Time Capsules?

Time capsules are sealed messages that contain:
- A message from the creator
- A snapshot of the game state at creation time
- A date when the capsule should be opened

When the opening date arrives, the capsule is unsealed, the message is revealed, and we can see how much the game has evolved since the capsule was created.

## How It Works

### Creating a Capsule

Anyone can create a time capsule by:
1. Adding a JSON file to `capsules/sealed/`
2. Following this format:

```json
{
  "id": "unique-capsule-name",
  "creator": "YourGitHubUsername",
  "created_date": "2026-01-18",
  "open_date": "2026-06-18",
  "message": "Your message to the future...",
  "state_snapshot": {
    "karma": 20,
    "players": 1,
    "level": 1,
    "achievements": 1
  }
}
```

### Opening Capsules

On the 1st of every month at noon UTC, the Time Capsule workflow:
1. Checks all sealed capsules
2. Opens any that have reached their date
3. Compares past state to current state
4. Generates a beautiful visualization
5. Moves the capsule to `capsules/opened/`

## Example Capsule

The **Genesis Capsule** was created at the dawn of enjoy:

```
"In the beginning, there was only potential. 
By the time you read this, that potential has 
transformed into reality. How far have we come?"
```

## Future Features

- [ ] Player-submitted capsules via PR
- [ ] Anniversary capsules (auto-created each month)
- [ ] Achievement prediction capsules
- [ ] Community milestone capsules

## Directory Structure

```
capsules/
├── sealed/          # Capsules waiting to be opened
├── opened/          # Capsules that have been opened
├── report.md        # Latest time capsule report
└── README.md        # This file
```

---

*What will you say to the future?*
*The past is listening.*
