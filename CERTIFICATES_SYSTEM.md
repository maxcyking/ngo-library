# Certificates Management System

## Overview
The certificates system allows the organization to manage and display certificates, awards, and recognitions. It includes both user-facing display pages and admin management functionality.

## Features

### 1. **User Certificate Gallery** (`/user/certificates`)
- **Public Display**: View all active certificates
- **Search & Filter**: Search by title, description, or issuer
- **Category Filtering**: Filter by certificate type
- **Download Functionality**: Download certificate images
- **Modal View**: Full-screen certificate viewing
- **Responsive Design**: Works on all devices

### 2. **Admin Certificate Management** (`/admin/certificates`)
- **CRUD Operations**: Create, Read, Update, Delete certificates
- **Image Management**: Upload and manage certificate images
- **Category Management**: Organize certificates by type
- **Status Control**: Activate/deactivate certificates
- **Validation**: Form validation and data integrity
- **Search & Filter**: Admin search and filtering tools

## Certificate Categories

1. **उपलब्धि प्रमाणपत्र** (Achievement Certificates)
2. **सहभागिता प्रमाणपत्र** (Participation Certificates)
3. **प्रशंसा प्रमाणपत्र** (Appreciation Certificates)
4. **पूर्णता प्रमाणपत्र** (Completion Certificates)
5. **मान्यता प्रमाणपत्र** (Recognition Certificates)

## Database Structure

### Certificates Collection (`certificates`)
```json
{
  "id": "auto-generated",
  "title": "Certificate Title",
  "description": "Optional description",
  "imageUrl": "https://example.com/certificate.jpg",
  "category": "achievement|participation|appreciation|completion|recognition",
  "issueDate": "2024-01-01T00:00:00Z",
  "issuedBy": "Organization Name",
  "certificateNumber": "CERT-2024-001",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "createdBy": "admin@example.com"
}
```

## Security Rules

### Firestore Rules
```javascript
// Certificates collection
match /certificates/{certificateId} {
  allow read: if true; // Public read access
  allow list: if true; // Public list access
  allow write, create, update: if isAdmin() && isValidCertificate(request.resource.data);
  allow delete: if isAdmin();
}

function isValidCertificate(data) {
  return data.keys().hasAll(['title', 'imageUrl', 'category', 'issueDate', 'issuedBy', 'isActive']) &&
         data.title is string && data.title.size() > 0 && data.title.size() <= 200 &&
         data.imageUrl is string && data.imageUrl.size() > 0 &&
         data.category in ['achievement', 'participation', 'appreciation', 'completion', 'recognition'] &&
         data.issueDate is timestamp &&
         data.issuedBy is string && data.issuedBy.size() > 0 && data.issuedBy.size() <= 100 &&
         data.isActive is bool;
}
```

### Storage Rules
```javascript
// Certificate images
match /certificates/{allPaths=**} {
  allow read: if true; // Public read access
  allow write: if isAdmin() && isValidImage(); // Admin only upload
  allow delete: if isAdmin();
}
```

## API Usage

### Fetching Certificates (User Page)
```typescript
const fetchCertificates = async () => {
  const certificatesRef = collection(db, 'certificates');
  const q = query(
    certificatesRef,
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const certificates = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    issueDate: doc.data().issueDate?.toDate(),
    createdAt: doc.data().createdAt?.toDate()
  }));
  
  return certificates;
};
```

### Adding Certificate (Admin)
```typescript
const addCertificate = async (certificateData) => {
  await addDoc(collection(db, 'certificates'), {
    ...certificateData,
    issueDate: new Date(certificateData.issueDate),
    createdAt: serverTimestamp(),
    createdBy: user?.email || 'unknown'
  });
};
```

### Updating Certificate (Admin)
```typescript
const updateCertificate = async (certificateId, certificateData) => {
  await updateDoc(doc(db, 'certificates', certificateId), {
    ...certificateData,
    updatedAt: serverTimestamp()
  });
};
```

## Navigation Updates

### Public Navigation
- Replaced "कार्य क्षेत्र" with "प्रमाणपत्र" linking to `/user/certificates`

### User Navigation
- Added "प्रमाणपत्र" link to `/user/certificates`

### Admin Navigation
- Added "प्रमाणपत्र प्रबंधन" link to `/admin/certificates`

