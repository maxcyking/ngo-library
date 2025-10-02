#!/usr/bin/env node

/**
 * Deploy All Firebase Rules Script
 * 
 * This script deploys both Firestore and Storage security rules
 * Run this after updating firestore.rules and storage.rules files
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Deploying All Firebase Security Rules...\n');

// Check if firebase.json exists
const firebaseConfigPath = path.join(process.cwd(), 'firebase.json');
if (!fs.existsSync(firebaseConfigPath)) {
  console.error('❌ firebase.json not found. Make sure you are in the project root directory.');
  process.exit(1);
}

// Check if both rule files exist
const firestoreRulesPath = path.join(process.cwd(), 'firestore.rules');
const storageRulesPath = path.join(process.cwd(), 'storage.rules');

if (!fs.existsSync(firestoreRulesPath)) {
  console.error('❌ firestore.rules not found. Make sure the Firestore rules file exists.');
  process.exit(1);
}

if (!fs.existsSync(storageRulesPath)) {
  console.error('❌ storage.rules not found. Make sure the Storage rules file exists.');
  process.exit(1);
}

try {
  console.log('📋 Rules Summary:');
  console.log('=====================================');
  
  // Show summary of both rule files
  const firestoreRules = fs.readFileSync(firestoreRulesPath, 'utf8');
  const storageRules = fs.readFileSync(storageRulesPath, 'utf8');
  
  console.log(`📄 Firestore Rules: ${firestoreRules.split('\n').length} lines`);
  console.log(`📄 Storage Rules: ${storageRules.split('\n').length} lines`);
  
  console.log('\n🚀 Deploying all rules to Firebase...');
  
  // Deploy both Firestore and Storage rules
  execSync('firebase deploy --only firestore:rules,storage', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ All Firebase rules deployed successfully!');
  
  console.log('\n📝 Firestore Rules Include:');
  console.log('   🔐 Settings Management:');
  console.log('      • settings/website (public read, admin write)');
  console.log('      • settingsLogs (admin only, immutable audit trail)');
  console.log('      • Data validation for all settings');
  console.log('   📞 Contact System:');
  console.log('      • contact-submissions (public create, admin read)');
  console.log('      • inquiries (public create, admin manage)');
  console.log('      • Input validation and length limits');
  console.log('   👥 User Management:');
  console.log('      • users, students, members (admin controlled)');
  console.log('      • applications (public create, admin manage)');
  console.log('   📚 Content Management:');
  console.log('      • books, events, news (public read, admin write)');
  console.log('      • categories, tags (public read, admin write)');
  console.log('   📊 Public Data:');
  console.log('      • statistics, testimonials, work-areas (public read)');
  
  console.log('\n📁 Storage Rules Include:');
  console.log('   🎨 Website Assets:');
  console.log('      • website-assets/ (public read, admin write)');
  console.log('      • branding/ (public read, admin write)');
  console.log('      • settings/ (public read, admin write)');
  console.log('   👤 User Content:');
  console.log('      • student-profiles/ (admin only)');
  console.log('      • member-photos/ (authenticated access)');
  console.log('   📋 Applications:');
  console.log('      • applications/ (public write, admin read)');
  console.log('      • Separate rules for profiles, signatures, marksheets');
  console.log('   🖼️ Media & Gallery:');
  console.log('      • gallery/ (public read, authenticated write)');
  console.log('      • news-images/, event-images/ (public read, authenticated write)');
  console.log('   📄 Documents:');
  console.log('      • documents/ (authenticated access)');
  
  console.log('\n🛡️ Security Features:');
  console.log('   ✅ Role-based access control (admin/user/public)');
  console.log('   ✅ Data validation and type checking');
  console.log('   ✅ File type and size restrictions');
  console.log('   ✅ Input length limits to prevent abuse');
  console.log('   ✅ Email format validation');
  console.log('   ✅ Immutable audit logs');
  console.log('   ✅ Public read access for website display');
  console.log('   ✅ Admin-only write access for sensitive data');
  
  console.log('\n📏 File Upload Limits:');
  console.log('   • Images: 5MB maximum');
  console.log('   • Documents: 10MB maximum');
  console.log('   • Allowed image types: image/*');
  console.log('   • Allowed document types: image/*, application/pdf');
  
  console.log('\n🔄 Your website now supports:');
  console.log('   • Dynamic website settings and branding');
  console.log('   • Secure contact form submissions');
  console.log('   • Admin management of all content');
  console.log('   • Public access to necessary data');
  console.log('   • Comprehensive audit logging');
  console.log('   • File upload security');
  
  console.log('\n🎯 Next Steps:');
  console.log('   1. Test the settings page: /admin/settings');
  console.log('   2. Submit a contact form to test public access');
  console.log('   3. Upload a logo to test file permissions');
  console.log('   4. Check Firebase Console for rule violations');
  console.log('   5. Monitor audit logs for settings changes');
  
} catch (error) {
  console.error('\n❌ Error deploying Firebase rules:');
  console.error(error.message);
  
  console.log('\n🔧 Troubleshooting:');
  console.log('   1. Make sure you are logged in: firebase login');
  console.log('   2. Check your project: firebase projects:list');
  console.log('   3. Set correct project: firebase use <project-id>');
  console.log('   4. Check Firebase Console for any issues');
  console.log('   5. Try deploying rules separately:');
  console.log('      • firebase deploy --only firestore:rules');
  console.log('      • firebase deploy --only storage');
  console.log('   6. Ensure both Firestore and Storage are enabled');
  
  process.exit(1);
}