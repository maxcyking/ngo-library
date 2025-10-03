#!/usr/bin/env node

/**
 * Setup Admin User for Certificate Management
 * 
 * This script creates an admin user document in Firestore
 * Run this to fix certificate permissions issues
 */

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

// Firebase configuration - update with your config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupAdminUser() {
  console.log('🔧 Setting up admin user for certificate management...\n');

  // Get credentials from command line or environment
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Please provide email and password:');
    console.log('Usage: node setup-admin-certificate-user.js <email> <password>');
    console.log('Or set ADMIN_EMAIL and ADMIN_PASSWORD environment variables');
    process.exit(1);
  }

  try {
    console.log(`📧 Signing in with email: ${email}`);
    
    // Sign in with provided credentials
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ Successfully signed in with UID: ${user.uid}`);

    // Check if user document already exists
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('📄 Existing user document found:');
      console.log(`   Role: ${userData.role}`);
      console.log(`   Active: ${userData.isActive}`);
      console.log(`   Email: ${userData.email}`);

      if (userData.role === 'admin' && userData.isActive === true) {
        console.log('✅ User is already set up as admin!');
        console.log('\n🎯 You should now be able to manage certificates.');
        return;
      } else {
        console.log('⚠️  User exists but is not admin. Updating...');
      }
    } else {
      console.log('📝 User document does not exist. Creating...');
    }

    // Create or update admin user document
    const adminUserData = {
      email: user.email,
      role: 'admin',
      isActive: true,
      displayName: user.displayName || user.email,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(userDocRef, adminUserData, { merge: true });
    
    console.log('✅ Admin user document created/updated successfully!');
    console.log('\n📋 User details:');
    console.log(`   UID: ${user.uid}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: admin`);
    console.log(`   Active: true`);

    console.log('\n🎯 Next steps:');
    console.log('1. Make sure Firestore rules are deployed:');
    console.log('   firebase deploy --only firestore:rules');
    console.log('2. Make sure Storage rules are deployed:');
    console.log('   firebase deploy --only storage');
    console.log('3. Try creating a certificate again');

  } catch (error) {
    console.error('\n❌ Error setting up admin user:');
    
    if (error.code === 'auth/user-not-found') {
      console.error('User not found. Please create the user account first.');
    } else if (error.code === 'auth/wrong-password') {
      console.error('Wrong password provided.');
    } else if (error.code === 'auth/invalid-email') {
      console.error('Invalid email address.');
    } else {
      console.error(error.message);
    }

    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the user account exists in Firebase Auth');
    console.log('2. Check that email and password are correct');
    console.log('3. Verify Firebase configuration in .env files');
    
    process.exit(1);
  }
}

// Run the setup
setupAdminUser().then(() => {
  console.log('\n🎉 Setup completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Setup failed:', error);
  process.exit(1);
});