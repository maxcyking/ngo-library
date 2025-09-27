"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Tag,
  ArrowLeft
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
import Link from 'next/link';

interface BookCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  bookCount: number;
  order: number;
  createdAt: Date | { seconds: number; nanoseconds: number };
  updatedAt: Date | { seconds: number; nanoseconds: number };
  createdBy: string;
}

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

export default function BookCategoriesPage() {
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<BookCategory | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue',
    isActive: true
  });
  
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'book-categories'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BookCategory[];
      
      setCategories(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      alert('कृपया श्रेणी का नाम भरें');
      return;
    }

    try {
      const categoryData = {
        ...formData,
        bookCount: editingItem?.bookCount || 0,
        order: editingItem?.order || categories.length + 1,
        updatedAt: serverTimestamp(),
        ...(editingItem ? {} : {
          createdAt: serverTimestamp(),
          createdBy: user?.uid || 'admin'
        })
      };

      if (editingItem) {
        await updateDoc(doc(db, 'book-categories', editingItem.id), categoryData);
        alert('पुस्तक श्रेणी अपडेट हो गई');
      } else {
        await addDoc(collection(db, 'book-categories'), categoryData);
        alert('नई पुस्तक श्रेणी जोड़ी गई');
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        color: 'blue',
        isActive: true
      });
      setShowAddForm(false);
      setEditingItem(null);
      
    } catch (error) {
      console.error('Error saving book category:', error);
      alert('पुस्तक श्रेणी सेव करने में त्रुटि हुई');
    }
  };

  const handleEdit = (item: BookCategory) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      color: item.color,
      isActive: item.isActive
    });
    setShowAddForm(true);
  };

  const handleDelete = async (item: BookCategory) => {
    if (item.bookCount > 0) {
      alert('इस श्रेणी में पुस्तकें हैं। पहले सभी पुस्तकों को दूसरी श्रेणी में स्थानांतरित करें।');
      return;
    }

    if (!confirm('क्या आप वाकई इस पुस्तक श्रेणी को डिलीट करना चाहते हैं?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'book-categories', item.id));
      alert('पुस्तक श्रेणी डिलीट हो गई');
    } catch (error) {
      console.error('Error deleting book category:', error);
      alert('पुस्तक श्रेणी डिलीट करने में त्रुटि हुई');
    }
  };

  const toggleActive = async (item: BookCategory) => {
    try {
      await updateDoc(doc(db, 'book-categories', item.id), {
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

  const filteredCategories = categories.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <Link href="/admin/books">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Tag className="w-6 h-6 mr-2" />
                    पुस्तक श्रेणी प्रबंधन
                  </h1>
                  <p className="text-gray-600">
                    पुस्तकों की श्रेणियों का प्रबंधन करें
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setShowAddForm(true);
                  setEditingItem(null);
                  setFormData({
                    name: '',
                    description: '',
                    color: 'blue',
                    isActive: true
                  });
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                नई श्रेणी जोड़ें
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
                  {editingItem ? 'पुस्तक श्रेणी एडिट करें' : 'नई पुस्तक श्रेणी जोड़ें'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        श्रेणी का नाम *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="जैसे: धार्मिक साहित्य, शैक्षणिक पुस्तकें"
                        required
                      />
                    </div>
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
                      placeholder="श्रेणी का विस्तृत विवरण"
                    />
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

                  {/* Preview */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      प्रीव्यू:
                    </label>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getColorClass(formData.color)}`}>
                      {formData.name || 'श्रेणी का नाम'}
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
                  placeholder="श्रेणी का नाम या विवरण से खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">लोड हो रहा है...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">कोई पुस्तक श्रेणी नहीं मिली</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <Card key={category.id} className={`hover:shadow-lg transition-shadow ${!category.isActive ? 'opacity-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getColorClass(category.color)}`}>
                        {category.name}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActive(category)}
                        >
                          {category.isActive ? '❌' : '✅'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(category)}
                          disabled={category.bookCount > 0}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-gray-600 text-sm">
                            {category.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          पुस्तकें: {category.bookCount}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>त्वरित कार्य</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/books/add">
                  <Button className="w-full" variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    नई पुस्तक जोड़ें
                  </Button>
                </Link>
                <Link href="/admin/books">
                  <Button className="w-full" variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    सभी पुस्तकें देखें
                  </Button>
                </Link>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  <Tag className="w-4 h-4 mr-2" />
                  रीफ्रेश करें
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}