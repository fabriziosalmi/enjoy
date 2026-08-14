```tsx
import React, { useMemo, useState } from 'react';

// --- Types & Interfaces ---

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Epic';

interface BountyData {
  number: number;
  title: string;
  difficulty: Difficulty;
  hunter: string | null; // Name of the person who claimed it
  status: 'Open' | 'Claimed' | 'Pending';
  url: string;
}

interface BountyBoardProps {
  data: BountyData[];
  className?: string;
}

// --- Constants & Utilities ---

const DIFFICULTY_KARMA: Record<Difficulty, number> = {
  Easy: 10,
  Medium: 25,
  Hard: 50,
  Epic: 100,
};

const INITIAL_STATE: BountyData = {
  number: 8,
  title: 'Bounty Board - Claim Your Karma',
  difficulty: 'Epic',
  hunter: null,
  status: 'Open',
  url: 'https://github.com/fabriziosalmi/enjoy/issues/8',
};

// --- Main Component ---

const BountyBoard: React.FC<BountyBoardProps> = ({ data, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Memoized logic to separate "Open" bounties from "Recently Claimed" based on status
  const openBounties = useMemo(() => data.filter((b) => b.status === 'Open'), [data]);
  const claimedBounties = useMemo(() => data.filter((b) => b.status === 'Claimed'), [data]);

  const formattedDate = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0]; // YYYY-MM-DD for 2026-08-14 style
  }, []);

  const getStatusColor = (status: BountyData['status']) => {
    switch (status) {
      case 'Open': return 'text-emerald-600';
      case 'Claimed': return 'text-blue-600';
      case 'Pending': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div 
      className={`bounty-board ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- Header Section --- */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-800">
          🏆 Active Bounties
        </h1>
        <p className="text-slate-500 text-lg">Track open bounties and claim your karma!</p>
      </header>

      {/* --- Instructions Section --- */}
      <section className="mb-10 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h2 className="text-xl font-semibold mb-3 text-slate-700">How Bounties Work</h2>
        <ol className="list-decimal list-inside space-y-1 text-slate-600">
          <li>Find an issue with the <code className="bg-slate-200 px-1 rounded text-sm">bounty</code> label</li>
          <li>Comment "Claiming this bounty"</li>
          <li>Submit a PR that fixes the issue</li>
          <li>Earn bonus karma!</li>
        </ol>
      </section>

      {/* --- Values Legend Table --- */}
      <div className="mb-8 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3 text-slate-700">Bounty Values</h2>
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left font-semibold text-slate-600">Difficulty</th>
              <th className="p-3 text-left font-semibold text-slate-600">Bonus Karma</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 text-slate-800">Easy</td>
              <td className="p-3 text-slate-800 text-right font-mono">+10</td>
            </tr>
            <tr>
              <td className="p-3 text-slate-800">Medium</td>
              <td className="p-3 text-slate-800 text-right font-mono">+25</td>
            </tr>
            <tr>
              <td className="p-3 text-slate-800">Hard</td>
              <td className="p-3 text-slate-800 text-right font-mono">+50</td>
            </tr>
            <tr>
              <td className="p-3 text-slate-800">Epic</td>
              <td className="p-3 text-slate-800 text-right font-mono">+100</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- Main Bounties Table --- */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-slate-700">Current Bounties ({openBounties.length} open)</h2>
        <div className="overflow-x-auto rounded-lg shadow-sm border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-600 w-24">Issue</th>
                <th className="p-4 font-semibold text-slate-600 w-48">Title</th>
                <th className="p-4 font-semibold text-slate-600 w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              {openBounties.length > 0 ? (
                openBounties.map((bounty) => (
                  <tr 
                    key={bounty.number} 
                    className={`hover:bg-slate-50 transition-colors ${isHovered ? 'opacity-90' : 'opacity-100'}`}
                  >
                    <td className="p-4">
                      <span className="font-mono text-lg text-indigo-600 font-bold">#{bounty.number}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 truncate">{bounty.title}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">
                          {bounty.difficulty}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        🟢 Open
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">
                    No active bounties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Recently Claimed Table --- */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-slate-700">Recently Claimed</h2>
        <div className="overflow-x-auto rounded-lg shadow-sm border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-600 w-24">Bounty</th>
                <th className="p-4 font-semibold text-slate-600 w-36">Hunter</th>
                <th className="p-4 font-semibold text-slate-600 w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              {claimedBounties.length > 0 ? (
                claimedBounties.map((bounty) => (
                  <tr 
                    key={`claimed-${bounty.number}`} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-lg text-indigo-600 font-bold">#{bounty.number}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-800 font-medium">{bounty.hunter}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ✓ Claimed
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">
                    Empty hunter's log.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="flex flex-col items-center text-slate-400 text-sm">
        <div className="mb-2">
          *Last updated: {formattedDate} 12:22 UTC*
        </div>
        <p className="italic text-center">The hunt is on. Choose your target wisely.</p>
        <div className="mt-6">
          <a 
            href="https://github.com/fabriziosalmi/enjoy/issues/new" 
            target="_blank" 
            rel="noreferrer"
            className="inline-block text-indigo-500 hover:text-indigo-700 transition-colors underline-offset-2 hover:underline"
          >
            **Create a bounty**: Open an issue and add the <code className="text-xs">bounty</code> label!
          </a>
        </div>
      </footer>
    </div>
  );
};

export default BountyBoard;
```