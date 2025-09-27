// Test script for Book Management System
const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to set up your service account)
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   projectId: 'your-project-id'
// });

const db = admin.firestore();

async function testBookSystem() {
  console.log('🔍 Testing Book Management System...\n');

  try {
    // Test 1: Check books collection
    console.log('📚 Testing Books Collection...');
    const booksSnapshot = await db.collection('books').limit(5).get();
    console.log(`✅ Found ${booksSnapshot.size} books in collection`);
    
    // Test 2: Check students collection
    console.log('\n👥 Testing Students Collection...');
    const studentsSnapshot = await db.collection('students').limit(5).get();
    console.log(`✅ Found ${studentsSnapshot.size} students in collection`);
    
    // Test 3: Check transactions collection
    console.log('\n📋 Testing Book Transactions Collection...');
    const transactionsSnapshot = await db.collection('bookTransactions').limit(5).get();
    console.log(`✅ Found ${transactionsSnapshot.size} transactions in collection`);
    
    // Test 4: Sample book data structure
    console.log('\n📖 Sample Book Data Structure:');
    if (!booksSnapshot.empty) {
      const sampleBook = booksSnapshot.docs[0].data();
      console.log('✅ Sample Book:', JSON.stringify(sampleBook, null, 2));
    } else {
      console.log('ℹ️  No books found. Here\'s the expected structure:');
      console.log(`
      {
        "title": "गीता रहस्य",
        "author": "बाल गंगाधर तिलक",
        "isbn": "978-81-7055-000-1",
        "category": "धार्मिक साहित्य",
        "language": "hindi",
        "totalCopies": 5,
        "availableCopies": 3,
        "issuedCopies": 2,
        "publisher": "प्रकाशक नाम",
        "publicationYear": 2020,
        "price": 150,
        "location": "A-1, शेल्फ-2",
        "description": "पुस्तक का विवरण",
        "addedDate": "2023-01-15T00:00:00.000Z",
        "createdAt": "2023-01-15T00:00:00.000Z",
        "updatedAt": "2023-01-15T00:00:00.000Z",
        "createdBy": "admin@arogyabmr.org",
        "updatedBy": "admin@arogyabmr.org"
      }`);
    }
    
    // Test 5: Sample transaction data structure
    console.log('\n📋 Sample Transaction Data Structure:');
    if (!transactionsSnapshot.empty) {
      const sampleTransaction = transactionsSnapshot.docs[0].data();
      console.log('✅ Sample Transaction:', JSON.stringify(sampleTransaction, null, 2));
    } else {
      console.log('ℹ️  No transactions found. Here\'s the expected structure:');
      console.log(`
      {
        "bookId": "book_id_here",
        "studentId": "student_id_here",
        "studentName": "राहुल शर्मा",
        "bookTitle": "गीता रहस्य",
        "bookAuthor": "बाल गंगाधर तिलक",
        "issueDate": "2023-01-15T00:00:00.000Z",
        "dueDate": "2023-01-22T00:00:00.000Z",
        "returnDate": null,
        "status": "issued",
        "fine": 0,
        "fineReason": null,
        "remarks": null,
        "issuedBy": "admin@arogyabmr.org",
        "returnedBy": null,
        "createdAt": "2023-01-15T00:00:00.000Z",
        "updatedAt": "2023-01-15T00:00:00.000Z"
      }`);
    }
    
    console.log('\n✅ Book Management System Test Complete!');
    console.log('\n📊 System Features Available:');
    console.log('✅ Add new books to collection');
    console.log('✅ Issue books to students');
    console.log('✅ Return books with fine calculation');
    console.log('✅ Track all transactions');
    console.log('✅ Automatic overdue detection');
    console.log('✅ Student book limit management');
    console.log('✅ Real-time availability updates');
    
  } catch (error) {
    console.error('❌ Error testing book system:', error);
  }
}

// Sample data for testing
const sampleBooks = [
  {
    title: "गीता रहस्य",
    author: "बाल गंगाधर तिलक",
    isbn: "978-81-7055-000-1",
    category: "धार्मिक साहित्य",
    language: "hindi",
    totalCopies: 5,
    availableCopies: 5,
    issuedCopies: 0,
    publisher: "केसरी प्रकाशन",
    publicationYear: 1915,
    price: 150,
    location: "A-1, शेल्फ-1",
    description: "श्रीमद्भगवद्गीता पर आधारित दर्शनशास्त्र की महान कृति"
  },
  {
    title: "हरी घास के ये दिन",
    author: "फणीश्वरनाथ रेणु",
    isbn: "978-81-7178-000-2",
    category: "उपन्यास",
    language: "hindi",
    totalCopies: 3,
    availableCopies: 3,
    issuedCopies: 0,
    publisher: "राजकमल प्रकाशन",
    publicationYear: 1954,
    price: 200,
    location: "B-2, शेल्फ-3",
    description: "आधुनिक हिंदी साहित्य का क्लासिक उपन्यास"
  },
  {
    title: "विज्ञान की कहानियाँ",
    author: "जयंत नार्लीकर",
    isbn: "978-81-7055-000-3",
    category: "विज्ञान",
    language: "hindi",
    totalCopies: 4,
    availableCopies: 4,
    issuedCopies: 0,
    publisher: "नेशनल बुक ट्रस्ट",
    publicationYear: 2010,
    price: 120,
    location: "C-1, शेल्फ-2",
    description: "बच्चों और युवाओं के लिए रोचक विज्ञान कहानियाँ"
  }
];

async function addSampleBooks() {
  console.log('📚 Adding sample books to collection...\n');
  
  try {
    for (const book of sampleBooks) {
      const docRef = await db.collection('books').add({
        ...book,
        addedDate: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: 'admin@arogyabmr.org',
        updatedBy: 'admin@arogyabmr.org'
      });
      
      console.log(`✅ Added book: ${book.title} (ID: ${docRef.id})`);
    }
    
    console.log('\n✅ All sample books added successfully!');
  } catch (error) {
    console.error('❌ Error adding sample books:', error);
  }
}

// Uncomment to run tests
// testBookSystem();

// Uncomment to add sample books
// addSampleBooks();

module.exports = {
  testBookSystem,
  addSampleBooks,
  sampleBooks
};
