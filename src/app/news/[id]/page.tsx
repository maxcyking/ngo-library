"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  User,
  Eye,
  Clock,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  ArrowLeft,
  Tag,
  ChevronRight,
  Home
} from 'lucide-react';
import Link from 'next/link';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsArticle } from '@/lib/types';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;
  
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categoryLabels: { [key: string]: string } = {
    'general': 'सामान्य',
    'health': 'स्वास्थ्य सेवा',
    'education': 'शिक्षा',
    'events': 'कार्यक्रम',
    'library': 'पुस्तकालय अपडेट',
    'donations': 'दान सेवा',
    'achievements': 'उपलब्धियां',
    'announcements': 'घोषणाएं'
  };

  useEffect(() => {
    if (newsId) {
      fetchArticle();
    }
  }, [newsId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      
      // Fetch the article
      const docRef = doc(db, 'newsArticles', newsId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError('समाचार नहीं मिला');
        setLoading(false);
        return;
      }

      const data = docSnap.data();
      const articleData: NewsArticle = {
        id: docSnap.id,
        ...data,
        publishDate: data.publishDate?.toDate() || new Date(),
        scheduledDate: data.scheduledDate?.toDate() || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        publishedAt: data.publishedAt?.toDate() || null
      } as NewsArticle;

      setArticle(articleData);

      // Increment view count
      await updateDoc(docRef, {
        viewCount: increment(1)
      });

      // Fetch related articles (same category, excluding current)
      const relatedQuery = query(
        collection(db, 'newsArticles'),
        where('category', '==', data.category),
        where('status', '==', 'published'),
        orderBy('publishDate', 'desc'),
        limit(4)
      );

      const relatedSnapshot = await getDocs(relatedQuery);
      const related: NewsArticle[] = [];
      
      relatedSnapshot.forEach((doc) => {
        if (doc.id !== newsId) {
          const relatedData = doc.data();
          related.push({
            id: doc.id,
            ...relatedData,
            publishDate: relatedData.publishDate?.toDate() || new Date(),
            scheduledDate: relatedData.scheduledDate?.toDate() || null,
            createdAt: relatedData.createdAt?.toDate() || new Date(),
            updatedAt: relatedData.updatedAt?.toDate() || new Date(),
            publishedAt: relatedData.publishedAt?.toDate() || null
          } as NewsArticle);
        }
      });

      setRelatedNews(related.slice(0, 3));
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('समाचार लोड करने में त्रुटि हुई');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article?.title || '';
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📰</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {error || 'समाचार नहीं मिला'}
              </h2>
              <p className="text-gray-600 mb-6">
                यह समाचार हटा दिया गया हो सकता है या उपलब्ध नहीं है
              </p>
              <Link href="/news">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  सभी समाचार पर जाएं
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 flex items-center">
              <Home className="w-4 h-4 mr-1" />
              होम
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/news" className="hover:text-blue-600">
              समाचार
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {article.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <Link href="/news">
              <Button variant="outline" size="sm" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस जाएं
              </Button>
            </Link>

            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Featured Image */}
              {article.featuredImage && (
                <div className="relative h-96 bg-gray-200">
                  <img
                    src={article.featuredImage}
                    alt={article.featuredImageAlt || article.title}
                    className="w-full h-full object-cover"
                  />
                  {article.isFeatured && (
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                      Featured
                    </Badge>
                  )}
                </div>
              )}

              {/* Article Header */}
              <div className="p-8">
                {/* Category & Date */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {categoryLabels[article.category] || article.category}
                  </Badge>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {article.publishDate.toLocaleDateString('hi-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {calculateReadingTime(article.content)} मिनट पढ़ने का समय
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                {/* Short Description */}
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {article.shortDescription}
                </p>

                {/* Author & Stats */}
                <div className="flex flex-wrap items-center justify-between pb-6 mb-6 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-700">
                      <User className="w-5 h-5 mr-2" />
                      <span className="font-medium">{article.author}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Eye className="w-5 h-5 mr-1" />
                      <span>{article.viewCount + 1} views</span>
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 mr-2">शेयर करें:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('facebook')}
                      title="Facebook पर शेयर करें"
                      aria-label="Facebook पर शेयर करें"
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('twitter')}
                      title="Twitter पर शेयर करें"
                      aria-label="Twitter पर शेयर करें"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('whatsapp')}
                      title="WhatsApp पर शेयर करें"
                      aria-label="WhatsApp पर शेयर करें"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag className="w-5 h-5 text-gray-500" />
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Comments Section (Placeholder) */}
            <Card className="mt-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  टिप्पणियाँ
                </h3>
                <div className="text-center py-8 text-gray-500">
                  <p>टिप्पणी सुविधा जल्द ही उपलब्ध होगी</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related News */}
            {relatedNews.length > 0 && (
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    संबंधित समाचार
                  </h3>
                  <div className="space-y-4">
                    {relatedNews.map((news) => (
                      <Link key={news.id} href={`/news/${news.id}`}>
                        <div className="group cursor-pointer">
                          <div className="flex gap-3">
                            {news.featuredImage && (
                              <img
                                src={news.featuredImage}
                                alt={news.title}
                                className="w-20 h-20 object-cover rounded-lg group-hover:opacity-75 transition"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 mb-1">
                                {news.title}
                              </h4>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {news.publishDate.toLocaleDateString('hi-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/news">
                    <Button variant="outline" className="w-full mt-6">
                      सभी समाचार देखें
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card className="mt-6">
              <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  संपर्क करें
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  क्या आपके पास कोई समाचार या सुझाव है? हमसे संपर्क करें!
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <strong>फोन:</strong> +91 99518 00733
                  </p>
                  <p className="text-gray-700">
                    <strong>ईमेल:</strong> arogyapustkalaya@gmail.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

