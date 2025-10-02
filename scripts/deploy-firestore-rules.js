#!/usr/bin/env node

/**
 * Deploy Firestore Rules Script
 * 
 * This script helps deploy the updated Firestore security rules
 * Run this after updating firestore.rules file
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Deploying Firestore Rules...\n');

// Check if firebase.json exists
const firebaseConfigPath = path.join(process.cwd(), 'firebase.json');
if (!fs.existsSync(firebaseConfigPath)) {
  console.error('❌ firebase.json not found. Make sure you are in the project root directory.');
  process.exit(1);
}

// Check if firestore.rules exists
const rulesPath = path.join(process.cwd(), 'firestore.rules');
if (!fs.existsSync(rulesPath)) {
  console.error('❌ firestore.rules not found. Make sure the rules file exists.');
  process.exit(1);
}

try {
  console.log('📋 Current Firestore rules preview:');
  console.log('=====================================');
  
  // Show first few lines of rules for confirmation
  const rules = fs.readFileSync(rulesPath, 'utf8');
  const lines = rules.split('\n').slice(0, 10);
  lines.forEach((line, index) => {
    console.log(`${index + 1}: ${line}`);
  });
  
  if (rules.split('\n').length > 10) {
    console.log('... (and more rules)');
  }
  
  console.log('\n🚀 Deploying rules to Firebase...');
  
  // Deploy the rules
  execSync('firebase deploy --only firestore:rules', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Firestore rules deployed successfully!');
  console.log('\n📝 Updated rules include:');
  console.log('   • settings/website collection (public read, admin write)');
  console.log('   • contact-submissions collection (public create, admin read)');
  console.log('   • settingsLogs collection (admin only, immutable)');
  console.log('   • book-categories collection (public read)');
  console.log('   • event-registrations collection (authenticated access)');
  console.log('   • work-areas collection (public read)');
  console.log('   • testimonials collection (public read)');
  console.log('   • statistics collection (public read)');
  
  console.log('\n🔄 Your website should now be able to:');
  console.log('   • Load dynamic website settings (logo, contact info, etc.)');
  console.log('   • Accept contact form submissions from public');
  console.log('   • Allow admin management of all settings');
  console.log('   • Track all settings changes with audit logs');
  console.log('   • Display book categories and other dynamic content');
  
} catch (error) {
  console.error('\n❌ Error deploying Firestore rules:');
  console.error(error.message);
  
  console.log('\n🔧 Troubleshooting:');
  console.log('   1. Make sure you are logged in: firebase login');
  console.log('   2. Check your project: firebase projects:list');
  console.log('   3. Set correct project: firebase use <project-id>');
  console.log('   4. Try deploying manually: firebase deploy --only firestore:rules');
  
  process.exit(1);
}