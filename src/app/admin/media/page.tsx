"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Image as ImageIcon, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Upload,
  Calendar,
  Tag,
  Filter
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
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

interface MediaItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  date: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date | { seconds: number; nanoseconds: number };
  updatedAt: Date | { seconds: number; nanoseconds: number };
  createdBy: string;
}

const categories = [
  'कार्यक्रम',
  'निर्माण कार्य',
  'स्वास्थ्य सेवा',
  'सामाजिक कार्यक्रम',
  'पर्यावरण',
  'शिक्षा',
  'रक्तदान',
  'अन्य'
];

export default function MediaManagementPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    isActive: true
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'media'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MediaItem[];
      
      setMediaItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category) {
      alert('कृपया सभी आवश्यक फील्ड भरें');
      return;
    }

    if (!editingItem && !selectedFile) {
      alert('कृपया एक इमेज फाइल चुनें');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = editingItem?.imageUrl || '';
      
      // Upload new image if selected
      if (selectedFile) {
        const timestamp = Date.now();
        const fileName = `gallery/${timestamp}-${selectedFile.name}`;
        const storageRef = ref(storage, fileName);
        
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const mediaData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isActive: formData.isActive,
        imageUrl,
        thumbnailUrl: imageUrl, // For now, same as main image
        updatedAt: serverTimestamp(),
        ...(editingItem ? {} : {
          createdAt: serverTimestamp(),
          createdBy: user?.uid || 'admin'
        })
      };

      if (editingItem) {
        await updateDoc(doc(db, 'media', editingItem.id), mediaData);
        alert('मीडिया आइटम अपडेट हो गया');
      } else {
        await addDoc(collection(db, 'media'), mediaData);
        alert('नया मीडिया आइटम जोड़ा गया');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        tags: '',
        isActive: true
      });
      setSelectedFile(null);
      setShowAddForm(false);
      setEditingItem(null);
      
    } catch (error) {
      console.error('Error saving media item:', error);
      alert('मीडिया आइटम सेव करने में त्रुटि हुई');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      date: item.date,
      tags: item.tags.join(', '),
      isActive: item.isActive
    });
    setShowAddForm(true);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm('क्या आप वाकई इस मीडिया आइटम को डिलीट करना चाहते हैं?')) {
      return;
    }

    try {
      // Delete image from storage
      if (item.imageUrl) {
        const imageRef = ref(storage, item.imageUrl);
        await deleteObject(imageRef);
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, 'media', item.id));
      alert('मीडिया आइटम डिलीट हो गया');
    } catch (error) {
      console.error('Error deleting media item:', error);
      alert('मीडिया आइटम डिलीट करने में त्रुटि हुई');
    }
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <ImageIcon className="w-6 h-6 mr-2" />
                  मीडिया/गैलरी प्रबंधन
                </h1>
                <p className="text-gray-600">
                  फोटो गैलरी और मीडिया कंटेंट का प्रबंधन करें
                </p>
              </div>
              <Button 
                onClick={() => {
                  setShowAddForm(true);
                  setEditingItem(null);
                  setFormData({
                    title: '',
                    description: '',
                    category: '',
                    date: new Date().toISOString().split('T')[0],
                    tags: '',
                    isActive: true
                  });
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                नया मीडिया जोड़ें
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Add/Edit Form */}
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingItem ? 'मीडिया आइटम एडिट करें' : 'नया मीडिया आइटम जोड़ें'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        शीर्षक *
                      </label>
                      <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="मीडिया आइटम का शीर्षक"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        श्रेणी *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">श्रेणी चुनें</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      विवरण
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="मीडिया आइटम का विवरण"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        दिनांक
                      </label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        टैग्स (कॉमा से अलग करें)
                      </label>
                      <Input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="जैसे: रक्तदान, स्वास्थ्य, सेवा"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      इमेज अपलोड करें {!editingItem && '*'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                        required={!editingItem}
                      />
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG फॉर्मेट में, अधिकतम 5MB</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                      सक्रिय (वेबसाइट पर दिखाएं)
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      type="submit" 
                      disabled={uploading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {uploading ? (
                        <>
                          <Upload className="w-4 h-4 mr-2 animate-spin" />
                          अपलोड हो रहा है...
                        </>
                      ) : (
                        editingItem ? 'अपडेट करें' : 'जोड़ें'
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingItem(null);
                      }}
                    >
                      रद्द करें
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="शीर्षक, विवरण या टैग्स से खोजें..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">सभी श्रेणियां</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">लोड हो रहा है...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">कोई मीडिया आइटम नहीं मिला</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.date}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {item.category}
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    {item.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                        )}
                      </div>
                    )}
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