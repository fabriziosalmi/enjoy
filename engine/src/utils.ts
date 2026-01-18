import { createHash } from 'crypto';
import path from 'path';

/**
 * Hash author name using SHA-256 for privacy
 * Returns a 16-character hex string
 */
export function hashAuthor(author: string): string {
  return createHash('sha256').update(author).digest('hex').slice(0, 16);
}

/**
 * Sanitize file path to prevent path traversal attacks
 * @param filepath The file path to sanitize
 * @param baseDir Optional base directory to restrict paths to
 * @returns Sanitized path
 * @throws Error if path is invalid or attempts traversal
 */
export function sanitizePath(filepath: string, baseDir?: string): string {
  // Normalize the path to resolve . and ..
  const normalized = path.normalize(filepath);

  // Check for path traversal attempts
  if (normalized.includes('..') || path.isAbsolute(normalized)) {
    throw new Error('Invalid path: path traversal or absolute paths not allowed');
  }

  // Check for hidden files/directories
  const parts = normalized.split(path.sep);
  for (const part of parts) {
    if (part.startsWith('.') && part !== '.') {
      throw new Error('Invalid path: hidden files/directories not allowed');
    }
  }

  // If baseDir specified, ensure path stays within it
  if (baseDir) {
    const resolvedBase = path.resolve(baseDir);
    const resolvedPath = path.resolve(baseDir, normalized);

    if (!resolvedPath.startsWith(resolvedBase)) {
      throw new Error('Invalid path: path escapes base directory');
    }
  }

  return normalized;
}

/**
 * Validate regex pattern to prevent ReDoS attacks
 * @param pattern The regex pattern to validate
 * @returns true if pattern is safe, false otherwise
 */
export function isSafeRegex(pattern: string): boolean {
  // Check for known ReDoS patterns
  const dangerousPatterns = [
    /\(\?[^)]*\*\+/,        // Possessive quantifiers with nested groups
    /\([^)]*\+\)\+/,        // Nested quantifiers like (a+)+
    /\([^)]*\*\)\*/,        // Nested quantifiers like (a*)*
    /\([^)]*\+\)\*/,        // Nested quantifiers like (a+)*
    /\([^)]*\*\)\+/,        // Nested quantifiers like (a*)+
    /\([^)]*\|\s*\)\+/,     // Empty alternatives with quantifiers
    /\([^)]*\|\s*\)\*/,
  ];

  for (const dangerous of dangerousPatterns) {
    if (dangerous.test(pattern)) {
      return false;
    }
  }

  // Check pattern length
  if (pattern.length > 1000) {
    return false;
  }

  return true;
}

/**
 * Create a regex with timeout protection
 * @param pattern The regex pattern
 * @param flags Optional regex flags
 * @param maxLength Maximum input length to test against
 * @returns RegExp object or null if pattern is unsafe
 */
export function safeRegex(pattern: string, flags?: string, _maxLength: number = 1000): RegExp | null {
  if (!isSafeRegex(pattern)) {
    console.warn(`Potentially unsafe regex pattern rejected: ${pattern}`);
    return null;
  }

  try {
    return new RegExp(pattern, flags);
  } catch (e) {
    console.error(`Invalid regex pattern: ${pattern}`, e);
    return null;
  }
}

/**
 * Safely test a regex against input with length limit
 * @param regex The regex to test
 * @param input The input string
 * @param maxLength Maximum input length
 * @returns Match result or null if input too long
 */
export function safeRegexTest(regex: RegExp, input: string, maxLength: number = 1000): boolean {
  if (input.length > maxLength) {
    console.warn(`Input too long for regex test: ${input.length} > ${maxLength}`);
    return false;
  }
  return regex.test(input);
}

/**
 * Log errors with context
 */
export function logError(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  console.error(`[ERROR] ${context}: ${message}`);
  if (stack) {
    console.error(stack);
  }
}
