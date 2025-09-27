import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Debug: Log configuration (remove in production)
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey
  });
}

// Validate required config
if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  throw new Error('Firebase configuration is incomplete. Please check your environment variables.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app, 'arogya-db'); // Use the correct database name
export const storage = getStorage(app);

// Enable offline persistence for better UX
if (typeof window !== 'undefined') {
  // Only run on client side
  import('firebase/firestore').then(({ enableNetwork, disableNetwork }) => {
    // Enable network by default
    enableNetwork(db).catch((error) => {
      console.warn('Failed to enable Firestore network:', error);
    });
  });
}

export default app;