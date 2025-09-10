"use client";

import React, { useState } from 'react';
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
  Eye
} from 'lucide-react';
import Link from 'next/link';

// Sample data - यह बाद में Firebase से आएगा
const sampleBooks = [
  {
    id: '1',
    title: 'गीता रहस्य',
    author: 'बाल गंगाधर तिलक',
    category: 'धार्मिक साहित्य',
    isbn: '978-81-7055-000-1',
    language: 'हिन्दी',
    status: 'उपलब्ध',
    totalCopies: 5,
    availableCopies: 3,
    addedDate: '15 जनवरी 2023'
  },
  {
    id: '2',
    title: 'हरी घास के ये दिन',
    author: 'फणीश्वरनाथ रेणु',
    category: 'उपन्यास',
    isbn: '978-81-7178-000-2',
    language: 'हिन्दी',
    status: 'जारी',
    totalCopies: 3,
    availableCopies: 0,
    addedDate: '20 फरवरी 2023'
  },
  {
    id: '3',
    title: 'विज्ञान की कहानियाँ',
    author: 'जयंत नार्लीकर',
    category: 'विज्ञान',
    isbn: '978-81-7055-000-3',
    language: 'हिन्दी',
    status: 'उपलब्ध',
    totalCopies: 4,
    availableCopies: 4,
    addedDate: '10 मार्च 2023'
  }
];

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books] = useState(sampleBooks);
  const [selectedCategory, setSelectedCategory] = useState('सभी');

  const categories = ['सभी', 'धार्मिक साहित्य', 'उपन्यास', 'विज्ञान', 'इतिहास', 'बाल साहित्य'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);
    const matchesCategory = selectedCategory === 'सभी' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'उपलब्ध':
        return 'bg-green-100 text-green-800';
      case 'जारी':
        return 'bg-yellow-100 text-yellow-800';
      case 'अनुपलब्ध':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                    कुल पुस्तकें: {books.length}
                  </p>
                </div>
              </div>
              <Link href="/admin/books/add">
                <Button className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  नई पुस्तक जोड़ें
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
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
                      <Badge className={getStatusColor(book.status)}>
                        {book.status}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>ISBN:</strong> {book.isbn}</p>
                      <p><strong>भाषा:</strong> {book.language}</p>
                      <p><strong>कुल प्रतियाँ:</strong> {book.totalCopies}</p>
                      <p><strong>उपलब्ध:</strong> {book.availableCopies}</p>
                      <p><strong>जोड़ी गई:</strong> {book.addedDate}</p>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        विवरण देखें
                      </Button>
                      <Button size="sm" className="flex-1">
                        जारी करें
                      </Button>
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
      </div>
    </ProtectedRoute>
  );
}