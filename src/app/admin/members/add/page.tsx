"use client";

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';
import Link from 'next/link';
import {
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Generate unique application ID
const generateApplicationId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `APL${timestamp.slice(-6)}${random}`;
};

// Generate form number
const generateFormNumber = () => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-4);
  return `FORM${year}${timestamp}`;
};

// Generate username
const generateUsername = (name: string, phone: string) => {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 6);
  const phoneDigits = phone.replace(/[^0-9]/g, '').slice(-4);
  return `${cleanName}${phoneDigits}`;
};

export default function AddMemberPage() {
  const [formData, setFormData] = useState({

    // Basic Information (matching the form image)
    name: '',
    fatherHusbandName: '',
    dateOfBirth: '',
    educationalQualification: '',
    workArea: '',
    gender: '',
    phone: '',
    fatherHusbandOccupation: '',
    annualIncome: '',
    guardianMemberNumber: '',
    commissionPreparationName: '',
    address: '',

    // Health & Other Information
    anyDiseaseOrTreatment: '',
    familyGovernmentEmployee: false,
    registrationFee: '0', // Free admission as mentioned

    // Party/Study Information
    fee: '0',



    // Additional Information
    admissionDate: '',
    studyLeaveDate: '',
    bloodGroup: '',
    email: '',

    // Document Upload Fields (as requested)
    profileImage: '',
    signatureImage: '',
    class10Marksheet: '',
    class12Marksheet: '',

    // Upload Types
    profileUploadType: 'file' as 'url' | 'file',
    signatureUploadType: 'file' as 'url' | 'file',
    marksheet10UploadType: 'file' as 'url' | 'file',
    marksheet12UploadType: 'file' as 'url' | 'file',

    // System Fields
    status: 'active',
    membershipType: 'basic',
    guardianName: '',
    guardianPhone: '',
    emergencyContact: '',
    emergencyPhone: '',

    // Application specific fields (as requested)
    applicationId: '',
    username: '',
    applicationType: 'library' as 'library' | 'member',

    // New fields from the form image
    course: '', // For roll number mapping
    rollNumber: ''
  });

  const [selectedFiles, setSelectedFiles] = useState({
    profile: null as File | null,
    signature: null as File | null,
    marksheet10: null as File | null,
    marksheet12: null as File | null
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  // Handle file upload to Firebase Storage
  const handleFileUpload = async (file: File, folder: string): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}-${file.name}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.fatherHusbandName) {
      alert('कृपया सभी आवश्यक फील्ड भरें (नाम, फोन, पिता/पति का नाम)');
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      // Generate application ID, form number, and username
      const applicationId = generateApplicationId();
      const formNumber = generateFormNumber();
      const username = generateUsername(formData.name, formData.phone);
      const applicationDate = new Date().toISOString().split('T')[0];

      // Upload all files
      let finalProfileImage = formData.profileImage;
      let finalSignatureImage = formData.signatureImage;
      let finalClass10Marksheet = formData.class10Marksheet;
      let finalClass12Marksheet = formData.class12Marksheet;

      // Upload profile image
      if (formData.profileUploadType === 'file' && selectedFiles.profile) {
        finalProfileImage = await handleFileUpload(selectedFiles.profile, 'student-profiles');
      }

      // Upload signature
      if (formData.signatureUploadType === 'file' && selectedFiles.signature) {
        finalSignatureImage = await handleFileUpload(selectedFiles.signature, 'student-signatures');
      }

      // Upload 10th marksheet
      if (formData.marksheet10UploadType === 'file' && selectedFiles.marksheet10) {
        finalClass10Marksheet = await handleFileUpload(selectedFiles.marksheet10, 'student-marksheets');
      }

      // Upload 12th marksheet
      if (formData.marksheet12UploadType === 'file' && selectedFiles.marksheet12) {
        finalClass12Marksheet = await handleFileUpload(selectedFiles.marksheet12, 'student-marksheets');
      }

      // Generate admission date if not provided
      const admissionDate = formData.admissionDate || new Date().toISOString().split('T')[0];

      const studentData = {
        ...formData,
        applicationId,
        formNumber,
        applicationDate,
        username,
        profileImage: finalProfileImage,
        signatureImage: finalSignatureImage,
        class10Marksheet: finalClass10Marksheet,
        class12Marksheet: finalClass12Marksheet,
        admissionDate,
        guardianName: formData.fatherHusbandName, // Map father/husband name to guardian name
        guardianPhone: formData.phone, // Use same phone as guardian for now
        booksIssued: 0,
        totalBooksRead: 0,
        fineAmount: 0,
        maxBooksAllowed: 3,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || 'admin',
        updatedAt: serverTimestamp(),
        source: 'admin' // To differentiate from public applications
      };

      await addDoc(collection(db, 'students'), studentData);

      alert(`छात्र सफलतापूर्वक जोड़ा गया!\n\nआवेदन ID: ${applicationId}\nयूजरनेम: ${username}`);
      router.push('/admin/members');

    } catch (error) {
      console.error('Error adding student:', error);
      alert('छात्र जोड़ने में त्रुटि हुई।');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Link href="/admin/members">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  वापस
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <UserPlus className="w-6 h-6 mr-2" />
                  नया छात्र जोड़ें
                </h1>
                <p className="text-gray-600">
                  नए छात्र की जानकारी भरें
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>छात्र की जानकारी</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">


                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">व्यक्तिगत जानकारी</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        नाम *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="पूरा नाम"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        पिता / पति का नाम *
                      </label>
                      <Input
                        type="text"
                        name="fatherHusbandName"
                        value={formData.fatherHusbandName}
                        onChange={handleInputChange}
                        placeholder="पिता या पति का नाम"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        जन्म तिथि (optional)
                      </label>
                      <Input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        शैक्षणिक योग्यता (optional)
                      </label>
                      <Input
                        type="text"
                        name="educationalQualification"
                        value={formData.educationalQualification}
                        onChange={handleInputChange}
                        placeholder="जैसे: 12वीं, स्नातक, स्नातकोत्तर"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        कार्यक्षेत्र (optional)
                      </label>
                      <Input
                        type="text"
                        name="workArea"
                        value={formData.workArea}
                        onChange={handleInputChange}
                        placeholder="कार्य का क्षेत्र"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        वर्ग (optional)
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="वर्ग चुनें"
                      >
                        <option value="">चुनें</option>
                        <option value="male">पुरुष</option>
                        <option value="female">महिला</option>
                        <option value="other">अन्य</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        मो.
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        पिता / पति का व्यवसाय (optional)
                      </label>
                      <Input
                        type="text"
                        name="fatherHusbandOccupation"
                        value={formData.fatherHusbandOccupation}
                        onChange={handleInputChange}
                        placeholder="व्यवसाय"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        वार्षिक आय (optional)
                      </label>
                      <Input
                        type="text"
                        name="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleInputChange}
                        placeholder="वार्षिक आय"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        अभिभावक सदस्य नं. (optional)
                      </label>
                      <Input
                        type="text"
                        name="guardianMemberNumber"
                        value={formData.guardianMemberNumber}
                        onChange={handleInputChange}
                        placeholder="सदस्य संख्या"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        कंपीटिशन /प्रतियोगिता परीक्षा तैयारी (optional)
                      </label>
                      <Input
                        type="text"
                        name="commissionPreparationName"
                        value={formData.commissionPreparationName}
                        onChange={handleInputChange}
                        placeholder="तैयारी का नाम"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      पता (optional)
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="पूरा पता"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      कोई एलर्जी, उपचार या कोई अन्य समस्या (optional)
                    </label>
                    <textarea
                      name="anyDiseaseOrTreatment"
                      value={formData.anyDiseaseOrTreatment}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="स्वास्थ्य संबंधी जानकारी"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="familyGovernmentEmployee"
                          checked={formData.familyGovernmentEmployee}
                          onChange={(e) => setFormData(prev => ({ ...prev, familyGovernmentEmployee: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          परिवार से सरकारी कर्मचारी
                        </span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        रजिस्ट्रेशन शुल्क
                      </label>
                      <Input
                        type="text"
                        name="registrationFee"
                        value={formData.registrationFee}
                        onChange={handleInputChange}
                        placeholder="शुल्क राशि"
                      />
                    </div>
                  </div>


                </div>



                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">अतिरिक्त जानकारी</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        प्रवेश दिनांक (optional)
                      </label>
                      <Input
                        type="date"
                        name="admissionDate"
                        value={formData.admissionDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        अध्ययन छोड़ने की तारीख (optional)
                      </label>
                      <Input
                        type="date"
                        name="studyLeaveDate"
                        value={formData.studyLeaveDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ब्लड ग्रुप (optional)
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="ब्लड ग्रुप चुनें"
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ईमेल पता (optional)
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        सदस्यता प्रकार
                      </label>
                      <select
                        name="membershipType"
                        value={formData.membershipType}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="सदस्यता प्रकार चुनें"
                      >
                        <option value="basic">सामान्य</option>
                        <option value="premium">प्रीमियम</option>
                        <option value="lifetime">आजीवन</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Profile Image Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">प्रोफाइल फोटो</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        अपलोड प्रकार
                      </label>
                      <div className="flex space-x-4 mb-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="url"
                            checked={formData.profileUploadType === 'url'}
                            onChange={(e) => setFormData(prev => ({ ...prev, profileUploadType: e.target.value as 'url' }))}
                            className="mr-2"
                          />
                          URL से
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="file"
                            checked={formData.profileUploadType === 'file'}
                            onChange={(e) => setFormData(prev => ({ ...prev, profileUploadType: e.target.value as 'file' }))}
                            className="mr-2"
                          />
                          फाइल अपलोड
                        </label>
                      </div>

                      {formData.profileUploadType === 'url' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            फोटो URL
                          </label>
                          <Input
                            name="profileImage"
                            value={formData.profileImage}
                            onChange={handleInputChange}
                            placeholder="https://example.com/photo.jpg"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            फोटो फाइल चुनें
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFiles(prev => ({ ...prev, profile: e.target.files?.[0] || null }))}
                            className="w-full p-3 border border-gray-300 rounded-md"
                            title="प्रोफाइल फोटो चुनें"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">आपातकालीन संपर्क</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        संपर्क व्यक्ति का नाम
                      </label>
                      <Input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        placeholder="आपातकालीन संपर्क व्यक्ति"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        आपातकालीन फोन नंबर
                      </label>
                      <Input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                {/* Declaration */}
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">घोषणा</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    मैं सत्य लेता / लेती हूं कि एरोज्ञा संस्थान में किसी प्रकार का नशा, गलत व्यवहार एवं किसी भी नियमों के विरुद्ध कार्य नहीं करूंगा / करूंगी।
                    मैं संस्था के नियमों का पूर्ण रूप से पालना करते हुए सच्चाई, कर्तव्यनिष्ठा, ईमानदारी के साथ अध्ययन करूंगा / करूंगी।
                    मेरी किसी भी तरह से अनुशासनहीनता पाई जाती है, तो संस्था मेरे विरुद्ध कानूनी कार्यवाही करते हुए मुझे पुस्तकालय से निकाल सकते है।
                    जिसकी सम्मत जिम्मेदारी मेरी स्वयं की होगी। और मैं भविष्य में कभी भी संस्था के प्रति अपनी द्वेष भावना नहीं रखूंगा / रखूंगी।
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Link href="/admin/members">
                    <Button type="button" variant="outline">
                      रद्द करें
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading || uploading}>
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {loading || uploading ? 'सेव हो रहा है...' : 'छात्र जोड़ें'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}