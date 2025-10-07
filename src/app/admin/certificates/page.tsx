"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  Award,
  Save,
  X,
  Upload,
  Link
} from "lucide-react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface Certificate {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
}

interface CertificateFormData {
  title: string;
  imageUrl: string;
}

type UploadMethod = 'url' | 'file';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState<CertificateFormData>({
    title: "",
    imageUrl: ""
  });
  const [saving, setSaving] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { user } = useAuth();



  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const certificatesRef = collection(db, 'certificates');
      const q = query(certificatesRef, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      const certificatesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Certificate[];

      setCertificates(certificatesData);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      alert('प्रमाणपत्र लोड करने में त्रुटि हुई।');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CertificateFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update preview URL when imageUrl changes
    if (field === 'imageUrl') {
      setPreviewUrl(value);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('कृपया केवल छवि फाइलें अपलोड करें।');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('फाइल का साइज़ 5MB से कम होना चाहिए।');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const fileName = `certificates/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    setUploading(true);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } finally {
      setUploading(false);
    }
  };

  const deleteFileFromStorage = async (imageUrl: string) => {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
      }
    } catch (error) {
      console.error('Error deleting file from storage:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('कृपया शीर्षक भरें।');
      return;
    }

    if (uploadMethod === 'url' && !formData.imageUrl.trim()) {
      alert('कृपया छवि URL भरें।');
      return;
    }

    if (uploadMethod === 'file' && !selectedFile && !editingCertificate) {
      alert('कृपया छवि फाइल चुनें।');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = formData.imageUrl;
      
      // Upload file if file method is selected and file is chosen
      if (uploadMethod === 'file' && selectedFile) {
        imageUrl = await uploadFileToStorage(selectedFile);
      }

      const certificateData = {
        title: formData.title,
        imageUrl: imageUrl,
        createdBy: user?.email || 'unknown',
        updatedAt: serverTimestamp()
      };

      if (editingCertificate) {
        // Update existing certificate
        await updateDoc(doc(db, 'certificates', editingCertificate.id), certificateData);
        alert('प्रमाणपत्र सफलतापूर्वक अपडेट हो गया!');
      } else {
        // Create new certificate
        await addDoc(collection(db, 'certificates'), {
          ...certificateData,
          createdAt: serverTimestamp()
        });
        alert('प्रमाणपत्र सफलतापूर्वक जोड़ा गया!');
      }

      // Reset form and refresh data
      setFormData({
        title: "",
        imageUrl: ""
      });
      setSelectedFile(null);
      setPreviewUrl("");
      setUploadMethod('url');
      setShowForm(false);
      setEditingCertificate(null);
      fetchCertificates();
    } catch (error) {
      console.error('Error saving certificate:', error);
      alert('प्रमाणपत्र सेव करने में त्रुटि हुई।');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      title: certificate.title,
      imageUrl: certificate.imageUrl
    });
    setPreviewUrl(certificate.imageUrl);
    setUploadMethod('url');
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleDelete = async (certificate: Certificate) => {
    if (!confirm(`क्या आप "${certificate.title}" प्रमाणपत्र को डिलीट करना चाहते हैं?`)) {
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'certificates', certificate.id));
      
      // Delete file from Storage if it's a Firebase Storage URL
      if (certificate.imageUrl.includes('firebasestorage.googleapis.com')) {
        await deleteFileFromStorage(certificate.imageUrl);
      }
      
      alert('प्रमाणपत्र सफलतापूर्वक डिलीट हो गया!');
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('प्रमाणपत्र डिलीट करने में त्रुटि हुई।');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCertificate(null);
    setFormData({
      title: "",
      imageUrl: ""
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadMethod('url');
  };

  const filteredCertificates = certificates.filter(cert => {
    return cert.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">प्रमाणपत्र लोड हो रहे हैं...</p>
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
                  <Award className="w-6 h-6 mr-2" />
                  प्रमाणपत्र प्रबंधन
                </h1>
                <p className="text-gray-600">
                  संस्था के प्रमाणपत्रों को जोड़ें, संपादित करें और प्रबंधित करें
                </p>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                नया प्रमाणपत्र जोड़ें
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="प्रमाणपत्र खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Add/Edit Form */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingCertificate ? 'प्रमाणपत्र संपादित करें' : 'नया प्रमाणपत्र जोड़ें'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title">शीर्षक *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="प्रमाणपत्र का शीर्षक"
                      required
                    />
                  </div>

                  {/* Upload Method Selection */}
                  <div>
                    <Label>छवि अपलोड विधि *</Label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="uploadMethod"
                          value="url"
                          checked={uploadMethod === 'url'}
                          onChange={(e) => setUploadMethod(e.target.value as UploadMethod)}
                          className="text-blue-600"
                        />
                        <Link className="w-4 h-4" />
                        <span>URL से</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="uploadMethod"
                          value="file"
                          checked={uploadMethod === 'file'}
                          onChange={(e) => setUploadMethod(e.target.value as UploadMethod)}
                          className="text-blue-600"
                        />
                        <Upload className="w-4 h-4" />
                        <span>फाइल अपलोड</span>
                      </label>
                    </div>
                  </div>

                  {/* URL Input */}
                  {uploadMethod === 'url' && (
                    <div>
                      <Label htmlFor="imageUrl">छवि URL *</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                        placeholder="https://example.com/certificate-image.jpg"
                        required
                      />
                    </div>
                  )}

                  {/* File Upload */}
                  {uploadMethod === 'file' && (
                    <div>
                      <Label htmlFor="fileUpload">छवि फाइल अपलोड करें *</Label>
                      <div className="mt-2">
                        <input
                          id="fileUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          केवल छवि फाइलें (JPG, PNG, GIF) - अधिकतम 5MB
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Image Preview */}
                  {previewUrl && (
                    <div>
                      <Label>छवि पूर्वावलोकन</Label>
                      <div className="mt-2 relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-48 h-32 object-cover border rounded-lg shadow-sm"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        {uploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <div className="text-white text-sm flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              अपलोड हो रहा है...
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={saving || uploading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {(saving || uploading) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {uploading ? 'अपलोड हो रहा है...' : saving ? 'सेव हो रहा है...' : (editingCertificate ? 'अपडेट करें' : 'सेव करें')}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      रद्द करें
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Certificates List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  कोई प्रमाणपत्र नहीं मिला
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "खोज मापदंड बदलकर पुनः प्रयास करें"
                    : "पहला प्रमाणपत्र जोड़ने के लिए ऊपर बटन दबाएं"}
                </p>
                {!showForm && (
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    नया प्रमाणपत्र जोड़ें
                  </Button>
                )}
              </div>
            ) : (
              filteredCertificates.map((certificate) => (
                <Card key={certificate.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={certificate.imageUrl}
                      alt={certificate.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/400/300";
                      }}
                    />

                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {certificate.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          जोड़ा गया:
                        </span>
                        <span className="font-medium">
                          {certificate.createdAt.toLocaleDateString('hi-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(certificate)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        संपादित
                      </Button>
                      <Button
                        onClick={() => handleDelete(certificate)}
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        डिलीट
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}