import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Rule, GameState } from './types.js';
import { logError } from './utils.js';

/**
 * Load all rules from the rules/ directory
 */
export function loadRules(): Rule[] {
  const rulesDir = './rules';
  const ruleFiles = fs.readdirSync(rulesDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
  
  const rules: Rule[] = [];
  
  for (const file of ruleFiles) {
    const content = fs.readFileSync(`${rulesDir}/${file}`, 'utf8');
    const rule = yaml.load(content) as Rule;
    
    if (rule.enabled) {
      rules.push(rule);
    }
  }
  
  // Sort by priority (higher first)
  return rules.sort((a, b) => b.priority - a.priority);
}

/**
 * Validate state schema
 */
function validateState(state: unknown): state is GameState {
  if (!state || typeof state !== 'object') {
    return false;
  }

  const s = state as Record<string, unknown>;

  // Check required top-level properties
  if (!s.board || typeof s.board !== 'object') {
    return false;
  }
  if (!s.players || typeof s.players !== 'object') {
    return false;
  }
  if (!s.karma || typeof s.karma !== 'object') {
    return false;
  }
  if (!s.levels || typeof s.levels !== 'object') {
    return false;
  }
  if (!s.rules || typeof s.rules !== 'object') {
    return false;
  }

  // Check karma structure
  const karma = s.karma as Record<string, unknown>;
  if (typeof karma.global !== 'number') {
    return false;
  }

  // Check levels structure
  const levels = s.levels as Record<string, unknown>;
  if (typeof levels.current !== 'number') {
    return false;
  }

  // Check rules structure
  const rules = s.rules as Record<string, unknown>;
  if (!Array.isArray(rules.active)) {
    return false;
  }

  return true;
}

/**
 * Load game state with validation
 */
export function loadState(): GameState {
  try {
    const content = fs.readFileSync('./state.json', 'utf8');
    const parsed = JSON.parse(content);

    if (!validateState(parsed)) {
      logError('loadState', new Error('Invalid state.json schema'));
      throw new Error('Invalid state.json schema');
    }

    return parsed;
  } catch (e) {
    logError('loadState', e);
    throw e;
  }
}

/**
 * Save game state with validation
 */
export function saveState(state: GameState): void {
  try {
    if (!validateState(state)) {
      logError('saveState', new Error('Attempted to save invalid state'));
      throw new Error('Attempted to save invalid state');
    }

    fs.writeFileSync('./state.json', JSON.stringify(state, null, 2));
  } catch (e) {
    logError('saveState', e);
    throw e;
  }
}
