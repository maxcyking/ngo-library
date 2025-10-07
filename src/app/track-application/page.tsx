"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Phone,
  Mail,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Application {
  id: string;
  applicationId: string;
  name: string;
  phone: string;
  aadharNumber: string;
  email: string;
  fatherHusbandName: string;
  dateOfBirth: string;
  educationalQualification: string;
  status: 'pending' | 'under-review' | 'accepted' | 'rejected';
  applicationDate: string;
  remarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export default function TrackApplicationPage() {
  const [searchType, setSearchType] = useState<'rollNumber' | 'aadhar'>('rollNumber');
  const [searchValue, setSearchValue] = useState('');
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      setError('कृपया खोज मान दर्ज करें');
      return;
    }

    setLoading(true);
    setError('');
    setApplication(null);

    try {
      const applicationsRef = collection(db, 'library-applications');
      let q;

      if (searchType === 'rollNumber') {
        q = query(applicationsRef, where('applicationId', '==', searchValue.toUpperCase()));
      } else {
        // Remove spaces from Aadhar number for search
        const cleanAadhar = searchValue.replace(/\s/g, '');
        q = query(applicationsRef, where('aadharNumber', '==', cleanAadhar));
      }

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('कोई आवेदन नहीं मिला। कृपया अपना रोल नंबर या आधार नंबर जांचें।');
      } else {
        const appData = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data()
        } as Application;
        setApplication(appData);
      }
    } catch (err) {
      console.error('Error searching application:', err);
      setError('आवेदन खोजने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      'pending': {
        label: 'लंबित',
        icon: <Clock className="w-6 h-6" />,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        description: 'आपका आवेदन प्राप्त हो गया है और समीक्षा के लिए प्रतीक्षा कर रहा है।'
      },
      'under-review': {
        label: 'समीक्षाधीन',
        icon: <FileText className="w-6 h-6" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        description: 'आपका आवेदन वर्तमान में प्रशासन द्वारा समीक्षा की जा रही है।'
      },
      'accepted': {
        label: 'स्वीकृत',
        icon: <CheckCircle className="w-6 h-6" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        description: 'बधाई हो! आपका आवेदन स्वीकृत हो गया है।'
      },
      'rejected': {
        label: 'अस्वीकृत',
        icon: <XCircle className="w-6 h-6" />,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        description: 'क्षमा करें, आपका आवेदन अस्वीकृत कर दिया गया है।'
      }
    };

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            आवेदन की स्थिति ट्रैक करें
          </h1>
          <p className="text-xl text-gray-600">
            अपने पुस्तकालय प्रवेश आवेदन की वर्तमान स्थिति जांचें
          </p>
        </div>

        {/* Search Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">अपना आवेदन खोजें</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Type Selection */}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSearchType('rollNumber');
                    setSearchValue('');
                    setError('');
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    searchType === 'rollNumber'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title="रोल नंबर से खोजें"
                  aria-label="रोल नंबर द्वारा खोज"
                >
                  रोल नंबर
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchType('aadhar');
                    setSearchValue('');
                    setError('');
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    searchType === 'aadhar'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title="आधार नंबर से खोजें"
                  aria-label="आधार नंबर द्वारा खोज"
                >
                  आधार नंबर
                </button>
              </div>

              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {searchType === 'rollNumber' ? 'आवेदन ID / रोल नंबर' : 'आधार नंबर'}
                </label>
                <Input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={
                    searchType === 'rollNumber'
                      ? 'जैसे: LIB123456ABCDEF'
                      : 'xxxx xxxx xxxx (12 अंक)'
                  }
                  className="text-lg"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  {searchType === 'rollNumber'
                    ? 'आवेदन जमा करने पर प्राप्त रोल नंबर दर्ज करें'
                    : 'अपना 12 अंकों का आधार नंबर दर्ज करें'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Search Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-lg py-6"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    खोज रहे हैं...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    खोजें
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Application Details */}
        {application && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className={`shadow-lg border-2 ${getStatusInfo(application.status).borderColor}`}>
              <CardContent className={`p-8 ${getStatusInfo(application.status).bgColor}`}>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getStatusInfo(application.status).bgColor} border-2 ${getStatusInfo(application.status).borderColor} mb-4`}>
                    <div className={getStatusInfo(application.status).color}>
                      {getStatusInfo(application.status).icon}
                    </div>
                  </div>
                  <h2 className={`text-3xl font-bold mb-2 ${getStatusInfo(application.status).color}`}>
                    {getStatusInfo(application.status).label}
                  </h2>
                  <p className="text-gray-700 text-lg">
                    {getStatusInfo(application.status).description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Application Details Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>आवेदन विवरण</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">आवेदन ID</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{application.applicationId}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">आवेदन दिनांक</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{application.applicationDate}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">नाम</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{application.name}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">पिता/पति का नाम</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{application.fatherHusbandName}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">मोबाइल नंबर</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{application.phone}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">ईमेल</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{application.email || 'N/A'}</p>
                  </div>
                </div>

                {/* Remarks */}
                {application.remarks && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">प्रशासन की टिप्पणी:</h4>
                    <p className="text-blue-800">{application.remarks}</p>
                  </div>
                )}

                {/* Review Info */}
                {application.reviewedAt && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>समीक्षा दिनांक: {new Date(application.reviewedAt).toLocaleDateString('hi-IN')}</p>
                    {application.reviewedBy && <p>समीक्षक: {application.reviewedBy}</p>}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">सहायता चाहिए?</h3>
                <p className="text-gray-600 mb-4">
                  यदि आपको अपने आवेदन के बारे में कोई प्रश्न है, तो कृपया हमसे संपर्क करें:
                </p>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-700">
                    <Phone className="w-4 h-4 mr-2 text-green-600" />
                    <strong className="mr-2">फोन:</strong> +91 9024635808
                  </p>
                  <p className="flex items-center text-gray-700">
                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                    <strong className="mr-2">ईमेल:</strong> arogyapustkalaya@gmail.com
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setApplication(null);
                  setSearchValue('');
                  setError('');
                }}
                className="flex-1"
              >
                नई खोज
              </Button>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  मुख्य पृष्ठ
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Information Section */}
        {!application && !loading && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">महत्वपूर्ण जानकारी</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <p>आवेदन जमा करने के बाद आपको एक यूनिक रोल नंबर (Application ID) प्राप्त होगा</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <p>आप अपने रोल नंबर या आधार नंबर का उपयोग करके अपने आवेदन की स्थिति ट्रैक कर सकते हैं</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <p>आवेदन की समीक्षा में 2-3 कार्य दिवस लग सकते हैं</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <p>स्वीकृति के बाद आपको फोन या ईमेल के माध्यम से सूचित किया जाएगा</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

