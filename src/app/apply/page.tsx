"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  GraduationCap,
  FileText,
  CheckCircle,
  Upload,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileImage,
  Save,
  Download,
  Search,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

// Generate unique application ID
const generateApplicationId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LIB${timestamp.slice(-6)}${random}`;
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

export default function ApplyPage() {
  const [selectedOption, setSelectedOption] = useState<'library' | 'member' | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationData, setApplicationData] = useState<{ applicationId: string, username: string } | null>(null);

  const [formData, setFormData] = useState({

    // Basic Information (matching the form image)
    name: '',
    fatherHusbandName: '',
    dateOfBirth: '',
    educationalQualification: '',
    workArea: '',
    gender: '',
    phone: '',
    aadharNumber: '', // Added Aadhar card number field
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

    // System Fields
    status: 'pending',
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

  // Generate PDF receipt
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('एरोज्ञा पुस्तकालय एवं कोचिंग संस्थान', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('मालिया की ढाणी, आरजीटी सर्कल, नगर, गुडामलानी, बाड़मेर', 105, 28, { align: 'center' });
    
    // Success Badge
    doc.setFillColor(34, 197, 94); // Green
    doc.rect(70, 35, 70, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('APPLICATION SUCCESSFUL', 105, 44, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Application Details Box
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Application Details:', 20, 60);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const appDetails = [
      ['Application ID:', applicationData?.applicationId || ''],
      ['Username:', applicationData?.username || ''],
      ['Name:', formData.name],
      ['Father/Husband Name:', formData.fatherHusbandName],
      ['Mobile:', formData.phone],
      ['Aadhar Number:', formData.aadharNumber],
      ['Email:', formData.email || 'N/A'],
      ['Date of Birth:', formData.dateOfBirth || 'N/A'],
      ['Educational Qualification:', formData.educationalQualification || 'N/A'],
      ['Address:', formData.address || 'N/A'],
      ['Application Date:', new Date().toLocaleDateString('en-IN')],
      ['Status:', 'Pending Review']
    ];
    
    autoTable(doc, {
      startY: 65,
      head: [],
      body: appDetails,
      theme: 'grid',
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 70 },
        1: { cellWidth: 110 }
      }
    });
    
    // Instructions
    const finalY = (doc as any).lastAutoTable.finalY || 200;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Important Instructions:', 20, finalY + 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const instructions = [
      '1. Please keep this receipt safe for future reference',
      '2. Your application is under review and will be processed within 2-3 working days',
      '3. You can track your application status using Application ID or Aadhar Number',
      '4. Visit our website: arogyapustkalaya.com/track-application',
      '5. For queries, contact: +91 99518 00733 or email: arogyapustkalaya@gmail.com'
    ];
    
    let yPos = finalY + 22;
    instructions.forEach(instruction => {
      doc.text(instruction, 25, yPos);
      yPos += 7;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Generated on: ' + new Date().toLocaleString('en-IN'), 105, 280, { align: 'center' });
    doc.text('This is a computer-generated document and does not require a signature', 105, 285, { align: 'center' });
    
    // Save PDF
    doc.save(`Application_${applicationData?.applicationId || 'Receipt'}.pdf`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFileChange = (fileType: string, file: File | null) => {
    setSelectedFiles(prev => ({
      ...prev,
      [fileType]: file
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

  const handleOptionSelect = (option: 'library' | 'member') => {
    setSelectedOption(option);
    setFormData(prev => ({ ...prev, applicationType: option }));
    if (option === 'library') {
      setShowForm(true);
    } else {
      // For member option, show coming soon message
      alert('सदस्यता आवेदन की सुविधा जल्द ही उपलब्ध होगी।');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.fatherHusbandName || !formData.aadharNumber) {
      alert('कृपया सभी आवश्यक फील्ड भरें (नाम, फोन, पिता/पति का नाम, आधार नंबर)');
      return;
    }

    // Validate Aadhar number (12 digits)
    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber.replace(/\s/g, ''))) {
      alert('कृपया वैध 12 अंकों का आधार नंबर दर्ज करें');
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
      if (selectedFiles.profile) {
        finalProfileImage = await handleFileUpload(selectedFiles.profile, 'applications/profiles');
      }

      // Upload signature
      if (selectedFiles.signature) {
        finalSignatureImage = await handleFileUpload(selectedFiles.signature, 'applications/signatures');
      }

      // Upload 10th marksheet
      if (selectedFiles.marksheet10) {
        finalClass10Marksheet = await handleFileUpload(selectedFiles.marksheet10, 'applications/marksheets');
      }

      // Upload 12th marksheet
      if (selectedFiles.marksheet12) {
        finalClass12Marksheet = await handleFileUpload(selectedFiles.marksheet12, 'applications/marksheets');
      }

      const applicationDataToSave = {
        ...formData,
        applicationId,
        formNumber,
        applicationDate,
        username,
        profileImage: finalProfileImage,
        signatureImage: finalSignatureImage,
        class10Marksheet: finalClass10Marksheet,
        class12Marksheet: finalClass12Marksheet,
        guardianName: formData.fatherHusbandName, // Map father/husband name to guardian name
        guardianPhone: formData.phone, // Use same phone as guardian for now
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        source: 'public' // To differentiate from admin applications
      };

      await addDoc(collection(db, 'library-applications'), applicationDataToSave);

      setApplicationData({ applicationId, username });
      setApplicationSubmitted(true);

    } catch (error) {
      console.error('Error submitting application:', error);
      alert('आवेदन जमा करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (applicationSubmitted && applicationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center shadow-lg">
            <CardContent className="p-8">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                आवेदन सफलतापूर्वक जमा हुआ!
              </h2>
              <p className="text-gray-600 mb-6">
                आपका आवेदन सफलतापूर्वक प्राप्त हो गया है
              </p>

              {/* Application Details */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📋 आपकी आवेदन जानकारी</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">आवेदन ID / रोल नंबर</p>
                    <p className="text-lg font-bold text-blue-600">{applicationData.applicationId}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">यूजरनेम</p>
                    <p className="text-lg font-bold text-purple-600">{applicationData.username}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">नाम</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.name}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-1">मोबाइल नंबर</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.phone}</p>
                  </div>
                </div>
              </div>

              {/* Important Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  महत्वपूर्ण जानकारी:
                </h4>
                <ul className="text-sm text-yellow-700 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>अपनी आवेदन ID को सुरक्षित रखें - यह आपके आवेदन को ट्रैक करने के लिए आवश्यक है</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>आपका आवेदन 2-3 कार्य दिवसों में समीक्षा की जाएगी</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>स्वीकृति के बाद आपको फोन या ईमेल से सूचित किया जाएगा</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>अपनी रसीद PDF डाउनलोड करें और सुरक्षित रखें</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Button 
                  onClick={generatePDF}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  PDF रसीद डाउनलोड करें
                </Button>
                <Link href="/track-application" className="w-full">
                  <Button variant="outline" className="w-full" size="lg">
                    <Search className="w-5 h-5 mr-2" />
                    आवेदन ट्रैक करें
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="w-full"
                >
                  नया आवेदन करें
                </Button>
                <Link href="/" className="w-full">
                  <Button variant="outline" className="w-full">
                    मुख्य पृष्ठ पर जाएं
                  </Button>
                </Link>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">सहायता के लिए संपर्क करें:</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
                  <a href="tel:+919951800733" className="text-green-600 hover:text-green-700 font-medium flex items-center justify-center">
                    <Phone className="w-4 h-4 mr-1" />
                    +91 99518 00733
                  </a>
                  <a href="mailto:arogyapustkalaya@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center">
                    <Mail className="w-4 h-4 mr-1" />
                    arogyapustkalaya@gmail.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showForm && selectedOption === 'library') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Button
                variant="ghost"
                size="sm"
                className="mr-4"
                onClick={() => setShowForm(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <GraduationCap className="w-6 h-6 mr-2" />
                  पुस्तकालय छात्र आवेदन
                </h1>
                <p className="text-gray-600">
                  निःशुल्क पुस्तकालय सदस्यता के लिए आवेदन करें
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                एरोज्ञा पुस्तकालय एवं कोचिंग संस्थान
              </CardTitle>
              <p className="text-center text-sm text-gray-600">
                मालिया की ढाणी, आरजीटी सर्कल, नगर, गुडामलानी, बाड़मेर
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">


                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">व्यक्तिगत जानकारी</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
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
                        <Calendar className="w-4 h-4 inline mr-1" />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        मोबाइल नंबर *
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 inline mr-1" />
                        आधार नंबर *
                      </label>
                      <Input
                        type="text"
                        name="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={handleInputChange}
                        placeholder="xxxx xxxx xxxx"
                        maxLength={14}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">12 अंकों का आधार नंबर दर्ज करें</p>
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
                        कमीशन तैयारी का नाम (optional)
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
                      <MapPin className="w-4 h-4 inline mr-1" />
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
                          onChange={(e) => handleCheckboxChange('familyGovernmentEmployee', e.target.checked)}
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
                        value="निःशुल्क"
                        disabled
                        className="bg-green-50 text-green-800"
                      />
                    </div>
                  </div>



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                </div>



                {/* Document Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    <FileImage className="w-5 h-5 inline mr-2" />
                    दस्तावेज अपलोड करें
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Photo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        पासपोर्ट साइज फोटो *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('profile', e.target.files?.[0] || null)}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-2">JPG, PNG फॉर्मेट में</p>
                      </div>
                    </div>

                    {/* Signature */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        हस्ताक्षर *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('signature', e.target.files?.[0] || null)}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-2">JPG, PNG फॉर्मेट में</p>
                      </div>
                    </div>

                    {/* 10th Marksheet */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        10वीं की मार्कशीट (optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange('marksheet10', e.target.files?.[0] || null)}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-2">JPG, PNG, PDF फॉर्मेट में</p>
                      </div>
                    </div>

                    {/* 12th Marksheet */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        12वीं की मार्कशीट (optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange('marksheet12', e.target.files?.[0] || null)}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-2">JPG, PNG, PDF फॉर्मेट में</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Declaration */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">घोषणा:</h4>
                  <p className="text-sm text-yellow-700">
                    मैं घोषणा करता/करती हूं कि एरोज्ञा संस्था में किसी प्रकार का नशा, गलत व्यवहार एवं किसी भी नियमों के विरुद्ध कार्य नहीं करूंगा/करूंगी। मैं किसी भी तरह से अनुशासनहीनता पाई जाती है, तो संस्था मेरे विरुद्ध कानूनी कार्यवाही करते हुए मुझे पुस्तकालय से निकाल सकते हैं। जिसकी सम्पूर्ण जिम्मेदारी मेरी स्वयं की होगी। और मैं भविष्य में कभी भी संस्था के प्रति अपनी द्वेष भावना नहीं रखूंगा/रखूंगी।
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-8 py-3 text-lg"
                  >
                    {loading ? (
                      <>
                        <Upload className="w-5 h-5 mr-2 animate-spin" />
                        {uploading ? 'फाइलें अपलोड हो रही हैं...' : 'आवेदन जमा हो रहा है...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        आवेदन जमा करें
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            आवेदन करें
          </h1>
          <p className="text-xl text-gray-600">
            एरोज्ञा पुस्तकालय एवं सेवा संस्था में शामिल होने के लिए आवेदन करें
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Library Student Application */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleOptionSelect('library')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">पुस्तकालय छात्र आवेदन</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-semibold">निःशुल्क प्रवेश</p>
                  <p className="text-green-600 text-sm">कोई शुल्क नहीं</p>
                </div>

                <div className="space-y-2 text-left">
                  <h4 className="font-semibold text-gray-800">सुविधाएं:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      निःशुल्क पुस्तकालय सदस्यता
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      पुस्तक इश्यू करने की सुविधा
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      अध्ययन कक्ष की सुविधा
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      प्रतियोगी परीक्षा की तैयारी
                    </li>
                  </ul>
                </div>

                <Button className="w-full" onClick={() => handleOptionSelect('library')}>
                  <FileText className="w-4 h-4 mr-2" />
                  आवेदन करें
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Member Application */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75" onClick={() => handleOptionSelect('member')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">सदस्यता आवेदन</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-800 font-semibold">जल्द ही उपलब्ध</p>
                  <p className="text-purple-600 text-sm">Coming Soon</p>
                </div>

                <div className="space-y-2 text-left">
                  <h4 className="font-semibold text-gray-800">सुविधाएं:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                      संस्था की सभी सुविधाएं
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                      कार्यक्रमों में भागीदारी
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                      विशेष छूट और लाभ
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                      सामाजिक सेवा में योगदान
                    </li>
                  </ul>
                </div>

                <Button variant="outline" className="w-full" disabled>
                  <Users className="w-4 h-4 mr-2" />
                  जल्द ही उपलब्ध
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">आवेदन संबंधी जानकारी</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">आवश्यक दस्तावेज:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <FileText className="w-4 h-4 text-blue-500 mr-2" />
                      पासपोर्ट साइज फोटो
                    </li>
                    <li className="flex items-center">
                      <FileText className="w-4 h-4 text-blue-500 mr-2" />
                      हस्ताक्षर
                    </li>
                    <li className="flex items-center">
                      <FileText className="w-4 h-4 text-blue-500 mr-2" />
                      10वीं की मार्कशीट
                    </li>
                    <li className="flex items-center">
                      <FileText className="w-4 h-4 text-blue-500 mr-2" />
                      12वीं की मार्कशीट
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">संपर्क जानकारी:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 text-green-500 mr-2" />
                      +91 99518 00733
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 text-green-500 mr-2" />
                      arogyapustkalaya@gmail.com
                    </p>
                    <p className="flex items-center">
                      <MapPin className="w-4 h-4 text-green-500 mr-2" />
                      मालिया की ढाणी, गुडामलानी, बाड़मेर
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}