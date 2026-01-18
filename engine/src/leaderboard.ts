import { GameState } from './types.js';
import { logError } from './utils.js';
import * as fs from 'fs';

/**
 * LEADERBOARD & COMMUNITY BOARD GENERATOR
 * 
 * Genera markdown con:
 * - Top Contributors
 * - Top Recruiters (referral kings)
 * - Top Karma Players
 * - Recent Activity
 */

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  badge: string;
}

export interface RecruiterEntry {
  rank: number;
  username: string;
  invites: number;
  chain_depth: number;
  referral_karma: number;
  badge: string;
}

/**
 * Generate top contributors leaderboard
 */
export function generateContributorsLeaderboard(state: GameState, limit: number = 10): LeaderboardEntry[] {
  const players = Object.entries(state.players)
    .map(([hash, data]) => ({
      hash,
      username: hash.substring(0, 8), // TODO: map to real usernames
      karma: data.karma || 0,
      prs: data.prs_merged || 0
    }))
    .sort((a, b) => b.karma - a.karma)
    .slice(0, limit);
  
  return players.map((p, idx) => ({
    rank: idx + 1,
    username: p.username,
    score: p.karma,
    badge: getBadge(idx + 1)
  }));
}

/**
 * Generate top recruiters leaderboard
 */
export function generateRecruitersLeaderboard(state: GameState, limit: number = 10): RecruiterEntry[] {
  if (!state.referrals?.chains) {
    return [];
  }
  
  const recruiters = Object.entries(state.referrals.chains)
    .map(([username, chain]) => ({
      username,
      invites: chain.invited.length,
      chain_depth: chain.chain_depth,
      referral_karma: chain.referral_karma,
      total_score: chain.invited.length * 10 + chain.referral_karma
    }))
    .sort((a, b) => b.total_score - a.total_score)
    .slice(0, limit);
  
  return recruiters.map((r, idx) => ({
    rank: idx + 1,
    username: r.username,
    invites: r.invites,
    chain_depth: r.chain_depth,
    referral_karma: r.referral_karma,
    badge: getRecruiterBadge(r.invites, r.chain_depth)
  }));
}

/**
 * Get badge emoji based on rank
 */
function getBadge(rank: number): string {
  if (rank === 1) {
    return '🥇';
  }
  if (rank === 2) {
    return '🥈';
  }
  if (rank === 3) {
    return '🥉';
  }
  if (rank <= 10) {
    return '⭐';
  }
  return '✨';
}

/**
 * Get recruiter badge based on performance
 */
function getRecruiterBadge(invites: number, depth: number): string {
  if (invites >= 10) {
    return '🌲'; // Viral Master
  }
  if (depth >= 3) {
    return '🌳'; // Network Effect
  }
  if (invites >= 5) {
    return '🌿'; // Community Builder
  }
  if (invites >= 1) {
    return '🌱'; // First Recruit
  }
  return '✨';
}

/**
 * Generate markdown leaderboard for README
 */
export function generateLeaderboardMarkdown(state: GameState): string {
  const contributors = generateContributorsLeaderboard(state, 10);
  const recruiters = generateRecruitersLeaderboard(state, 10);
  
  let md = '## 🏆 Leaderboards\n\n';
  
  // Top Contributors
  md += '### Top Contributors\n\n';
  md += '| Rank | Player | Karma | Badge |\n';
  md += '|------|--------|-------|-------|\n';
  
  if (contributors.length === 0) {
    md += '| - | *No players yet* | - | - |\n';
  } else {
    contributors.forEach(p => {
      md += `| ${p.rank} | [@${p.username}](https://github.com/${p.username}) | ${p.score} | ${p.badge} |\n`;
    });
  }
  
  md += '\n';
  
  // Top Recruiters
  md += '### Top Recruiters\n\n';
  md += '| Rank | Player | Invites | Chain | Karma | Badge |\n';
  md += '|------|--------|---------|-------|-------|-------|\n';
  
  if (recruiters.length === 0) {
    md += '| - | *No recruiters yet* | - | - | - | - |\n';
  } else {
    recruiters.forEach(r => {
      md += `| ${r.rank} | [@${r.username}](https://github.com/${r.username}) | ${r.invites} | ${r.chain_depth} | ${r.referral_karma} | ${r.badge} |\n`;
    });
  }
  
  md += '\n';
  md += `*Updated: ${new Date().toISOString()}*\n`;
  
  return md;
}

