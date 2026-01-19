import Filter from 'bad-words';
import { Rule, PRMetadata, ValidationResult } from './types.js';
import { loadState } from './loader.js';
import { getFileContent } from './parser.js';
import { hashAuthor, safeRegex, safeRegexTest } from './utils.js';

const filter = new Filter();

/**
 * Extract referral from PR body
 */
export function extractReferral(prBody: string): string | null {
  // Match patterns: "Invited by @username" or "Referred by @username"
  const patterns = [
    /invited by @([a-zA-Z0-9-]+)/i,
    /referred by @([a-zA-Z0-9-]+)/i,
    /referral: @([a-zA-Z0-9-]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = prBody.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Check if a PR matches a rule's trigger conditions
 */
function matchesTrigger(rule: Rule, pr: PRMetadata): boolean {
  if (rule.trigger.type === 'file_added') {
    // Check if PR has any files added
    if (!pr.files_added || pr.files_added.length === 0) {
      return false;
    }

    // Check all conditions
    for (const condition of rule.trigger.conditions) {
      if (condition.extension) {
        const ext = condition.extension;
        const hasExt = pr.files_added.some(f => f.endsWith(ext));
        if (!hasExt) {
          return false;
        }
      }

      if (condition.max_files !== undefined) {
        if (pr.files_added.length > condition.max_files) {
          return false;
        }
      }
    }

    return true;
  }
  
  return false;
}

/**
 * Validate file content against rule conditions
 */
function validateContent(rule: Rule, pr: PRMetadata): { valid: boolean; reason?: string } {
  // Check if there are files to validate
  if (!pr.files_added || pr.files_added.length === 0) {
    return { valid: false, reason: 'No files added in PR' };
  }

  const file = pr.files_added[0];
  if (!file) {
    return { valid: false, reason: 'Invalid file reference' };
  }

  const content = getFileContent(file);
  
  // Check trigger conditions on content
  for (const condition of rule.trigger.conditions) {
    if (condition.max_lines !== undefined) {
      const lines = content.split('\n').filter(l => l.trim().length > 0);
      if (lines.length > condition.max_lines) {
        return { valid: false, reason: `Max ${condition.max_lines} line(s) allowed` };
      }
    }
    
    if (condition.max_chars !== undefined) {
      if (content.length > condition.max_chars) {
        return { valid: false, reason: `Max ${condition.max_chars} characters allowed` };
      }
    }
    
    if (condition.pattern) {
      const regex = safeRegex(condition.pattern);
      if (!regex) {
        return { valid: false, reason: `Invalid or unsafe pattern: ${condition.pattern}` };
      }
      if (!safeRegexTest(regex, content)) {
        return { valid: false, reason: `Content must match pattern: ${condition.pattern}` };
      }
    }
  }
  
  // Check validate conditions
  const state = loadState();
  
  for (const validation of rule.validate) {
    if (validation.not_profanity) {
      if (filter.isProfane(content)) {
        return { valid: false, reason: 'Profanity not allowed' };
      }
    }
    
    if (validation.not_duplicate) {
      const exists = state.board.elements.some((el) =>
        el.content?.toLowerCase() === content.toLowerCase()
      );
      if (exists) {
        return { valid: false, reason: 'Word already exists on board' };
      }
    }
  }
  
  return { valid: true };
}

/**
 * Calculate points for a PR
 */
function calculatePoints(rule: Rule, pr: PRMetadata): number {
  const state = loadState();
  let points = rule.points.base;
  
  if (rule.points.bonus) {
    for (const bonus of rule.points.bonus) {
      if (bonus.condition === 'first_pr_of_player') {
        const playerHash = hashAuthor(pr.author);
        if (!state.players[playerHash]) {
          points += bonus.points;
        }
      }
      
      if (bonus.condition === 'first_pr_of_day') {
        const today = new Date().toISOString().split('T')[0];
        const lastUpdate = state.last_updated.split('T')[0];
        if (today !== lastUpdate) {
          points += bonus.points;
        }
      }
    }
  }
  
  return points;
}


/**
 * Main validation function
 */
export function validatePR(rules: Rule[], pr: PRMetadata): ValidationResult {
  const matchedRules: string[] = [];
  
  for (const rule of rules) {
    if (matchesTrigger(rule, pr)) {
      const validation = validateContent(rule, pr);
      
      if (validation.valid) {
        matchedRules.push(rule.id);
        const points = calculatePoints(rule, pr);
        
        return {
          valid: true,
          matched_rules: [rule.id],
          points,
          effects: [{
            rule_id: rule.id,
            effect: rule.effect
          }]
        };
      } else {
        return {
          valid: false,
          matched_rules: [],
          points: 0,
          reason: validation.reason
        };
      }
    }
  }
  
  return {
    valid: false,
    matched_rules: [],
    points: 0,
    reason: 'No matching rules found'
  };
}
