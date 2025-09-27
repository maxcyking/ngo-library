#!/usr/bin/env node

/**
 * Script to create admin user in Firestore
 * Run with: node scripts/setup-admin-user.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'arogya-db');
const auth = getAuth(app);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@arogyabmr.org';
const ADMIN_PASSWORD = process.argv[2] || 'Admin@123456'; // Get password from command line

async function setupAdminUser() {
  console.log('🔧 Setting up admin user...\n');

  try {
    let user;
    
    // Try to sign in first (user might already exist)
    try {
      console.log(`📧 Attempting to sign in as ${ADMIN_EMAIL}...`);
      const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      user = userCredential.user;
      console.log('✅ Admin user already exists and signed in successfully.');
    } catch (signInError) {
      if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/wrong-password') {
        // User doesn't exist, create new one
        console.log(`👤 Creating new admin user: ${ADMIN_EMAIL}...`);
        const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        user = userCredential.user;
        console.log('✅ Admin user created successfully.');
      } else {
        throw signInError;
      }
    }

    // Create/update user document in Firestore
    console.log('📝 Creating admin user document in Firestore...');
    const userDoc = {
      email: ADMIN_EMAIL,
      role: 'admin',
      isActive: true,
      displayName: 'System Administrator',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      permissions: {
        students: { read: true, write: true, delete: true },
        books: { read: true, write: true, delete: true },
        ui: { read: true, write: true, delete: true },
        users: { read: true, write: true, delete: true },
        reports: { read: true, write: true, delete: true }
      }
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);
    console.log('✅ Admin user document created in Firestore.');

    console.log('\n🎉 Admin user setup completed successfully!');
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
    console.log(`🆔 UID: ${user.uid}`);
    console.log('\n⚠️  Please change the default password after first login.');
    console.log('🔒 You can now use production Firestore rules safely.');

  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n💡 The email is already in use. Try signing in with the existing password.');
    } else if (error.code === 'auth/weak-password') {
      console.log('\n💡 Password is too weak. Please use a stronger password (at least 6 characters).');
    } else if (error.code === 'auth/invalid-email') {
      console.log('\n💡 Invalid email format. Please check the ADMIN_EMAIL in your .env.local file.');
    }
    
    console.error('\nTroubleshooting:');
    console.error('1. Make sure Firebase Authentication is enabled in your project');
    console.error('2. Make sure Email/Password provider is enabled in Firebase Auth');
    console.error('3. Check your Firebase configuration in .env.local');
    console.error('4. Make sure you have internet connection');
    
    process.exit(1);
  }
}

// Check if environment variables are set
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error('❌ Firebase environment variables not found.');
  console.error('Make sure to set up your .env.local file with Firebase configuration.');
  process.exit(1);
}

console.log('🚀 Admin User Setup Script');
console.log('========================\n');

if (process.argv.length < 3) {
  console.log('💡 Usage: node scripts/setup-admin-user.js [password]');
  console.log(`📧 Admin Email: ${ADMIN_EMAIL}`);
  console.log('🔑 Default Password: Admin@123456 (if not provided)\n');
}

// Run setup
setupAdminUser();