"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Star,
  User,
  Quote
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

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  location: string;
  message: string;
  rating: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date | { seconds: number; nanoseconds: number };
  updatedAt: Date | { seconds: number; nanoseconds: number };
  createdBy: string;
}

export default function TestimonialsManagementPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    location: '',
    message: '',
    rating: 5,
    isActive: true,
    isFeatured: false
  });
  
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'testimonials'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Testimonial[];
      
      setTestimonials(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.message) {
      alert('कृपया नाम और संदेश भरें');
      return;
    }

    try {
      const testimonialData = {
        ...formData,
        updatedAt: serverTimestamp(),
        ...(editingItem ? {} : {
          createdAt: serverTimestamp(),
          createdBy: user?.uid || 'admin'
        })
      };

      if (editingItem) {
        await updateDoc(doc(db, 'testimonials', editingItem.id), testimonialData);
        alert('प्रशंसापत्र अपडेट हो गया');
      } else {
        await addDoc(collection(db, 'testimonials'), testimonialData);
        alert('नया प्रशंसापत्र जोड़ा गया');
      }

      // Reset form
      setFormData({
        name: '',
        designation: '',
        location: '',
        message: '',
        rating: 5,
        isActive: true,
        isFeatured: false
      });
      setShowAddForm(false);
      setEditingItem(null);
      
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('प्रशंसापत्र सेव करने में त्रुटि हुई');
    }
  };

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      designation: item.designation,
      location: item.location,
      message: item.message,
      rating: item.rating,
      isActive: item.isActive,
      isFeatured: item.isFeatured
    });
    setShowAddForm(true);
  };

  const handleDelete = async (item: Testimonial) => {
    if (!confirm('क्या आप वाकई इस प्रशंसापत्र को डिलीट करना चाहते हैं?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'testimonials', item.id));
      alert('प्रशंसापत्र डिलीट हो गया');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('प्रशंसापत्र डिलीट करने में त्रुटि हुई');
    }
  };

  const toggleFeatured = async (item: Testimonial) => {
    try {
      await updateDoc(doc(db, 'testimonials', item.id), {
        isFeatured: !item.isFeatured,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('स्थिति अपडेट करने में त्रुटि हुई');
    }
  };

  const filteredTestimonials = testimonials.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.designation.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <MessageSquare className="w-6 h-6 mr-2" />
                  प्रशंसापत्र प्रबंधन
                </h1>
                <p className="text-gray-600">
                  सदस्यों और लाभार्थियों के प्रशंसापत्र का प्रबंधन करें
                </p>
              </div>
              <Button 
                onClick={() => {
                  setShowAddForm(true);
                  setEditingItem(null);
                  setFormData({
                    name: '',
                    designation: '',
                    location: '',
                    message: '',
                    rating: 5,
                    isActive: true,
                    isFeatured: false
                  });
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                नया प्रशंसापत्र जोड़ें
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
                  {editingItem ? 'प्रशंसापत्र एडिट करें' : 'नया प्रशंसापत्र जोड़ें'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        नाम *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="व्यक्ति का नाम"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        पदनाम
                      </label>
                      <Input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                        placeholder="जैसे: सदस्य, लाभार्थी, स्वयंसेवक"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        स्थान
                      </label>
                      <Input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="शहर, राज्य"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      संदेश *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="प्रशंसापत्र का संदेश"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        रेटिंग
                      </label>
                      <select
                        value={formData.rating}
                        onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={5}>5 स्टार</option>
                        <option value={4}>4 स्टार</option>
                        <option value={3}>3 स्टार</option>
                        <option value={2}>2 स्टार</option>
                        <option value={1}>1 स्टार</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">सक्रिय</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">फीचर्ड</span>
                      </label>
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
                  placeholder="नाम, संदेश या पदनाम से खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Testimonials List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">लोड हो रहा है...</p>
              </div>
            ) : filteredTestimonials.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">कोई प्रशंसापत्र नहीं मिला</p>
              </div>
            ) : (
              filteredTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                          {testimonial.designation && (
                            <p className="text-sm text-gray-600">{testimonial.designation}</p>
                          )}
                          {testimonial.location && (
                            <p className="text-xs text-gray-500">{testimonial.location}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleFeatured(testimonial)}
                          className={testimonial.isFeatured ? 'bg-yellow-100 text-yellow-800' : ''}
                        >
                          <Star className={`w-3 h-3 ${testimonial.isFeatured ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(testimonial)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="relative">
                      <Quote className="w-4 h-4 text-gray-400 absolute -top-1 -left-1" />
                      <p className="text-gray-700 text-sm leading-relaxed pl-4 mb-4">
                        {testimonial.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        {[...Array(5 - testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-gray-300" />
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {testimonial.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                        </span>
                        {testimonial.isFeatured && (
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            फीचर्ड
                          </span>
                        )}
                      </div>
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