/**
 * Generate community board HTML (for GitHub Pages)
 */
export function generateCommunityBoardHTML(state: GameState): string {
  const contributors = generateContributorsLeaderboard(state, 20);
  const recruiters = generateRecruitersLeaderboard(state, 20);
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>enjoy - Community Board</title>
  <style>
    body {
      background: #000;
      color: #0f0;
      font-family: 'Courier New', monospace;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      text-align: center;
      color: #0ff;
      text-shadow: 0 0 10px #0ff;
    }
    .boards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 40px;
    }
    .board {
      border: 2px solid #0f0;
      padding: 20px;
      background: rgba(0, 255, 0, 0.05);
    }
    .board h2 {
      color: #ff0;
      margin-top: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #0f0;
    }
    th {
      color: #ff0;
    }
    a {
      color: #0ff;
      text-decoration: none;
    }
    a:hover {
      text-shadow: 0 0 5px #0ff;
    }
    .badge {
      font-size: 1.5em;
    }
    @media (max-width: 768px) {
      .boards {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <h1>🎮 ENJOY - COMMUNITY BOARD</h1>
  <p style="text-align: center;">Level ${state.levels.current} | Karma ${state.karma.global} | Players ${state.meta.total_players}</p>
  
  <div class="boards">
    <div class="board">
      <h2>🏆 Top Contributors</h2>
      <table>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th>Karma</th>
          <th>Badge</th>
        </tr>`;
  
  contributors.forEach(p => {
    html += `
        <tr>
          <td>${p.rank}</td>
          <td><a href="https://github.com/${p.username}" target="_blank">@${p.username}</a></td>
          <td>${p.score}</td>
          <td class="badge">${p.badge}</td>
        </tr>`;
  });
  
  html += `
      </table>
    </div>
    
    <div class="board">
      <h2>🌟 Top Recruiters</h2>
      <table>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th>Invites</th>
          <th>Chain</th>
          <th>Badge</th>
        </tr>`;
  
  recruiters.forEach(r => {
    html += `
        <tr>
          <td>${r.rank}</td>
          <td><a href="https://github.com/${r.username}" target="_blank">@${r.username}</a></td>
          <td>${r.invites}</td>
          <td>${r.chain_depth}</td>
          <td class="badge">${r.badge}</td>
        </tr>`;
  });
  
  html += `
      </table>
    </div>
  </div>
  
  <p style="text-align: center; margin-top: 40px; color: #555;">
    Updated: ${new Date().toISOString()}
  </p>
</body>
</html>`;
  
  return html;
}

/**
 * Update leaderboard in README.md
 */
export function updateLeaderboardInReadme(state: GameState, readmePath: string): void {
  try {
    const leaderboardMd = generateLeaderboardMarkdown(state);
    let readme = fs.readFileSync(readmePath, 'utf-8');

    // Replace leaderboard section or append
    const leaderboardStart = '## 🏆 Leaderboards';
    // Use match() instead of exec() with /g flag to avoid state issues
    const nextSectionPattern = /\n## /;

    if (readme.includes(leaderboardStart)) {
      // Find start and end
      const startIdx = readme.indexOf(leaderboardStart);
      const afterStart = readme.substring(startIdx + leaderboardStart.length);
      const match = afterStart.match(nextSectionPattern);
      const endIdx = match ? startIdx + leaderboardStart.length + match.index! : readme.length;

      readme = readme.substring(0, startIdx) + leaderboardMd + readme.substring(endIdx);
    } else {
      // Append at end
      readme += '\n\n' + leaderboardMd;
    }

    fs.writeFileSync(readmePath, readme, 'utf-8');
  } catch (e) {
    logError(`updateLeaderboardInReadme(${readmePath})`, e);
    throw e;
  }
}

/**
 * Generate community board file
 */
export function generateCommunityBoardFile(state: GameState, outputPath: string): void {
  try {
    const html = generateCommunityBoardHTML(state);
    fs.writeFileSync(outputPath, html, 'utf-8');
  } catch (e) {
    logError(`generateCommunityBoardFile(${outputPath})`, e);
    throw e;
  }
}
