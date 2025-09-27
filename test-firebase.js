// Simple Firebase connection test
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDwBUpXRFGQPHRAb1q9YYKyEz3977YRqkg",
  authDomain: "arogya-lib-ebd5e.firebaseapp.com",
  projectId: "arogya-lib-ebd5e",
  storageBucket: "arogya-lib-ebd5e.firebasestorage.app",
  messagingSenderId: "727533508347",
  appId: "1:727533508347:web:9307558d33ef4045be425e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'arogya-db'); // Use the correct database name

async function testConnection() {
  try {
    console.log('Testing Firebase connection...');
    
    // Try to read the user document
    const userDoc = await getDoc(doc(db, 'users', 'sT228snM1XQqaOSxoB4GDQcD06q2'));
    
    if (userDoc.exists()) {
      console.log('✅ Connection successful!');
      console.log('User data:', userDoc.data());
    } else {
      console.log('❌ User document not found');
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();