"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Eye,
  UserPlus,
  RotateCcw,
  Calendar,
  Users,
  Archive,
  AlertTriangle,
  Tag
} from 'lucide-react';
import Link from 'next/link';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  where 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Book, BookTransaction } from '@/lib/types';
import { IssueBookModal } from '@/components/books/IssueBookModal';
import { ReturnBookModal } from '@/components/books/ReturnBookModal';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [transactions, setTransactions] = useState<BookTransaction[]>([]);
  const [categories, setCategories] = useState<string[]>(['सभी']);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('सभी');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  const { user } = useAuth();

  // Fetch books from Firebase
  const fetchBooks = async () => {
    try {
      const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const booksData: Book[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        booksData.push({ 
          id: doc.id, 
          ...data,
          addedDate: data.addedDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Book);
      });
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const q = query(collection(db, 'bookTransactions'), orderBy('issueDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const transactionsData: BookTransaction[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactionsData.push({ 
          id: doc.id, 
          ...data,
          issueDate: data.issueDate?.toDate() || new Date(),
          dueDate: data.dueDate?.toDate() || new Date(),
          returnDate: data.returnDate?.toDate() || null,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as BookTransaction);
      });
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const q = query(
        collection(db, 'book-categories'), 
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const categoriesData: string[] = ['सभी'];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categoriesData.push(data.name);
      });
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories(['सभी', 'धार्मिक साहित्य', 'उपन्यास', 'विज्ञान', 'इतिहास', 'बाल साहित्य', 'शैक्षणिक', 'तकनीकी']);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBooks(), fetchTransactions(), fetchCategories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.isbn && book.isbn.includes(searchQuery));
    const matchesCategory = selectedCategory === 'सभी' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getBookStatus = (book: Book) => {
    if (book.availableCopies === 0) return 'अनुपलब्ध';
    if (book.availableCopies < book.totalCopies) return 'आंशिक रूप से जारी';
    return 'उपलब्ध';
  };

  const getStatusColor = (book: Book) => {
    const status = getBookStatus(book);
    switch (status) {
      case 'उपलब्ध':
        return 'bg-green-100 text-green-800';
      case 'आंशिक रूप से जारी':
        return 'bg-yellow-100 text-yellow-800';
      case 'अनुपलब्ध':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm('क्या आप वाकई इस पुस्तक को हटाना चाहते हैं?')) {
      try {
        await deleteDoc(doc(db, 'books', bookId));
        await fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  // Statistics
  const stats = {
    totalBooks: books.length,
    totalCopies: books.reduce((sum, book) => sum + book.totalCopies, 0),
    availableCopies: books.reduce((sum, book) => sum + book.availableCopies, 0),
    issuedCopies: books.reduce((sum, book) => sum + book.issuedCopies, 0),
    overdueBooks: transactions.filter(t => t.status === 'overdue').length
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">पुस्तकें लोड हो रही हैं...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link href="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BookOpen className="w-6 h-6 mr-2" />
                    पुस्तक प्रबंधन
                  </h1>
                  <p className="text-gray-600">
                    कुल पुस्तकें: {stats.totalBooks} | उपलब्ध प्रतियाँ: {stats.availableCopies}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link href="/admin/books/categories">
                  <Button variant="outline" className="flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    श्रेणी प्रबंधन
                  </Button>
                </Link>
                <Link href="/admin/books/transactions">
                  <Button variant="outline" className="flex items-center">
                    <Archive className="w-4 h-4 mr-2" />
                    लेन-देन देखें
                  </Button>
                </Link>
                <Link href="/admin/books/add">
                  <Button className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    नई पुस्तक जोड़ें
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">कुल पुस्तकें</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalBooks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Archive className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">कुल प्रतियाँ</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalCopies}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">उपलब्ध</p>
                    <p className="text-xl font-bold text-green-600">{stats.availableCopies}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <UserPlus className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">जारी</p>
                    <p className="text-xl font-bold text-yellow-600">{stats.issuedCopies}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">अतिदेय</p>
                    <p className="text-xl font-bold text-red-600">{stats.overdueBooks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="पुस्तक का नाम, लेखक या ISBN से खोजें..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="पुस्तक श्रेणी फिल्टर"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Books List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {book.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {book.author}
                      </p>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <Button size="sm" variant="ghost" title="विवरण देखें">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="संपादित करें">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteBook(book.id)}
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">
                        {book.category}
                      </Badge>
                      <Badge className={getStatusColor(book)}>
                        {getBookStatus(book)}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      {book.isbn && <p><strong>ISBN:</strong> {book.isbn}</p>}
                      <p><strong>भाषा:</strong> {book.language}</p>
                      <p><strong>कुल प्रतियाँ:</strong> {book.totalCopies}</p>
                      <p><strong>उपलब्ध:</strong> <span className={`font-semibold ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>{book.availableCopies}</span></p>
                      <p><strong>जारी:</strong> {book.issuedCopies}</p>
                      <p><strong>जोड़ी गई:</strong> {book.addedDate.toLocaleDateString('hi-IN')}</p>
                      {book.location && <p><strong>स्थान:</strong> {book.location}</p>}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedBook(book);
                          // Navigate to book details page
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        विवरण
                      </Button>
                      {book.availableCopies > 0 ? (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedBook(book);
                            setShowIssueModal(true);
                          }}
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          जारी करें
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                          onClick={() => {
                            setSelectedBook(book);
                            setShowReturnModal(true);
                          }}
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          वापसी
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  कोई पुस्तक नहीं मिली
                </h3>
                <p className="text-gray-600 mb-4">
                  आपकी खोज के अनुसार कोई पुस्तक नहीं मिली।
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('सभी');
                }}>
                  सभी पुस्तकें दिखाएं
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modals */}
        {selectedBook && (
          <>
            <IssueBookModal
              book={selectedBook}
              isOpen={showIssueModal}
              onClose={() => {
                setShowIssueModal(false);
                setSelectedBook(null);
              }}
              onSuccess={() => {
                fetchBooks();
                fetchTransactions();
              }}
            />
            
            <ReturnBookModal
              book={selectedBook}
              isOpen={showReturnModal}
              onClose={() => {
                setShowReturnModal(false);
                setSelectedBook(null);
              }}
              onSuccess={() => {
                fetchBooks();
                fetchTransactions();
              }}
            />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}