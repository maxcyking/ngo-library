"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Search, 
  Calendar,
  User,
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { 
  collection, 
  getDocs, 
  query,
  orderBy,
  where,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { BookTransaction } from '@/lib/types';

export default function BookTransactionsPage() {
  const [transactions, setTransactions] = useState<BookTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { user } = useAuth();

  // Fetch transactions from Firebase
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Update overdue status
  useEffect(() => {
    const updateOverdueStatus = async () => {
      const now = new Date();
      for (const transaction of transactions) {
        if (transaction.status === 'issued' && transaction.dueDate < now) {
          try {
            await updateDoc(doc(db, 'bookTransactions', transaction.id), {
              status: 'overdue',
              updatedAt: serverTimestamp()
            });
          } catch (error) {
            console.error('Error updating overdue status:', error);
          }
        }
      }
      await fetchTransactions();
    };

    if (transactions.length > 0) {
      updateOverdueStatus();
    }
  }, [transactions.length]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.bookAuthor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'lost':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued':
        return <Clock className="w-4 h-4" />;
      case 'returned':
        return <CheckCircle className="w-4 h-4" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      case 'lost':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleReturnBook = async (transactionId: string) => {
    if (window.confirm('क्या आप इस पुस्तक की वापसी की पुष्टि करते हैं?')) {
      try {
        await updateDoc(doc(db, 'bookTransactions', transactionId), {
          status: 'returned',
          returnDate: new Date(),
          returnedBy: user?.email || 'unknown',
          updatedAt: serverTimestamp()
        });
        
        // Also need to update book's available copies count
        await fetchTransactions();
      } catch (error) {
        console.error('Error returning book:', error);
      }
    }
  };

  // Statistics
  const stats = {
    total: transactions.length,
    issued: transactions.filter(t => t.status === 'issued').length,
    overdue: transactions.filter(t => t.status === 'overdue').length,
    returned: transactions.filter(t => t.status === 'returned').length
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">लेन-देन लोड हो रहे हैं...</p>
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
                <Link href="/admin/books">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Calendar className="w-6 h-6 mr-2" />
                    पुस्तक लेन-देन
                  </h1>
                  <p className="text-gray-600">
                    कुल लेन-देन: {stats.total} | जारी: {stats.issued} | अतिदेय: {stats.overdue}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">कुल लेन-देन</p>
                    <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">जारी</p>
                    <p className="text-xl font-bold text-yellow-600">{stats.issued}</p>
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
                    <p className="text-xl font-bold text-red-600">{stats.overdue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">वापस</p>
                    <p className="text-xl font-bold text-green-600">{stats.returned}</p>
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
                      placeholder="छात्र का नाम, पुस्तक का नाम या लेखक से खोजें..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">सभी स्थितियां</option>
                    <option value="issued">जारी</option>
                    <option value="overdue">अतिदेय</option>
                    <option value="returned">वापस</option>
                    <option value="lost">खो गई</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {transaction.bookTitle}
                            </h3>
                            <Badge className={getStatusColor(transaction.status)}>
                              <span className="flex items-center space-x-1">
                                {getStatusIcon(transaction.status)}
                                <span>{transaction.status === 'issued' ? 'जारी' : 
                                       transaction.status === 'returned' ? 'वापस' : 
                                       transaction.status === 'overdue' ? 'अतिदेय' : 'खो गई'}</span>
                              </span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            लेखक: {transaction.bookAuthor}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {transaction.studentName}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              जारी: {transaction.issueDate.toLocaleDateString('hi-IN')}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              वापसी: {transaction.dueDate.toLocaleDateString('hi-IN')}
                            </span>
                            {transaction.returnDate && (
                              <span className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                वापस की: {transaction.returnDate.toLocaleDateString('hi-IN')}
                              </span>
                            )}
                          </div>
                          {transaction.fine && transaction.fine > 0 && (
                            <div className="mt-2">
                              <Badge className="bg-red-100 text-red-800">
                                जुर्माना: ₹{transaction.fine}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {(transaction.status === 'issued' || transaction.status === 'overdue') && (
                      <div className="mt-4 md:mt-0 md:ml-4">
                        <Button
                          onClick={() => handleReturnBook(transaction.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          वापसी की पुष्टि करें
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  कोई लेन-देन नहीं मिला
                </h3>
                <p className="text-gray-600 mb-4">
                  आपकी खोज के अनुसार कोई लेन-देन नहीं मिला।
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}>
                  सभी लेन-देन दिखाएं
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
