/**
 * Script to create the first admin user
 * Run this script once to create the initial admin user
 * 
 * Usage: node scripts/create-admin.js
 */

const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase Admin SDK
const serviceAccount = {
  // You'll need to add your Firebase service account key here
  // Download it from Firebase Console > Project Settings > Service Accounts
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'arogya-lib-ebd5e'
  });
}

const db = admin.firestore();
const auth = admin.auth();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const createAdminUser = async () => {
  try {
    console.log('🔧 Creating Admin User for Arogya Library System\n');
    
    const email = await new Promise((resolve) => {
      rl.question('Enter admin email: ', resolve);
    });
    
    const password = await new Promise((resolve) => {
      rl.question('Enter admin password (min 6 characters): ', resolve);
    });
    
    const name = await new Promise((resolve) => {
      rl.question('Enter admin name: ', resolve);
    });
    
    // Create user in Firebase Auth
    console.log('\n📝 Creating user in Firebase Auth...');
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: name,
      emailVerified: true
    });
    
    console.log('✅ User created in Firebase Auth with UID:', userRecord.uid);
    
    // Create user profile in Firestore
    console.log('📄 Creating user profile in Firestore...');
    const userProfile = {
      uid: userRecord.uid,
      email: email,
      name: name,
      role: 'admin',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'system',
      lastLogin: null,
      permissions: [
        'read_users',
        'write_users',
        'read_books',
        'write_books',
        'read_members',
        'write_members',
        'read_content',
        'write_content',
        'admin_dashboard'
      ]
    };
    
    await db.collection('users').doc(userRecord.uid).set(userProfile);
    
    console.log('✅ User profile created in Firestore');
    console.log('\n🎉 Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('👤 Name:', name);
    console.log('🔑 Role: admin');
    console.log('✅ Status: active');
    console.log('\nYou can now login to the admin panel with these credentials.');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    rl.close();
    process.exit(0);
  }
};

createAdminUser();