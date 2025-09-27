# Firebase Security Rules Documentation

## Overview
This document explains the Firebase security rules implemented for the एरोग्या पुस्तकालय एवं सेवा संस्था (Arogya Library and Service Organization) application.

## Firestore Database Rules

### Authentication & Authorization

#### Helper Functions
- `isAuthenticated()`: Checks if user is logged in
- `isAdmin()`: Verifies user has admin role and is active
- `isValidApplication()`: Validates application data structure
- `isValidStudent()`: Validates student data structure

### Collection-Level Security

#### Public Collections (Read Access)
- **books**: Public can browse library catalog
- **events**: Public can view events
- **newsArticles**: Public can read news
- **newsCategories**: Public can view categories
- **newsTags**: Public can view tags
- **media**: Public can view gallery
- **donations**: Public transparency for donations
- **bloodDonors**: Public access for emergency situations
- **financialDonors**: Public transparency
- **heroImages**: Public website display
- **uiContent**: Public website content

#### Admin-Only Collections
- **students**: Complete student records management
- **members**: Member management
- **transactions**: Library transaction records
- **bookTransactions**: Book lending history
- **settings**: System configuration
- **auditLogs**: System audit trail (read-only after creation)

#### Mixed Access Collections
- **library-applications**: 
  - Public can CREATE (submit applications)
  - Admins can READ/UPDATE/DELETE (manage applications)
- **inquiries**: 
  - Public can CREATE (submit contact forms)
  - Admins can READ/UPDATE/DELETE (manage inquiries)
- **users**: Authenticated users can manage their own records

### Data Validation Rules

#### Application Validation
Applications must include:
- `name` (non-empty string)
- `fatherHusbandName` (non-empty string)
- `phone` (non-empty string)
- `applicationType` ('library' or 'member')
- `status` ('pending', 'approved', or 'rejected')

New applications automatically set to 'pending' status.

#### Student Validation
Student records must include:
- `name` (non-empty string)
- `fatherHusbandName` (non-empty string)
- `phone` (non-empty string)
- `status` ('active', 'inactive', or 'suspended')

## Firebase Storage Rules

### File Type & Size Validation

#### Image Files
- **Allowed types**: image/* (JPEG, PNG, GIF, etc.)
- **Size limit**: 5MB
- **Used for**: Profile photos, signatures, hero images

#### Document Files
- **Allowed types**: image/* and application/pdf
- **Size limit**: 10MB
- **Used for**: Marksheets, certificates, documents

### Folder-Level Security

#### Public Read Access
- **hero-images**: Website hero images
- **news-images**: News article images
- **event-images**: Event photos
- **gallery**: Public gallery images

#### Admin-Only Access
- **student-profiles**: Student profile photos
- **student-signatures**: Student signatures
- **student-marksheets**: Student academic documents
- **member-photos**: Member photographs
- **book-images**: Book cover images
- **documents**: Administrative documents

#### Mixed Access (Application Uploads)
- **applications/profiles**: Public upload, admin read
- **applications/signatures**: Public upload, admin read
- **applications/marksheets**: Public upload, admin read

## Security Features

### 1. Role-Based Access Control
- **Public**: Can submit applications and view public content
- **Authenticated Users**: Can manage their own data
- **Admins**: Full access to student/member management

### 2. Data Integrity
- Required field validation
- Data type checking
- Status value constraints
- File type and size validation

### 3. Audit Trail
- Immutable audit logs
- Creation timestamps
- User attribution for changes

### 4. File Security
- File type restrictions
- Size limitations
- Organized folder structure
- Secure upload paths

## Production Deployment Checklist

### Before Going Live:
1. ✅ Remove development comments
2. ✅ Test all rule combinations
3. ✅ Verify admin user creation process
4. ✅ Test public application submission
5. ✅ Validate file upload restrictions
6. ✅ Check audit log functionality
7. ✅ Verify backup procedures

### Security Best Practices:
1. **Regular Rule Reviews**: Monthly security rule audits
2. **Admin Account Management**: Limit admin accounts, regular password updates
3. **File Monitoring**: Monitor storage usage and file types
4. **Access Logging**: Review audit logs regularly
5. **Backup Strategy**: Regular database and storage backups

## Common Use Cases

### Public User (Website Visitor)
```javascript
// Can submit library application
await addDoc(collection(db, 'library-applications'), applicationData);

// Can view public content
const books = await getDocs(collection(db, 'books'));
const events = await getDocs(collection(db, 'events'));
```

### Admin User
```javascript
// Can manage applications
await updateDoc(doc(db, 'library-applications', id), { status: 'approved' });

// Can manage students
await addDoc(collection(db, 'students'), studentData);

// Can view all data
const applications = await getDocs(collection(db, 'library-applications'));
```

### File Uploads
```javascript
// Public application upload
const storageRef = ref(storage, 'applications/profiles/photo.jpg');
await uploadBytes(storageRef, file);

// Admin student document upload
const storageRef = ref(storage, 'student-marksheets/document.pdf');
await uploadBytes(storageRef, file); // Requires admin authentication
```

## Error Handling

### Common Permission Errors
- `permission-denied`: User lacks required permissions
- `invalid-argument`: Data validation failed
- `unauthenticated`: User not logged in

### Troubleshooting
1. Check user authentication status
2. Verify user role in users collection
3. Validate data structure against rules
4. Check file type and size for uploads

## Monitoring & Maintenance

### Regular Tasks
- Monitor failed requests in Firebase Console
- Review storage usage and costs
- Update rules as application evolves
- Backup rule configurations

### Performance Considerations
- Rules are evaluated on every request
- Complex rules may impact performance
- Use indexes for frequently queried fields
- Monitor read/write operations

---

**Last Updated**: December 2024
**Version**: 1.0
**Maintained By**: Development Team