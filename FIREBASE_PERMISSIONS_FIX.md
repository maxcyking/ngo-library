# Firebase Permissions Fix Guide

## Issue
You're getting `permission-denied` errors because the Firestore security rules don't allow public access to certain collections that the website needs to display dynamic content.

## Collections Affected
- `book-categories` - Used in library showcase
- `events` - Used in upcoming events section  
- `event-registrations` - Used to count registrations
- `work-areas` - Used in work areas section
- `testimonials` - Used in testimonials section
- `statistics` - Used for displaying stats

## Solution

### Step 1: Deploy Updated Firestore Rules

The `firestore.rules` file has been updated with the necessary permissions. Deploy it using:

```bash
# Option 1: Use the deployment script
node scripts/deploy-firestore-rules.js

# Option 2: Deploy manually
firebase deploy --only firestore:rules
```

### Step 2: Verify Firebase Project Setup

Make sure you're connected to the correct Firebase project:

```bash
# Check current project
firebase projects:list

# Set the correct project if needed
firebase use your-project-id

# Login if needed
firebase login
```

### Step 3: Test the Website

After deploying the rules, the website should:
- ✅ Load book categories dynamically in the library section
- ✅ Display upcoming events from the database
- ✅ Show real registration counts
- ✅ Load other dynamic content without permission errors

## Updated Rules Summary

The updated rules now allow:

```javascript
// Book categories - Public read access
match /book-categories/{categoryId} {
  allow read: if true; // Anyone can read categories
  allow write, create, delete, list: if isAdmin(); // Only admins can manage
}

// Events - Public read access  
match /events/{eventId} {
  allow read: if true; // Anyone can read events
  allow write, create, delete, list: if isAdmin(); // Only admins can manage
}

// Event registrations - Authenticated access
match /event-registrations/{registrationId} {
  allow read, write, create, delete, list: if isAuthenticated();
}

// Work areas - Public read access
match /work-areas/{areaId} {
  allow read: if true; // Anyone can read work areas
  allow write, create, delete, list: if isAdmin(); // Only admins can manage
}

// Testimonials - Public read access
match /testimonials/{testimonialId} {
  allow read: if true; // Anyone can read testimonials  
  allow write, create, delete, list: if isAdmin(); // Only admins can manage
}

// Statistics - Public read access
match /statistics/{statId} {
  allow read: if true; // Anyone can read statistics
  allow write, create, delete, list: if isAdmin(); // Only admins can manage
}
```

## Fallback Behavior

If the database is still not accessible, the components now show sample data instead of empty states:

- **Library Showcase**: Shows sample book categories
- **Upcoming Events**: Shows sample events with realistic data
- **Other Components**: Gracefully handle permission errors

## Security Notes

- ✅ Public collections only allow **read** access to anonymous users
- ✅ **Write/Create/Delete** operations still require admin authentication
- ✅ Sensitive collections (users, applications, etc.) remain protected
- ✅ Admin-only collections are still secure

## Troubleshooting

If you still see permission errors:

1. **Check Firebase Console**: Go to Firestore → Rules and verify the rules are deployed
2. **Clear Browser Cache**: Hard refresh the website (Ctrl+F5)
3. **Check Network Tab**: Look for specific permission errors in browser dev tools
4. **Verify Project**: Make sure you're using the correct Firebase project

## Next Steps

1. Deploy the updated Firestore rules
2. Test the website functionality
3. Add real data through the admin panel
4. Monitor for any remaining permission issues

The website should now load all dynamic content properly! 🎉