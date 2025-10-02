#!/usr/bin/env node

/**
 * Deploy Firebase Storage Rules Script
 * 
 * This script helps deploy the updated Firebase Storage security rules
 * Run this after updating storage.rules file
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Deploying Firebase Storage Rules...\n');

// Check if firebase.json exists
const firebaseConfigPath = path.join(process.cwd(), 'firebase.json');
if (!fs.existsSync(firebaseConfigPath)) {
  console.error('❌ firebase.json not found. Make sure you are in the project root directory.');
  process.exit(1);
}

// Check if storage.rules exists
const rulesPath = path.join(process.cwd(), 'storage.rules');
if (!fs.existsSync(rulesPath)) {
  console.error('❌ storage.rules not found. Make sure the storage rules file exists.');
  process.exit(1);
}

try {
  console.log('📋 Current Storage rules preview:');
  console.log('=====================================');
  
  // Show first few lines of rules for confirmation
  const rules = fs.readFileSync(rulesPath, 'utf8');
  const lines = rules.split('\n').slice(0, 15);
  lines.forEach((line, index) => {
    console.log(`${index + 1}: ${line}`);
  });
  
  if (rules.split('\n').length > 15) {
    console.log('... (and more rules)');
  }
  
  console.log('\n🚀 Deploying storage rules to Firebase...');
  
  // Deploy the storage rules
  execSync('firebase deploy --only storage', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Firebase Storage rules deployed successfully!');
  console.log('\n📝 Updated storage rules include:');
  console.log('   • website-assets/ (public read, admin write)');
  console.log('   • branding/ (public read, admin write)');
  console.log('   • settings/ (public read, admin write)');
  console.log('   • student-profiles/ (admin only)');
  console.log('   • applications/ (public write, admin read)');
  console.log('   • gallery/ (public read, authenticated write)');
  console.log('   • news-images/ (public read, authenticated write)');
  console.log('   • event-images/ (public read, authenticated write)');
  
  console.log('\n🔄 Your website can now:');
  console.log('   • Display logos and branding assets publicly');
  console.log('   • Allow admin uploads of website assets');
  console.log('   • Secure student and application documents');
  console.log('   • Manage gallery and media files');
  console.log('   • Validate file types and sizes');
  
  console.log('\n📏 File upload limits:');
  console.log('   • Images: 5MB maximum');
  console.log('   • Documents: 10MB maximum');
  console.log('   • Allowed image types: image/*');
  console.log('   • Allowed document types: image/*, application/pdf');
  
} catch (error) {
  console.error('\n❌ Error deploying Storage rules:');
  console.error(error.message);
  
  console.log('\n🔧 Troubleshooting:');
  console.log('   1. Make sure you are logged in: firebase login');
  console.log('   2. Check your project: firebase projects:list');
  console.log('   3. Set correct project: firebase use <project-id>');
  console.log('   4. Try deploying manually: firebase deploy --only storage');
  console.log('   5. Check if Storage is enabled in Firebase Console');
  
  process.exit(1);
}