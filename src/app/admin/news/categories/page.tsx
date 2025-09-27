"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Tag,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Hash,
  Palette,
  BarChart3,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { NewsCategory, NewsTag } from '@/lib/types';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
  parentId: string;
  isActive: boolean;
  sortOrder: number;
}

interface TagFormData {
  name: string;
  color: string;
}

export default function NewsCategoriesPage() {
  const { user } = useAuth();
  
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [tags, setTags] = useState<NewsTag[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<NewsCategory | null>(null);
  const [editingTag, setEditingTag] = useState<NewsTag | null>(null);
  
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '',
    parentId: '',
    isActive: true,
    sortOrder: 0
  });
  
  const [tagForm, setTagForm] = useState<TagFormData>({
    name: '',
    color: '#6B7280'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  // Fetch categories from Firebase
  const fetchCategories = async () => {
    try {
      const q = query(collection(db, 'newsCategories'), orderBy('sortOrder', 'asc'));
      const querySnapshot = await getDocs(q);
      const categoriesData: NewsCategory[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categoriesData.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as NewsCategory);
      });
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch tags from Firebase
  const fetchTags = async () => {
    try {
      const q = query(collection(db, 'newsTags'), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      const tagsData: NewsTag[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tagsData.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as NewsTag);
      });
      setTags(tagsData);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchCategories(), fetchTags()]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && category.isActive) ||
                         (filterActive === 'inactive' && !category.isActive);
    return matchesSearch && matchesFilter;
  });

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: categoryForm.name,
        description: categoryForm.description,
        color: categoryForm.color,
        icon: categoryForm.icon,
        parentId: categoryForm.parentId || null,
        isActive: categoryForm.isActive,
        sortOrder: categoryForm.sortOrder,
        slug: categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        updatedAt: serverTimestamp()
      };

      if (editingCategory) {
        await updateDoc(doc(db, 'newsCategories', editingCategory.id), categoryData);
        alert('श्रेणी अपडेट की गई!');
      } else {
        await addDoc(collection(db, 'newsCategories'), {
          ...categoryData,
          createdAt: serverTimestamp()
        });
        alert('नई श्रेणी जोड़ी गई!');
      }

      await fetchCategories();
      resetCategoryForm();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('श्रेणी सेव करने में त्रुटि: ' + (error as Error).message);
    }
  };

  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagData = {
        name: tagForm.name,
        color: tagForm.color,
        slug: tagForm.name.toLowerCase().replace(/\s+/g, '-'),
        count: editingTag ? editingTag.count : 0,
        updatedAt: serverTimestamp()
      };

      if (editingTag) {
        await updateDoc(doc(db, 'newsTags', editingTag.id), tagData);
        alert('टैग अपडेट किया गया!');
      } else {
        await addDoc(collection(db, 'newsTags'), {
          ...tagData,
          createdAt: serverTimestamp()
        });
        alert('नया टैग जोड़ा गया!');
      }

      await fetchTags();
      resetTagForm();
    } catch (error) {
      console.error('Error saving tag:', error);
      alert('टैग सेव करने में त्रुटि: ' + (error as Error).message);
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      color: '#3B82F6',
      icon: '',
      parentId: '',
      isActive: true,
      sortOrder: 0
    });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const resetTagForm = () => {
    setTagForm({
      name: '',
      color: '#6B7280'
    });
    setEditingTag(null);
    setShowTagForm(false);
  };

  const handleEditCategory = (category: NewsCategory) => {
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      color: category.color,
      icon: category.icon || '',
      parentId: category.parentId || '',
      isActive: category.isActive,
      sortOrder: category.sortOrder
    });
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleEditTag = (tag: NewsTag) => {
    setTagForm({
      name: tag.name,
      color: tag.color || '#6B7280'
    });
    setEditingTag(tag);
    setShowTagForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('क्या आप इस श्रेणी को हटाना चाहते हैं?')) {
      try {
        await deleteDoc(doc(db, 'newsCategories', categoryId));
        await fetchCategories();
        alert('श्रेणी हटा दी गई!');
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('श्रेणी हटाने में त्रुटि: ' + (error as Error).message);
      }
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (window.confirm('क्या आप इस टैग को हटाना चाहते हैं?')) {
      try {
        await deleteDoc(doc(db, 'newsTags', tagId));
        await fetchTags();
        alert('टैग हटा दिया गया!');
      } catch (error) {
        console.error('Error deleting tag:', error);
        alert('टैग हटाने में त्रुटि: ' + (error as Error).message);
      }
    }
  };

  const stats = {
    totalCategories: categories.length,
    activeCategories: categories.filter(c => c.isActive).length,
    inactiveCategories: categories.filter(c => !c.isActive).length,
    totalTags: tags.length,
    popularTags: tags.filter(t => t.count > 5).length
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">श्रेणियां लोड हो रही हैं...</p>
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
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link href="/admin/news">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Tag className="w-6 h-6 mr-2" />
                    श्रेणी और टैग प्रबंधन
                  </h1>
                  <p className="text-gray-600">
                    श्रेणियां: {stats.totalCategories} | टैग्स: {stats.totalTags}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowTagForm(true)}
                  className="flex items-center"
                >
                  <Hash className="w-4 h-4 mr-2" />
                  नया टैग
                </Button>
                <Button 
                  onClick={() => setShowCategoryForm(true)}
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  नई श्रेणी
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Tag className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">कुल श्रेणियां</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalCategories}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">सक्रिय श्रेणियां</p>
                    <p className="text-xl font-bold text-green-600">{stats.activeCategories}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">निष्क्रिय श्रेणियां</p>
                    <p className="text-xl font-bold text-red-600">{stats.inactiveCategories}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Hash className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">कुल टैग्स</p>
                    <p className="text-xl font-bold text-purple-600">{stats.totalTags}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">लोकप्रिय टैग्स</p>
                    <p className="text-xl font-bold text-yellow-600">{stats.popularTags}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="श्रेणी या टैग खोजें..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={filterActive}
                    onChange={(e) => setFilterActive(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="श्रेणी फिल्टर"
                  >
                    <option value="all">सभी श्रेणियां</option>
                    <option value="active">सक्रिय</option>
                    <option value="inactive">निष्क्रिय</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Categories Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">समाचार श्रेणियां</h2>
              <div className="space-y-4">
                {filteredCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                            role="presentation"
                          ></div>
                          <div>
                            <h3 className="font-medium text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">समाचार टैग्स</h2>
              <div className="space-y-4">
                {filteredTags.map((tag) => (
                  <Card key={tag.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: tag.color }}
                            role="presentation"
                          ></div>
                          <div>
                            <h3 className="font-medium text-gray-900">#{tag.name}</h3>
                            <p className="text-sm text-gray-500">{tag.count} समाचारों में उपयोग</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {tag.count} उपयोग
                          </Badge>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditTag(tag)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteTag(tag.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category Form Modal */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingCategory ? 'श्रेणी संपादित करें' : 'नई श्रेणी जोड़ें'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetCategoryForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      श्रेणी नाम *
                    </label>
                    <Input
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="श्रेणी का नाम..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      विवरण
                    </label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="श्रेणी का विवरण..."
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="श्रेणी विवरण"
                      title="श्रेणी का विवरण"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      रंग
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={categoryForm.color}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
                        className="w-10 h-10 border border-gray-300 rounded"
                        aria-label="श्रेणी रंग चुनें"
                      />
                      <Input
                        value={categoryForm.color}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      क्रम संख्या
                    </label>
                    <Input
                      type="number"
                      value={categoryForm.sortOrder}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={categoryForm.isActive}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">सक्रिय श्रेणी</span>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={resetCategoryForm} className="flex-1">
                      रद्द करें
                    </Button>
                    <Button type="submit" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      सेव करें
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tag Form Modal */}
        {showTagForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingTag ? 'टैग संपादित करें' : 'नया टैग जोड़ें'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetTagForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form onSubmit={handleTagSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      टैग नाम *
                    </label>
                    <Input
                      value={tagForm.name}
                      onChange={(e) => setTagForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="टैग का नाम..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      रंग
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={tagForm.color}
                        onChange={(e) => setTagForm(prev => ({ ...prev, color: e.target.value }))}
                        className="w-10 h-10 border border-gray-300 rounded"
                        aria-label="टैग रंग चुनें"
                      />
                      <Input
                        value={tagForm.color}
                        onChange={(e) => setTagForm(prev => ({ ...prev, color: e.target.value }))}
                        placeholder="#6B7280"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={resetTagForm} className="flex-1">
                      रद्द करें
                    </Button>
                    <Button type="submit" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      सेव करें
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
