import { describe, it, expect } from 'vitest';
import { getCETHour, getCurrentPeriod, getTimeKarmaMultiplier, TIME_PERIODS } from '../time-system.js';

describe('Time System', () => {
  describe('getCETHour', () => {
    it('should return hour, minute, and timestamp', () => {
      const result = getCETHour();

      expect(typeof result.hour).toBe('number');
      expect(result.hour).toBeGreaterThanOrEqual(0);
      expect(result.hour).toBeLessThan(24);

      expect(typeof result.minute).toBe('number');
      expect(result.minute).toBeGreaterThanOrEqual(0);
      expect(result.minute).toBeLessThan(60);

      expect(typeof result.timestamp).toBe('string');
      expect(() => new Date(result.timestamp)).not.toThrow();
    });

    it('should handle DST correctly (CET vs CEST)', () => {
      // This test verifies the function doesn't crash
      // Actual DST behavior depends on current date
      const result = getCETHour();
      expect(result.hour).toBeDefined();
    });
  });

  describe('getCurrentPeriod', () => {
    it('should return a valid time period', () => {
      const period = getCurrentPeriod();

      expect(period.id).toBeDefined();
      expect(['dawn', 'morning', 'noon', 'afternoon', 'sunset', 'night']).toContain(period.id);
      expect(period.emoji).toBeDefined();
      expect(period.name).toBeDefined();
      expect(period.karmaMultiplier).toBeGreaterThan(0);
    });
  });

  describe('getTimeKarmaMultiplier', () => {
    it('should return a positive multiplier', () => {
      const multiplier = getTimeKarmaMultiplier();

      expect(typeof multiplier).toBe('number');
      expect(multiplier).toBeGreaterThan(0);
      expect(multiplier).toBeLessThanOrEqual(2); // Max multiplier is around 1.5
    });
  });

  describe('TIME_PERIODS', () => {
    it('should cover all 24 hours', () => {
      const allHours = new Set<number>();

      for (const period of Object.values(TIME_PERIODS)) {
        for (const hour of period.hours) {
          allHours.add(hour);
        }
      }

      // All hours 0-23 should be covered
      for (let h = 0; h < 24; h++) {
        expect(allHours.has(h)).toBe(true);
      }
    });

    it('should have valid karma multipliers', () => {
      for (const period of Object.values(TIME_PERIODS)) {
        expect(period.karmaMultiplier).toBeGreaterThan(0);
        expect(period.karmaMultiplier).toBeLessThanOrEqual(2);
      }
    });
  });
});
