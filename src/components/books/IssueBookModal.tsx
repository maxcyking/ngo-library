"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Search, 
  User, 
  Calendar,
  BookOpen,
  UserPlus,
  AlertTriangle
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Book, Student, BookTransaction } from '@/lib/types';

interface IssueBookModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const IssueBookModal: React.FC<IssueBookModalProps> = ({
  book,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [issueDays, setIssueDays] = useState('7');
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);
  
  const { user } = useAuth();

  // Fetch students
  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
      const q = query(
        collection(db, 'students'), 
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      const studentsData: Student[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        studentsData.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Student);
      });
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setStudentsLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssueBook = async () => {
    if (!selectedStudent) {
      alert('कृपया छात्र का चयन करें');
      return;
    }

    if (selectedStudent.booksIssued >= selectedStudent.maxBooksAllowed) {
      alert(`छात्र की पुस्तक सीमा समाप्त हो गई है (अधिकतम: ${selectedStudent.maxBooksAllowed})`);
      return;
    }

    setLoading(true);

    try {
      const issueDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(issueDate.getDate() + parseInt(issueDays));

      // Create transaction record
      const transactionData: Omit<BookTransaction, 'id'> = {
        bookId: book.id,
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        bookTitle: book.title,
        bookAuthor: book.author,
        issueDate: issueDate,
        dueDate: dueDate,
        status: 'issued',
        issuedBy: user?.email || 'unknown',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'bookTransactions'), {
        ...transactionData,
        issueDate: issueDate,
        dueDate: dueDate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update book availability
      await updateDoc(doc(db, 'books', book.id), {
        availableCopies: book.availableCopies - 1,
        issuedCopies: book.issuedCopies + 1,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || 'unknown'
      });

      // Update student's book count
      await updateDoc(doc(db, 'students', selectedStudent.id), {
        booksIssued: selectedStudent.booksIssued + 1,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || 'unknown'
      });

      onSuccess();
      onClose();
      setSelectedStudent(null);
      setSearchQuery('');
    } catch (error) {
      console.error('Error issuing book:', error);
      alert('पुस्तक जारी करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-gray-900">
              पुस्तक जारी करें
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
                <p className="text-sm text-gray-600">उपलब्ध प्रतियाँ: {book.availableCopies}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Selection */}
            <div>
              <Label className="text-base font-semibold mb-3 block">छात्र का चयन करें</Label>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="छात्र का नाम, रोल नंबर या ईमेल से खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Students List */}
              <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                {studentsLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    छात्र लोड हो रहे हैं...
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    कोई छात्र नहीं मिला
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedStudent?.id === student.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-600">रोल: {student.rollNumber}</p>
                          <p className="text-sm text-gray-600">कोर्स: {student.course}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={student.booksIssued >= student.maxBooksAllowed ? 'destructive' : 'default'}>
                            {student.booksIssued}/{student.maxBooksAllowed}
                          </Badge>
                          {student.fineAmount > 0 && (
                            <p className="text-xs text-red-600 mt-1">
                              जुर्माना: ₹{student.fineAmount}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Issue Details */}
            <div>
              <Label className="text-base font-semibold mb-3 block">जारी करने की जानकारी</Label>
              
              {selectedStudent ? (
                <div className="space-y-4">
                  {/* Selected Student Info */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedStudent.name}</h4>
                        <p className="text-sm text-gray-600">रोल: {selectedStudent.rollNumber}</p>
                        <p className="text-sm text-gray-600">ईमेल: {selectedStudent.email}</p>
                        <p className="text-sm text-gray-600">फोन: {selectedStudent.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Issue Duration */}
                  <div>
                    <Label htmlFor="issueDays">कितने दिन के लिए जारी करें?</Label>
                    <select
                      id="issueDays"
                      value={issueDays}
                      onChange={(e) => setIssueDays(e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="पुस्तक जारी करने की अवधि"
                    >
                      <option value="3">3 दिन</option>
                      <option value="7">7 दिन (सप्ताह)</option>
                      <option value="14">14 दिन (दो सप्ताह)</option>
                      <option value="21">21 दिन (तीन सप्ताह)</option>
                      <option value="30">30 दिन (महीना)</option>
                    </select>
                  </div>

                  {/* Due Date Display */}
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">वापसी की अंतिम तारीख</p>
                        <p className="text-sm text-gray-600">
                          {new Date(Date.now() + parseInt(issueDays) * 24 * 60 * 60 * 1000)
                            .toLocaleDateString('hi-IN', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {selectedStudent.booksIssued >= selectedStudent.maxBooksAllowed && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <p className="text-sm text-red-700">
                          चेतावनी: छात्र की पुस्तक सीमा समाप्त हो गई है
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedStudent.fineAmount > 0 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <p className="text-sm text-orange-700">
                          जुर्माना बकाया: ₹{selectedStudent.fineAmount}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Issue Button */}
                  <Button
                    onClick={handleIssueBook}
                    disabled={loading || selectedStudent.booksIssued >= selectedStudent.maxBooksAllowed}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        जारी की जा रही है...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        पुस्तक जारी करें
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p>कृपया छात्र का चयन करें</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
