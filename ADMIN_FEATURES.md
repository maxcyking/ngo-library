# Admin Panel Features

## Overview
The admin panel now includes comprehensive management features for students, UI elements, and content management.

## New Features Added

### 1. Student Management System
- **Location**: `/admin/members`
- **Features**:
  - Add new students with complete profile information
  - Upload profile photos (file upload or URL)
  - View, edit, and delete student records
  - Filter students by status and membership type
  - Track books issued, total books read, and fine amounts
  - Manage student status (active, inactive, banned, graduated)
  - Guardian and emergency contact information

### 2. UI Management System
- **Location**: `/admin/ui`
- **Features**:
  - **Hero Section Management**:
    - Upload hero images for homepage
    - Support for both file upload and URL input
    - Image ordering and activation/deactivation
    - Edit image titles and descriptions
  - **About Section Content**:
    - Manage organization description
    - Mission and vision statements
  - **Contact Information**:
    - Organization details
    - Contact information
    - Social media links
    - Operating hours

### 3. Enhanced Firebase Integration
- **Storage**: Configured for image uploads
- **Firestore**: Updated rules for new collections
- **Collections Added**:
  - `students` - Student records
  - `heroImages` - Homepage hero images
  - `uiContent` - Website content management

### 4. Utility Functions
- **File Upload Utils**: `src/lib/storage-utils.ts`
  - File validation
  - Image compression
  - Secure file naming
  - Storage management

## File Structure

```
src/
├── app/admin/
│   ├── members/
│   │   ├── page.tsx          # Student list and management
│   │   ├── add/page.tsx      # Add new student
│   │   └── [id]/page.tsx     # Student details and editing
│   ├── ui/
│   │   └── page.tsx          # UI management (hero, about, contact)
│   └── dashboard/page.tsx    # Updated dashboard with new stats
├── lib/
│   ├── firebase.ts           # Firebase configuration
│   └── storage-utils.ts      # File upload utilities
└── components/
    └── ui/                   # Reusable UI components
```

## Usage Instructions

### Adding a New Student
1. Navigate to `/admin/members`
2. Click "नया छात्र जोड़ें" (Add New Student)
3. Fill in required information:
   - Name (required)
   - Roll Number (required)
   - Phone (required)
   - Course (required)
4. Optional information:
   - Profile photo (upload or URL)
   - Guardian details
   - Emergency contacts
   - Personal information
5. Click "छात्र जोड़ें" (Add Student)

### Managing Hero Images
1. Navigate to `/admin/ui`
2. Select "हीरो सेक्शन" tab
3. Click "नई इमेज जोड़ें" (Add New Image)
4. Choose upload method:
   - **File Upload**: Select image file from computer
   - **URL**: Enter image URL
5. Add title, description, and order number
6. Click "जोड़ें" (Add)

### Student Status Management
- **Active**: Student can access library services
- **Inactive**: Temporarily suspended
- **Banned**: Permanently restricted
- **Graduated**: Completed studies

### File Upload Guidelines
- **Supported formats**: JPEG, PNG, GIF, WebP
- **Maximum size**: 5MB per file
- **Automatic compression**: Images are optimized for web
- **Secure storage**: Files stored in Firebase Storage

## Security Features
- **Admin-only access**: All management features require admin authentication
- **Firestore rules**: Strict access control for data security
- **File validation**: Prevents malicious file uploads
- **Audit trail**: Track who made changes and when

## Technical Details

### Firebase Collections
```javascript
// Students collection structure
{
  name: string,
  email: string,
  phone: string,
  rollNumber: string,
  course: string,
  status: 'active' | 'inactive' | 'banned' | 'graduated',
  membershipType: 'basic' | 'premium' | 'lifetime',
  profileImage?: string,
  booksIssued: number,
  totalBooksRead: number,
  fineAmount: number,
  // ... other fields
}

// Hero images collection structure
{
  title: string,
  description: string,
  imageUrl: string,
  isActive: boolean,
  order: number,
  uploadType: 'file' | 'url',
  createdAt: timestamp,
  createdBy: string
}
```

### Environment Variables Required
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Deployment

### Firestore Rules
Deploy updated rules:
```bash
npm run deploy:rules
# or
node scripts/deploy-rules.js
```

### Full Deployment
```bash
npm run build
npm run deploy
```

## Future Enhancements
- Bulk student import/export
- Advanced search and filtering
- Student performance analytics
- Automated fine calculations
- Email notifications
- Mobile app integration

## Support
For technical support or feature requests, contact the development team.