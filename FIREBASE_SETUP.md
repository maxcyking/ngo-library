# Firebase Setup Guide

This document provides step-by-step instructions for setting up Firebase authentication with role-based access control for the NGO Library project.

## Prerequisites

1. A Google account
2. Node.js installed on your system
3. Firebase CLI installed globally (`npm install -g firebase-tools`)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `arogya-library` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 3: Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your preferred location (choose closest to your users)
5. Click "Done"

## Step 4: Get Firebase Configuration

1. In Firebase Console, go to "Project Settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Enter app nickname: `ngo-library-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the configuration object

## Step 5: Configure Environment Variables

Your `.env.local` file is already configured with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDwBUpXRFGQPHRAb1q9YYKyEz3977YRqkg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=arogya-lib-ebd5e.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=arogya-lib-ebd5e
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=arogya-lib-ebd5e.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=727533508347
NEXT_PUBLIC_FIREBASE_APP_ID=1:727533508347:web:9307558d33ef4045be425e
ADMIN_EMAIL=admin@arogyabmr.org
```

## Step 6: Deploy Security Rules

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project: `firebase init firestore`
4. Choose your existing project: `arogya-lib-ebd5e`
5. Use the existing `firestore.rules` file
6. Deploy rules: `firebase deploy --only firestore:rules`

## Step 7: Create First Admin User

### Method 1: Using Firebase Console (Recommended)

1. **Create Authentication User:**
   - Go to Firebase Console > Authentication > Users
   - Click "Add user"
   - Enter email: `admin@arogyabmr.org`
   - Enter a secure password
   - Click "Add user"

2. **Create User Profile in Firestore:**
   - Go to Firestore Database
   - Click "Start collection"
   - Collection ID: `users`
   - Document ID: Use the UID from the authentication user you just created
   - Add the following fields:
     ```
     uid: [user's UID from Authentication]
     email: "admin@arogyabmr.org"
     name: "Admin User"
     role: "admin"
     isActive: true
     createdAt: [current timestamp]
     createdBy: "system"
     permissions: ["read_users", "write_users", "read_books", "write_books", "read_members", "write_members", "read_content", "write_content", "admin_dashboard"]
     ```

### Method 2: Using Admin Script (Advanced)

1. Download your Firebase service account key:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

2. Update `scripts/create-admin.js` with your service account key
3. Run: `node scripts/create-admin.js`

## Step 8: Test Authentication System

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/admin/login`
3. Try logging in with your admin credentials
4. You should be redirected to the admin dashboard

## Authentication Flow

### How It Works:

1. **User Login**: User enters email/password on login page
2. **Firebase Auth**: Firebase authenticates the user
3. **Profile Check**: System checks Firestore for user profile
4. **Role Validation**: Verifies user has `role: "admin"` and `isActive: true`
5. **Access Grant**: If valid, user gets access to admin panel
6. **Access Deny**: If invalid, user is logged out and shown error

### Security Features:

- **Role-based Access**: Only users with `role: "admin"` can access admin panel
- **Active Status**: Users must have `isActive: true` to login
- **Firestore Rules**: Database rules prevent unauthorized access
- **Protected Routes**: All admin routes are protected with `ProtectedRoute` component
- **Session Management**: Automatic logout on role/status changes

## User Profile Structure

Each user document in Firestore should have:

```javascript
{
  uid: "user_firebase_uid",
  email: "user@example.com",
  name: "User Full Name",
  role: "admin" | "user",
  isActive: true | false,
  createdAt: Timestamp,
  createdBy: "creator_uid",
  lastLogin: Timestamp | null,
  permissions: ["read_users", "write_users", ...],
  updatedAt: Timestamp,
  updatedBy: "updater_uid"
}
```

## Managing Users

### To Create New Admin User:
1. Create user in Firebase Authentication
2. Create corresponding document in `users` collection with `role: "admin"` and `isActive: true`

### To Deactivate User:
1. Set `isActive: false` in user's Firestore document
2. User will be automatically logged out on next request

### To Change User Role:
1. Update `role` field in user's Firestore document
2. Update `permissions` array accordingly

## Security Rules Explanation

The `firestore.rules` file implements:

- **Admin-only Access**: Users collection only accessible by admins
- **Public Read**: News, events, donations visible to everyone
- **Protected Write**: Only admins can modify data
- **Self-access**: Users can read their own profile
- **Audit Trail**: All changes are logged

## Troubleshooting

### Common Issues:

1. **"Access denied" Error**:
   - Check if user exists in Firestore `users` collection
   - Verify `role: "admin"` and `isActive: true`
   - Ensure Firestore rules are deployed

2. **"User profile not found"**:
   - Create user document in Firestore with correct UID
   - Match UID from Authentication with Firestore document ID

3. **Login works but redirects to login**:
   - Check browser console for errors
   - Verify user has admin role in Firestore
   - Check if `isActive` is set to `true`

4. **Firebase not initialized**:
   - Verify environment variables are correct
   - Check if Firebase config is properly imported

### Debug Steps:

1. Check browser console for errors
2. Verify user document exists in Firestore
3. Check Authentication user exists
4. Verify Firestore rules are deployed
5. Test with Firebase Console

## Production Considerations

1. **Environment Variables**: Use production Firebase project
2. **Security Rules**: Review and tighten rules for production
3. **Backup Strategy**: Set up regular Firestore backups
4. **Monitoring**: Enable Firebase monitoring and alerts
5. **Rate Limiting**: Implement rate limiting for login attempts

## Support

For issues:
1. Check Firebase Console logs
2. Review browser developer tools
3. Verify Firestore document structure
4. Test authentication flow step by step

## Next Steps

After setup:
1. Create additional admin users as needed
2. Implement user management interface
3. Add audit logging for admin actions
4. Set up email verification (optional)
5. Implement password reset functionality