import * as fs from 'fs';
import { PRMetadata } from './types.js';
import { sanitizePath, logError } from './utils.js';

/**
 * Parse PR metadata from GitHub Actions environment
 */
export function parsePR(prNumber: number, prFiles?: string[]): PRMetadata {
  const author = process.env.GITHUB_ACTOR || process.env.PR_AUTHOR || 'local';
  const timestamp = new Date().toISOString();
  
  // Files can be passed from GitHub Actions or detected locally
  let filesAdded: string[] = [];
  let filesModified: string[] = [];
  let filesRemoved: string[] = [];
  
  // If PR_FILES env var exists (set by workflow), use that
  if (process.env.PR_FILES_ADDED) {
    filesAdded = process.env.PR_FILES_ADDED.split(',').filter(f => f.trim());
  } else if (prFiles) {
    filesAdded = prFiles;
  } else {
    // Fallback: scan for .txt files locally (for testing)
    try {
      const txtFiles = fs.readdirSync('.').filter(f => f.endsWith('.txt') && !f.startsWith('.'));
      filesAdded = txtFiles;
    } catch (e) {
      // Ignore
    }
  }
  
  if (process.env.PR_FILES_MODIFIED) {
    filesModified = process.env.PR_FILES_MODIFIED.split(',').filter(f => f.trim());
  }
  
  if (process.env.PR_FILES_REMOVED) {
    filesRemoved = process.env.PR_FILES_REMOVED.split(',').filter(f => f.trim());
  }
  
  return {
    number: prNumber,
    author,
    files_added: filesAdded,
    files_modified: filesModified,
    files_removed: filesRemoved,
    commit_message: process.env.COMMIT_MSG || process.env.PR_TITLE || '',
    timestamp,
    body: process.env.PR_BODY || ''
  };
}

/**
 * Extract file content for validation
 */
export function getFileContent(filepath: string): string {
  try {
    // Sanitize path to prevent traversal attacks
    const safePath = sanitizePath(filepath);
    return fs.readFileSync(safePath, 'utf8').trim();
  } catch (e) {
    logError(`getFileContent(${filepath})`, e);
    return '';
  }
}
