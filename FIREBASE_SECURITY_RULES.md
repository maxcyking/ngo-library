# Firebase Security Rules for Settings System

## Overview
This document outlines the Firebase security rules implemented for the website settings system and related functionality.

## Firestore Security Rules

### Settings Collection Rules

#### 1. General Settings (`/settings/{settingId}`)
```javascript
// Website settings should be readable by all for public display
allow read: if settingId == 'website' || isAdmin();
// Only admins can modify settings
allow write, create, delete: if isAdmin();
// Only admins can list all settings
allow list: if isAdmin();
```

#### 2. Website Settings Document (`/settings/website`)
```javascript
allow read: if true; // Public read access for website display
allow write, update: if isAdmin() && isValidWebsiteSettings(request.resource.data);
allow create: if isAdmin() && isValidWebsiteSettings(request.resource.data);
allow delete: if false; // Website settings should never be deleted
```

#### 3. Website Settings Validation
```javascript
function isValidWebsiteSettings(data) {
  return data.keys().hasAll(['siteName', 'siteTitle', 'phone', 'email']) &&
         data.siteName is string && data.siteName.size() > 0 &&
         data.siteTitle is string && data.siteTitle.size() > 0 &&
         data.phone is string && data.phone.size() > 0 &&
         data.email is string && data.email.size() > 0 &&
         data.email.matches('.*@.*\\..*'); // Basic email validation
}
```

### Contact & Inquiry Rules

#### 1. Contact Form Submissions (`/contact-submissions/{submissionId}`)
```javascript
allow create: if isValidInquiry(request.resource.data); // Anyone can submit contact forms
allow read, list: if isAdmin(); // Only admins can view submissions
allow update: if isAdmin(); // Only admins can update (mark as read, etc.)
allow delete: if isAdmin(); // Only admins can delete submissions
```

#### 2. Inquiry Validation
```javascript
function isValidInquiry(data) {
  return data.keys().hasAll(['name', 'phone', 'subject', 'message']) &&
         data.name is string && data.name.size() > 0 && data.name.size() <= 100 &&
         data.phone is string && data.phone.size() > 0 && data.phone.size() <= 20 &&
         data.subject is string && data.subject.size() > 0 && data.subject.size() <= 200 &&
         data.message is string && data.message.size() > 0 && data.message.size() <= 1000 &&
         (!data.keys().hasAny(['email']) || (data.email is string && data.email.matches('.*@.*\\..*')));
}
```

### Audit Logging Rules

#### 1. Settings Change Logs (`/settingsLogs/{logId}`)
```javascript
allow read, list: if isAdmin(); // Only admins can read settings logs
allow create: if isAdmin() && isValidSettingsLog(request.resource.data); // Only admins can create settings logs
allow update, delete: if false; // Settings logs should not be modified or deleted
```

#### 2. Settings Log Validation
```javascript
function isValidSettingsLog(data) {
  return data.keys().hasAll(['action', 'settingKey', 'oldValue', 'newValue', 'timestamp', 'userId']) &&
         data.action in ['create', 'update', 'delete'] &&
         data.settingKey is string && data.settingKey.size() > 0 &&
         data.timestamp is timestamp &&
         data.userId is string && data.userId.size() > 0;
}
```

## Firebase Storage Rules

### Website Assets Rules

#### 1. Website Assets (`/website-assets/{allPaths=**}`)
```javascript
allow read: if true; // Public read access for website display
allow write: if isAdmin() && isValidImage(); // Only admins can upload website assets
allow delete: if isAdmin(); // Only admins can delete website assets
```

#### 2. Branding Assets (`/branding/{allPaths=**}`)
```javascript
allow read: if true; // Public read access
allow write: if isAdmin() && isValidImage(); // Only admins can manage branding
allow delete: if isAdmin();
```

#### 3. Settings-related Uploads (`/settings/{allPaths=**}`)
```javascript
allow read: if true; // Public read access for website display
allow write: if isAdmin() && isValidImage(); // Only admins can upload settings images
allow delete: if isAdmin(); // Only admins can delete settings images
```

