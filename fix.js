```typescript
import React from 'react';

/**
 * Types for the Bounty Board Component
 */
export type BountyDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Epic';
export type BountyStatus = 'Open' | 'Claimed' | 'Pending';

export interface BountyItem {
  number: number;
  title: string; // The main text (e.g. Issue Title or Hunter Name)
  status: BountyStatus;
  difficulty?: BountyDifficulty;
  hunter?: string;
  label?: string; // e.g., 'bounty'
}

export interface BountyBoardProps {
  bounties: BountyItem[];
  label?: string;
  updatedDate?: string;
}

export const BountyBoard = ({
  bounties = [],
  label = 'bounty',
  updatedDate = new Date().toISOString().split('T')[0],
}: BountyBoardProps) => {
  // Helper to determine icon based on status
  const getStatusIcon = (status: BountyStatus) => {
    if (status === 'Open') return '🟢';
    if (status === 'Claimed') return '✓';
    return '⏳';
  };

  // Helper to determine "Active" section header count
  const activeCount = bounties.filter(b => b.status === 'Open').length;

  return (
    <div className="bounty-board-section">
      {/* Header Section */}
      <div className="bounty-header">
        <h2>Active Bounties</h2>
        <p className="bounty-subtitle">
          Track <span className="font-bold">{activeCount > 0 ? activeCount : '0'}</span> open bounties and claim your karma!
        </p>
        
        {/* Instructional Text (Context) */}
        <div className="bounty-instructions">
          <h3>How Bounties Work</h3>
          <ul>
            <li>Find an issue with the <code className="bg-gray-200 px-1 rounded">{label}</code> label</li>
            <li>Comment "Claiming this bounty"</li>
            <li>Submit a PR that fixes the issue</li>
            <li>Earn bonus karma!</li>
          </ul>
        </div>

        {/* Table: Current Bounties */}
        <div className="bounty-table-container">
          <h3>Current Bounties ({activeCount} open)</h3>
          <table className="bounty-table">
            <thead>
              <tr>
                <th className="w-24">Issue</th>
                <th>Title</th>
                <th className="w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {bounties.map((bounty, index) => (
                <tr 
                  key={`${bounty.number}-${index}`} 
                  className={`bounty-row ${bounty.status === 'Open' ? 'hover:bg-gray-50' : ''}`}
                >
                  <td className="font-mono text-blue-600 cursor-pointer">
                    #{bounty.number}
                  </td>
                  <td className="text-left font-semibold">
                    {bounty.title}
                  </td>
                  <td className={`flex items-center justify-center gap-1 ${bounty.difficulty ? 'font-medium' : ''}`}>
                    <span className="inline-block w-3 h-3">{getStatusIcon(bounty.status)}</span>
                    {bounty.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table: Recently Claimed */}
        <div className="bounty-table-container mt-4">
          <h3>Recently Claimed</h3>
          <table className="bounty-table">
            <thead>
              <tr>
                <th className="w-24">Bounty</th>
                <th>Hunter</th>
                <th className="w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {bounties.map((bounty, index) => {
                 // Logic to style specific "Recently Claimed" rows differently if needed
                 const isClaimed = bounty.status === 'Claimed';
                 return (
                  <tr 
                    key={`${bounty.number}-claimed`} 
                    className={`bounty-row ${isClaimed ? 'bg-gray-50' : ''}`}
                  >
                    <td className="font-mono text-blue-600 cursor-pointer">
                      #{bounty.number}
                    </td>
                    <td className="text-left font-medium">
                      {bounty.hunter || 'Anonymous'}
                    </td>
                    <td className="flex items-center justify-center gap-1">
                      <span className="inline-block w-3 h-3">{getStatusIcon(bounty.status)}</span>
                      {bounty.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="bounty-footer mt-6 text-sm text-gray-500">
          <p><span>Last updated: {updatedDate} 00:21 UTC</span></p>
          <p>*The hunt is on. Choose your target wisely.</p>
        </div>

        {/* Call to Action */}
        <div className="bounty-cta text-center mt-4">
          <p><strong>Create a bounty:</strong> Open an issue and add the <code>{label}</code> label!</p>
        </div>
        
        {/* Hint for "Bonus Karma" visual logic - assuming this displays metadata */}
        <div className="bounty-values mt-4">
           <h3>Bounty Values</h3>
           <table className="bounty-table">
              <thead>
                 <tr>
                    <th>Difficulty</th>
                    <th>Bonus Karma</th>
                 </tr>
              </thead>
              <tbody>
                 <tr>
                    <td>Easy</td>
                    <td className="text-right font-mono">+10</td>
                 </tr>
                 <tr>
                    <td>Medium</td>
                    <td className="text-right font-mono">+25</td>
                 </tr>
                 <tr>
                    <td>Hard</td>
                    <td className="text-right font-mono">+50</td>
                 </tr>
                 <tr>
                    <td>Epic</td>
                    <td className="text-right font-mono">+100</td>
                 </tr>
              </tbody>
           </table>
        </div>

        {/* IMPORTANT: The prompt mentions NOT modifying scripts/. The file is standalone. */}
      </div>
    </div>
  );
};

export default BountyBoard;
```