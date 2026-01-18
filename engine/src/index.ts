#!/usr/bin/env node
import * as fs from 'fs';
import minimist from 'minimist';
import { loadRules } from './loader.js';
import { parsePR } from './parser.js';
import { validatePR } from './validator.js';
// import { applyEffect } from './executor.js'; // Disabled for MVP

const args = minimist(process.argv.slice(2));
const command = args._[0];

if (command === 'validate') {
  // Validate a PR
  const prNumber = parseInt(args['pr-number'] || '1');
  
  console.log(`🔍 Validating PR #${prNumber}...`);
  
  const rules = loadRules();
  console.log(`📋 Loaded ${rules.length} active rule(s)`);
  
  const pr = parsePR(prNumber);
  console.log(`📁 Files added: ${pr.files_added.join(', ') || 'none'}`);
  
  const result = validatePR(rules, pr);
  
  // Write result to file for GitHub Actions
  fs.writeFileSync('validation-result.json', JSON.stringify(result, null, 2));
  
  if (result.valid) {
    console.log(`✅ VALID! Matched rule(s): ${result.matched_rules.join(', ')}`);
    console.log(`   Points: +${result.points}`);
    process.exit(0);
  } else {
    console.log(`❌ INVALID: ${result.reason}`);
    process.exit(1);
  }
  
} else if (command === 'apply') {
  // Apply effect from a validated PR
  const prNumber = parseInt(args['pr-number'] || '1');
  
  console.log(`⚡ Applying effect from PR #${prNumber}...`);
  
  // Read validation result
  if (!fs.existsSync('validation-result.json')) {
    console.error('❌ No validation result found. Run validate first.');
    process.exit(1);
  }
  
  const result = JSON.parse(fs.readFileSync('validation-result.json', 'utf8'));
  
  if (!result.valid) {
    console.error('❌ Cannot apply effect from invalid PR');
    process.exit(1);
  }
  
  const pr = parsePR(prNumber);
  applyEffect(pr, result);
  
} else {
  console.log('Usage:');
  console.log('  validate --pr-number=123');
  console.log('  apply --pr-number=123');
  process.exit(1);
}
