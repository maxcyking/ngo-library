"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    FileText,
    Search,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Download,
    ExternalLink
} from 'lucide-react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Application {
    id: string;
    applicationId: string;
    formNumber: string;
    applicationDate: string;
    username: string;
    name: string;
    fatherHusbandName: string;
    phone: string;
    email: string;
    address: string;
    dateOfBirth: string;
    educationalQualification: string;
    gender: string;
    applicationType: 'library' | 'member';
    status: 'pending' | 'approved' | 'rejected';
    profileImage: string;
    signatureImage: string;
    class10Marksheet: string;
    class12Marksheet: string;
    workArea: string;
    fatherHusbandOccupation: string;
    annualIncome: string;
    guardianMemberNumber: string;
    commissionPreparationName: string;
    anyDiseaseOrTreatment: string;
    familyGovernmentEmployee: boolean;
    hasAadhaarCard: boolean;
    hasMarksheet: boolean;
    hasCharacterCertificate: boolean;
    bloodGroup: string;
    createdAt: Date | { seconds: number; nanoseconds: number };
    updatedAt: Date | { seconds: number; nanoseconds: number };
    source: 'admin' | 'public';
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const q = query(
            collection(db, 'library-applications'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const applicationsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Application[];

            setApplications(applicationsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusUpdate = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
        try {
            await updateDoc(doc(db, 'library-applications', applicationId), {
                status: newStatus,
                updatedAt: new Date(),
                updatedBy: user?.uid
            });

            alert(`आवेदन ${newStatus === 'approved' ? 'स्वीकृत' : 'अस्वीकृत'} कर दिया गया।`);
        } catch (error) {
            console.error('Error updating application status:', error);
            alert('स्थिति अपडेट करने में त्रुटि हुई।');
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.phone.includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'text-green-600 bg-green-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            default: return 'text-yellow-600 bg-yellow-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    if (showDetails && selectedApplication) {
        return (
            <ProtectedRoute adminOnly={true}>
                <div className="min-h-screen bg-gray-50">
                    {/* Header */}
                    <div className="bg-white shadow-sm border-b">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mr-4"
                                        onClick={() => setShowDetails(false)}
                                    >
                                        ← वापस
                                    </Button>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            आवेदन विवरण
                                        </h1>
                                        <p className="text-gray-600">
                                            आवेदन ID: {selectedApplication.applicationId}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {selectedApplication.status === 'pending' && (
                                        <>
                                            <Button
                                                onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                स्वीकृत करें
                                            </Button>
                                            <Button
                                                onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                                                variant="destructive"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                अस्वीकृत करें
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>व्यक्तिगत जानकारी</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">नाम</label>
                                                <p className="text-gray-900">{selectedApplication.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">पिता/पति का नाम</label>
                                                <p className="text-gray-900">{selectedApplication.fatherHusbandName}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">जन्म तिथि</label>
                                                <p className="text-gray-900">{selectedApplication.dateOfBirth || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">लिंग</label>
                                                <p className="text-gray-900">{selectedApplication.gender || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">फोन</label>
                                                <p className="text-gray-900">{selectedApplication.phone}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">ईमेल</label>
                                                <p className="text-gray-900">{selectedApplication.email || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">शैक्षणिक योग्यता</label>
                                                <p className="text-gray-900">{selectedApplication.educationalQualification || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">कार्यक्षेत्र</label>
                                                <p className="text-gray-900">{selectedApplication.workArea || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">पिता/पति का व्यवसाय</label>
                                                <p className="text-gray-900">{selectedApplication.fatherHusbandOccupation || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">वार्षिक आय</label>
                                                <p className="text-gray-900">{selectedApplication.annualIncome || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">ब्लड ग्रुप</label>
                                                <p className="text-gray-900">{selectedApplication.bloodGroup || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">यूजरनेम</label>
                                                <p className="text-gray-900">{selectedApplication.username}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">पता</label>
                                            <p className="text-gray-900">{selectedApplication.address || 'N/A'}</p>
                                        </div>
                                        {selectedApplication.anyDiseaseOrTreatment && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">स्वास्थ्य संबंधी जानकारी</label>
                                                <p className="text-gray-900">{selectedApplication.anyDiseaseOrTreatment}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Documents */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>दस्तावेज</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedApplication.profileImage && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500 mb-2 block">प्रोफाइल फोटो</label>
                                                    <div className="border rounded-lg p-2">
                                                        <img
                                                            src={selectedApplication.profileImage}
                                                            alt="Profile"
                                                            className="w-32 h-32 object-cover rounded"
                                                        />
                                                        <a
                                                            href={selectedApplication.profileImage}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline text-sm flex items-center mt-2"
                                                        >
                                                            <ExternalLink className="w-3 h-3 mr-1" />
                                                            देखें
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedApplication.signatureImage && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500 mb-2 block">हस्ताक्षर</label>
                                                    <div className="border rounded-lg p-2">
                                                        <img
                                                            src={selectedApplication.signatureImage}
                                                            alt="Signature"
                                                            className="w-32 h-16 object-cover rounded"
                                                        />
                                                        <a
                                                            href={selectedApplication.signatureImage}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline text-sm flex items-center mt-2"
                                                        >
                                                            <ExternalLink className="w-3 h-3 mr-1" />
                                                            देखें
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedApplication.class10Marksheet && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500 mb-2 block">10वीं मार्कशीट</label>
                                                    <a
                                                        href={selectedApplication.class10Marksheet}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline flex items-center"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        डाउनलोड करें
                                                    </a>
                                                </div>
                                            )}

                                            {selectedApplication.class12Marksheet && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500 mb-2 block">12वीं मार्कशीट</label>
                                                    <a
                                                        href={selectedApplication.class12Marksheet}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline flex items-center"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        डाउनलोड करें
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>आवेदन स्थिति</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                                            {getStatusIcon(selectedApplication.status)}
                                            <span className="ml-2">
                                                {selectedApplication.status === 'pending' ? 'लंबित' :
                                                    selectedApplication.status === 'approved' ? 'स्वीकृत' : 'अस्वीकृत'}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>सहायक दस्तावेज</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full mr-2 ${selectedApplication.hasAadhaarCard ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            <span className="text-sm">आधार कार्ड</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full mr-2 ${selectedApplication.hasMarksheet ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            <span className="text-sm">मार्कशीट</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full mr-2 ${selectedApplication.hasCharacterCertificate ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            <span className="text-sm">चरित्र प्रमाण</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full mr-2 ${selectedApplication.familyGovernmentEmployee ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                            <span className="text-sm">सरकारी कर्मचारी</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>आवेदन जानकारी</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">फॉर्म नंबर:</span>
                                            <span className="ml-2 font-mono">{selectedApplication.formNumber || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">आवेदन प्रकार:</span>
                                            <span className="ml-2">{selectedApplication.applicationType === 'library' ? 'पुस्तकालय' : 'सदस्यता'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">स्रोत:</span>
                                            <span className="ml-2">{selectedApplication.source === 'public' ? 'सार्वजनिक' : 'एडमिन'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">आवेदन दिनांक:</span>
                                            <span className="ml-2">
                                                {selectedApplication.applicationDate || 
                                                 (selectedApplication.createdAt instanceof Date 
                                                  ? selectedApplication.createdAt.toLocaleDateString('hi-IN')
                                                  : selectedApplication.createdAt?.seconds 
                                                    ? new Date(selectedApplication.createdAt.seconds * 1000).toLocaleDateString('hi-IN')
                                                    : 'N/A')}
                                            </span>
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

    return (
        <ProtectedRoute adminOnly={true}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <FileText className="w-6 h-6 mr-2" />
                                    आवेदन प्रबंधन
                                </h1>
                                <p className="text-gray-600">
                                    पुस्तकालय आवेदनों की समीक्षा और प्रबंधन करें
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="नाम, आवेदन ID या फोन नंबर से खोजें..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">सभी स्थिति</option>
                                        <option value="pending">लंबित</option>
                                        <option value="approved">स्वीकृत</option>
                                        <option value="rejected">अस्वीकृत</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Applications List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>आवेदन सूची ({filteredApplications.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2 text-gray-600">लोड हो रहा है...</p>
                                </div>
                            ) : filteredApplications.length === 0 ? (
                                <div className="text-center py-8">
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">कोई आवेदन नहीं मिला</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4">आवेदन ID</th>
                                                <th className="text-left py-3 px-4">फॉर्म नं.</th>
                                                <th className="text-left py-3 px-4">नाम</th>
                                                <th className="text-left py-3 px-4">फोन</th>
                                                <th className="text-left py-3 px-4">प्रकार</th>
                                                <th className="text-left py-3 px-4">स्थिति</th>
                                                <th className="text-left py-3 px-4">दिनांक</th>
                                                <th className="text-left py-3 px-4">कार्य</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredApplications.map((application) => (
                                                <tr key={application.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-mono text-sm">
                                                        {application.applicationId}
                                                    </td>
                                                    <td className="py-3 px-4 font-mono text-xs">
                                                        {application.formNumber || 'N/A'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <p className="font-medium">{application.name}</p>
                                                            <p className="text-sm text-gray-500">{application.fatherHusbandName}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">{application.phone}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                            {application.applicationType === 'library' ? 'पुस्तकालय' : 'सदस्यता'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                                            {getStatusIcon(application.status)}
                                                            <span className="ml-1">
                                                                {application.status === 'pending' ? 'लंबित' :
                                                                    application.status === 'approved' ? 'स्वीकृत' : 'अस्वीकृत'}
                                                            </span>
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        {application.createdAt instanceof Date 
                                                         ? application.createdAt.toLocaleDateString('hi-IN')
                                                         : application.createdAt?.seconds 
                                                           ? new Date(application.createdAt.seconds * 1000).toLocaleDateString('hi-IN')
                                                           : 'N/A'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedApplication(application);
                                                                    setShowDetails(true);
                                                                }}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            {application.status === 'pending' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleStatusUpdate(application.id, 'approved')}
                                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                                                    >
                                                                        <XCircle className="w-4 h-4" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}