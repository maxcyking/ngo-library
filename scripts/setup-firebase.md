# Firebase Setup Instructions

## 🚨 **Current Issue: Firestore Database Not Created**

The errors you're seeing indicate that the Firestore database hasn't been created in your Firebase project yet.

## ✅ **Step-by-Step Fix:**

### **1. Create Firestore Database**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `arogya-lib-ebd5e`
3. Click on **"Firestore Database"** in the left sidebar
4. Click **"Create database"**
5. Choose **"Start in production mode"** (we have security rules ready)
6. Select location: **"asia-south1 (Mumbai)"** (closest to India)
7. Click **"Done"**

### **2. Deploy Security Rules**

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# When prompted:
# - Select "Use an existing project"
# - Choose "arogya-lib-ebd5e"
# - Use existing firestore.rules file
# - Use existing firestore.indexes.json (or create new)

# Deploy the rules
firebase deploy --only firestore:rules
```

### **3. Create First Admin User**

After Firestore is created:

1. **Create Authentication User:**
   - Go to Firebase Console > Authentication > Users
   - Click "Add user"
   - Email: `admin@arogyabmr.org`
   - Password: `[choose a secure password]`
   - Click "Add user"

2. **Create User Profile in Firestore:**
   - Go to Firestore Database
   - Click "Start collection"
   - Collection ID: `users`
   - Document ID: `[copy the UID from the auth user you just created]`
   - Add these fields:
     ```
     uid: [paste the UID here]
     email: "admin@arogyabmr.org"
     name: "Admin User"
     role: "admin"
     isActive: true
     createdAt: [click "timestamp" and use current time]
     permissions: [click "array" and add these strings]:
       - "read_users"
       - "write_users" 
       - "read_books"
       - "write_books"
       - "admin_dashboard"
     ```

### **4. Test the Setup**

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to: `http://localhost:3000/admin/login`

3. Login with your admin credentials

4. Should redirect to admin dashboard

## 🔧 **Alternative: Quick Firebase CLI Setup**

If you have Firebase CLI installed:

```bash
# Login and select project
firebase login
firebase use arogya-lib-ebd5e

# Create Firestore database (if not exists)
firebase firestore:databases:create --location=asia-south1

# Deploy rules
firebase deploy --only firestore:rules
```

## 📋 **Verification Checklist**

- [ ] Firebase project exists: `arogya-lib-ebd5e`
- [ ] Firestore database is created
- [ ] Security rules are deployed
- [ ] Authentication is enabled (Email/Password)
- [ ] Admin user exists in Authentication
- [ ] Admin user profile exists in Firestore `users` collection
- [ ] User has `role: "admin"` and `isActive: true`

## 🚨 **Common Issues & Solutions**

### **"Permission denied" errors:**
- Deploy Firestore rules: `firebase deploy --only firestore:rules`

### **"Database not found" errors:**
- Create Firestore database in Firebase Console

### **"User profile not found" errors:**
- Create user document in Firestore with correct UID

### **Still getting connection errors:**
- Check internet connection
- Verify Firebase project ID in environment variables
- Try clearing browser cache and cookies

## 📞 **Need Help?**

If you're still having issues:

1. Check Firebase Console for any error messages
2. Verify your project ID matches: `arogya-lib-ebd5e`
3. Make sure billing is enabled (required for Firestore)
4. Try creating a simple test document in Firestore Console

The main issue is that Firestore database needs to be created first before the app can connect to it!