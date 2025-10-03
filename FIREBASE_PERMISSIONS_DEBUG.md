# Firebase Permissions Debug Guide

## Error: "Missing or insufficient permissions"

This error occurs when trying to save certificates. Here's how to debug and fix it:

## 1. Check User Admin Status

First, verify that your user is properly set up as an admin in Firestore:

### Check in Firebase Console:
1. Go to Firebase Console → Firestore Database
2. Look for collection: `users`
3. Find document with your user ID (UID)
4. Verify the document has:
   ```json
   {
     "role": "admin",
     "isActive": true,
     "email": "your-email@example.com"
   }
   ```

### If user document doesn't exist, create it:
```javascript
// Run this in browser console on your website
import { doc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { useAuth } from './contexts/AuthContext';

// Get current user
const { user } = useAuth();

// Create admin user document
await setDoc(doc(db, 'users', user.uid), {
  email: user.email,
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  displayName: user.displayName || user.email
});
```

## 2. Correct Firestore Rules

Make sure your `firestore.rules` file has these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Admin check based on users collection
    function isAdmin() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isActive == true;
    }
    
    // Users collection - Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
      allow create: if isAuthenticated(); // Allow user creation
      allow read, list: if isAdmin(); // Admins can read all users
    }
    
    // Certificates collection
    match /certificates/{certificateId} {
      allow read, list: if true; // Public read access for displaying certificates
      allow create: if isAdmin() && isValidCertificate(request.resource.data);
      allow update: if isAdmin() && isValidCertificate(request.resource.data);
      allow delete: if isAdmin();
    }
    
    // Validate certificate data structure
    function isValidCertificate(data) {
      return data.keys().hasAll(['title', 'imageUrl']) &&
             data.title is string && data.title.size() > 0 && data.title.size() <= 200 &&
             data.imageUrl is string && data.imageUrl.size() > 0;
    }
  }
}
```

## 3. Correct Storage Rules

Make sure your `storage.rules` file has these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Admin check based on users collection in Firestore
    function isAdmin() {
      return isAuthenticated() && 
             firestore.exists(/databases/(default)/documents/users/$(request.auth.uid)) &&
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isActive == true;
    }
    
    // Validate image file types and sizes
    function isValidImage() {
      return request.resource.contentType.matches('image/.*') &&
             request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
    
    // Certificate images
    match /certificates/{allPaths=**} {
      allow read: if true; // Public read access for certificate display
      allow write: if isAdmin() && isValidImage(); // Only admins can upload certificate images
      allow delete: if isAdmin(); // Only admins can delete certificate images
    }
  }
}
```

## 4. Deploy Rules

Deploy the updated rules:

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage

# Or deploy both
firebase deploy --only firestore:rules,storage
```

## 5. Quick Admin Setup Script

Create and run this script to set up admin user:

```javascript
// setup-admin.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupAdmin(email, password) {
  try {
    // Sign in with your credentials
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create admin document
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      displayName: user.displayName || user.email
    });
    
    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error setting up admin:', error);
  }
}

// Replace with your email and password
setupAdmin('your-email@example.com', 'your-password');
```

## 6. Debug in Browser Console

Add this debug code to check admin status:

```javascript
// Add this to your certificates page for debugging
useEffect(() => {
  const checkAdminStatus = async () => {
    if (user) {
      console.log('Current user:', user.uid, user.email);
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          console.log('User document:', userDoc.data());
        } else {
          console.log('User document does not exist!');
        }
      } catch (error) {
        console.error('Error checking user document:', error);
      }
    }
  };
  
  checkAdminStatus();
}, [user]);
```

## 7. Common Issues and Solutions

### Issue 1: User document doesn't exist
**Solution**: Create the user document with admin role

### Issue 2: Wrong database name
**Solution**: Check if you're using the correct database name in Firebase config

### Issue 3: Rules not deployed
**Solution**: Deploy rules using Firebase CLI

### Issue 4: Authentication not working
**Solution**: Check Firebase Auth configuration and user login status

### Issue 5: Wrong collection path
**Solution**: Verify collection name is exactly 'certificates' (case-sensitive)

## 8. Test Admin Access

Add this test function to verify admin access:

```javascript
const testAdminAccess = async () => {
  try {
    // Test creating a simple document
    const testDoc = {
      title: 'Test Certificate',
      imageUrl: 'https://example.com/test.jpg',
      createdBy: user?.email || 'test',
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'certificates'), testDoc);
    console.log('Test certificate created with ID:', docRef.id);
    
    // Clean up test document
    await deleteDoc(doc(db, 'certificates', docRef.id));
    console.log('Admin access working correctly!');
  } catch (error) {
    console.error('Admin access test failed:', error);
  }
};
```

## 9. Emergency Development Rules

If you need to test quickly, you can temporarily use these permissive rules (ONLY FOR DEVELOPMENT):

```javascript
// TEMPORARY DEVELOPMENT RULES - DO NOT USE IN PRODUCTION
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

```javascript
// TEMPORARY STORAGE RULES - DO NOT USE IN PRODUCTION
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Remember to revert to secure rules before going to production!

## 10. Verification Checklist

- [ ] User is authenticated
- [ ] User document exists in `users` collection
- [ ] User has `role: 'admin'` and `isActive: true`
- [ ] Firestore rules are deployed
- [ ] Storage rules are deployed
- [ ] Certificate data structure is valid
- [ ] File upload validation passes

Follow these steps in order, and your certificate management should work correctly!