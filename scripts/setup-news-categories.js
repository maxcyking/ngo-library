const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'arogya-db');

// Default news categories
const defaultCategories = [
  {
    name: 'सामान्य समाचार',
    slug: 'general',
    description: 'सामान्य संस्था समाचार और अपडेट',
    color: '#3B82F6',
    icon: 'newspaper',
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'स्वास्थ्य सेवा',
    slug: 'health',
    description: 'स्वास्थ्य शिविर और चिकित्सा सेवाएं',
    color: '#10B981',
    icon: 'heart',
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'शिक्षा',
    slug: 'education',
    description: 'शैक्षणिक कार्यक्रम और पुस्तकालय',
    color: '#F59E0B',
    icon: 'book',
    isActive: true,
    sortOrder: 3
  },
  {
    name: 'कार्यक्रम',
    slug: 'events',
    description: 'आयोजन और सांस्कृतिक कार्यक्रम',
    color: '#8B5CF6',
    icon: 'calendar',
    isActive: true,
    sortOrder: 4
  },
  {
    name: 'पुस्तकालय',
    slug: 'library',
    description: 'पुस्तकालय संबंधी समाचार और अपडेट',
    color: '#3B82F6',
    icon: 'book-open',
    isActive: true,
    sortOrder: 5
  },
  {
    name: 'दान सेवा',
    slug: 'donations',
    description: 'रक्तदान और अन्य दान सेवाएं',
    color: '#EF4444',
    icon: 'heart',
    isActive: true,
    sortOrder: 6
  },
  {
    name: 'उपलब्धियां',
    slug: 'achievements',
    description: 'संस्था की उपलब्धियां और पुरस्कार',
    color: '#F97316',
    icon: 'trophy',
    isActive: true,
    sortOrder: 7
  },
  {
    name: 'घोषणाएं',
    slug: 'announcements',
    description: 'महत्वपूर्ण घोषणाएं और सूचनाएं',
    color: '#EC4899',
    icon: 'megaphone',
    isActive: true,
    sortOrder: 8
  }
];

// Default news tags
const defaultTags = [
  { name: 'स्वास्थ्य', slug: 'health', color: '#10B981', count: 0 },
  { name: 'रक्तदान', slug: 'blood-donation', color: '#EF4444', count: 0 },
  { name: 'पुस्तकालय', slug: 'library', color: '#3B82F6', count: 0 },
  { name: 'शिविर', slug: 'camp', color: '#8B5CF6', count: 0 },
  { name: 'सामुदायिक सेवा', slug: 'community-service', color: '#F59E0B', count: 0 },
  { name: 'शिक्षा', slug: 'education', color: '#F59E0B', count: 0 },
  { name: 'महिला सशक्तिकरण', slug: 'women-empowerment', color: '#EC4899', count: 0 },
  { name: 'युवा कार्यक्रम', slug: 'youth-program', color: '#8B5CF6', count: 0 },
  { name: 'पर्यावरण', slug: 'environment', color: '#10B981', count: 0 },
  { name: 'तकनीकी', slug: 'technology', color: '#6366F1', count: 0 }
];

async function setupNewsCategories() {
  try {
    console.log('Setting up news categories...');
    
    // Add categories
    for (const category of defaultCategories) {
      await addDoc(collection(db, 'newsCategories'), {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✓ Added category: ${category.name}`);
    }
    
    console.log('\nSetting up news tags...');
    
    // Add tags
    for (const tag of defaultTags) {
      await addDoc(collection(db, 'newsTags'), {
        ...tag,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✓ Added tag: ${tag.name}`);
    }
    
    console.log('\n🎉 News categories and tags setup completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Go to /admin/news to manage articles');
    console.log('2. Go to /admin/news/add to create new articles');
    console.log('3. Go to /admin/news/categories to manage categories and tags');
    console.log('4. Visit /news to see published articles');
    
  } catch (error) {
    console.error('Error setting up news categories:', error);
  }
}

// Check if this script is being run directly
if (require.main === module) {
  setupNewsCategories();
}

module.exports = { setupNewsCategories };
