"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Save, 
  Globe, 
  Phone, 
  MessageCircle,
  Building,
  Eye,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface WebsiteSettings {
  // Basic Information
  siteName: string;
  siteTitle: string;
  tagline: string;
  description: string;
  logo: string;
  favicon: string;
  
  // Contact Information
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapLink: string;
  mapIframe: string;
  
  // Social Media Links
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  
  // Organization Details
  establishedYear: string;
  registrationNumber: string;
  chairperson: string;
  viceChairperson: string;
  secretary: string;
  
  // Office Hours
  officeHours: string;
  libraryHours: string;
  
  // SEO Settings
  metaKeywords: string;
  googleAnalytics: string;
  googleVerification?: string;
  bingVerification?: string;
  
  // Emergency Contact
  emergencyContact: string;
  emergencyPhone: string;
  
  // Bank Details (for donations)
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  
  // Last Updated
  updatedAt?: Date;
  updatedBy?: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings>({
    siteName: 'एरोग्या पुस्तकालय एवं सेवा संस्था',
    siteTitle: 'एरोग्या पुस्तकालय एवं सेवा संस्था - बाड़मेर राजस्थान',
    tagline: 'समाज सेवा में समर्पित',
    description: 'बाड़मेर राजस्थान में 2020 से सेवारत एरोग्या पुस्तकालय एवं सेवा संस्था। निःशुल्क पुस्तकालय, रक्तदान शिविर, स्वास्थ्य सेवा।',
    logo: '',
    favicon: '',
    phone: '+91 96600 89144',
    whatsapp: '+91 96600 89144',
    email: 'arogyapustkalaya@gmail.com',
    address: 'गुडामलानी, बाड़मेर, राजस्थान',
    mapLink: '',
    mapIframe: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    establishedYear: '2020',
    registrationNumber: '',
    chairperson: 'श्री आत्माराम बोरा',
    viceChairperson: 'श्री बाबूराम शर्मा',
    secretary: '',
    officeHours: 'सुबह 9:00 से शाम 6:00 तक',
    libraryHours: 'सुबह 9:00 से शाम 6:00 तक',
    metaKeywords: 'एरोग्या पुस्तकालय, बाड़मेर NGO, राजस्थान पुस्तकालय, निःशुल्क पुस्तकालय, रक्तदान शिविर',
    googleAnalytics: '',
    googleVerification: '',
    bingVerification: '',
    emergencyContact: 'श्री आत्माराम बोरा',
    emergencyPhone: '+91 96600 89144',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const settingsDoc = await getDoc(doc(db, 'settings', 'website'));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setSettings(prev => ({
          ...prev,
          ...data,
          updatedAt: data.updatedAt?.toDate() || new Date()
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof WebsiteSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (file: File, type: 'logo' | 'favicon'): Promise<string> => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}-${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `website/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('कृपया केवल JPG, PNG, GIF या WebP फॉर्मेट की इमेज अपलोड करें।');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('फाइल का साइज 2MB से कम होना चाहिए।');
        return;
      }
      
      setLogoFile(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/x-icon'];
      if (!validTypes.includes(file.type)) {
        alert('कृपया केवल JPG, PNG, GIF, WebP या ICO फॉर्मेट की इमेज अपलोड करें।');
        return;
      }
      
      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        alert('फाइल का साइज 1MB से कम होना चाहिए।');
        return;
      }
      
      setFaviconFile(file);
    }
  };

  const removeLogoFile = () => {
    setLogoFile(null);
  };

  const removeFaviconFile = () => {
    setFaviconFile(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (validTypes.includes(file.type) && file.size <= 2 * 1024 * 1024) {
        setLogoFile(file);
      } else {
        alert('कृपया केवल JPG, PNG, GIF या WebP फॉर्मेट की इमेज अपलोड करें (अधिकतम 2MB)।');
      }
    }
  };

  const handleFaviconDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/x-icon'];
      if (validTypes.includes(file.type) && file.size <= 1024 * 1024) {
        setFaviconFile(file);
      } else {
        alert('कृपया केवल JPG, PNG, GIF, WebP या ICO फॉर्मेट की इमेज अपलोड करें (अधिकतम 1MB)।');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setUploading(true);
    
    try {
      const updatedSettings = { ...settings };

      // Upload logo if new file is selected
      if (logoFile) {
        try {
          console.log('Uploading logo:', logoFile.name);
          const logoURL = await handleFileUpload(logoFile, 'logo');
          console.log('Logo uploaded successfully:', logoURL);
          updatedSettings.logo = logoURL;
          setLogoFile(null);
        } catch (error) {
          console.error('Error uploading logo:', error);
          alert(`लोगो अपलोड करने में त्रुटि हुई: ${error instanceof Error ? error.message : 'अज्ञात त्रुटि'}`);
          return;
        }
      }

      // Upload favicon if new file is selected
      if (faviconFile) {
        try {
          console.log('Uploading favicon:', faviconFile.name);
          const faviconURL = await handleFileUpload(faviconFile, 'favicon');
          console.log('Favicon uploaded successfully:', faviconURL);
          updatedSettings.favicon = faviconURL;
          setFaviconFile(null);
        } catch (error) {
          console.error('Error uploading favicon:', error);
          alert(`फेविकॉन अपलोड करने में त्रुटि हुई: ${error instanceof Error ? error.message : 'अज्ञात त्रुटि'}`);
          return;
        }
      }

      const settingsData = {
        ...updatedSettings,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || 'unknown'
      };

      await setDoc(doc(db, 'settings', 'website'), settingsData);
      setSettings(updatedSettings);
      alert('सेटिंग्स सफलतापूर्वक सेव हो गईं!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('सेटिंग्स सेव करने में त्रुटि हुई।');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'मुख्य जानकारी', icon: <Globe className="w-4 h-4" /> },
    { id: 'contact', label: 'संपर्क विवरण', icon: <Phone className="w-4 h-4" /> },
    { id: 'social', label: 'सोशल मीडिया', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'organization', label: 'संस्था विवरण', icon: <Building className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO सेटिंग्स', icon: <Settings className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">सेटिंग्स लोड हो रही हैं...</p>
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
                  <Settings className="w-6 h-6 mr-2" />
                  वेबसाइट सेटिंग्स
                </h1>
                <p className="text-gray-600">
                  वेबसाइट की सभी सेटिंग्स को यहाँ से प्रबंधित करें
                </p>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={saving || uploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving || uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {uploading ? 'अपलोड हो रहा है...' : saving ? 'सेव हो रहा है...' : 'सेटिंग्स सेव करें'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">सेटिंग्स मेनू</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-none border-r-2 transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 border-transparent'
                        }`}
                      >
                        {tab.icon}
                        <span className="ml-3">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              
              {/* Preview Section */}
              <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    प्रीव्यू
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
                    {settings.logo || logoFile ? (
                      <img 
                        src={logoFile ? URL.createObjectURL(logoFile) : settings.logo} 
                        alt={settings.siteName}
                        className="w-12 h-12 object-contain rounded-full border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">🕉️</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-green-800">{settings.siteName}</h3>
                      <p className="text-sm text-gray-600">{settings.tagline}</p>
                      <p className="text-xs text-gray-500 mt-1">{settings.description}</p>
                      {(logoFile || faviconFile) && (
                        <p className="text-xs text-blue-600 mt-1 font-medium">
                          {logoFile && 'नया लोगो'} {logoFile && faviconFile && ' और '} {faviconFile && 'नया फेविकॉन'} अपलोड के लिए तैयार
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <Card>
                  <CardHeader>
                    <CardTitle>मुख्य जानकारी</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="siteName">साइट का नाम *</Label>
                        <Input
                          id="siteName"
                          value={settings.siteName}
                          onChange={(e) => handleInputChange('siteName', e.target.value)}
                          placeholder="एरोग्या पुस्तकालय एवं सेवा संस्था"
                        />
                      </div>
                      <div>
                        <Label htmlFor="siteTitle">साइट टाइटल *</Label>
                        <Input
                          id="siteTitle"
                          value={settings.siteTitle}
                          onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                          placeholder="एरोग्या पुस्तकालय एवं सेवा संस्था - बाड़मेर राजस्थान"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tagline">टैगलाइन</Label>
                      <Input
                        id="tagline"
                        value={settings.tagline}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        placeholder="समाज सेवा में समर्पित"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">साइट विवरण</Label>
                      <Textarea
                        id="description"
                        value={settings.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="वेबसाइट का संक्षिप्त विवरण..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Logo Upload Section */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          लोगो अपलोड करें
                        </Label>
                        
                        {/* Current Logo Display */}
                        {settings.logo && !logoFile && (
                          <div className="mb-3 p-3 border rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={settings.logo} 
                                  alt="Current Logo" 
                                  className="w-12 h-12 object-contain rounded border"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">वर्तमान लोगो</p>
                                  <p className="text-xs text-gray-500">क्लिक करके नया लोगो अपलोड करें</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* File Upload Area */}
                        <div className="relative">
                          <input
                            type="file"
                            id="logoUpload"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                          
                          {logoFile ? (
                            <div className="p-4 border-2 border-green-300 border-dashed rounded-lg bg-green-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <ImageIcon className="w-8 h-8 text-green-600" />
                                  <div>
                                    <p className="text-sm font-medium text-green-800">{logoFile.name}</p>
                                    <p className="text-xs text-green-600">
                                      {(logoFile.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeLogoFile}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <label
                              htmlFor="logoUpload"
                              className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                              onDragOver={handleDragOver}
                              onDrop={handleLogoDrop}
                            >
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 text-center">
                                <span className="font-medium text-blue-600">क्लिक करें</span> या फाइल को यहाँ ड्रैग करें
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, GIF (अधिकतम 2MB)
                              </p>
                            </label>
                          )}
                        </div>

                        {/* Manual URL Input */}
                        <div className="mt-3">
                          <Label htmlFor="logoUrl" className="text-xs text-gray-600">
                            या URL से लोगो सेट करें
                          </Label>
                          <Input
                            id="logoUrl"
                            value={settings.logo}
                            onChange={(e) => handleInputChange('logo', e.target.value)}
                            placeholder="https://example.com/logo.png"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* Favicon Upload Section */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          फेविकॉन अपलोड करें
                        </Label>
                        
                        {/* Current Favicon Display */}
                        {settings.favicon && !faviconFile && (
                          <div className="mb-3 p-3 border rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={settings.favicon} 
                                  alt="Current Favicon" 
                                  className="w-8 h-8 object-contain rounded border"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">वर्तमान फेविकॉन</p>
                                  <p className="text-xs text-gray-500">क्लिक करके नया फेविकॉन अपलोड करें</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* File Upload Area */}
                        <div className="relative">
                          <input
                            type="file"
                            id="faviconUpload"
                            accept="image/*,.ico"
                            onChange={handleFaviconChange}
                            className="hidden"
                          />
                          
                          {faviconFile ? (
                            <div className="p-4 border-2 border-green-300 border-dashed rounded-lg bg-green-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <ImageIcon className="w-8 h-8 text-green-600" />
                                  <div>
                                    <p className="text-sm font-medium text-green-800">{faviconFile.name}</p>
                                    <p className="text-xs text-green-600">
                                      {(faviconFile.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeFaviconFile}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <label
                              htmlFor="faviconUpload"
                              className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                              onDragOver={handleDragOver}
                              onDrop={handleFaviconDrop}
                            >
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 text-center">
                                <span className="font-medium text-blue-600">क्लिक करें</span> या फाइल को यहाँ ड्रैग करें
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                ICO, PNG, JPG (अधिकतम 1MB)
                              </p>
                            </label>
                          )}
                        </div>

                        {/* Manual URL Input */}
                        <div className="mt-3">
                          <Label htmlFor="faviconUrl" className="text-xs text-gray-600">
                            या URL से फेविकॉन सेट करें
                          </Label>
                          <Input
                            id="faviconUrl"
                            value={settings.favicon}
                            onChange={(e) => handleInputChange('favicon', e.target.value)}
                            placeholder="https://example.com/favicon.ico"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Information Tab */}
              {activeTab === 'contact' && (
                <Card>
                  <CardHeader>
                    <CardTitle>संपर्क विवरण</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">फोन नंबर *</Label>
                        <Input
                          id="phone"
                          value={settings.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+91 96600 89144"
                        />
                      </div>
                      <div>
                        <Label htmlFor="whatsapp">व्हाट्सऐप नंबर</Label>
                        <Input
                          id="whatsapp"
                          value={settings.whatsapp}
                          onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                          placeholder="+91 96600 89144"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">ईमेल पता *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="arogyapustkalaya@gmail.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">पता *</Label>
                      <Textarea
                        id="address"
                        value={settings.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="गुडामलानी, बाड़मेर, राजस्थान"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="mapLink">गूगल मैप लिंक</Label>
                      <Input
                        id="mapLink"
                        value={settings.mapLink}
                        onChange={(e) => handleInputChange('mapLink', e.target.value)}
                        placeholder="https://maps.google.com/..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="mapIframe">गूगल मैप Iframe</Label>
                      <Textarea
                        id="mapIframe"
                        value={settings.mapIframe}
                        onChange={(e) => handleInputChange('mapIframe', e.target.value)}
                        placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450"></iframe>'
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="officeHours">कार्यालय समय</Label>
                        <Input
                          id="officeHours"
                          value={settings.officeHours}
                          onChange={(e) => handleInputChange('officeHours', e.target.value)}
                          placeholder="सुबह 9:00 से शाम 6:00 तक"
                        />
                      </div>
                      <div>
                        <Label htmlFor="libraryHours">पुस्तकालय समय</Label>
                        <Input
                          id="libraryHours"
                          value={settings.libraryHours}
                          onChange={(e) => handleInputChange('libraryHours', e.target.value)}
                          placeholder="सुबह 9:00 से शाम 6:00 तक"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Social Media Tab */}
              {activeTab === 'social' && (
                <Card>
                  <CardHeader>
                    <CardTitle>सोशल मीडिया लिंक्स</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="facebook" className="flex items-center">
                          <span className="w-4 h-4 mr-2 text-blue-600">📘</span>
                          Facebook
                        </Label>
                        <Input
                          id="facebook"
                          value={settings.facebook}
                          onChange={(e) => handleInputChange('facebook', e.target.value)}
                          placeholder="https://facebook.com/your-page"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagram" className="flex items-center">
                          <span className="w-4 h-4 mr-2 text-pink-600">📷</span>
                          Instagram
                        </Label>
                        <Input
                          id="instagram"
                          value={settings.instagram}
                          onChange={(e) => handleInputChange('instagram', e.target.value)}
                          placeholder="https://instagram.com/your-account"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="twitter" className="flex items-center">
                          <span className="w-4 h-4 mr-2 text-blue-400">🐦</span>
                          Twitter
                        </Label>
                        <Input
                          id="twitter"
                          value={settings.twitter}
                          onChange={(e) => handleInputChange('twitter', e.target.value)}
                          placeholder="https://twitter.com/your-account"
                        />
                      </div>
                      <div>
                        <Label htmlFor="youtube" className="flex items-center">
                          <span className="w-4 h-4 mr-2 text-red-600">📺</span>
                          YouTube
                        </Label>
                        <Input
                          id="youtube"
                          value={settings.youtube}
                          onChange={(e) => handleInputChange('youtube', e.target.value)}
                          placeholder="https://youtube.com/your-channel"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={settings.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/company/your-company"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Organization Details Tab */}
              {activeTab === 'organization' && (
                <Card>
                  <CardHeader>
                    <CardTitle>संस्था विवरण</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="establishedYear">स्थापना वर्ष</Label>
                        <Input
                          id="establishedYear"
                          value={settings.establishedYear}
                          onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                          placeholder="2020"
                        />
                      </div>
                      <div>
                        <Label htmlFor="registrationNumber">पंजीकरण संख्या</Label>
                        <Input
                          id="registrationNumber"
                          value={settings.registrationNumber}
                          onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                          placeholder="REG/2020/12345"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="chairperson">अध्यक्ष</Label>
                        <Input
                          id="chairperson"
                          value={settings.chairperson}
                          onChange={(e) => handleInputChange('chairperson', e.target.value)}
                          placeholder="श्री आत्माराम बोरा"
                        />
                      </div>
                      <div>
                        <Label htmlFor="viceChairperson">उपाध्यक्ष</Label>
                        <Input
                          id="viceChairperson"
                          value={settings.viceChairperson}
                          onChange={(e) => handleInputChange('viceChairperson', e.target.value)}
                          placeholder="श्री बाबूराम शर्मा"
                        />
                      </div>
                      <div>
                        <Label htmlFor="secretary">संस्थापक</Label>
                        <Input
                          id="secretary"
                          value={settings.secretary}
                          onChange={(e) => handleInputChange('secretary', e.target.value)}
                          placeholder="संस्थापक का नाम"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergencyContact">आपातकालीन संपर्क व्यक्ति</Label>
                        <Input
                          id="emergencyContact"
                          value={settings.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                          placeholder="श्री आत्माराम बोरा"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone">आपातकालीन फोन</Label>
                        <Input
                          id="emergencyPhone"
                          value={settings.emergencyPhone}
                          onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                          placeholder="+91 96600 89144"
                        />
                      </div>
                    </div>

                    {/* Bank Details for Donations */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">दान के लिए बैंक विवरण</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bankName">बैंक का नाम</Label>
                          <Input
                            id="bankName"
                            value={settings.bankName}
                            onChange={(e) => handleInputChange('bankName', e.target.value)}
                            placeholder="State Bank of India"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">खाता संख्या</Label>
                          <Input
                            id="accountNumber"
                            value={settings.accountNumber}
                            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                            placeholder="1234567890"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="ifscCode">IFSC कोड</Label>
                          <Input
                            id="ifscCode"
                            value={settings.ifscCode}
                            onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                            placeholder="SBIN0012345"
                          />
                        </div>
                        <div>
                          <Label htmlFor="upiId">UPI ID</Label>
                          <Input
                            id="upiId"
                            value={settings.upiId}
                            onChange={(e) => handleInputChange('upiId', e.target.value)}
                            placeholder="arogyapustkalaya@paytm"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* SEO Settings Tab */}
              {activeTab === 'seo' && (
                <Card>
                  <CardHeader>
                    <CardTitle>SEO सेटिंग्स</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="metaKeywords">मेटा कीवर्ड्स</Label>
                      <Textarea
                        id="metaKeywords"
                        value={settings.metaKeywords}
                        onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                        placeholder="एरोग्या पुस्तकालय, बाड़मेर NGO, राजस्थान पुस्तकालय, निःशुल्क पुस्तकालय"
                        rows={3}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        कॉमा से अलग करके कीवर्ड्स लिखें
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                      <Input
                        id="googleAnalytics"
                        value={settings.googleAnalytics}
                        onChange={(e) => handleInputChange('googleAnalytics', e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        वेबसाइट ट्रैफिक एनालिटिक्स के लिए
                      </p>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">वेबसाइट सत्यापन</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="googleVerification">Google Search Console सत्यापन कोड</Label>
                          <Input
                            id="googleVerification"
                            value={settings.googleVerification || ''}
                            onChange={(e) => handleInputChange('googleVerification', e.target.value)}
                            placeholder="google-site-verification कोड"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bingVerification">Bing Webmaster सत्यापन कोड</Label>
                          <Input
                            id="bingVerification"
                            value={settings.bingVerification || ''}
                            onChange={(e) => handleInputChange('bingVerification', e.target.value)}
                            placeholder="msvalidate.01 कोड"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}