"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Calendar, Search, Eye, Share2 } from "lucide-react";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsArticle } from '@/lib/types';

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("सभी");
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<string[]>(["सभी"]);
  const [loading, setLoading] = useState(true);

  // Fetch published news articles from Firebase
  const fetchNews = async () => {
    try {
      const q = query(
        collection(db, 'newsArticles'),
        where('status', '==', 'published'),
        orderBy('publishDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const newsData: NewsArticle[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newsData.push({ 
          id: doc.id, 
          ...data,
          publishDate: data.publishDate?.toDate() || new Date(),
          scheduledDate: data.scheduledDate?.toDate() || null,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          publishedAt: data.publishedAt?.toDate() || null
        } as NewsArticle);
      });
      setNewsItems(newsData);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(newsData.map(item => item.category)));
      const categoryLabels = {
        'general': 'सामान्य',
        'health': 'स्वास्थ्य सेवा',
        'education': 'शिक्षा',
        'events': 'कार्यक्रम',
        'library': 'पुस्तकालय अपडेट',
        'donations': 'दान सेवा',
        'achievements': 'उपलब्धियां',
        'announcements': 'घोषणाएं'
      };
      const translatedCategories = uniqueCategories.map(cat => categoryLabels[cat as keyof typeof categoryLabels] || cat);
      setCategories(['सभी', ...translatedCategories]);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const categoryLabels = {
    'सभी': 'all',
    'सामान्य': 'general',
    'स्वास्थ्य सेवा': 'health',
    'शिक्षा': 'education',
    'कार्यक्रम': 'events',
    'पुस्तकालय अपडेट': 'library',
    'दान सेवा': 'donations',
    'उपलब्धियां': 'achievements',
    'घोषणाएं': 'announcements'
  };

  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "सभी" || 
                           categoryLabels[selectedCategory as keyof typeof categoryLabels] === news.category;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = newsItems.filter(news => news.isFeatured);
  const regularNews = filteredNews.filter(news => !news.isFeatured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">समाचार लोड हो रहे हैं...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              📰 समाचार और अपडेट
            </h1>
            <p className="text-xl mb-8">
              संस्था की गतिविधियों और उपलब्धियों की नवीनतम जानकारी
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  समाचार खोजें
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="समाचार का शीर्षक या विषय..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  श्रेणी
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                🌟 मुख्य समाचार
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredNews.map((news) => (
                  <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 bg-gray-200">
                      <img
                        src={news.featuredImage || "/api/placeholder/600/300"}
                        alt={news.featuredImageAlt || news.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="destructive" className="text-xs">
                          मुख्य समाचार
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {news.viewCount}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-800 line-clamp-2">
                        {news.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {news.shortDescription}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {news.publishDate.toLocaleDateString('hi-IN')}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {Object.entries(categoryLabels).find(([label, value]) => value === news.category)?.[0] || news.category}
                        </Badge>
                      </div>
                      <Link href={`/news/${news.id}`} className="w-full">
                        <Button className="w-full">
                          पूरा पढ़ें
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Regular News */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              📄 सभी समाचार
            </h2>
            
            <div className="space-y-6">
              {regularNews.map((news) => (
                <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                      <img
                        src={news.featuredImage || "/api/placeholder/300/200"}
                        alt={news.featuredImageAlt || news.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:col-span-3 p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {Object.entries(categoryLabels).find(([label, value]) => value === news.category)?.[0] || news.category}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {news.publishDate.toLocaleDateString('hi-IN')}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {news.viewCount} views
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {news.shortDescription}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          लेखक: {news.author}
                        </span>
                        <div className="flex gap-2">
                          <Link href={`/news/${news.id}`}>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              पूरा पढ़ें
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" title="शेयर करें" aria-label="समाचार शेयर करें">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  कोई समाचार नहीं मिला
                </h3>
                <p className="text-gray-600">
                  कृपया अपनी खोज या फिल्टर बदलकर पुनः प्रयास करें
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}