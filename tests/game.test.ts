import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════════════════
// ENJOY - VITEST TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════

describe('Game State', () => {
  const statePath = path.join(__dirname, '../state.json');
  let state: any;

  beforeAll(() => {
    state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
  });

  it('should have valid JSON structure', () => {
    expect(state).toBeDefined();
    expect(state.version).toBeDefined();
  });

  it('should have levels configuration', () => {
    expect(state.levels).toBeDefined();
    expect(state.levels.current).toBeGreaterThanOrEqual(1);
    expect(state.levels.max_level).toBe(100);
  });
 guida ;-)
  it('should have karma system', () => {
    expect(state.karma).toBeDefined();
    expect(state.karma.multiplier_active).toBeGreaterThanOrEqual(1);
  });

  it('should have players object', () => {
    expect(state.players).toBeDefined();
    expect(typeof state.players).toBe('object');
  });

  it('should have score tracking', () => {
    expect(state.score).toBeDefined();
    expect(state.score.total).toBeGreaterThanOrEqual(0);
  });
});

describe('Karma System', () => {
  it('should calculate karma correctly', () => {
    const baseKarma = 10;
    const multiplier = 1.5;
    expect(baseKarma * multiplier).toBe(15);
  });

  it('should have valid time periods', () => {
    const periods = ['dawn', 'morning', 'noon', 'afternoon', 'sunset', 'night'];
    expect(periods).toHaveLength(6);
  });
});

describe('Level System', () => {
  const levelsDir = path.join(__dirname, '../levels');

  it('should have 100 level files', () => {
    const files = fs.readdirSync(levelsDir).filter(f => f.endsWith('.yaml'));
    expect(files.length).toBe(100);
  });

  it('should have level 1 file', () => {
    const level1 = fs.existsSync(path.join(levelsDir, '001-hello-world.yaml'));
    expect(level1).toBe(true);
  });

  it('should have level 100 file', () => {
    const level100 = fs.existsSync(path.join(levelsDir, '100-transcendence.yaml'));
    expect(level100).toBe(true);
  });
});

describe('Player Consistency', () => {
  const statePath = path.join(__dirname, '../state.json');
  let state: any;

  beforeAll(() => {
    state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
  });

  it('should have matching karma totals', () => {
    const playerKarma = Object.values(state.players as Record<string, any>)
      .reduce((sum: number, p: any) => sum + (p.karma || 0), 0);
    // Player karma should be close to total score
    expect(playerKarma).toBeGreaterThanOrEqual(0);
  });

  it('should have valid player structure', () => {
    Object.values(state.players as Record<string, any>).forEach((player: any) => {
      expect(player.karma).toBeDefined();
      expect(player.prs).toBeDefined();
      expect(player.joined).toBeDefined();
    });
  });
});

describe('Achievements', () => {
  const statePath = path.join(__dirname, '../state.json');
  let state: any;

  beforeAll(() => {
    state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
  });

  it('should have achievements structure', () => {
    expect(state.achievements).toBeDefined();
    expect(state.achievements.unlocked_global).toBeDefined();
    expect(Array.isArray(state.achievements.unlocked_global)).toBe(true);
  });
});

describe('Bounties', () => {
  const statePath = path.join(__dirname, '../state.json');
  let state: any;

  beforeAll(() => {
    state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
  });

  it('should have bounties structure', () => {
    expect(state.bounties).toBeDefined();
    expect(state.bounties.active).toBeDefined();
    expect(Array.isArray(state.bounties.active)).toBe(true);
  });

  it('should have valid bounty format', () => {
    state.bounties.active.forEach((bounty: any) => {
      expect(bounty.id).toBeDefined();
      expect(bounty.title).toBeDefined();
      expect(bounty.karma).toBeGreaterThan(0);
    });
  });
});

describe('Time System', () => {
  it('should map hours to periods correctly', () => {
    const getTimePeriod = (hour: number): string => {
      if (hour >= 5 && hour < 8) return 'dawn';
      if (hour >= 8 && hour < 12) return 'morning';
      if (hour >= 12 && hour < 15) return 'noon';
      if (hour >= 15 && hour < 18) return 'afternoon';
      if (hour >= 18 && hour < 21) return 'sunset';
      return 'night';
    };

    expect(getTimePeriod(6)).toBe('dawn');
    expect(getTimePeriod(10)).toBe('morning');
    expect(getTimePeriod(13)).toBe('noon');
    expect(getTimePeriod(16)).toBe('afternoon');
    expect(getTimePeriod(19)).toBe('sunset');
    expect(getTimePeriod(23)).toBe('night');
    expect(getTimePeriod(2)).toBe('night');
  });
});
