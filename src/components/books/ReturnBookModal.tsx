"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, 
  Search, 
  RotateCcw, 
  Calendar,
  BookOpen,
  User,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Book, BookTransaction } from '@/lib/types';

interface ReturnBookModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReturnBookModal: React.FC<ReturnBookModalProps> = ({
  book,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [issuedTransactions, setIssuedTransactions] = useState<BookTransaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<BookTransaction | null>(null);
  const [fine, setFine] = useState('0');
  const [fineReason, setFineReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  
  const { user } = useAuth();

  // Fetch issued transactions for this book
  useEffect(() => {
    if (isOpen) {
      fetchIssuedTransactions();
    }
  }, [isOpen, book.id]);

  const fetchIssuedTransactions = async () => {
    try {
      setTransactionsLoading(true);
      const q = query(
        collection(db, 'bookTransactions'),
        where('bookId', '==', book.id),
        where('status', 'in', ['issued', 'overdue'])
      );
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
      setIssuedTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching issued transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const calculateAutoFine = (transaction: BookTransaction) => {
    const now = new Date();
    const dueDate = transaction.dueDate;
    
    if (now <= dueDate) return 0;
    
    const daysLate = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const finePerDay = 2; // ₹2 per day
    return daysLate * finePerDay;
  };

  const handleTransactionSelect = (transaction: BookTransaction) => {
    setSelectedTransaction(transaction);
    const autoFine = calculateAutoFine(transaction);
    setFine(autoFine.toString());
    if (autoFine > 0) {
      setFineReason(`${Math.ceil((new Date().getTime() - transaction.dueDate.getTime()) / (1000 * 60 * 60 * 24))} दिन देर से वापसी`);
    } else {
      setFineReason('');
    }
  };

  const handleReturnBook = async () => {
    if (!selectedTransaction) {
      alert('कृपया एक लेन-देन का चयन करें');
      return;
    }

    setLoading(true);

    try {
      const fineAmount = parseFloat(fine) || 0;
      
      // Update transaction
      await updateDoc(doc(db, 'bookTransactions', selectedTransaction.id), {
        status: 'returned',
        returnDate: new Date(),
        fine: fineAmount,
        fineReason: fineReason || null,
        remarks: remarks || null,
        returnedBy: user?.email || 'unknown',
        updatedAt: serverTimestamp()
      });

      // Update book availability
      await updateDoc(doc(db, 'books', book.id), {
        availableCopies: book.availableCopies + 1,
        issuedCopies: book.issuedCopies - 1,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || 'unknown'
      });

      // Update student's book count and fine
      const studentQuery = query(
        collection(db, 'students'),
        where('name', '==', selectedTransaction.studentName)
      );
      const studentSnapshot = await getDocs(studentQuery);
      
      if (!studentSnapshot.empty) {
        const studentDoc = studentSnapshot.docs[0];
        const studentData = studentDoc.data();
        
        await updateDoc(studentDoc.ref, {
          booksIssued: Math.max(0, (studentData.booksIssued || 1) - 1),
          totalBooksRead: (studentData.totalBooksRead || 0) + 1,
          fineAmount: (studentData.fineAmount || 0) + fineAmount,
          updatedAt: serverTimestamp(),
          updatedBy: user?.email || 'unknown'
        });
      }

      onSuccess();
      onClose();
      setSelectedTransaction(null);
      setFine('0');
      setFineReason('');
      setRemarks('');
    } catch (error) {
      console.error('Error returning book:', error);
      alert('पुस्तक वापस करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-gray-900">
              पुस्तक वापसी
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Book Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{book.title}</h3>
                <p className="text-sm text-gray-600">लेखक: {book.author}</p>
                <p className="text-sm text-gray-600">जारी प्रतियाँ: {book.issuedCopies}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issued Transactions */}
            <div>
              <Label className="text-base font-semibold mb-3 block">जारी की गई प्रतियाँ</Label>
              
              <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
                {transactionsLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    लेन-देन लोड हो रहे हैं...
                  </div>
                ) : issuedTransactions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    कोई जारी की गई प्रति नहीं मिली
                  </div>
                ) : (
                  issuedTransactions.map((transaction) => {
                    const isOverdue = new Date() > transaction.dueDate;
                    const autoFine = calculateAutoFine(transaction);
                    
                    return (
                      <div
                        key={transaction.id}
                        onClick={() => handleTransactionSelect(transaction)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          selectedTransaction?.id === transaction.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <h4 className="font-medium text-gray-900">{transaction.studentName}</h4>
                              <Badge className={isOverdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                {isOverdue ? 'अतिदेय' : 'सामान्य'}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-3 h-3" />
                                <span>जारी: {transaction.issueDate.toLocaleDateString('hi-IN')}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-3 h-3" />
                                <span>वापसी: {transaction.dueDate.toLocaleDateString('hi-IN')}</span>
                              </div>
                              {autoFine > 0 && (
                                <div className="flex items-center space-x-2 text-red-600">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>जुर्माना: ₹{autoFine}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Return Details */}
            <div>
              <Label className="text-base font-semibold mb-3 block">वापसी की जानकारी</Label>
              
              {selectedTransaction ? (
                <div className="space-y-4">
                  {/* Selected Transaction Info */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <User className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedTransaction.studentName}</h4>
                        <p className="text-sm text-gray-600">
                          जारी: {selectedTransaction.issueDate.toLocaleDateString('hi-IN')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">वापसी की तारीख:</p>
                        <p className="font-medium">{selectedTransaction.dueDate.toLocaleDateString('hi-IN')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">स्थिति:</p>
                        <Badge className={new Date() > selectedTransaction.dueDate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                          {new Date() > selectedTransaction.dueDate ? 'अतिदेय' : 'सामान्य'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Fine Details */}
                  <div>
                    <Label htmlFor="fine">जुर्माना (₹)</Label>
                    <Input
                      id="fine"
                      type="number"
                      step="0.01"
                      min="0"
                      value={fine}
                      onChange={(e) => setFine(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  {parseFloat(fine) > 0 && (
                    <div>
                      <Label htmlFor="fineReason">जुर्माने का कारण</Label>
                      <Input
                        id="fineReason"
                        value={fineReason}
                        onChange={(e) => setFineReason(e.target.value)}
                        placeholder="देर से वापसी, पुस्तक क्षतिग्रस्त, आदि"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="remarks">टिप्पणी (वैकल्पिक)</Label>
                    <Textarea
                      id="remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="कोई अतिरिक्त टिप्पणी..."
                      rows={3}
                    />
                  </div>

                  {/* Return Date Display */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">वापसी की तारीख</p>
                        <p className="text-sm text-gray-600">
                          {new Date().toLocaleDateString('hi-IN', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">सारांश</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>छात्र: {selectedTransaction.studentName}</p>
                      <p>पुस्तक: {book.title}</p>
                      <p>जारी की तारीख: {selectedTransaction.issueDate.toLocaleDateString('hi-IN')}</p>
                      <p>वापसी की तारीख: {new Date().toLocaleDateString('hi-IN')}</p>
                      {parseFloat(fine) > 0 && (
                        <p className="text-red-600 font-medium">जुर्माना: ₹{fine}</p>
                      )}
                    </div>
                  </div>

                  {/* Return Button */}
                  <Button
                    onClick={handleReturnBook}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        वापसी प्रक्रिया में...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        पुस्तक वापसी की पुष्टि करें
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p>कृपया एक लेन-देन का चयन करें</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
