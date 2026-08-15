```typescript
import React from 'react';

interface BountyRow {
  number: string;
  title: string;
  status: string;
}

interface ValueRow {
  difficulty: string;
  bonus: string;
}

interface HunterRow {
  number: string;
  hunter: string;
  status: string;
}

export default function BountyBoard() {
  const openBounties: BountyRow[] = [
    { 
      number: "#8", 
      title: "Bounty Board - Claim Your Karma", 
      status: "🟢 Open" 
    }
  ];

  const claimedBounties: HunterRow[] = [
    { 
      number: "#10", 
      hunter: "tanu123421", 
      status: "✓" 
    }
  ];

  const valueRows: ValueRow[] = [
    { difficulty: "Easy", bonus: "+10" },
    { difficulty: "Medium", bonus: "+25" },
    { difficulty: "Hard", bonus: "+50" },
    { difficulty: "Epic", bonus: "+100" }
  ];

  return (
    <div className="bounty-board">
      <h2>🏆 Active Bounties</h2>
      <p>Track open bounties and claim your karma!</p>

      <h4>## How Bounties Work</h4>
      <ol>
        <li>Find an issue with the <code>bounty</code> label</li>
        <li>Comment "Claiming this bounty"</li>
        <li>Submit a PR that fixes the issue</li>
        <li>Earn bonus karma!</li>
      </ol>

      <h4>## Bounty Values</h4>
      <table className="bounty-table">
        <thead>
          <tr>
            <th>Difficulty</th>
            <th>Bonus Karma</th>
          </tr>
        </thead>
        <tbody>
          {valueRows.map((row) => (
            <tr key={row.difficulty}>
              <td>{row.difficulty}</td>
              <td>{row.bonus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>## Current Bounties ({openBounties.length} open)</h4>
      <table className="bounty-table">
        <thead>
          <tr>
            <th>Issue</th>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {openBounties.map((item) => (
            <tr key={item.number}>
              <td>{item.number}</td>
              <td>{item.title}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>## Recently Claimed</h4>
      <table className="bounty-table">
        <thead>
          <tr>
            <th>Bounty</th>
            <th>Hunter</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {claimedBounties.length > 0 && (
            <tr>
              <td>{claimedBounties[0].number}</td>
              <td>{claimedBounties[0].hunter}</td>
              <td>{claimedBounties[0].status}</td>
            </tr>
          )}
        </tbody>
      </table>

      <p>---</p>
      <p><i>Last updated: 2026-08-15 00:21 UTC</i></p>
      <p><i>The hunt is on. Choose your target wisely.</i></p>

      <p>---</p>
      <p><strong>Create a bounty:</strong> Open an issue and add the <code>bounty</code> label!</p>
      
      <p><strong>IMPORTANT:</strong> DO NOT modify <code>scripts/</code> or <code>.github/</code> files.</p>
      <p>Create a NEW standalone file: <code>solution_8.typescript</code></p>
    </div>
  );
}
```