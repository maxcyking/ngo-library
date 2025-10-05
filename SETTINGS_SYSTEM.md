# Website Settings System

## Overview
The website settings system allows administrators to manage all website configuration from a centralized admin panel. This includes basic information, contact details, social media links, organization details, and SEO settings.

## Features

### 1. Basic Information
- Site name and title
- Tagline and description
- Logo and favicon URLs
- Real-time preview

### 2. Contact Information
- Phone and WhatsApp numbers
- Email address
- Physical address
- Google Maps integration (link and iframe)
- Office and library hours

### 3. Social Media Links
- Facebook, Instagram, Twitter, YouTube, LinkedIn
- Automatically displayed in header and footer
- Icons with proper accessibility attributes

### 4. Organization Details
- Establishment year and registration number
- Leadership positions (Chairman, Vice-Chairman, Secretary)
- Emergency contact information
- Bank details for donations (Bank name, Account number, IFSC, UPI)

### 5. SEO Settings
- Meta keywords
- Google Analytics integration
- Google Search Console verification
- Bing Webmaster verification
- Dynamic structured data generation

## Technical Implementation

### Settings Context
- `src/contexts/SettingsContext.tsx` - Provides settings throughout the app
- Real-time updates using Firestore listeners
- Default fallback values

### Admin Interface
- `src/app/admin/settings/page.tsx` - Comprehensive admin panel
- Tabbed interface for different setting categories
- Form validation and error handling
- Live preview of changes

### Dynamic Integration
- `src/components/seo/DynamicMetadata.tsx` - Updates page metadata dynamically
- `src/lib/seo.ts` - SEO utilities and structured data generation
- Automatic Google Analytics injection

### Usage in Components
```tsx
import { useSettings } from '@/contexts/SettingsContext';

function MyComponent() {
  const { settings, loading } = useSettings();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{settings.siteName}</h1>
      <p>{settings.tagline}</p>
    </div>
  );
}
```

## Database Structure
Settings are stored in Firestore under the `settings/website` document with the following structure:

```json
{
  "siteName": "एरोग्या पुस्तकालय एवं सेवा संस्था",
  "siteTitle": "एरोग्या पुस्तकालय एवं सेवा संस्था - बाड़मेर राजस्थान",
  "tagline": "समाज सेवा में समर्पित",
  "description": "Website description...",
  "logo": "https://example.com/logo.png",
  "favicon": "https://example.com/favicon.ico",
  "phone": "+91 9024635808",
  "whatsapp": "+91 9024635808",
  "email": "arogyapustkalaya@gmail.com",
  "address": "मालियों की ढाणी, आरजीटी सर्कल,नगर तहसील - गुडामालानी जिला बाडमेर राजस्थान 344031
",
  "mapLink": "https://maps.google.com/...",
  "mapIframe": "<iframe src='...'></iframe>",
  "facebook": "https://facebook.com/page",
  "instagram": "https://instagram.com/account",
  "twitter": "https://twitter.com/account",
  "youtube": "https://youtube.com/channel",
  "linkedin": "https://linkedin.com/company",
  "establishedYear": "2020",
  "registrationNumber": "REG/2020/12345",
  "chairperson": " आत्माराम बोरा",
  "viceChairperson": " बाबूराम शर्मा",
  "secretary": "Secretary Name",
  "officeHours": "सुबह 9:00 से शाम 6:00 तक",
  "libraryHours": "सुबह 9:00 से शाम 6:00 तक",
  "metaKeywords": "keywords, separated, by, commas",
  "googleAnalytics": "G-XXXXXXXXXX",
  "googleVerification": "verification-code",
  "bingVerification": "verification-code",
  "emergencyContact": " आत्माराम बोरा",
  "emergencyPhone": "+91 9024635808",
  "bankName": "Bank Name",
  "accountNumber": "1234567890",
  "ifscCode": "BANK0123456",
  "upiId": "organization@upi",
  "updatedAt": "2024-01-01T00:00:00Z",
  "updatedBy": "admin@example.com"
}
```

## Security
- Only admin users can access the settings page
- All changes are logged with timestamp and user information
- Input validation and sanitization
- Protected routes with authentication

## Components Updated
- Header: Uses dynamic logo, site name, and contact info
- Footer: Uses dynamic contact info, social links, and organization details
- Contact Page: Uses dynamic contact information, map, and bank details
- Layout: Dynamic metadata and structured data

## Benefits
1. **Centralized Management**: All website settings in one place
2. **Real-time Updates**: Changes reflect immediately across the site
3. **SEO Optimization**: Dynamic meta tags and structured data
4. **User-Friendly**: Intuitive admin interface with preview
5. **Scalable**: Easy to add new settings as needed
6. **Secure**: Proper authentication and validation

## Future Enhancements
- Image upload functionality for logo and favicon
- Theme customization options
- Multi-language support
- Backup and restore functionality
- Settings import/export
- Advanced SEO tools integration