# Firestore Rules Setup Guide

## 🚨 Current Issue Resolution

The error "Missing or insufficient permissions" occurs because Firestore rules are not properly configured for the students collection. This guide will help you fix this issue.

## 🔧 Quick Fix (Development)

The current `firestore.rules` file has been updated with development-friendly rules that allow authenticated users to access all collections. This should resolve the immediate permission error.

### Deploy Development Rules
```bash
npm run deploy:rules
```

This will deploy permissive rules suitable for development and testing.

## 📋 Rule Files Explained

### 1. `firestore.rules` (Current - Development)
- **Permissive rules** for development
- Any authenticated user can read/write most collections
- Good for testing and development
- **⚠️ NOT suitable for production**

### 2. `firestore-production.rules` (Production Ready)
- **Secure rules** with proper role-based access
- Admin-only access for management operations
- Public read access for appropriate content
- **✅ Suitable for production**

### 3. `firestore-dev.rules` (Development Backup)
- Backup copy of development rules
- Same as current `firestore.rules`

## 🚀 Setup Instructions

### Step 1: Deploy Development Rules (Immediate Fix)
```bash
# Deploy current development rules
npm run deploy:rules

# Or manually with Firebase CLI
firebase deploy --only firestore:rules
```

### Step 2: Test the Fix
```bash
# Test admin features
npm run test:admin

# Start development server
npm run dev
```

### Step 3: Create Admin User (For Production Rules)
```bash
# Create admin user with default password
npm run setup:admin

# Or create with custom password
node scripts/setup-admin-user.js "YourSecurePassword123"
```

### Step 4: Deploy Production Rules (When Ready)
```bash
# Deploy production rules
npm run deploy:rules:prod
```

## 🔐 Rule Structure

### Development Rules (Current)
```javascript
// Students collection - Anyone authenticated can access
match /students/{studentId} {
  allow read, write, create, delete, list: if isAuthenticated();
}
```

### Production Rules
```javascript
// Students collection - Role-based access
match /students/{studentId} {
  allow read: if isActiveMember();
  allow write, create, delete, list: if isAdmin();
}
```

## 🛡️ Security Levels

### Development (Current)
- ✅ **Authentication required** for most operations
- ✅ **Public read** for hero images and UI content
- ⚠️ **Permissive write access** for authenticated users
- ❌ **No role-based restrictions**

### Production
- ✅ **Authentication required** for all operations
- ✅ **Role-based access control** (Admin/Member/Public)
- ✅ **Admin-only management** operations
- ✅ **Member access** to appropriate data
- ✅ **Public read** only for intended content

## 🔍 Troubleshooting

### Error: "Missing or insufficient permissions"

**Cause**: Firestore rules are too restrictive or not deployed

**Solutions**:
1. Deploy development rules: `npm run deploy:rules`
2. Check Firebase Authentication is working
3. Ensure user is logged in to admin panel
4. Verify Firebase project configuration

### Error: "Firebase CLI not found"

**Solution**:
```bash
npm install -g firebase-tools
firebase login
firebase init
```

### Error: "Project not initialized"

**Solution**:
```bash
firebase init firestore
# Select your project
# Use existing rules file
```

### Error: "Authentication failed"

**Solutions**:
1. Check `.env.local` file has correct Firebase config
2. Verify Firebase Authentication is enabled
3. Ensure Email/Password provider is enabled
4. Create admin user: `npm run setup:admin`

## 📊 Collection Access Matrix

| Collection | Public Read | Member Read | Admin Read | Admin Write |
|------------|-------------|-------------|------------|-------------|
| students | ❌ | ✅ | ✅ | ✅ |
| heroImages | ✅ | ✅ | ✅ | ✅ |
| uiContent | ✅ | ✅ | ✅ | ✅ |
| books | ❌ | ✅ | ✅ | ✅ |
| users | ❌ | Own Only | ✅ | ✅ |
| news | ✅ | ✅ | ✅ | ✅ |
| events | ✅ | ✅ | ✅ | ✅ |
| donations | ✅ | ✅ | ✅ | ✅ |

## 🎯 Next Steps

1. **Immediate**: Deploy development rules to fix permission error
2. **Testing**: Verify all admin features work correctly
3. **Production**: Create admin user and deploy production rules
4. **Security**: Review and customize rules for your specific needs

## 📞 Support Commands

```bash
# Deploy development rules (permissive)
npm run deploy:rules

# Deploy production rules (secure)
npm run deploy:rules:prod

# Create admin user
npm run setup:admin

# Test admin functionality
npm run test:admin

# Check Firebase project status
firebase projects:list

# View current rules
firebase firestore:rules
```

## ⚠️ Important Notes

1. **Development rules are permissive** - suitable for testing only
2. **Always use production rules** for live deployment
3. **Create admin user** before switching to production rules
4. **Test thoroughly** after deploying new rules
5. **Backup your data** before making rule changes

The development rules should resolve your immediate permission error. Once everything is working, you can transition to production rules for better security.