"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Heart,
  Share,
  Calendar,
  Clock,
  User,
  Tag,
  Star,
  AlertTriangle,
  Globe,
  TrendingUp,
  MessageCircle,
  BarChart3,
  ExternalLink,
  Copy,
  Send
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { NewsArticle } from '@/lib/types';

export default function NewsArticleViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Sample article data
  const sampleArticle: NewsArticle = {
    id: params.id as string,
    title: 'पुस्तकालय भवन निर्माण कार्य जून 2024 तक पूर्ण होने की संभावना',
    shortDescription: '35 लाख रुपए की लागत से बन रहे नए पुस्तकालय भवन का निर्माण कार्य तेजी से प्रगति पर है। यह आधुनिक सुविधाओं से युक्त भवन जल्द ही तैयार हो जाएगा।',
    content: `<div class="prose max-w-none">
      <p>एरोज्ञा पुस्तकालय एवं सेवा संस्था के नए भवन का निर्माण कार्य तेजी से आगे बढ़ रहा है। 35 लाख रुपए की लागत से बन रहा यह आधुनिक पुस्तकालय भवन जून 2024 तक पूर्ण होने की संभावना है।</p>
      
      <h3>नए भवन की मुख्य विशेषताएं</h3>
      <p>इस नए भवन में निम्नलिखित सुविधाएं होंगी:</p>
      <ul>
        <li>5000+ पुस्तकों की क्षमता वाला मुख्य पुस्तकालय</li>
        <li>डिजिटल लाइब्रेरी सेक्शन</li>
        <li>रीडिंग हॉल (100 व्यक्तियों की क्षमता)</li>
        <li>सेमिनार हॉल</li>
        <li>कंप्यूटर लैब</li>
        <li>बच्चों के लिए अलग सेक्शन</li>
      </ul>
      
      <h3>निर्माण की वर्तमान स्थिति</h3>
      <p>संस्था के अध्यक्ष  आत्माराम बोरा ने बताया कि यह भवन न केवल पुस्तकालय सेवा के लिए बल्कि विभिन्न सामाजिक गतिविधियों के लिए भी उपयोग किया जाएगा। निर्माण कार्य 75% पूरा हो चुका है और शेष कार्य अगले महीने तक पूरा हो जाने की संभावना है।</p>
      
      <h3>समुदाय के लिए लाभ</h3>
      <p>यह नया पुस्तकालय भवन न केवल पुस्तक प्रेमियों के लिए बल्कि पूरे समुदाय के लिए एक केंद्रीय स्थान बनेगा। यहां नियमित रूप से शैक्षणिक और सांस्कृतिक कार्यक्रम आयोजित किए जाएंगे।</p>
    </div>`,
    excerpt: 'एरोज्ञा पुस्तकालय का नया भवन जून 2024 तक तैयार हो जाएगा।',
    metaTitle: 'पुस्तकालय भवन निर्माण कार्य - एरोज्ञा पुस्तकालय',
    metaDescription: '35 लाख रुपए की लागत से बन रहे नए पुस्तकालय भवन का निर्माण कार्य तेजी से प्रगति पर है। आधुनिक सुविधाओं से युक्त यह भवन जून 2024 तक तैयार हो जाएगा।',
    keywords: ['पुस्तकालय', 'निर्माण', 'विकास', 'एरोज्ञा', 'भवन'],
    slug: 'library-construction-completion-june-2024',
    category: 'library',
    tags: ['पुस्तकालय', 'निर्माण', 'विकास'],
    priority: 'high',
    featuredImage: '/news/library-construction.jpg',
    featuredImageAlt: 'पुस्तकालय भवन निर्माण कार्य की तस्वीर',
    images: [
      '/news/library-construction-1.jpg',
      '/news/library-construction-2.jpg',
      '/news/library-construction-3.jpg'
    ],
    videoUrl: 'https://youtube.com/watch?v=example',
    status: 'published',
    publishDate: new Date('2024-05-15'),
    isFeatured: true,
    isBreaking: false,
    viewCount: 2456,
    shareCount: 67,
    likes: 234,
    readingTime: 4,
    author: 'संस्था संवाददाता',
    authorId: 'author1',
    source: 'एरोज्ञा पुस्तकालय एवं सेवा संस्था',
    lastEditedBy: 'admin@Arogya.org',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-05-15'),
    publishedAt: new Date('2024-05-15')
  };

  useEffect(() => {
    // Simulate loading article data
    setTimeout(() => {
      setArticle(sampleArticle);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleDelete = async () => {
    if (window.confirm('क्या आप वाकई इस समाचार को हटाना चाहते हैं?')) {
      try {
        // TODO: Implement Firebase deletion
        alert('समाचार हटा दिया गया!');
        router.push('/admin/news');
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('समाचार हटाने में त्रुटि');
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      // TODO: Implement status update
      console.log('Status changed to:', newStatus);
      alert(`समाचार स्थिति बदली गई: ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('स्थिति बदलने में त्रुटि');
    }
  };

  const copyArticleUrl = () => {
    const url = `${window.location.origin}/news/${article?.slug}`;
    navigator.clipboard.writeText(url);
    alert('समाचार URL कॉपी किया गया!');
  };

  const shareOnSocialMedia = (platform: string) => {
    const url = `${window.location.origin}/news/${article?.slug || ''}`;
    const text = article?.title || 'समाचार';
    
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">समाचार लोड हो रहा है...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!article) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">समाचार नहीं मिला</h2>
            <p className="text-gray-600 mb-4">यह समाचार उपलब्ध नहीं है या हटा दिया गया है।</p>
            <Link href="/admin/news">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस समाचार सूची में जाएं
              </Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
                  <h1 className="text-xl font-bold text-gray-900">समाचार विवरण</h1>
                  <p className="text-gray-600">समाचार देखें और प्रबंधित करें</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowAnalytics(!showAnalytics)}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  एनालिटिक्स
                </Button>
                <Link href={`/admin/news/${article.id}/edit`}>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    संपादित करें
                  </Button>
                </Link>
                <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  हटाएं
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Article Content */}
              <Card>
                <CardContent className="p-8">
                  {/* Article Header */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge className={getStatusColor(article.status)}>
                        {article.status === 'published' ? 'प्रकाशित' : 
                         article.status === 'draft' ? 'प्रारूप' : 
                         article.status === 'scheduled' ? 'अनुसूचित' : 'संग्रहीत'}
                      </Badge>
                      <Badge className={getPriorityColor(article.priority)}>
                        {article.priority === 'urgent' ? 'तत्काल' :
                         article.priority === 'high' ? 'उच्च' :
                         article.priority === 'medium' ? 'मध्यम' : 'कम'} प्राथमिकता
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
                          ब्रेकिंग न्यूज
                        </Badge>
                      )}
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {article.title}
                    </h1>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {article.publishDate.toLocaleDateString('hi-IN')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readingTime} मिनट पढ़ने का समय
                      </div>
                    </div>
                    
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {article.shortDescription}
                    </p>
                  </div>

                  {/* Featured Image */}
                  {article.featuredImage && (
                    <div className="mb-8">
                      <img
                        src="/api/placeholder/800/400"
                        alt={article.featuredImageAlt}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      {article.featuredImageAlt && (
                        <p className="text-sm text-gray-500 mt-2 italic">
                          {article.featuredImageAlt}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="prose max-w-none mb-8" 
                       dangerouslySetInnerHTML={{ __html: article.content }}>
                  </div>

                  {/* Video */}
                  {article.videoUrl && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">संबंधित वीडियो</h3>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <ExternalLink className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">वीडियो देखने के लिए क्लिक करें</p>
                          <a 
                            href={article.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {article.videoUrl}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Images */}
                  {article.images.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">अतिरिक्त छवियां</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {article.images.map((image, index) => (
                          <img
                            key={index}
                            src="/api/placeholder/300/200"
                            alt={`Additional image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-3">टैग्स</h3>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics Section */}
              {showAnalytics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      समाचार एनालिटिक्स
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">{article.viewCount}</p>
                        <p className="text-sm text-gray-600">कुल व्यूज</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-red-600">{article.likes}</p>
                        <p className="text-sm text-gray-600">लाइक्स</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Share className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">{article.shareCount}</p>
                        <p className="text-sm text-gray-600">शेयर</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-600">12</p>
                        <p className="text-sm text-gray-600">कमेंट्स</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        पिछले 7 दिनों में: <span className="font-medium text-green-600">+23% व्यूज</span>
                      </p>
                      <Button variant="outline" size="sm">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        विस्तृत रिपोर्ट देखें
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publishing Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>प्रकाशन नियंत्रण</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      स्थिति बदलें
                    </label>
                    <select
                      value={article.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="समाचार स्थिति बदलें"
                    >
                      <option value="draft">प्रारूप</option>
                      <option value="published">प्रकाशित</option>
                      <option value="scheduled">अनुसूचित</option>
                      <option value="archived">संग्रहीत</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full"
                      onClick={() => window.open(`/news/${article.slug}`, '_blank')}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      लाइव देखें
                    </Button>
                    
                    <Button variant="outline" className="w-full" onClick={copyArticleUrl}>
                      <Copy className="w-4 h-4 mr-2" />
                      URL कॉपी करें
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Share */}
              <Card>
                <CardHeader>
                  <CardTitle>सोशल मीडिया शेयर</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => shareOnSocialMedia('whatsapp')}
                  >
                    <Send className="w-4 h-4 mr-2 text-green-600" />
                    WhatsApp पर शेयर करें
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => shareOnSocialMedia('facebook')}
                  >
                    <Share className="w-4 h-4 mr-2 text-blue-600" />
                    Facebook पर शेयर करें
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => shareOnSocialMedia('twitter')}
                  >
                    <Share className="w-4 h-4 mr-2 text-blue-400" />
                    Twitter पर शेयर करें
                  </Button>
                </CardContent>
              </Card>

              {/* SEO Information */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO जानकारी</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">मेटा शीर्षक</p>
                    <p className="text-sm text-gray-600">{article.metaTitle}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">मेटा विवरण</p>
                    <p className="text-sm text-gray-600">{article.metaDescription}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">URL Slug</p>
                    <p className="text-sm text-gray-600 break-all">{article.slug}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">खोज शब्द</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {article.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Article Info */}
              <Card>
                <CardHeader>
                  <CardTitle>समाचार जानकारी</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">श्रेणी:</span>
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">लेखक:</span>
                    <span className="text-sm font-medium">{article.author}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">बनाया गया:</span>
                    <span className="text-sm">{article.createdAt.toLocaleDateString('hi-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">अपडेट किया गया:</span>
                    <span className="text-sm">{article.updatedAt.toLocaleDateString('hi-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">अंतिम संपादक:</span>
                    <span className="text-sm">{article.lastEditedBy}</span>
                  </div>
                  
                  {article.source && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">स्रोत:</span>
                      <span className="text-sm">{article.source}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
