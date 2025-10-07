"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Eye,
  XCircle,
  FileText
} from 'lucide-react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface Application {
  id: string;
  applicationId: string;
  name: string;
  phone: string;
  aadharNumber: string;
  email: string;
  fatherHusbandName: string;
  dateOfBirth: string;
  gender: string;
  educationalQualification: string;
  address: string;
  profileImage: string;
  aadharCardImage: string;
  // Education Information
  educationLevel: string;
  board: string;
  status: 'pending' | 'under-review' | 'accepted' | 'rejected';
  percentage: string;
  applicationDate: string;
  remarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: any;
}

export default function AdminAdmissionsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [remarkText, setRemarkText] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'library-applications'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const apps = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];

      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = useCallback(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(term) ||
        app.applicationId.toLowerCase().includes(term) ||
        app.phone.includes(term) ||
        app.aadharNumber.includes(term) ||
        app.email.toLowerCase().includes(term)
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchTerm]);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [filterApplications]);

  const handleStatusUpdate = async (applicationId: string, newStatus: string, remarks: string = '') => {
    try {
      setUpdating(true);
      const appRef = doc(db, 'library-applications', applicationId);
      await updateDoc(appRef, {
        status: newStatus,
        remarks: remarks || '',
        reviewedBy: 'Admin', // You can get actual admin name from auth context
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date()
      });

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: newStatus as any, remarks }
            : app
        )
      );

      alert('स्थिति सफलतापूर्वक अपडेट हो गई!');
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('स्थिति अपडेट करने में त्रुटि हुई');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { label: 'लंबित', className: 'bg-yellow-100 text-yellow-800' },
      'under-review': { label: 'समीक्षाधीन', className: 'bg-blue-100 text-blue-800' },
      'accepted': { label: 'स्वीकृत', className: 'bg-green-100 text-green-800' },
      'rejected': { label: 'अस्वीकृत', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    underReview: applications.filter(a => a.status === 'under-review').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">प्रवेश प्रबंधन</h1>
          <p className="text-gray-600">पुस्तकालय प्रवेश आवेदनों का प्रबंधन करें</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">कुल आवेदन</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">लंबित</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">समीक्षाधीन</p>
                <p className="text-3xl font-bold text-blue-600">{stats.underReview}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">स्वीकृत</p>
                <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">अस्वीकृत</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="नाम, आवेदन ID, फोन, आधार नंबर या ईमेल से खोजें..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-64">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="स्थिति फ़िल्टर"
                  aria-label="स्थिति के अनुसार फ़िल्टर करें"
                >
                  <option value="all">सभी स्थिति</option>
                  <option value="pending">लंबित</option>
                  <option value="under-review">समीक्षाधीन</option>
                  <option value="accepted">स्वीकृत</option>
                  <option value="rejected">अस्वीकृत</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">लोड हो रहा है...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">कोई आवेदन नहीं मिला</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        आवेदन ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        नाम
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        फोन
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        आधार नंबर
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        दिनांक
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        स्थिति
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        कार्य
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {app.applicationId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {app.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {app.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {app.aadharNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {app.applicationDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(app);
                              setRemarkText(app.remarks || '');
                              setShowDetailsModal(true);
                            }}
                            title="विवरण देखें"
                            aria-label={`${app.name} का आवेदन विवरण देखें`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            विवरण
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">आवेदन विवरण</h2>
                    <p className="text-gray-600">आवेदन ID: {selectedApplication.applicationId}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    title="बंद करें"
                    aria-label="मोडल बंद करें"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">व्यक्तिगत जानकारी</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">नाम</label>
                      <p className="font-medium text-gray-900">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">पिता/पति का नाम</label>
                      <p className="font-medium text-gray-900">{selectedApplication.fatherHusbandName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">मोबाइल नंबर</label>
                      <p className="font-medium text-gray-900">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">आधार नंबर</label>
                      <p className="font-medium text-gray-900">{selectedApplication.aadharNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">ईमेल</label>
                      <p className="font-medium text-gray-900">{selectedApplication.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">जन्म तिथि</label>
                      <p className="font-medium text-gray-900">{selectedApplication.dateOfBirth || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">लिंग</label>
                      <p className="font-medium text-gray-900">{selectedApplication.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">शैक्षणिक योग्यता</label>
                      <p className="font-medium text-gray-900">{selectedApplication.educationalQualification || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-600">पता</label>
                      <p className="font-medium text-gray-900">{selectedApplication.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                {/* Education Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">शैक्षणिक जानकारी</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">शिक्षा स्तर</label>
                      <p className="font-medium text-gray-900">
                        {selectedApplication.educationLevel === '10th' && '10वीं कक्षा'}
                        {selectedApplication.educationLevel === '12th' && '12वीं कक्षा'}
                        {selectedApplication.educationLevel === 'ug_pg' && 'स्नातक/स्नातकोत्तर'}
                        {!selectedApplication.educationLevel && 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">बोर्ड/विश्वविद्यालय</label>
                      <p className="font-medium text-gray-900">{selectedApplication.board || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">स्थिति</label>
                      <p className="font-medium text-gray-900">
                        {selectedApplication.status === 'accepted' && 'स्वीकृत'}
                        {selectedApplication.status === 'rejected' && 'अस्वीकृत'}
                        {selectedApplication.status === 'under-review' && 'समीक्षाधीन'}
                        {selectedApplication.status === 'pending' && 'लंबित'}
                        {!selectedApplication.status && 'N/A'}
                      </p>
                    </div>
                    {selectedApplication.percentage && (
                      <div>
                        <label className="text-sm text-gray-600">प्रतिशत</label>
                        <p className="font-medium text-gray-900">{selectedApplication.percentage}%</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">दस्तावेज़</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.profileImage && (
                      <div className="text-center">
                        <button
                          onClick={() => {
                            setSelectedImage({ url: selectedApplication.profileImage, title: 'प्रोफाइल फोटो' });
                            setShowImageModal(true);
                          }}
                          className="block w-full"
                          title="प्रोफाइल फोटो देखें"
                          aria-label="प्रोफाइल फोटो देखें"
                        >
                          <img
                            src={selectedApplication.profileImage}
                            alt="Profile"
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition"
                          />
                          <p className="text-sm text-gray-600 mt-2">प्रोफाइल फोटो</p>
                        </button>
                      </div>
                    )}
                    {selectedApplication.aadharCardImage && (
                      <div className="text-center">
                        <button
                          onClick={() => {
                            setSelectedImage({ url: selectedApplication.aadharCardImage, title: 'आधार कार्ड' });
                            setShowImageModal(true);
                          }}
                          className="block w-full"
                          title="आधार कार्ड देखें"
                          aria-label="आधार कार्ड देखें"
                        >
                          <img
                            src={selectedApplication.aadharCardImage}
                            alt="Aadhar Card"
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition"
                          />
                          <p className="text-sm text-gray-600 mt-2">आधार कार्ड</p>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Remarks */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">स्थिति और टिप्पणी</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        वर्तमान स्थिति
                      </label>
                      <div className="mb-4">
                        {getStatusBadge(selectedApplication.status)}
                      </div>
                      <select
                        value={selectedApplication.status}
                        onChange={(e) => setSelectedApplication({ ...selectedApplication, status: e.target.value as any })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="स्थिति चुनें"
                        aria-label="आवेदन की स्थिति चुनें"
                      >
                        <option value="pending">लंबित</option>
                        <option value="under-review">समीक्षाधीन</option>
                        <option value="accepted">स्वीकृत</option>
                        <option value="rejected">अस्वीकृत</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        टिप्पणी
                      </label>
                      <textarea
                        value={remarkText}
                        onChange={(e) => setRemarkText(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="आवेदन के बारे में टिप्पणी या नोट्स लिखें..."
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    onClick={() => handleStatusUpdate(selectedApplication.id, selectedApplication.status, remarkText)}
                    disabled={updating}
                    className="flex-1"
                  >
                    {updating ? 'अपडेट हो रहा है...' : 'स्थिति अपडेट करें'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1"
                  >
                    रद्द करें
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
                title="बंद करें"
                aria-label="इमेज मोडल बंद करें"
              >
                <XCircle className="w-8 h-8" />
              </button>
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">{selectedImage.title}</h3>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

