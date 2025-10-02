const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'arogya-db');

async function testConnection() {
  try {
    console.log('Testing Firebase connection...');
    
    // Test adding a simple category
    const testCategory = {
      name: 'टेस्ट श्रेणी',
      slug: 'test-category',
      description: 'यह एक टेस्ट श्रेणी है',
      color: '#3B82F6',
      icon: 'test',
      isActive: true,
      sortOrder: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'newsCategories'), testCategory);
    console.log('✅ Test category added successfully with ID:', docRef.id);
    
  } catch (error) {
    console.error('❌ Error testing Firebase connection:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      customData: error.customData
    });
  }
}

// Run test
testConnection();
