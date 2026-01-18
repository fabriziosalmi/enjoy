import * as fs from 'fs';
import * as path from 'path';
import { GameState } from './types.js';
import { loadState } from './loader.js';

/**
 * Builder - Assembles docs/ from contributions
 * 
 * This is the heart of level progression.
 * As levels unlock, the builder dynamically constructs
 * the GitHub Pages site from player contributions.
 */

const DOCS_DIR = './docs';
const CONTRIBUTIONS_DIR = './contributions';

interface BuildResult {
  success: boolean;
  files_updated: string[];
  errors: string[];
}

/**
 * Main builder function
 */
export async function buildPages(): Promise<BuildResult> {
  console.log('🔨 Building GitHub Pages...');
  
  const state = loadState();
  const result: BuildResult = {
    success: true,
    files_updated: [],
    errors: []
  };
  
  try {
    // Build base HTML
    await buildHTML(state, result);
    
    // Build CSS if level >= 2
    if (state.levels.current >= 2) {
      await buildCSS(state, result);
    }
    
    // Build JS if level >= 3
    if (state.levels.current >= 3) {
      await buildJS(state, result);
    }
    
    console.log(`✅ Build complete! Updated ${result.files_updated.length} file(s)`);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    result.success = false;
    result.errors.push(String(error));
  }
  
  return result;
}

/**
 * Build HTML - Assemble index.html with contributions
 */
async function buildHTML(state: GameState, result: BuildResult) {
  const templatePath = path.join(DOCS_DIR, 'index.html');
  let html = fs.readFileSync(templatePath, 'utf8');
  
  // If level >= 1, inject HTML contributions
  if (state.levels.current >= 1) {
    const htmlContributions = assembleHTMLContributions(state);
    html = html.replace(
      '<!-- Player-contributed HTML goes here -->',
      htmlContributions
    );
  }
  
  fs.writeFileSync(templatePath, html);
  result.files_updated.push('index.html');
}

/**
 * Build CSS - Assemble style.css with contributions
 */
async function buildCSS(state: GameState, result: BuildResult) {
  const stylePath = path.join(DOCS_DIR, 'style.css');
  let css = fs.readFileSync(stylePath, 'utf8');
  
  // Inject CSS contributions
  const cssContributions = assembleCSSContributions(state);
  css = css.replace(
    '/* CONTRIBUTIONS_CSS_PLACEHOLDER */',
    cssContributions
  );
  
  fs.writeFileSync(stylePath, css);
  result.files_updated.push('style.css');
}

/**
 * Build JS - Assemble game.js with contributions
 */
async function buildJS(state: GameState, result: BuildResult) {
  const jsPath = path.join(DOCS_DIR, 'game.js');
  let js = fs.readFileSync(jsPath, 'utf8');
  
  // Inject JS contributions
  const jsContributions = assembleJSContributions(state);
  js = js.replace(
    '/* CONTRIBUTIONS_JS_PLACEHOLDER */',
    jsContributions
  );
  
  fs.writeFileSync(jsPath, js);
  result.files_updated.push('game.js');
}

/**
 * Assemble HTML contributions from contributions/html/
 */
function assembleHTMLContributions(state: GameState): string {
  const htmlDir = path.join(CONTRIBUTIONS_DIR, 'html');
  
  if (!fs.existsSync(htmlDir)) {
    return '';
  }
  
  const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
  const contributions: string[] = [];
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(htmlDir, file), 'utf8');
    contributions.push(`\n<!-- From ${file} -->\n${content}`);
  }
  
  return contributions.join('\n');
}

/**
 * Assemble CSS contributions from contributions/css/
 */
function assembleCSSContributions(state: GameState): string {
  const cssDir = path.join(CONTRIBUTIONS_DIR, 'css');
  
  if (!fs.existsSync(cssDir)) {
    return '';
  }
  
  const files = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
  const contributions: string[] = [];
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(cssDir, file), 'utf8');
    contributions.push(`\n/* From ${file} */\n${content}`);
  }
  
  return contributions.join('\n');
}

/**
 * Assemble JS contributions from contributions/js/
 */
function assembleJSContributions(state: GameState): string {
  const jsDir = path.join(CONTRIBUTIONS_DIR, 'js');
  
  if (!fs.existsSync(jsDir)) {
    return '';
  }
  
  const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
  const contributions: string[] = [];
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
    contributions.push(`\n// From ${file}\n(function() {\n${content}\n})();`);
  }
  
  return contributions.join('\n');
}

/**
 * Check if level should be unlocked
 */
export function checkLevelUnlock(state: GameState): boolean {
  const next = state.levels.next_unlock;
  
  if (!next) {
    return false; // Max level reached
  }
  
  const scoreReached = state.score.total >= next.requires_score;
  const prsReached = state.meta.total_prs >= next.requires_prs;
  const playersReached = state.meta.total_players >= next.requires_players;
  
  return scoreReached && prsReached && playersReached;
}

/**
 * Unlock next level
 */
export function unlockNextLevel(state: GameState): void {
  const next = state.levels.next_unlock;
  
  if (!next) {
    console.log('🏁 Max level already reached!');
    return;
  }
  
  console.log(`🎉 LEVEL UP! Unlocking ${next.level}...`);
  
  // Update state
  state.levels.current = next.level_id;
  state.levels.unlocked.push(next.level);
  state.levels.unlocked_at[next.level] = new Date().toISOString();
  
  // Set next unlock or null if max level
  const levelThresholds = [
    { level: 'html', id: 1, score: 100, prs: 10, players: 5 },
    { level: 'css', id: 2, score: 500, prs: 25, players: 12 },
    { level: 'js', id: 3, score: 1500, prs: 50, players: 20 },
    { level: 'canvas', id: 4, score: 5000, prs: 100, players: 50 },
    { level: 'mystery', id: 5, score: 10000, prs: 200, players: 100 }
  ];
  
  const nextLevel = levelThresholds.find(l => l.id === next.level_id + 1);
  
  if (nextLevel) {
    state.levels.next_unlock = {
      level: nextLevel.level,
      level_id: nextLevel.id,
      requires_score: nextLevel.score,
      requires_prs: nextLevel.prs,
      requires_players: nextLevel.players,
      progress: {
        score: state.score.total,
        prs: state.meta.total_prs,
        players: state.meta.total_players
      }
    };
  } else {
    state.levels.next_unlock = null;
  }
  
  // Enable GitHub Pages if level 1
  if (next.level === 'html') {
    state.meta.pages_enabled = true;
    console.log('🌐 GitHub Pages enabled!');
  }
}
