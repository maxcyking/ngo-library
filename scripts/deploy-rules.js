#!/usr/bin/env node

/**
 * Script to deploy Firestore rules
 * Run with: node scripts/deploy-rules.js [dev|prod]
 */

const { execSync } = require('child_process');
const { copyFileSync } = require('fs');
const path = require('path');

const environment = process.argv[2] || 'dev';

console.log(`🚀 Deploying Firestore rules for ${environment} environment...`);

try {
  // Change to project directory
  process.chdir(path.join(__dirname, '..'));
  
  // Copy the appropriate rules file
  if (environment === 'prod' || environment === 'production') {
    console.log('📋 Using production rules...');
    copyFileSync('firestore-production.rules', 'firestore.rules');
  } else {
    console.log('📋 Using development rules...');
    // Current firestore.rules is already set to development mode
  }
  
  // Deploy Firestore and Storage rules
  execSync('firebase deploy --only firestore:rules,storage', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Firestore and Storage rules deployed successfully!');
  console.log(`📝 Environment: ${environment}`);
  
  if (environment === 'dev' || environment === 'development') {
    console.log('⚠️  WARNING: Development rules are more permissive. Use production rules for live deployment.');
  }
  
} catch (error) {
  console.error('❌ Error deploying Firestore rules:', error.message);
  console.error('\nTroubleshooting:');
  console.error('1. Make sure Firebase CLI is installed: npm install -g firebase-tools');
  console.error('2. Make sure you are logged in: firebase login');
  console.error('3. Make sure the project is initialized: firebase init');
  process.exit(1);
}