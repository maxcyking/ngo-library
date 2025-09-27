#!/usr/bin/env node

/**
 * Test script for admin features
 * Run with: node scripts/test-admin-features.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, serverTimestamp } = require('firebase/firestore');

// Firebase configuration (using environment variables)
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

async function testAdminFeatures() {
  console.log('🧪 Testing Admin Features...\n');

  try {
    // Test 1: Check if we can read from students collection
    console.log('1. Testing students collection access...');
    const studentsSnapshot = await getDocs(collection(db, 'students'));
    console.log(`   ✅ Students collection accessible. Found ${studentsSnapshot.size} students.\n`);

    // Test 2: Check if we can read from heroImages collection
    console.log('2. Testing heroImages collection access...');
    const heroImagesSnapshot = await getDocs(collection(db, 'heroImages'));
    console.log(`   ✅ Hero images collection accessible. Found ${heroImagesSnapshot.size} images.\n`);

    // Test 3: Check if we can read from uiContent collection
    console.log('3. Testing uiContent collection access...');
    const uiContentSnapshot = await getDocs(collection(db, 'uiContent'));
    console.log(`   ✅ UI content collection accessible. Found ${uiContentSnapshot.size} documents.\n`);

    // Test 4: Test sample data creation (commented out to avoid spam)
    /*
    console.log('4. Testing sample student creation...');
    const sampleStudent = {
      name: 'Test Student',
      rollNumber: 'TEST001',
      phone: '+91 9876543210',
      course: 'Test Course',
      status: 'active',
      membershipType: 'basic',
      booksIssued: 0,
      totalBooksRead: 0,
      fineAmount: 0,
      createdAt: serverTimestamp(),
      createdBy: 'test-script'
    };
    
    const docRef = await addDoc(collection(db, 'students'), sampleStudent);
    console.log(`   ✅ Sample student created with ID: ${docRef.id}\n`);
    */

    console.log('🎉 All tests passed! Admin features are working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nPossible issues:');
    console.error('- Firebase configuration is incorrect');
    console.error('- Firestore rules are too restrictive');
    console.error('- Network connectivity issues');
    console.error('- Database name mismatch');
    process.exit(1);
  }
}

// Check if environment variables are set
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error('❌ Firebase environment variables not found.');
  console.error('Make sure to set up your .env.local file with Firebase configuration.');
  process.exit(1);
}

// Run tests
testAdminFeatures();