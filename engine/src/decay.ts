import { GameState } from './types.js';

/**
 * LEVEL DECAY SYSTEM
 * 
 * Se il gioco resta inattivo, i livelli possono decadere
 * - Inattività prolungata = scendi di livello
 * - Karma decade lentamente
 * - Mantiene il gioco vivo e dinamico
 */

export interface DecayConfig {
  enabled: boolean;
  inactivity_threshold_days: number;
  karma_decay_rate: number; // % per day
  level_decay_threshold_days: number;
  min_level: number; // Never go below this
}

const DEFAULT_DECAY_CONFIG: DecayConfig = {
  enabled: true,
  inactivity_threshold_days: 7,
  karma_decay_rate: 0.02, // 2% per day
  level_decay_threshold_days: 14,
  min_level: 1
};

/**
 * Check if decay should be applied
 */
export function shouldApplyDecay(state: GameState, config: DecayConfig = DEFAULT_DECAY_CONFIG): boolean {
  if (!config.enabled) {
    return false;
  }
  
  const lastUpdate = new Date(state.last_updated).getTime();
  const now = Date.now();
  const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
  
  return daysSinceUpdate >= config.inactivity_threshold_days;
}

/**
 * Apply karma decay to inactive game
 */
export function applyKarmaDecay(state: GameState, config: DecayConfig = DEFAULT_DECAY_CONFIG): {
  decayed: boolean;
  old_karma: number;
  new_karma: number;
  days_inactive: number;
} {
  const lastUpdate = new Date(state.last_updated).getTime();
  const now = Date.now();
  const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
  
  if (daysSinceUpdate < config.inactivity_threshold_days) {
    return {
      decayed: false,
      old_karma: state.karma.global,
      new_karma: state.karma.global,
      days_inactive: daysSinceUpdate
    };
  }
  
  const oldKarma = state.karma.global;
  const decayDays = daysSinceUpdate - config.inactivity_threshold_days;
  const decayFactor = Math.pow(1 - config.karma_decay_rate, decayDays);
  const newKarma = Math.max(0, Math.floor(oldKarma * decayFactor));
  
  state.karma.global = newKarma;
  
  return {
    decayed: true,
    old_karma: oldKarma,
    new_karma: newKarma,
    days_inactive: daysSinceUpdate
  };
}

/**
 * Apply level decay to inactive game
 */
export function applyLevelDecay(state: GameState, config: DecayConfig = DEFAULT_DECAY_CONFIG): {
  decayed: boolean;
  old_level: number;
  new_level: number;
  reason: string;
} {
  const lastUpdate = new Date(state.last_updated).getTime();
  const now = Date.now();
  const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
  
  if (daysSinceUpdate < config.level_decay_threshold_days) {
    return {
      decayed: false,
      old_level: state.levels.current,
      new_level: state.levels.current,
      reason: 'Not enough inactivity'
    };
  }
  
  const oldLevel = state.levels.current;
  
  if (oldLevel <= config.min_level) {
    return {
      decayed: false,
      old_level: oldLevel,
      new_level: oldLevel,
      reason: 'Already at minimum level'
    };
  }
  
  // Decay 1 level per 14 days of inactivity
  const levelsToDecay = Math.floor(daysSinceUpdate / config.level_decay_threshold_days);
  const newLevel = Math.max(config.min_level, oldLevel - levelsToDecay);
  
  state.levels.current = newLevel;
  
  // Remove from unlocked list if decayed
  state.levels.unlocked = state.levels.unlocked.filter(l => l <= newLevel);
  
  return {
    decayed: true,
    old_level: oldLevel,
    new_level: newLevel,
    reason: `${Math.floor(daysSinceUpdate)} days of inactivity`
  };
}

/**
 * Apply full decay system
 */
export function applyDecaySystem(state: GameState, config: DecayConfig = DEFAULT_DECAY_CONFIG): {
  karma_decay: ReturnType<typeof applyKarmaDecay>;
  level_decay: ReturnType<typeof applyLevelDecay>;
  message: string;
} {
  const karmaDecay = applyKarmaDecay(state, config);
  const levelDecay = applyLevelDecay(state, config);
  
  let message = '';
  
  if (karmaDecay.decayed) {
    message += `⚠️ Karma decayed from ${karmaDecay.old_karma} to ${karmaDecay.new_karma} after ${Math.floor(karmaDecay.days_inactive)} days of inactivity.\n`;
  }
  
  if (levelDecay.decayed) {
    message += `📉 Level dropped from ${levelDecay.old_level} to ${levelDecay.new_level}. Reason: ${levelDecay.reason}.\n`;
  }
  
  if (!karmaDecay.decayed && !levelDecay.decayed) {
    message = '✅ No decay applied - game is active!';
  }
  
  return {
    karma_decay: karmaDecay,
    level_decay: levelDecay,
    message
  };
}

/**
 * Get decay status (without applying)
 */
export function getDecayStatus(state: GameState, config: DecayConfig = DEFAULT_DECAY_CONFIG): {
  at_risk: boolean;
  days_until_karma_decay: number;
  days_until_level_decay: number;
  warning_message: string;
} {
  const lastUpdate = new Date(state.last_updated).getTime();
  const now = Date.now();
  const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
  
  const daysUntilKarmaDecay = Math.max(0, config.inactivity_threshold_days - daysSinceUpdate);
  const daysUntilLevelDecay = Math.max(0, config.level_decay_threshold_days - daysSinceUpdate);
  
  const atRisk = daysSinceUpdate >= config.inactivity_threshold_days;
  
  let warning = '';
  if (atRisk) {
    warning = `⚠️ INACTIVITY WARNING: ${Math.floor(daysSinceUpdate)} days since last update. `;
    if (daysUntilLevelDecay > 0) {
      warning += `Level decay in ${Math.ceil(daysUntilLevelDecay)} days.`;
    } else {
      warning += `Level is decaying!`;
    }
  }
  
  return {
    at_risk: atRisk,
    days_until_karma_decay: daysUntilKarmaDecay,
    days_until_level_decay: daysUntilLevelDecay,
    warning_message: warning
  };
}
