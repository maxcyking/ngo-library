"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Eye,
  Calendar,
  Tag,
  TrendingUp,
  Star,
  AlertTriangle,
  Clock,
  Filter,
  MoreVertical,
  Share,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  where 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { NewsArticle } from '@/lib/types';

export default function AdminNewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  const { user } = useAuth();

  const statusLabels = {
    'all': 'सभी',
    'draft': 'प्रारूप',
    'published': 'प्रकाशित',
    'scheduled': 'अनुसूचित',
    'archived': 'संग्रहीत'
  };

  const priorityLabels = {
    'all': 'सभी',
    'low': 'कम',
    'medium': 'मध्यम',
    'high': 'उच्च',
    'urgent': 'तत्काल'
  };

  const categoryLabels = {
    'all': 'सभी',
    'general': 'सामान्य',
    'health': 'स्वास्थ्य',
    'education': 'शिक्षा',
    'events': 'कार्यक्रम',
    'library': 'पुस्तकालय',
    'donations': 'दान',
    'achievements': 'उपलब्धियां',
    'announcements': 'घोषणाएं'
  };


  // Fetch articles from Firebase
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'newsArticles'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const articlesData: NewsArticle[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        articlesData.push({ 
          id: doc.id, 
          ...data,
          publishDate: data.publishDate?.toDate() || new Date(),
          scheduledDate: data.scheduledDate?.toDate() || null,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          publishedAt: data.publishedAt?.toDate() || null,
          approvedAt: data.approvedAt?.toDate() || null
        } as NewsArticle);
      });
      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || article.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (window.confirm('क्या आप वाकई इस समाचार को हटाना चाहते हैं?')) {
      try {
        await deleteDoc(doc(db, 'newsArticles', articleId));
        await fetchArticles();
        alert('समाचार सफलतापूर्वक हटा दिया गया!');
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('समाचार हटाने में त्रुटि हुई!');
      }
    }
  };

  // Statistics
  const stats = {
    totalArticles: articles.length,
    publishedArticles: articles.filter(a => a.status === 'published').length,
    draftArticles: articles.filter(a => a.status === 'draft').length,
    scheduledArticles: articles.filter(a => a.status === 'scheduled').length,
    featuredArticles: articles.filter(a => a.isFeatured).length,
    totalViews: articles.reduce((sum, a) => sum + a.viewCount, 0),
    avgReadingTime: Math.round(articles.reduce((sum, a) => sum + a.readingTime, 0) / articles.length) || 0
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">समाचार लोड हो रहे हैं...</p>
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
                <Link href="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FileText className="w-6 h-6 mr-2" />
                    समाचार प्रबंधन
                  </h1>
                  <p className="text-gray-600">
                    कुल समाचार: {stats.totalArticles} | प्रकाशित: {stats.publishedArticles} | कुल व्यूज: {stats.totalViews}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link href="/admin/news/categories">
                  <Button variant="outline" className="flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    श्रेणियां
                  </Button>
                </Link>
                <Link href="/admin/news/analytics">
                  <Button variant="outline" className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    एनालिटिक्स
                  </Button>
                </Link>
                <Link href="/admin/news/add">
                  <Button className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    नया समाचार जोड़ें
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">कुल समाचार</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalArticles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">प्रकाशित</p>
                    <p className="text-xl font-bold text-green-600">{stats.publishedArticles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Edit className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">प्रारूप</p>
                    <p className="text-xl font-bold text-yellow-600">{stats.draftArticles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">अनुसूचित</p>
                    <p className="text-xl font-bold text-purple-600">{stats.scheduledArticles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Star className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">फीचर्ड</p>
                    <p className="text-xl font-bold text-pink-600">{stats.featuredArticles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">कुल व्यूज</p>
                    <p className="text-xl font-bold text-indigo-600">{stats.totalViews}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Clock className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">औसत पढ़ने का समय</p>
                    <p className="text-xl font-bold text-teal-600">{stats.avgReadingTime} मिनट</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="समाचार शीर्षक, विवरण या लेखक से खोजें..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="स्थिति फिल्टर"
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="श्रेणी फिल्टर"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="प्राथमिकता फिल्टर"
                  >
                    {Object.entries(priorityLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles List */}
          <div className="space-y-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {/* Article Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {article.featuredImage ? (
                              <img 
                                src="/api/placeholder/80/80" 
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileText className="w-8 h-8 text-blue-600" />
                            )}
                          </div>
                        </div>
                        
                        {/* Article Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 truncate">
                              {article.title}
                            </h3>
                            <Badge className={getStatusColor(article.status)}>
                              {statusLabels[article.status]}
                            </Badge>
                            <Badge className={getPriorityColor(article.priority)}>
                              {priorityLabels[article.priority]}
                            </Badge>
                            {article.isFeatured && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 mr-1" />
                                फीचर्ड
                              </Badge>
                            )}
                            {article.isBreaking && (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                ब्रेकिंग
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {article.shortDescription}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {article.publishDate.toLocaleDateString('hi-IN')}
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-2" />
                              {article.viewCount} व्यूज
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {article.readingTime} मिनट पढ़ने का समय
                            </div>
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 mr-2" />
                              {categoryLabels[article.category as keyof typeof categoryLabels] || article.category}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-gray-500">
                                लेखक: {article.author}
                              </span>
                              <div className="flex items-center space-x-2">
                                {article.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {article.tags.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{article.tags.length - 3} और
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {article.likes} लाइक्स
                              </span>
                              <span className="flex items-center">
                                <Share className="w-4 h-4 mr-1" />
                                {article.shareCount} शेयर
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <Link href={`/admin/news/${article.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            विवरण
                          </Button>
                        </Link>
                        <Link href={`/admin/news/${article.id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            संपादित
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          हटाएं
                        </Button>
                      </div>
                      
                      <Button size="sm" variant="ghost" className="w-full">
                        <MoreVertical className="w-4 h-4 mr-1" />
                        और विकल्प
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  कोई समाचार नहीं मिला
                </h3>
                <p className="text-gray-600 mb-4">
                  आपकी खोज के अनुसार कोई समाचार नहीं मिला।
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setPriorityFilter('all');
                }}>
                  सभी समाचार दिखाएं
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
