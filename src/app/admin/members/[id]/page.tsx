"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  User,
  MapPin,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Ban,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
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
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [editData, setEditData] = useState<Partial<Student>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'url' | 'file'>('url');

  // Fetch student data
  const fetchStudent = async () => {
    try {
      const docRef = doc(db, 'students', studentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const studentData = { id: docSnap.id, ...docSnap.data() } as Student;
        setStudent(studentData);
        setEditData(studentData);
      } else {
        alert('छात्र नहीं मिला');
        router.push('/admin/members');
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      alert('छात्र की जानकारी लोड करने में त्रुटि हुई');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  // Handle file upload
  const handleFileUpload = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `student-profiles/${timestamp}-${file.name}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  // Save changes
  const handleSave = async () => {
    if (!student) return;

    setSaving(true);
    setUploading(true);

    try {
      let finalProfileImage = editData.profileImage;

      // Upload new profile image if file is selected
      if (uploadType === 'file' && selectedFile) {
        finalProfileImage = await handleFileUpload(selectedFile);
      }

      const updateData = {
        ...editData,
        profileImage: finalProfileImage,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'unknown'
      };

      await updateDoc(doc(db, 'students', studentId), updateData);

      // Update local state
      setStudent({
        ...student,
        ...updateData,
        updatedAt: new Date() // Convert serverTimestamp to Date for local state
      } as Student);
      setEditing(false);
      setSelectedFile(null);
      alert('छात्र की जानकारी सफलतापूर्वक अपडेट की गई!');

    } catch (error) {
      console.error('Error updating student:', error);
      alert('छात्र की जानकारी अपडेट करने में त्रुटि हुई');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  // Update status
  const handleStatusUpdate = async (newStatus: string) => {
    if (!student) return;

    try {
      await updateDoc(doc(db, 'students', studentId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'unknown'
      });

      setStudent({ ...student, status: newStatus as 'active' | 'inactive' | 'banned' | 'graduated' });
      alert('छात्र की स्थिति सफलतापूर्वक अपडेट की गई!');

    } catch (error) {
      console.error('Error updating status:', error);
      alert('स्थिति अपडेट करने में त्रुटि हुई');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-red-100 text-red-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <p className="text-gray-600">छात्र की जानकारी लोड हो रही है...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!student) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">छात्र नहीं मिला</h2>
            <p className="text-gray-600 mb-4">यह छात्र मौजूद नहीं है या डिलीट हो गया है।</p>
            <Link href="/admin/members">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस जाएं
              </Button>
            </Link>
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link href="/admin/members">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {student.name}
                  </h1>
                  <p className="text-gray-600">
                    रोल नंबर: {student.rollNumber}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {editing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditing(false);
                        setEditData(student);
                        setSelectedFile(null);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      रद्द करें
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving || uploading}
                    >
                      {saving || uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      सेव करें
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    एडिट करें
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    {student.profileImage ? (
                      <Image
                        src={student.profileImage}
                        alt={student.name}
                        width={120}
                        height={120}
                        className="rounded-full mx-auto object-cover"
                      />
                    ) : (
                      <div className="w-30 h-30 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-3xl font-bold">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Profile Image Edit Section */}
                    {editing && (
                      <div className="mt-4 space-y-3">
                        <div className="text-sm font-medium text-gray-700">
                          प्रोफाइल फोटो अपडेट करें
                        </div>
                        <div className="flex justify-center space-x-2 mb-3">
                          <label className="flex items-center text-sm">
                            <input
                              type="radio"
                              value="url"
                              checked={uploadType === 'url'}
                              onChange={(e) => setUploadType(e.target.value as 'url')}
                              className="mr-1"
                            />
                            URL
                          </label>
                          <label className="flex items-center text-sm">
                            <input
                              type="radio"
                              value="file"
                              checked={uploadType === 'file'}
                              onChange={(e) => setUploadType(e.target.value as 'file')}
                              className="mr-1"
                            />
                            फाइल
                          </label>
                        </div>

                        {uploadType === 'url' ? (
                          <Input
                            placeholder="इमेज URL"
                            value={editData.profileImage || ''}
                            onChange={(e) => setEditData({ ...editData, profileImage: e.target.value })}
                            className="text-sm"
                          />
                        ) : (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="w-full text-sm p-2 border border-gray-300 rounded-md"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {student.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {student.course}
                  </p>

                  <div className="flex justify-center space-x-2 mb-4">
                    <Badge className={getStatusColor(student.status)}>
                      {getStatusText(student.status)}
                    </Badge>
                    <Badge variant="outline">
                      {getMembershipText(student.membershipType)}
                    </Badge>
                  </div>

                  {/* Status Actions */}
                  <div className="flex justify-center space-x-2">
                    {student.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate('inactive')}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        निष्क्रिय करें
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate('active')}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        सक्रिय करें
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate('banned')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Ban className="w-4 h-4 mr-1" />
                      प्रतिबंधित करें
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">आंकड़े</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">जारी पुस्तकें:</span>
                      <span className="font-semibold">{student.booksIssued}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">कुल पढ़ी:</span>
                      <span className="font-semibold">{student.totalBooksRead}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">जुर्माना:</span>
                      <span className={`font-semibold ${student.fineAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{student.fineAmount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    बुनियादी जानकारी
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          नाम
                        </label>
                        <Input
                          value={editData.name || ''}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          रोल नंबर
                        </label>
                        <Input
                          value={editData.rollNumber || ''}
                          onChange={(e) => setEditData({ ...editData, rollNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ईमेल
                        </label>
                        <Input
                          type="email"
                          value={editData.email || ''}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          फोन
                        </label>
                        <Input
                          value={editData.phone || ''}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          कोर्स
                        </label>
                        <Input
                          value={editData.course || ''}
                          onChange={(e) => setEditData({ ...editData, course: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          सदस्यता प्रकार
                        </label>
                        <select
                          value={editData.membershipType || 'basic'}
                          onChange={(e) => setEditData({ ...editData, membershipType: e.target.value as 'basic' | 'premium' | 'lifetime' })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="basic">सामान्य</option>
                          <option value="premium">प्रीमियम</option>
                          <option value="lifetime">आजीवन</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-3 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">ईमेल</p>
                          <p className="font-medium">{student.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-3 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">फोन</p>
                          <p className="font-medium">{student.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="w-4 h-4 mr-3 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">कोर्स</p>
                          <p className="font-medium">{student.course}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">प्रवेश तिथि</p>
                          <p className="font-medium">
                            {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString('hi-IN') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>व्यक्तिगत जानकारी</CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          जन्म तिथि
                        </label>
                        <Input
                          type="date"
                          value={editData.dateOfBirth || ''}
                          onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          लिंग
                        </label>
                        <select
                          value={editData.gender || ''}
                          onChange={(e) => setEditData({ ...editData, gender: e.target.value === '' ? undefined : e.target.value as 'male' | 'female' | 'other' })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">चुनें</option>
                          <option value="male">पुरुष</option>
                          <option value="female">महिला</option>
                          <option value="other">अन्य</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ब्लड ग्रुप
                        </label>
                        <select
                          value={editData.bloodGroup || ''}
                          onChange={(e) => setEditData({ ...editData, bloodGroup: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">चुनें</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          पता
                        </label>
                        <textarea
                          value={editData.address || ''}
                          onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-600">जन्म तिथि</p>
                          <p className="font-medium">
                            {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('hi-IN') : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">लिंग</p>
                          <p className="font-medium">
                            {student.gender === 'male' ? 'पुरुष' : student.gender === 'female' ? 'महिला' : student.gender === 'other' ? 'अन्य' : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ब्लड ग्रुप</p>
                          <p className="font-medium">{student.bloodGroup || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-3 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">पता</p>
                          <p className="font-medium">{student.address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>संपर्क जानकारी</CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          अभिभावक का नाम
                        </label>
                        <Input
                          value={editData.guardianName || ''}
                          onChange={(e) => setEditData({ ...editData, guardianName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          अभिभावक का फोन
                        </label>
                        <Input
                          value={editData.guardianPhone || ''}
                          onChange={(e) => setEditData({ ...editData, guardianPhone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          आपातकालीन संपर्क
                        </label>
                        <Input
                          value={editData.emergencyContact || ''}
                          onChange={(e) => setEditData({ ...editData, emergencyContact: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          आपातकालीन फोन
                        </label>
                        <Input
                          value={editData.emergencyPhone || ''}
                          onChange={(e) => setEditData({ ...editData, emergencyPhone: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600">अभिभावक का नाम</p>
                        <p className="font-medium">{student.guardianName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">अभिभावक का फोन</p>
                        <p className="font-medium">{student.guardianPhone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">आपातकालीन संपर्क</p>
                        <p className="font-medium">{student.emergencyContact || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">आपातकालीन फोन</p>
                        <p className="font-medium">{student.emergencyPhone || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Books Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    पुस्तक प्रबंधन
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{student.booksIssued}</div>
                      <div className="text-sm text-gray-600">जारी पुस्तकें</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{student.totalBooksRead}</div>
                      <div className="text-sm text-gray-600">कुल पढ़ी गई</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className={`text-2xl font-bold ${student.fineAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{student.fineAmount}
                      </div>
                      <div className="text-sm text-gray-600">जुर्माना</div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1">
                      <BookOpen className="w-4 h-4 mr-2" />
                      पुस्तक जारी करें
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      पुस्तक वापस करें
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      इतिहास देखें
                    </Button>
                  </div>

                  {/* Currently Issued Books */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-800 mb-3">वर्तमान में जारी पुस्तकें</h4>
                    <div className="space-y-2">
                      {student.booksIssued > 0 ? (
                        <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                          <p>जारी पुस्तकों की सूची यहाँ दिखाई जाएगी।</p>
                          <p className="text-xs mt-1">यह फीचर जल्द ही उपलब्ध होगा।</p>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                          कोई पुस्तक जारी नहीं है
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}