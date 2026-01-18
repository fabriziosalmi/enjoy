import { GameState } from './types.js';

/**
 * AUTO-SCALING SYSTEM
 * 
 * Rileva traffico, adatta meccaniche, scala livelli automaticamente
 * Graceful degradation quando diventa virale
 */

export interface TrafficMetrics {
  prs_per_hour: number;
  prs_per_day: number;
  unique_players_today: number;
  velocity_trend: 'slow' | 'normal' | 'viral' | 'explosive';
  load_factor: number; // 0-1
}

export interface ScalingConfig {
  enable_subsampling: boolean;
  sampling_rate: number; // 0-1 (1 = all, 0.1 = 10%)
  disable_screenshots: boolean;
  disable_amplification: boolean;
  fast_track_levels: boolean;
  cache_validations: boolean;
}

/**
 * Calcola metriche di traffico real-time
 */
export function calculateTrafficMetrics(state: GameState): TrafficMetrics {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;
  
  // Count recent PRs
  const recentPRs = Object.values(state.players).reduce((sum, player) => {
    return sum + (player.total_prs || 0);
  }, 0);
  
  // Estimate velocity from player growth
  const playersCount = Object.keys(state.players).length;
  const prsPerDay = state.meta.total_prs / Math.max(1, 
    (now - new Date(state.meta.game_started).getTime()) / oneDay
  );
  
  // Velocity trend
  let velocity: 'slow' | 'normal' | 'viral' | 'explosive' = 'slow';
  if (prsPerDay < 10) velocity = 'slow';
  else if (prsPerDay < 50) velocity = 'normal';
  else if (prsPerDay < 200) velocity = 'viral';
  else velocity = 'explosive';
  
  // Load factor (0-1, based on PRs per player per day)
  const prsPerPlayerPerDay = prsPerDay / Math.max(1, playersCount);
  const loadFactor = Math.min(1, prsPerPlayerPerDay / 10); // 10 PRs/player/day = max load
  
  return {
    prs_per_hour: Math.round(prsPerDay / 24),
    prs_per_day: Math.round(prsPerDay),
    unique_players_today: playersCount,
    velocity_trend: velocity,
    load_factor: loadFactor
  };
}

/**
 * Determina configurazione di scaling basata su metriche
 */
export function determineScalingConfig(metrics: TrafficMetrics): ScalingConfig {
  const config: ScalingConfig = {
    enable_subsampling: false,
    sampling_rate: 1.0,
    disable_screenshots: false,
    disable_amplification: false,
    fast_track_levels: false,
    cache_validations: false
  };
  
  // VIRAL: inizio ottimizzazioni
  if (metrics.velocity_trend === 'viral') {
    config.enable_subsampling = true;
    config.sampling_rate = 0.5; // valida 50%
    config.disable_screenshots = true; // screenshot ogni 30min invece di 5min
    config.cache_validations = true;
    config.fast_track_levels = true; // unlock più veloce
  }
  
  // EXPLOSIVE: graceful degradation hardcore
  if (metrics.velocity_trend === 'explosive') {
    config.enable_subsampling = true;
    config.sampling_rate = 0.2; // valida solo 20%
    config.disable_screenshots = true;
    config.disable_amplification = true; // no x2/x3, solo accept
    config.cache_validations = true;
    config.fast_track_levels = true;
  }
  
  // Load-based adjustments
  if (metrics.load_factor > 0.7) {
    config.sampling_rate = Math.min(config.sampling_rate, 0.3);
  }
  
  return config;
}

/**
 * Decide se processare questo PR (subsampling)
 */
export function shouldProcessPR(prNumber: number, samplingRate: number): boolean {
  if (samplingRate >= 1.0) return true;
  
  // Deterministic sampling basato su PR number
  // Garantisce che lo stesso PR viene sempre processato o skippato
  const hash = prNumber % 100;
  const threshold = samplingRate * 100;
  
  return hash < threshold;
}

/**
 * Auto-unlock levels basato su velocity
 */
export function checkAutoUnlock(state: GameState, metrics: TrafficMetrics): boolean {
  const config = determineScalingConfig(metrics);
  
  if (!config.fast_track_levels) return false;
  
  const currentLevel = state.levels.current;
  const nextRequires = state.levels.next_unlock;
  
  if (!nextRequires) return false;
  
  // Fast track: scala requirements in base a velocity
  let scaleFactor = 1.0;
  if (metrics.velocity_trend === 'viral') scaleFactor = 0.6;
  if (metrics.velocity_trend === 'explosive') scaleFactor = 0.3;
  
  const adjustedScoreReq = nextRequires.requires_score * scaleFactor;
  const adjustedPRsReq = nextRequires.requires_prs * scaleFactor;
  
  const hasScore = nextRequires.progress.score >= adjustedScoreReq;
  const hasPRs = nextRequires.progress.prs >= adjustedPRsReq;
  
  return hasScore && hasPRs;
}

/**
 * Apply graceful degradation to karma analysis
 */
export function degradeKarmaAnalysis(quality: number, config: ScalingConfig): {
  quality: number;
  amplification: number;
  degraded: boolean;
} {
  if (!config.disable_amplification) {
    // Normal mode
    let amp = 1;
    if (quality >= 80) amp = 3;
    else if (quality >= 60) amp = 2;
    return { quality, amplification: amp, degraded: false };
  }
  
  // Degraded mode: no amplification, just accept/reject
  return {
    quality,
    amplification: quality >= 40 ? 1 : 0,
    degraded: true
  };
}

/**
 * Cache key per validation results
 */
export function getCacheKey(files: string[], content: string): string {
  const filesHash = files.sort().join('|');
  const contentHash = content.substring(0, 100); // First 100 chars
  return `${filesHash}-${contentHash.length}`;
}

/**
 * Validation cache (in-memory, reset su deploy)
 */
const validationCache = new Map<string, any>();

export function getCachedValidation(key: string): any | null {
  return validationCache.get(key) || null;
}

export function setCachedValidation(key: string, result: any): void {
  // Max 1000 entries
  if (validationCache.size > 1000) {
    const firstKey = Array.from(validationCache.keys())[0];
    if (firstKey) {
      validationCache.delete(firstKey);
    }
  }
  validationCache.set(key, result);
}

/**
 * Status message per utente
 */
export function getScalingStatusMessage(metrics: TrafficMetrics, config: ScalingConfig): string {
  if (metrics.velocity_trend === 'slow' || metrics.velocity_trend === 'normal') {
    return '🟢 Normal operations';
  }
  
  if (metrics.velocity_trend === 'viral') {
    return `🟡 VIRAL MODE! ${metrics.prs_per_day} PRs/day - Optimizations active, fast-tracking levels!`;
  }
  
  if (metrics.velocity_trend === 'explosive') {
    return `🔴 EXPLOSIVE GROWTH! ${metrics.prs_per_day} PRs/day - Graceful degradation active. Some features reduced to handle load.`;
  }
  
  return '🟢 System nominal';
}

/**
 * Export metrics per monitoring
 */
export function exportMetrics(state: GameState): {
  metrics: TrafficMetrics;
  config: ScalingConfig;
  status: string;
} {
  const metrics = calculateTrafficMetrics(state);
  const config = determineScalingConfig(metrics);
  const status = getScalingStatusMessage(metrics, config);
  
  return { metrics, config, status };
}
