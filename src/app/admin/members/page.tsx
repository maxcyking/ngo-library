"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Phone, 
  Mail,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  ArrowLeft,
  GraduationCap
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
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  course: string;
  rollNumber: string;
  admissionDate: string;
  status: 'active' | 'inactive' | 'banned' | 'graduated';
  membershipType: 'basic' | 'premium' | 'lifetime';
  profileImage?: string;
  booksIssued: number;
  totalBooksRead: number;
  fineAmount: number;
  guardianName?: string;
  guardianPhone?: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  createdBy: string;
}

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [membershipFilter, setMembershipFilter] = useState<string>('all');
  
  const { user } = useAuth();

  // Fetch students from Firebase
  const fetchStudents = async () => {
    try {
      const q = query(collection(db, 'students'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const studentsData: Student[] = [];
      querySnapshot.forEach((doc) => {
        studentsData.push({ id: doc.id, ...doc.data() } as Student);
      });
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesMembership = membershipFilter === 'all' || student.membershipType === membershipFilter;
    
    return matchesSearch && matchesStatus && matchesMembership;
  });

  // Delete student
  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`क्या आप वाकई ${name} को डिलीट करना चाहते हैं?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'students', id));
      await fetchStudents();
      alert('छात्र सफलतापूर्वक डिलीट किया गया!');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('छात्र डिलीट करने में त्रुटि हुई');
    }
  };

  // Update student status
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'students', id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'unknown'
      });
      await fetchStudents();
      alert('छात्र की स्थिति सफलतापूर्वक अपडेट की गई!');
    } catch (error) {
      console.error('Error updating student status:', error);
      alert('स्थिति अपडेट करने में त्रुटि हुई');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      case 'graduated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'सक्रिय';
      case 'inactive': return 'निष्क्रिय';
      case 'banned': return 'प्रतिबंधित';
      case 'graduated': return 'स्नातक';
      default: return status;
    }
  };

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'lifetime':
        return 'bg-gold-100 text-gold-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getMembershipText = (type: string) => {
    switch (type) {
      case 'basic': return 'सामान्य';
      case 'premium': return 'प्रीमियम';
      case 'lifetime': return 'आजीवन';
      default: return type;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">छात्र डेटा लोड हो रहा है...</p>
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
                    <Users className="w-6 h-6 mr-2" />
                    सदस्य प्रबंधन
                  </h1>
                  <p className="text-gray-600">
                    कुल छात्र: {students.length}
                  </p>
                </div>
              </div>
              <Link href="/admin/members/add">
                <Button className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  नया छात्र जोड़ें
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="नाम, ईमेल, फोन या रोल नंबर से खोजें..."
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
                    <option value="active">सक्रिय</option>
                    <option value="inactive">निष्क्रिय</option>
                    <option value="banned">प्रतिबंधित</option>
                    <option value="graduated">स्नातक</option>
                  </select>
                </div>
                <div>
                  <select
                    value={membershipFilter}
                    onChange={(e) => setMembershipFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">सभी सदस्यता</option>
                    <option value="basic">सामान्य</option>
                    <option value="premium">प्रीमियम</option>
                    <option value="lifetime">आजीवन</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {student.profileImage ? (
                        <Image
                          src={student.profileImage}
                          alt={student.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          {student.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          रोल: {student.rollNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => window.open(`mailto:${student.email}`, '_blank')}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => window.open(`tel:${student.phone}`, '_blank')}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteStudent(student.id, student.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {student.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {student.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {student.course}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge className={getMembershipColor(student.membershipType)}>
                        {getMembershipText(student.membershipType)}
                      </Badge>
                      <Badge className={getStatusColor(student.status)}>
                        {getStatusText(student.status)}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>जारी पुस्तकें:</span>
                        <span className="font-medium">{student.booksIssued}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>कुल पढ़ी:</span>
                        <span className="font-medium">{student.totalBooksRead}</span>
                      </div>
                      {student.fineAmount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>जुर्माना:</span>
                          <span className="font-medium">₹{student.fineAmount}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open(`/admin/members/${student.id}`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        विवरण
                      </Button>
                      <div className="flex space-x-1">
                        {student.status === 'active' ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusUpdate(student.id, 'inactive')}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusUpdate(student.id, 'active')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(student.id, 'banned')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  कोई छात्र नहीं मिला
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'आपकी खोज के अनुसार कोई छात्र नहीं मिला।' : 'अभी तक कोई छात्र नहीं जोड़ा गया है।'}
                </p>
                <Button onClick={() => setSearchQuery('')}>
                  {searchQuery ? 'सभी छात्र दिखाएं' : 'पहला छात्र जोड़ें'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}