### File Validation Functions

#### Image Validation
```javascript
function isValidImage() {
  return request.resource.contentType.matches('image/.*') &&
         request.resource.size < 5 * 1024 * 1024; // 5MB limit
}
```

#### Admin Check
```javascript
function isAdmin() {
  return isAuthenticated() && 
         firestore.exists(/databases/(default)/documents/users/$(request.auth.uid)) &&
         firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
         firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isActive == true;
}
```

## Security Features

### 1. **Public Access Control**
- Website settings are publicly readable for display purposes
- Contact forms can be submitted by anyone (with validation)
- Media assets are publicly accessible

### 2. **Admin-Only Operations**
- Only admins can modify website settings
- Only admins can view contact form submissions
- Only admins can upload website assets

### 3. **Data Validation**
- All settings must include required fields
- Email addresses are validated with regex
- File uploads are restricted by type and size
- Input length limits prevent abuse

### 4. **Audit Trail**
- All settings changes are logged
- Audit logs cannot be modified or deleted
- Comprehensive tracking of who changed what and when

### 5. **Rate Limiting & Abuse Prevention**
- File size limits (5MB for images)
- String length limits for all text fields
- Required field validation
- Type checking for all data

## Deployment Instructions

### 1. Deploy Firestore Rules
```bash
# Using Firebase CLI
firebase deploy --only firestore:rules

# Or using the deployment script
node scripts/deploy-firestore-rules.js
```

### 2. Deploy Storage Rules
```bash
# Using Firebase CLI
firebase deploy --only storage

# Or deploy all rules at once
firebase deploy --only firestore:rules,storage
```

### 3. Test Rules
```bash
# Run Firestore emulator with rules
firebase emulators:start --only firestore

# Test specific rules
firebase firestore:rules:test --test-file=tests/firestore-rules.test.js
```

## Testing Scenarios

### 1. **Settings Access Tests**
- ✅ Public can read website settings
- ✅ Admin can update website settings
- ❌ Non-admin cannot update settings
- ❌ Invalid data is rejected

### 2. **Contact Form Tests**
- ✅ Anyone can submit valid contact forms
- ✅ Admin can read submissions
- ❌ Invalid contact forms are rejected
- ❌ Non-admin cannot read submissions

### 3. **File Upload Tests**
- ✅ Admin can upload valid images
- ✅ Public can read uploaded assets
- ❌ Non-admin cannot upload files
- ❌ Invalid file types are rejected

### 4. **Audit Log Tests**
- ✅ Settings changes are logged
- ✅ Admin can read audit logs
- ❌ Audit logs cannot be modified
- ❌ Non-admin cannot read logs

## Security Best Practices

### 1. **Principle of Least Privilege**
- Users only get minimum required permissions
- Public access only where necessary
- Admin verification for sensitive operations

### 2. **Data Validation**
- All inputs are validated at the rule level
- Type checking and format validation
- Length limits to prevent abuse

### 3. **Audit Trail**
- All administrative actions are logged
- Immutable audit records
- Comprehensive change tracking

### 4. **File Security**
- File type restrictions
- Size limits to prevent abuse
- Admin-only upload for sensitive assets

## Monitoring & Alerts

### 1. **Firebase Console Monitoring**
- Monitor rule violations
- Track usage patterns
- Set up alerts for suspicious activity

### 2. **Custom Logging**
- Log all settings changes
- Monitor contact form submissions
- Track file upload patterns

### 3. **Security Alerts**
- Failed authentication attempts
- Rule violation attempts
- Unusual access patterns

## Production Considerations

### 1. **Environment-Specific Rules**
- Development rules are more permissive
- Production rules are stricter
- Staging environment for testing

### 2. **Performance Optimization**
- Efficient rule evaluation
- Minimal database reads in rules
- Cached admin status checks

### 3. **Backup & Recovery**
- Regular rule backups
- Version control for rule changes
- Rollback procedures

This security configuration ensures that the website settings system is secure, auditable, and follows Firebase security best practices while maintaining the necessary functionality for public website display and administrative management.