"use client";

import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Plus,
  X
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
import { useSettings } from '@/contexts/SettingsContext';
import { getAvailableSeats, areSeatsAvailable, TOTAL_LIBRARY_SEATS } from '@/lib/seatAvailability';

// Generate unique application ID (6 digits)
const generateApplicationId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${timestamp.slice(-3)}${random}`;
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
  const { settings } = useSettings();
  const [selectedOption, setSelectedOption] = useState<'library' | 'member' | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [availableSeats, setAvailableSeats] = useState<number>(TOTAL_LIBRARY_SEATS);
  const [seatsLoading, setSeatsLoading] = useState(true);
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

    // Document Upload Fields (simplified)
    profileImage: '',
    aadharCardImage: '',

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

    // Education Information - Array to support multiple qualifications
    educationDetails: [
      {
        id: 1,
        educationLevel: '',
        board: '',
        status: '',
        percentage: ''
      }
    ],

    // New fields from the form image
    course: '', // For roll number mapping
    rollNumber: ''
  });

  const [selectedFiles, setSelectedFiles] = useState({
    profile: null as File | null,
    aadharCard: null as File | null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const seats = await getAvailableSeats();
        setAvailableSeats(seats);
      } catch (error) {
        console.error('Error fetching available seats:', error);
      } finally {
        setSeatsLoading(false);
      }
    };

    fetchSeats();
  }, []);

  // Generate PDF receipt
  const generatePDF = () => {
    const doc = new jsPDF();

    // Professional Header with Border
    // Top border line
    doc.setLineWidth(2);
    doc.setDrawColor(34, 197, 94); // Green color
    doc.line(15, 15, 195, 15);

    // Organization Name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('AROGYA PUSTKALAYA & COACHING INSTITUTE', 105, 25, { align: 'center' });

    // Address
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Maliyan Ki Dhani, RGT Circle, Nagar, Gudamalani, Barmer', 105, 32, { align: 'center' });

    // Contact Information
    doc.setFontSize(9);
    const contactInfo = `Phone: ${settings.phone || '+91 9024635808'} | Email: ${settings.email || 'arogyapustkalaya@gmail.com'}`;
    doc.text(contactInfo, 105, 38, { align: 'center' });

    // Bottom border line for header
    doc.setLineWidth(1);
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 42, 195, 42);

    // Success Badge with better positioning
    doc.setFillColor(34, 197, 94); // Green
    doc.rect(60, 48, 90, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('APPLICATION SUCCESSFUL', 105, 58, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Application Details Box
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Application Details:', 20, 75);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const appDetails = [
      ['Application ID:', applicationData?.applicationId || ''],
      ['Username:', applicationData?.username || ''],
      ['Name:', formData.name],
      ['Father/Husband Name:', formData.fatherHusbandName],
      ['Mobile Number:', formData.phone],
      ['Aadhar Number:', formData.aadharNumber],
      ['Email:', formData.email || 'N/A'],
      ['Date of Birth:', formData.dateOfBirth || 'N/A'],
      ['Educational Qualification:', formData.educationalQualification || 'N/A'],
      ['Address:', formData.address || 'N/A'],
      ['Application Date:', new Date().toLocaleDateString('en-IN')],
      ['Status:', 'Under Review']
    ];

    autoTable(doc, {
      startY: 80,
      head: [],
      body: appDetails,
      theme: 'striped',
      styles: {
        fontSize: 10,
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.5
      },
      columnStyles: {
        0: {
          fontStyle: 'bold',
          cellWidth: 70,
          fillColor: [248, 250, 252]
        },
        1: {
          cellWidth: 110,
          fillColor: [255, 255, 255]
        }
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      }
    });

    // Instructions
    const finalY = (doc as any).lastAutoTable.finalY || 200;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Important Instructions:', 20, finalY + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const instructions = [
      '1. Please keep this receipt safe for future reference',
      '2. Your application is under review and will be processed within 2-3 working days',
      '3. You can track your application status using Application ID or Aadhar Number',
      '4. Visit our website: arogyapustkalaya.com/track-application',
      `5. For queries, contact: ${settings.phone || '+91 9024635808'} or email: ${settings.email || 'arogyapustkalaya@gmail.com'}`
    ];

    let yPos = finalY + 22;
    instructions.forEach(instruction => {
      doc.text(instruction, 25, yPos);
      yPos += 6;
    });

    // Footer with border
    doc.setLineWidth(1);
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 275, 195, 275);

    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Generated on: ' + new Date().toLocaleString('en-IN'), 105, 282, { align: 'center' });
    doc.text('This is a computer-generated document and does not require a signature', 105, 287, { align: 'center' });

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

  // Education management functions
  const handleEducationChange = (id: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      educationDetails: prev.educationDetails.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducationEntry = () => {
    const newId = Math.max(...formData.educationDetails.map(edu => edu.id)) + 1;
    setFormData(prev => ({
      ...prev,
      educationDetails: [
        ...prev.educationDetails,
        {
          id: newId,
          educationLevel: '',
          board: '',
          status: '',
          percentage: ''
        }
      ]
    }));
  };

  const removeEducationEntry = (id: number) => {
    if (formData.educationDetails.length > 1) {
      setFormData(prev => ({
        ...prev,
        educationDetails: prev.educationDetails.filter(edu => edu.id !== id)
      }));
    }
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

    // Only allow submission on step 3
    if (currentStep !== 3) {
      alert('Please complete all steps / कृपया सभी चरण पूरे करें');
      return;
    }

    // Check if seats are available for library applications
    if (selectedOption === 'library') {
      const seatsAvailable = await areSeatsAvailable();
      if (!seatsAvailable) {
        alert('क्षमा करें, पुस्तकालय की सभी सीटें भर गई हैं। कृपया बाद में पुनः प्रयास करें।');
        return;
      }
    }

    // Validate required fields
    if (!formData.name || !formData.phone || !formData.fatherHusbandName || !formData.aadharNumber) {
      alert('Please fill all required fields / कृपया सभी आवश्यक फील्ड भरें');
      return;
    }

    // Validate education details
    const incompleteEducation = formData.educationDetails.find(edu =>
      !edu.educationLevel || !edu.board || !edu.status
    );
    if (incompleteEducation) {
      alert('Please complete all education details / कृपया सभी शैक्षणिक जानकारी पूरी भरें');
      return;
    }

    // Validate documents
    if (!selectedFiles.profile) {
      alert('Please upload passport size photo / कृपया पासपोर्ट साइज फोटो अपलोड करें');
      return;
    }
    if (!selectedFiles.aadharCard) {
      alert('Please upload Aadhar card / कृपया आधार कार्ड अपलोड करें');
      return;
    }

    // Validate Aadhar number (12 digits)
    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber.replace(/\s/g, ''))) {
      alert('Please enter valid 12-digit Aadhar number / कृपया वैध 12 अंकों का आधार नंबर दर्ज करें');
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
      let finalAadharCardImage = formData.aadharCardImage;

      // Upload profile image
      if (selectedFiles.profile) {
        finalProfileImage = await handleFileUpload(selectedFiles.profile, 'applications/profiles');
      }

      // Upload Aadhar card
      if (selectedFiles.aadharCard) {
        finalAadharCardImage = await handleFileUpload(selectedFiles.aadharCard, 'applications/documents');
      }

      const applicationDataToSave = {
        ...formData,
        applicationId,
        formNumber,
        applicationDate,
        username,
        profileImage: finalProfileImage,
        aadharCardImage: finalAadharCardImage,
        educationDetails: formData.educationDetails,
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
            <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="text-center text-xl font-bold text-gray-800">
                {settings.siteName || 'एरोज्ञा पुस्तकालय एवं कोचिंग संस्थान'}
              </CardTitle>
              <p className="text-center text-sm text-gray-600 mt-1">
                {settings.address || 'मालिया की ढाणी, आरजीटी सर्कल, नगर, गुडामलानी, बाड़मेर'}
              </p>
              <p className="text-center text-xs text-gray-500 mt-1">
                फोन: {settings.phone || '+91 9024635808'} | ईमेल: {settings.email || 'arogyapustkalaya@gmail.com'}
              </p>
            </CardHeader>
            <CardContent>
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-2 md:space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step < currentStep
                        ? 'bg-green-600 text-white border-green-600'
                        : step === currentStep
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-200 text-gray-600 border-gray-300'
                        }`}>
                        {step < currentStep ? '✓' : step}
                      </div>
                      <div className="ml-2 text-xs md:text-sm">
                        <div className="font-medium">
                          {step === 1 && 'Personal Info'}
                          {step === 2 && 'Education'}
                          {step === 3 && 'Documents'}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {step === 1 && 'व्यक्तिगत जानकारी'}
                          {step === 2 && 'शैक्षणिक जानकारी'}
                          {step === 3 && 'दस्तावेज़ अपलोड'}
                        </div>
                      </div>
                      {step < 3 && <div className={`w-6 md:w-8 h-0.5 ml-2 md:ml-4 ${step < currentStep ? 'bg-green-600' : 'bg-gray-300'
                        }`}></div>}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Step {currentStep} of {totalSteps} / चरण {totalSteps} का {currentStep}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">


                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      व्यक्तिगत जानकारी / Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4 inline mr-1" />
                          नाम / Name *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          पिता / पति का नाम / Father's/Husband's Name *
                        </label>
                        <Input
                          type="text"
                          name="fatherHusbandName"
                          value={formData.fatherHusbandName}
                          onChange={handleInputChange}
                          placeholder="Enter father's or husband's name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          जन्म तिथि / Date of Birth (optional)
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
                          शैक्षणिक योग्यता / Educational Qualification (optional)
                        </label>
                        <Input
                          type="text"
                          name="educationalQualification"
                          value={formData.educationalQualification}
                          onChange={handleInputChange}
                          placeholder="e.g., 12th, Graduate, Post Graduate"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-1" />
                          मोबाइल नंबर / Mobile Number *
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
                          आधार नंबर / Aadhar Number *
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
                        <p className="text-xs text-gray-500 mt-1">Enter 12-digit Aadhar number</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          कार्यक्षेत्र / Work Area (optional)
                        </label>
                        <Input
                          type="text"
                          name="workArea"
                          value={formData.workArea}
                          onChange={handleInputChange}
                          placeholder="Enter work area"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          लिंग / Gender (optional)
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          title="Select gender"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ब्लड ग्रुप / Blood Group (optional)
                        </label>
                        <select
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          title="Select blood group"
                        >
                          <option value="">Select</option>
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
                          पिता / पति का व्यवसाय / Father's/Husband's Occupation (optional)
                        </label>
                        <Input
                          type="text"
                          name="fatherHusbandOccupation"
                          value={formData.fatherHusbandOccupation}
                          onChange={handleInputChange}
                          placeholder="Enter occupation"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          वार्षिक आय / Annual Income (optional)
                        </label>
                        <Input
                          type="text"
                          name="annualIncome"
                          value={formData.annualIncome}
                          onChange={handleInputChange}
                          placeholder="Enter annual income"
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
                        पता / Address (optional)
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter complete address"
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
                        ईमेल पता / Email Address (optional)
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
                )}

                {/* Step 2: Education Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      <GraduationCap className="w-5 h-5 inline mr-2" />
                      शैक्षणिक जानकारी / Educational Information
                    </h3>

                    {formData.educationDetails.map((education, index) => (
                      <div key={education.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-800">
                            शिक्षा विवरण / Education Details {index + 1}
                          </h4>
                          {formData.educationDetails.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeEducationEntry(education.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {/* Education Level */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              शिक्षा / Education *
                            </label>
                            <select
                              value={education.educationLevel}
                              onChange={(e) => handleEducationChange(education.id, 'educationLevel', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            >
                              <option value="">Select</option>
                              <option value="5th">5th Class</option>
                              <option value="8th">8th Class</option>
                              <option value="10th">10th Class</option>
                              <option value="12th">12th Class</option>
                              <option value="diploma">Diploma</option>
                              <option value="iti">ITI</option>
                              <option value="graduate">Graduate</option>
                              <option value="post_graduate">Post Graduate</option>
                              <option value="phd">PhD</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          {/* Board/University */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              बोर्ड / Board *
                            </label>
                            <Input
                              type="text"
                              value={education.board}
                              onChange={(e) => handleEducationChange(education.id, 'board', e.target.value)}
                              placeholder="Enter board/university name"
                              required
                            />
                          </div>

                          {/* Status */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              स्थिति / Status *
                            </label>
                            <select
                              value={education.status}
                              onChange={(e) => handleEducationChange(education.id, 'status', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            >
                              <option value="">Select</option>
                              <option value="passed">Passed</option>
                              <option value="failed">Failed</option>
                              <option value="appearing">Appearing</option>
                            </select>
                          </div>

                          {/* Percentage */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              प्रतिशत / Percentage
                            </label>
                            <Input
                              type="number"
                              value={education.percentage}
                              onChange={(e) => handleEducationChange(education.id, 'percentage', e.target.value)}
                              placeholder="Enter percentage"
                              min="0"
                              max="100"
                              step="0.01"
                              disabled={education.status !== 'passed'}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add More Button */}
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addEducationEntry}
                        className="px-6 py-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add More +
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Document Upload */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      <FileImage className="w-5 h-5 inline mr-2" />
                      दस्तावेज़ अपलोड करें / Document Upload
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Profile Photo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          पासपोर्ट साइज फोटो / Passport Size Photo *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange('profile', e.target.files?.[0] || null)}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-2">JPG, PNG format only</p>
                        </div>
                      </div>

                      {/* Aadhar Card */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          आधार कार्ड / Aadhar Card *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange('aadharCard', e.target.files?.[0] || null)}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-2">JPG, PNG, PDF format only</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Declaration - Only show on step 3 */}
                {currentStep === 3 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">घोषणा:</h4>
                    <p className="text-sm text-yellow-700">
                      मैं घोषणा करता/करती हूं कि एरोज्ञा संस्था में किसी प्रकार का नशा, गलत व्यवहार एवं किसी भी नियमों के विरुद्ध कार्य नहीं करूंगा/करूंगी। मैं किसी भी तरह से अनुशासनहीनता पाई जाती है, तो संस्था मेरे विरुद्ध कानूनी कार्यवाही करते हुए मुझे पुस्तकालय से निकाल सकते हैं। जिसकी सम्पूर्ण जिम्मेदारी मेरी स्वयं की होगी। और मैं भविष्य में कभी भी संस्था के प्रति अपनी द्वेष भावना नहीं रखूंगा/रखूंगी।
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 py-2"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      पिछला
                    </Button>
                  )}

                  <div className="flex-1"></div>

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        // Validation for each step
                        if (currentStep === 1) {
                          if (!formData.name || !formData.phone || !formData.fatherHusbandName || !formData.aadharNumber) {
                            alert('Please fill all required fields / कृपया सभी आवश्यक फील्ड भरें');
                            return;
                          }
                        }
                        if (currentStep === 2) {
                          const incompleteEducation = formData.educationDetails.find(edu =>
                            !edu.educationLevel || !edu.board || !edu.status
                          );
                          if (incompleteEducation) {
                            alert('Please complete all education details / कृपया सभी शैक्षणिक जानकारी पूरी भरें');
                            return;
                          }

                          const missingPercentage = formData.educationDetails.find(edu =>
                            edu.status === 'passed' && !edu.percentage
                          );
                          if (missingPercentage) {
                            alert('Please enter percentage for passed qualifications / कृपया उत्तीर्ण योग्यताओं के लिए प्रतिशत दर्ज करें');
                            return;
                          }
                        }

                        console.log('Moving from step', currentStep, 'to step', currentStep + 1);
                        setCurrentStep(currentStep + 1);
                      }}
                      className="px-6 py-2"
                    >
                      Next / अगला
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading || uploading}
                      className="px-8 py-3 text-lg"
                      onClick={(e) => {
                        // Validation for step 3 (documents)
                        if (!selectedFiles.profile) {
                          e.preventDefault();
                          alert('Please upload passport size photo / कृपया पासपोर्ट साइज फोटो अपलोड करें');
                          return;
                        }
                        if (!selectedFiles.aadharCard) {
                          e.preventDefault();
                          alert('Please upload Aadhar card / कृपया आधार कार्ड अपलोड करें');
                          return;
                        }
                      }}
                    >
                      {loading ? (
                        <>
                          <Upload className="w-5 h-5 mr-2 animate-spin" />
                          {uploading ? 'Uploading files... / फाइलें अपलोड हो रही हैं...' : 'Submitting application... / आवेदन जमा हो रहा है...'}
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Submit Application / आवेदन जमा करें
                        </>
                      )}
                    </Button>
                  )}
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

                {/* Seat Availability */}
                <div className={`border rounded-lg p-4 ${
                  seatsLoading ? 'bg-gray-50 border-gray-200' :
                  availableSeats === 0 ? 'bg-red-50 border-red-200' :
                  availableSeats <= 10 ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  {seatsLoading ? (
                    <p className="text-gray-600 text-sm animate-pulse">सीट की जानकारी लोड हो रही है...</p>
                  ) : availableSeats === 0 ? (
                    <>
                      <p className="text-red-800 font-semibold">सीटें भर गई हैं</p>
                      <p className="text-red-600 text-sm">कृपया बाद में पुनः प्रयास करें</p>
                    </>
                  ) : (
                    <>
                      <p className={`font-semibold ${
                        availableSeats <= 10 ? 'text-yellow-800' : 'text-blue-800'
                      }`}>
                        {availableSeats} सीटें उपलब्ध
                      </p>
                      <p className={`text-sm ${
                        availableSeats <= 10 ? 'text-yellow-600' : 'text-blue-600'
                      }`}>
                        कुल {TOTAL_LIBRARY_SEATS} में से
                      </p>
                      {availableSeats <= 10 && (
                        <p className="text-yellow-700 text-xs mt-1 font-medium">
                          जल्दी करें! सीमित सीटें बची हैं
                        </p>
                      )}
                    </>
                  )}
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

                <Button 
                  className="w-full" 
                  onClick={() => handleOptionSelect('library')}
                  disabled={availableSeats === 0}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {availableSeats === 0 ? 'सीटें भर गई हैं' : 'आवेदन करें'}
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