## File Structure
```
src/
├── app/
│   ├── user/
│   │   ├── certificates/
│   │   │   └── page.tsx          # User certificate gallery
│   │   └── layout.tsx            # User layout
│   └── admin/
│       └── certificates/
│           └── page.tsx          # Admin certificate management
├── lib/
│   └── constants.ts              # Updated navigation constants
└── docs/
    └── CERTIFICATES_SYSTEM.md    # This documentation
```

## Features in Detail

### User Certificate Gallery
1. **Grid Layout**: Responsive grid showing certificate thumbnails
2. **Search Functionality**: Real-time search across title, description, issuer
3. **Category Filter**: Dropdown to filter by certificate category
4. **Certificate Cards**: Show title, category, issue date, issuer
5. **Modal View**: Click to view full-size certificate
6. **Download Feature**: Download certificate images directly
7. **Loading States**: Proper loading indicators
8. **Error Handling**: Graceful error handling for missing images

### Admin Management Panel
1. **Dashboard View**: Overview of all certificates with admin controls
2. **Add/Edit Form**: Comprehensive form for certificate management
3. **Image Preview**: Live preview of certificate images
4. **Validation**: Client and server-side validation
5. **Status Management**: Toggle active/inactive status
6. **Bulk Operations**: Search and filter for bulk management
7. **Audit Trail**: Track who created/modified certificates
8. **Responsive Design**: Works on all screen sizes

## Validation Rules

### Client-Side Validation
- **Title**: Required, 1-200 characters
- **Image URL**: Required, valid URL format
- **Category**: Required, must be from predefined list
- **Issue Date**: Required, valid date
- **Issued By**: Required, 1-100 characters
- **Description**: Optional, max 1000 characters
- **Certificate Number**: Optional, max 50 characters

### Server-Side Validation (Firestore Rules)
- All required fields must be present
- Data types must match specifications
- String length limits enforced
- Category must be from allowed values
- Boolean fields properly validated

## Security Features

1. **Role-Based Access**: Only admins can manage certificates
2. **Public Read Access**: Certificates are publicly viewable
3. **Input Validation**: Comprehensive validation on all inputs
4. **File Type Restrictions**: Only images allowed for certificates
5. **Size Limits**: File size restrictions in storage rules
6. **Audit Logging**: Track all certificate operations

## Usage Instructions

### For Admins
1. **Adding Certificates**:
   - Go to `/admin/certificates`
   - Click "नया प्रमाणपत्र जोड़ें"
   - Fill in all required fields
   - Upload image URL
   - Set category and status
   - Click "सेव करें"

2. **Managing Certificates**:
   - Use search and filter to find certificates
   - Click "संपादित" to edit
   - Click "डिलीट" to delete (with confirmation)
   - Toggle active status as needed

### For Users
1. **Viewing Certificates**:
   - Go to `/user/certificates`
   - Browse all available certificates
   - Use search to find specific certificates
   - Filter by category
   - Click "देखें" for full view
   - Click "डाउनलोड" to save certificate

## Future Enhancements

1. **File Upload**: Direct file upload instead of URL
2. **Bulk Import**: CSV/Excel import for multiple certificates
3. **Templates**: Certificate templates for consistent design
4. **Digital Signatures**: Add digital signature verification
5. **QR Codes**: Generate QR codes for certificate verification
6. **Email Integration**: Send certificates via email
7. **Print Optimization**: Better print layouts
8. **Multi-language**: Support for multiple languages
9. **Certificate Builder**: Visual certificate creation tool
10. **Analytics**: Track certificate views and downloads

## Troubleshooting

### Common Issues
1. **Images not loading**: Check image URL validity and accessibility
2. **Upload failures**: Verify admin permissions and file size limits
3. **Search not working**: Check Firestore indexes and query limits
4. **Download issues**: Verify CORS settings for external images

### Error Messages
- "प्रमाणपत्र लोड करने में त्रुटि हुई": Database connection or permission issue
- "कृपया शीर्षक और छवि URL भरें": Required field validation
- "प्रमाणपत्र सेव करने में त्रुटि हुई": Database write permission or validation error

This certificates system provides a comprehensive solution for managing and displaying organizational certificates while maintaining security and user experience standards.