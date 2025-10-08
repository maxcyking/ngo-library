"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, ArrowRight, Clock, Tag } from "lucide-react";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface NewsArticle {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  slug: string;
  category: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  featuredImage?: string;
  featuredImageAlt?: string;
  images: string[];
  videoUrl?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishDate: Date | { seconds: number; nanoseconds: number };
  scheduledDate?: Date | { seconds: number; nanoseconds: number };
  isFeatured: boolean;
  isBreaking: boolean;
  viewCount: number;
  shareCount: number;
  likes: number;
  readingTime: number;
  author: string;
  authorId: string;
  source?: string;
  approvedBy?: string;
  approvedAt?: Date | { seconds: number; nanoseconds: number };
  createdAt: Date | { seconds: number; nanoseconds: number };
  updatedAt: Date | { seconds: number; nanoseconds: number };
  publishedAt?: Date | { seconds: number; nanoseconds: number };
}

export function LatestNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = () => {
      try {
        const newsQuery = query(
          collection(db, 'newsArticles'),
          where('status', '==', 'published'),
          orderBy('publishDate', 'desc'),
          limit(3)
        );

        const unsubscribe = onSnapshot(
          newsQuery,
          (snapshot) => {
            const newsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as NewsArticle[];

            setArticles(newsData);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching news:', error);
            // Set fallback sample data when database is not accessible
            setArticles([
              {
                id: 'sample-1',
                title: 'पुस्तकालय भवन निर्माण कार्य प्रगति पर',
                shortDescription: '65 लाख रुपए की लागत से नया पुस्तकालय भवन निर्माण कार्य तेजी से प्रगति पर है।',
                content: '',
                slug: 'library-construction-progress',
                category: 'निर्माण कार्य',
                tags: ['पुस्तकालय', 'निर्माण', 'प्रगति'],
                priority: 'high' as const,
                featuredImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                status: 'published' as const,
                publishDate: new Date('2024-06-15'),
                isFeatured: true,
                isBreaking: false,
                viewCount: 245,
                shareCount: 12,
                likes: 34,
                readingTime: 3,
                author: 'एडमिन',
                authorId: 'admin',
                keywords: [],
                images: [],
                createdAt: new Date(),
                updatedAt: new Date()
              },
              {
                id: 'sample-2',
                title: 'मान मिलाप समारोह 2022 का सफल आयोजन',
                shortDescription: 'द्वितीय वार्षिकोत्सव पर सामाजिक कार्यकर्ताओं का सम्मान किया गया।',
                content: '',
                slug: 'annual-celebration-2022',
                category: 'कार्यक्रम',
                tags: ['समारोह', 'सम्मान', 'वार्षिकोत्सव'],
                priority: 'medium' as const,
                featuredImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                status: 'published' as const,
                publishDate: new Date('2022-08-15'),
                isFeatured: false,
                isBreaking: false,
                viewCount: 189,
                shareCount: 8,
                likes: 23,
                readingTime: 2,
                author: 'एडमिन',
                authorId: 'admin',
                keywords: [],
                images: [],
                createdAt: new Date(),
                updatedAt: new Date()
              },
              {
                id: 'sample-3',
                title: 'रक्तदान शिविर का सफल आयोजन',
                shortDescription: '50+ रक्तदाताओं ने रक्तदान कर जीवन दान का पुण्य कार्य किया।',
                content: '',
                slug: 'blood-donation-camp-success',
                category: 'रक्तदान',
                tags: ['रक्तदान', 'शिविर', 'सेवा'],
                priority: 'high' as const,
                featuredImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
                status: 'published' as const,
                publishDate: new Date('2022-07-20'),
                isFeatured: true,
                isBreaking: false,
                viewCount: 312,
                shareCount: 15,
                likes: 45,
                readingTime: 4,
                author: 'एडमिन',
                authorId: 'admin',
                keywords: [],
                images: [],
                createdAt: new Date(),
                updatedAt: new Date()
              }
            ]);
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error('Error setting up news listener:', error);
        setLoading(false);
      }
    };

    const unsubscribe = fetchLatestNews();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const formatDate = (date: Date | { seconds: number; nanoseconds: number }) => {
    const dateObj = date instanceof Date ? date : new Date(date.seconds * 1000);
    return dateObj.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'निर्माण कार्य':
      case 'construction':
        return 'bg-blue-100 text-blue-800';
      case 'कार्यक्रम':
      case 'events':
        return 'bg-purple-100 text-purple-800';
      case 'रक्तदान':
      case 'blood donation':
        return 'bg-red-100 text-red-800';
      case 'स्वास्थ्य':
      case 'health':
        return 'bg-green-100 text-green-800';
      case 'शिक्षा':
      case 'education':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800 animate-pulse">तत्काल</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">महत्वपूर्ण</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800">सामान्य</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              📰 हाल की गतिविधियां
            </h2>
            <p className="text-lg text-gray-600">
              हमारे नवीनतम कार्यक्रम और उपलब्धियां
            </p>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">समाचार लोड हो रहे हैं...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            📰 हाल की गतिविधियां
          </h2>
          <p className="text-lg text-gray-600">
            हमारे नवीनतम कार्यक्रम और उपलब्धियां
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">कोई समाचार उपलब्ध नहीं</h3>
            <p className="text-gray-500 mb-6">
              अभी तक कोई समाचार प्रकाशित नहीं किया गया है।
            </p>
            <Link href="/admin/news/add">
              <Button variant="outline">
                पहला समाचार जोड़ें
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  {article.featuredImage ? (
                    <img
                      src={article.featuredImage}
                      alt={article.featuredImageAlt || article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-4xl text-gray-400">📰</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  
                  {/* Priority and Featured Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {article.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        ⭐ विशेष
                      </Badge>
                    )}
                    {article.isBreaking && (
                      <Badge className="bg-red-100 text-red-800 animate-pulse">
                        🚨 ब्रेकिंग
                      </Badge>
                    )}
                    {getPriorityBadge(article.priority)}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={getCategoryColor(article.category)}>
                      {article.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(article.publishDate)}</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{article.readingTime} मिनट</span>
                    <span className="mx-2">•</span>
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{article.viewCount}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.shortDescription}
                  </p>

                  {/* Tags */}
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{article.tags.length - 3} और
                        </span>
                      )}
                    </div>
                  )}

                  <Link
                    href={`/news/${article.slug}`}
                    className="text-green-600 hover:text-green-700 font-medium text-sm inline-flex items-center group"
                  >
                    विस्तार से पढ़ें
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/news">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
              सभी समाचार देखें
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}