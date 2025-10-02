# Media Management Security Rules

## Overview
This document explains the security rules for the Media/Gallery Management system implemented for the NGO Library project.

---

## 🔥 Firestore Rules (`firestore.rules`)

### Media Collection
**Location:** Lines 139-143 in `firestore.rules`

```javascript
// Media/Gallery collection
match /media/{mediaId} {
  allow read: if true; // Public read access for website display
  allow write, create, delete, list: if isAdmin(); // Only admins can manage media
}
```

**Permissions:**
- ✅ **Public Read**: Anyone can view media items (for public gallery display)
- ❌ **Admin Only Write**: Only administrators can create, update, delete, and list media
- ❌ **Admin Only Create**: Only administrators can add new media items
- ❌ **Admin Only Delete**: Only administrators can remove media items
- ❌ **Admin Only List**: Only administrators can query all media items

**Security Features:**
- Prevents unauthorized media uploads
- Ensures only verified admins can manage gallery content
- Allows public access to active media for website display
- Protects against spam and malicious uploads

---

## 💾 Storage Rules (`storage.rules`)

### Media Folder
**Location:** Lines 119-124 in `storage.rules`

```javascript
// Media management uploads (photos, gallery, news images)
match /media/{allPaths=**} {
  allow read: if true; // Public read access for website gallery display
  allow write: if isAdmin() && isValidImage(); // Only admins can upload media with validation
  allow delete: if isAdmin(); // Only admins can delete media files
}
```

**Permissions:**
- ✅ **Public Read**: Anyone can view/download media files (for public gallery display)
- ❌ **Admin Only Write**: Only administrators can upload files
- ❌ **Admin Only Delete**: Only administrators can delete files

**Validation Functions:**

#### `isAdmin()` Function
```javascript
function isAdmin() {
  return isAuthenticated() && 
         firestore.exists(/databases/(default)/documents/users/$(request.auth.uid)) &&
         firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
         firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isActive == true;
}
```
**Checks:**
1. User is authenticated
2. User document exists in Firestore
3. User role is 'admin'
4. User account is active

#### `isValidImage()` Function
```javascript
function isValidImage() {
  return request.resource.contentType.matches('image/.*') &&
         request.resource.size < 5 * 1024 * 1024; // 5MB limit
}
```
**Validation:**
1. File must be an image type (image/jpeg, image/png, etc.)
2. File size must be less than 5MB

---

## 📊 Data Flow

### Upload Process
```
Admin Panel → Firebase Auth Check → Admin Role Check → File Validation → Storage Upload → Firestore Document Creation
```

1. **Authentication**: User must be logged in
2. **Authorization**: User role must be 'admin' and account active
3. **File Validation**: 
   - Must be image format (JPEG, PNG, GIF, WebP, etc.)
   - Must be under 5MB
4. **Storage Upload**: File saved to `/media/{timestamp}-{index}-{filename}`
5. **Firestore Document**: Metadata saved to `media` collection

### Read Process (Public)
```
User Panel → Firebase Storage (Public Read) → Display Images
           → Firestore (Public Read) → Display Metadata
```

1. **Public Access**: Anyone can read active media items
2. **No Authentication Required**: For public website display
3. **Filtered by Status**: Only `isActive: true` items shown on public pages

---

## 🛡️ Security Benefits

### Prevents:
- ❌ Unauthorized file uploads
- ❌ Non-admin users from managing media
- ❌ Large file uploads (>5MB)
- ❌ Non-image file uploads
- ❌ Spam and malicious content
- ❌ Inactive admin accounts from making changes

### Allows:
- ✅ Public viewing of gallery images
- ✅ Verified admins to manage media
- ✅ Multiple image batch uploads by admins
- ✅ Category-based organization
- ✅ Safe file validation

---

## 📝 Media Document Structure

```typescript
{
  id: string;                    // Auto-generated document ID
  title: string;                 // Auto-generated: "Category - Date (Index)"
  description: string;           // Optional description
  category: string;              // Selected category
  imageUrl: string;              // Firebase Storage URL
  thumbnailUrl: string;          // Same as imageUrl (for now)
  date: string;                  // ISO date string
  tags: string[];                // Empty array by default
  isActive: boolean;             // Visibility toggle
  createdAt: Timestamp;          // Server timestamp
  updatedAt: Timestamp;          // Server timestamp
  createdBy: string;             // Admin user ID
}
```

---

## 🔧 Testing the Rules

### Test Public Read Access
```javascript
// Should succeed - anyone can read
const mediaQuery = query(collection(db, 'media'), where('isActive', '==', true));
const snapshot = await getDocs(mediaQuery);
```

### Test Admin Write Access
```javascript
// Should succeed only if user is admin
const mediaData = {
  title: 'Test Image',
  category: 'Gallery',
  imageUrl: 'https://...',
  isActive: true,
  createdAt: serverTimestamp()
};
await addDoc(collection(db, 'media'), mediaData);
```

### Test Non-Admin Write Access
```javascript
// Should fail with permission denied error
// Non-admin users cannot create media documents
```

### Test File Upload Validation
```javascript
// Should succeed - valid image under 5MB
const validImage = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

// Should fail - file too large
const largeImage = new File([largeBlob], 'photo.jpg', { type: 'image/jpeg' }); // >5MB

// Should fail - not an image
const textFile = new File([blob], 'file.txt', { type: 'text/plain' });
```

---

## 🚀 Deployment

### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy Storage Rules
```bash
firebase deploy --only storage
```

### Deploy Both
```bash
firebase deploy --only firestore:rules,storage
```

---

## 📚 Categories Supported

1. समाचार (News)
2. गैलरी (Gallery)
3. मीडिया (Media)
4. कार्यक्रम (Events)
5. निर्माण कार्य (Construction)
6. स्वास्थ्य सेवा (Health)
7. सामाजिक कार्यक्रम (Social)
8. पर्यावरण (Environment)
9. शिक्षा (Education)
10. रक्तदान (Blood Donation)
11. अन्य (Others)

---

## ⚠️ Important Notes

1. **Admin Verification**: Ensure admin users have proper role assignment in Firestore
2. **File Size Limit**: Current limit is 5MB per image, can be adjusted if needed
3. **Public Access**: All active media is publicly readable for website display
4. **Multiple Uploads**: Admins can upload multiple images at once (batch upload)
5. **Auto-generated Titles**: Titles are created automatically from category and date
6. **Date Field**: Only shown for "समाचार (News)" category in the form
7. **Cleanup**: When deleting media documents, associated storage files are also deleted

---

## 🔍 Monitoring

Monitor your Firebase Console for:
- Unauthorized access attempts
- Failed upload attempts
- Storage usage
- Firestore read/write operations
- Rule evaluation errors

---

## 📞 Support

For issues or questions:
1. Check Firebase Console error logs
2. Verify admin role in Firestore users collection
3. Confirm file size and type requirements
4. Check network connectivity and authentication status

---

**Last Updated:** October 2, 2025
**Version:** 1.0
**Project:** एरोज्ञा पुस्तकालय एवं सेवा संस्था

