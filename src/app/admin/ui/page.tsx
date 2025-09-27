"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Upload,
  Trash2,
  Eye,
  Link as LinkIcon,
  Image as ImageIcon,
  Plus,
  Edit,
  Save,
  X
} from 'lucide-react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface HeroImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
  uploadType: 'file' | 'url';
  createdAt: Date | null;
  createdBy: string;
}

export default function UIManagementPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'contact'>('hero');
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for hero images
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'url'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [order, setOrder] = useState(1);

  // About section states
  const [aboutData, setAboutData] = useState({
    title: 'हमारे बारे में',
    description: '',
    mission: '',
    vision: ''
  });

  // Contact section states
  const [contactData, setContactData] = useState({
    organizationName: 'आरोग्य लाइब्रेरी',
    phone: '',
    email: '',
    website: '',
    address: '',
    openingHours: 'सुबह 9:00 - शाम 6:00',
    closedDays: 'रविवार',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: ''
  });

  const { user } = useAuth();

  // Fetch hero images
  const fetchHeroImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'heroImages'));
      const images: HeroImage[] = [];
      querySnapshot.forEach((doc) => {
        images.push({ id: doc.id, ...doc.data() } as HeroImage);
      });
      // Sort by order
      images.sort((a, b) => a.order - b.order);
      setHeroImages(images);
    } catch (error) {
      console.error('Error fetching hero images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroImages();
    fetchAboutData();
    fetchContactData();
  }, []);

  // Fetch about data
  const fetchAboutData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'uiContent'));
      querySnapshot.forEach((doc) => {
        if (doc.id === 'about') {
          setAboutData({ ...aboutData, ...doc.data() });
        }
      });
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  // Fetch contact data
  const fetchContactData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'uiContent'));
      querySnapshot.forEach((doc) => {
        if (doc.id === 'contact') {
          setContactData({ ...contactData, ...doc.data() });
        }
      });
    } catch (error) {
      console.error('Error fetching contact data:', error);
    }
  };

  // Save about data
  const saveAboutData = async () => {
    setUploading(true);
    try {
      await updateDoc(doc(db, 'uiContent', 'about'), {
        ...aboutData,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'unknown'
      });
      alert('अबाउट सेक्शन सफलतापूर्वक अपडेट किया गया!');
    } catch (error) {
      console.error('Error saving about data:', error);
      // If document doesn't exist, create it
      try {
        await addDoc(collection(db, 'uiContent'), {
          ...aboutData,
          id: 'about',
          createdAt: serverTimestamp(),
          createdBy: user?.uid || 'unknown'
        });
        alert('अबाउट सेक्शन सफलतापूर्वक बनाया गया!');
      } catch (createError) {
        console.error('Error creating about data:', createError);
        alert('अबाउट सेक्शन सेव करने में त्रुटि हुई');
      }
    } finally {
      setUploading(false);
    }
  };

  // Save contact data
  const saveContactData = async () => {
    setUploading(true);
    try {
      await updateDoc(doc(db, 'uiContent', 'contact'), {
        ...contactData,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'unknown'
      });
      alert('संपर्क जानकारी सफलतापूर्वक अपडेट की गई!');
    } catch (error) {
      console.error('Error saving contact data:', error);
      // If document doesn't exist, create it
      try {
        await addDoc(collection(db, 'uiContent'), {
          ...contactData,
          id: 'contact',
          createdAt: serverTimestamp(),
          createdBy: user?.uid || 'unknown'
        });
        alert('संपर्क जानकारी सफलतापूर्वक बनाई गई!');
      } catch (createError) {
        console.error('Error creating contact data:', createError);
        alert('संपर्क जानकारी सेव करने में त्रुटि हुई');
      }
    } finally {
      setUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setSelectedFile(null);
    setOrder(heroImages.length + 1);
    setUploadType('url');
    setShowAddForm(false);
    setEditingId(null);
  };

  // Handle file upload
  const handleFileUpload = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `hero-images/${timestamp}-${file.name}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  // Add new hero image
  const handleAddImage = async () => {
    if (!title || (!imageUrl && !selectedFile)) {
      alert('कृपया सभी आवश्यक फील्ड भरें');
      return;
    }

    setUploading(true);
    try {
      let finalImageUrl = imageUrl;

      if (uploadType === 'file' && selectedFile) {
        finalImageUrl = await handleFileUpload(selectedFile);
      }

      const newImage = {
        title,
        description,
        imageUrl: finalImageUrl,
        isActive: true,
        order,
        uploadType,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || 'unknown'
      };

      await addDoc(collection(db, 'heroImages'), newImage);
      await fetchHeroImages();
      resetForm();
      alert('हीरो इमेज सफलतापूर्वक जोड़ी गई!');
    } catch (error) {
      console.error('Error adding hero image:', error);
      alert('इमेज जोड़ने में त्रुटि हुई');
    } finally {
      setUploading(false);
    }
  };

  // Update hero image
  const handleUpdateImage = async (id: string) => {
    if (!title) {
      alert('कृपया टाइटल भरें');
      return;
    }

    setUploading(true);
    try {
      let finalImageUrl = imageUrl;

      if (uploadType === 'file' && selectedFile) {
        finalImageUrl = await handleFileUpload(selectedFile);
      }

      const updateData: Record<string, unknown> = {
        title,
        description,
        order,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'unknown'
      };

      if (finalImageUrl !== imageUrl || selectedFile) {
        updateData.imageUrl = finalImageUrl;
        updateData.uploadType = uploadType;
      }

      await updateDoc(doc(db, 'heroImages', id), updateData);
      await fetchHeroImages();
      resetForm();
      alert('हीरो इमेज सफलतापूर्वक अपडेट की गई!');
    } catch (error) {
      console.error('Error updating hero image:', error);
      alert('इमेज अपडेट करने में त्रुटि हुई');
    } finally {
      setUploading(false);
    }
  };

  // Delete hero image
  const handleDeleteImage = async (id: string, imageUrl: string) => {
    if (!confirm('क्या आप वाकई इस इमेज को डिलीट करना चाहते हैं?')) {
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'heroImages', id));

      // Delete from Storage if it's a uploaded file
      if (imageUrl.includes('firebase')) {
        try {
          const storageRef = ref(storage, imageUrl);
          await deleteObject(storageRef);
        } catch (storageError) {
          console.warn('Could not delete file from storage:', storageError);
        }
      }

      await fetchHeroImages();
      alert('हीरो इमेज सफलतापूर्वक डिलीट की गई!');
    } catch (error) {
      console.error('Error deleting hero image:', error);
      alert('इमेज डिलीट करने में त्रुटि हुई');
    }
  };

  // Toggle active status
  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'heroImages', id), {
        isActive: !currentStatus,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'unknown'
      });
      await fetchHeroImages();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('स्टेटस बदलने में त्रुटि हुई');
    }
  };

  // Start editing
  const startEditing = (image: HeroImage) => {
    setTitle(image.title);
    setDescription(image.description);
    setImageUrl(image.imageUrl);
    setOrder(image.order);
    setUploadType(image.uploadType);
    setEditingId(image.id);
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                UI प्रबंधन
              </h1>
              <p className="text-gray-600">
                वेबसाइट के UI एलिमेंट्स प्रबंधित करें
              </p>
            </div>
            {activeTab === 'hero' && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                नई इमेज जोड़ें
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('hero')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'hero'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              हीरो सेक्शन
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'about'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              अबाउट सेक्शन
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'contact'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              संपर्क जानकारी
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <>
            {/* Add/Edit Form */}
            {showAddForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>
                    {editingId ? 'इमेज एडिट करें' : 'नई हीरो इमेज जोड़ें'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        टाइटल *
                      </label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="इमेज का टाइटल"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        क्रम संख्या
                      </label>
                      <Input
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(parseInt(e.target.value))}
                        min="1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        विवरण
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="इमेज का विवरण"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        अपलोड प्रकार
                      </label>
                      <div className="flex space-x-4 mb-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="url"
                            checked={uploadType === 'url'}
                            onChange={(e) => setUploadType(e.target.value as 'url')}
                            className="mr-2"
                          />
                          URL से
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="file"
                            checked={uploadType === 'file'}
                            onChange={(e) => setUploadType(e.target.value as 'file')}
                            className="mr-2"
                          />
                          फाइल अपलोड
                        </label>
                      </div>

                      {uploadType === 'url' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            इमेज URL *
                          </label>
                          <Input
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            इमेज फाइल चुनें *
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="w-full p-3 border border-gray-300 rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={resetForm}
                    >
                      <X className="w-4 h-4 mr-2" />
                      रद्द करें
                    </Button>
                    <Button
                      onClick={() => editingId ? handleUpdateImage(editingId) : handleAddImage()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {editingId ? 'अपडेट करें' : 'जोड़ें'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hero Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={image.imageUrl}
                      alt={image.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button
                        size="sm"
                        variant={image.isActive ? "default" : "secondary"}
                        onClick={() => toggleActiveStatus(image.id, image.isActive)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                        क्रम: {image.order}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {image.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {image.uploadType === 'url' ? (
                          <LinkIcon className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Upload className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-xs text-gray-500">
                          {image.uploadType === 'url' ? 'URL' : 'अपलोड'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(image)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteImage(image.id, image.imageUrl)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {heroImages.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  कोई हीरो इमेज नहीं मिली
                </h3>
                <p className="text-gray-600 mb-4">
                  होम पेज के लिए हीरो इमेज जोड़ें
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  पहली इमेज जोड़ें
                </Button>
              </div>
            )}
          </>
        )}

        {/* About Section Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>अबाउट सेक्शन कंटेंट</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      मुख्य शीर्षक
                    </label>
                    <Input
                      placeholder="जैसे: हमारे बारे में"
                      value={aboutData.title}
                      onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      विवरण
                    </label>
                    <textarea
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="संगठन के बारे में विस्तृत जानकारी..."
                      value={aboutData.description}
                      onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      मिशन स्टेटमेंट
                    </label>
                    <textarea
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="हमारा मिशन..."
                      value={aboutData.mission}
                      onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      विजन स्टेटमेंट
                    </label>
                    <textarea
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="हमारा विजन..."
                      value={aboutData.vision}
                      onChange={(e) => setAboutData({ ...aboutData, vision: e.target.value })}
                    />
                  </div>
                  <Button onClick={saveAboutData} disabled={uploading}>
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    सेव करें
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Section Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>संपर्क जानकारी</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      संगठन का नाम
                    </label>
                    <Input
                      placeholder="आरोग्य लाइब्रेरी"
                      value={contactData.organizationName}
                      onChange={(e) => setContactData({ ...contactData, organizationName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      फोन नंबर
                    </label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ईमेल पता
                    </label>
                    <Input
                      placeholder="info@arogyalibrary.org"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      वेबसाइट
                    </label>
                    <Input
                      placeholder="www.arogyalibrary.org"
                      value={contactData.website}
                      onChange={(e) => setContactData({ ...contactData, website: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      पता
                    </label>
                    <textarea
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="पूरा पता..."
                      value={contactData.address}
                      onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      खुलने का समय
                    </label>
                    <Input
                      placeholder="सुबह 9:00 - शाम 6:00"
                      value={contactData.openingHours}
                      onChange={(e) => setContactData({ ...contactData, openingHours: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      बंद दिन
                    </label>
                    <Input
                      placeholder="रविवार"
                      value={contactData.closedDays}
                      onChange={(e) => setContactData({ ...contactData, closedDays: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Button onClick={saveContactData} disabled={uploading}>
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    सेव करें
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card>
              <CardHeader>
                <CardTitle>सोशल मीडिया लिंक्स</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <Input
                      placeholder="https://facebook.com/arogyalibrary"
                      value={contactData.facebook}
                      onChange={(e) => setContactData({ ...contactData, facebook: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <Input
                      placeholder="https://twitter.com/arogyalibrary"
                      value={contactData.twitter}
                      onChange={(e) => setContactData({ ...contactData, twitter: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <Input
                      placeholder="https://instagram.com/arogyalibrary"
                      value={contactData.instagram}
                      onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube
                    </label>
                    <Input
                      placeholder="https://youtube.com/arogyalibrary"
                      value={contactData.youtube}
                      onChange={(e) => setContactData({ ...contactData, youtube: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Button onClick={saveContactData} disabled={uploading}>
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    सेव करें
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}