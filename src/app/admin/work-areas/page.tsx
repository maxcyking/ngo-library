"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Save,
  GripVertical
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
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface WorkArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  order: number;
  createdAt: Date | { seconds: number; nanoseconds: number };
  updatedAt: Date | { seconds: number; nanoseconds: number };
  createdBy: string;
}

const availableIcons = [
  { value: '📚', label: '📚 शिक्षा' },
  { value: '🏥', label: '🏥 स्वास्थ्य' },
  { value: '🌱', label: '🌱 पर्यावरण' },
  { value: '❤️', label: '❤️ सामाजिक सेवा' },
  { value: '💰', label: '💰 आर्थिक सहायता' },
  { value: '👩‍💼', label: '👩‍💼 महिला सशक्तिकरण' },
  { value: '🏗️', label: '🏗️ निर्माण कार्य' },
  { value: '🎯', label: '🎯 कौशल विकास' },
  { value: '🤝', label: '🤝 सामुदायिक सेवा' },
  { value: '⚕️', label: '⚕️ चिकित्सा सेवा' }
];

const availableColors = [
  { value: 'blue', label: '🔵 नीला', class: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'green', label: '🟢 हरा', class: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'red', label: '🔴 लाल', class: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'purple', label: '🟣 बैंगनी', class: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'orange', label: '🟠 नारंगी', class: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'pink', label: '🩷 गुलाबी', class: 'bg-pink-100 text-pink-800 border-pink-200' },
  { value: 'yellow', label: '🟡 पीला', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'indigo', label: '🟦 इंडिगो', class: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
];

export default function WorkAreasManagementPage() {
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkArea | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '📚',
    color: 'blue',
    isActive: true
  });
  
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'work-areas'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkArea[];
      
      setWorkAreas(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      alert('कृपया शीर्षक और विवरण भरें');
      return;
    }

    try {
      const workAreaData = {
        ...formData,
        order: editingItem?.order || workAreas.length + 1,
        updatedAt: serverTimestamp(),
        ...(editingItem ? {} : {
          createdAt: serverTimestamp(),
          createdBy: user?.uid || 'admin'
        })
      };

      if (editingItem) {
        await updateDoc(doc(db, 'work-areas', editingItem.id), workAreaData);
        alert('कार्य क्षेत्र अपडेट हो गया');
      } else {
        await addDoc(collection(db, 'work-areas'), workAreaData);
        alert('नया कार्य क्षेत्र जोड़ा गया');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        icon: '📚',
        color: 'blue',
        isActive: true
      });
      setShowAddForm(false);
      setEditingItem(null);
      
    } catch (error) {
      console.error('Error saving work area:', error);
      alert('कार्य क्षेत्र सेव करने में त्रुटि हुई');
    }
  };

  const handleEdit = (item: WorkArea) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      icon: item.icon,
      color: item.color,
      isActive: item.isActive
    });
    setShowAddForm(true);
  };

  const handleDelete = async (item: WorkArea) => {
    if (!confirm('क्या आप वाकई इस कार्य क्षेत्र को डिलीट करना चाहते हैं?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'work-areas', item.id));
      alert('कार्य क्षेत्र डिलीट हो गया');
    } catch (error) {
      console.error('Error deleting work area:', error);
      alert('कार्य क्षेत्र डिलीट करने में त्रुटि हुई');
    }
  };

  const toggleActive = async (item: WorkArea) => {
    try {
      await updateDoc(doc(db, 'work-areas', item.id), {
        isActive: !item.isActive,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating active status:', error);
      alert('स्थिति अपडेट करने में त्रुटि हुई');
    }
  };

  const getColorClass = (color: string) => {
    const colorObj = availableColors.find(c => c.value === color);
    return colorObj?.class || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredWorkAreas = workAreas.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Briefcase className="w-6 h-6 mr-2" />
                  कार्य क्षेत्र प्रबंधन
                </h1>
                <p className="text-gray-600">
                  संस्था के कार्य क्षेत्रों का प्रबंधन करें
                </p>
              </div>
              <Button 
                onClick={() => {
                  setShowAddForm(true);
                  setEditingItem(null);
                  setFormData({
                    title: '',
                    description: '',
                    icon: '📚',
                    color: 'blue',
                    isActive: true
                  });
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                नया कार्य क्षेत्र जोड़ें
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
                  {editingItem ? 'कार्य क्षेत्र एडिट करें' : 'नया कार्य क्षेत्र जोड़ें'}
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
                        placeholder="कार्य क्षेत्र का नाम"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        आइकन
                      </label>
                      <select
                        value={formData.icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {availableIcons.map(icon => (
                          <option key={icon.value} value={icon.value}>{icon.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      विवरण *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="कार्य क्षेत्र का विस्तृत विवरण"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        रंग
                      </label>
                      <select
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {availableColors.map(color => (
                          <option key={color.value} value={color.value}>{color.label}</option>
                        ))}
                      </select>
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
                  </div>

                  {/* Preview */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      प्रीव्यू:
                    </label>
                    <div className={`inline-block p-4 rounded-lg border-2 ${getColorClass(formData.color)}`}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">{formData.icon}</div>
                        <h3 className="text-lg font-semibold mb-1">{formData.title || 'शीर्षक'}</h3>
                        <p className="text-sm">{formData.description || 'विवरण'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {editingItem ? 'अपडेट करें' : 'जोड़ें'}
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

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="शीर्षक या विवरण से खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Work Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">लोड हो रहा है...</p>
              </div>
            ) : filteredWorkAreas.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">कोई कार्य क्षेत्र नहीं मिला</p>
              </div>
            ) : (
              filteredWorkAreas.map((area) => (
                <Card key={area.id} className={`hover:shadow-lg transition-shadow ${!area.isActive ? 'opacity-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          area.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {area.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActive(area)}
                        >
                          {area.isActive ? '❌' : '✅'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(area)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(area)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-4xl mb-4">{area.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {area.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {area.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Website Preview */}
          <Card>
            <CardHeader>
              <CardTitle>वेबसाइट पर प्रीव्यू</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {workAreas.filter(area => area.isActive).map((area) => (
                    <div key={area.id} className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                      <div className="text-4xl mb-4">{area.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {area.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {area.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}