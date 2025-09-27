"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Share,
  Calendar,
  Tag,
  Users,
  Clock,
  Star,
  Hash,
  Download
} from 'lucide-react';
import Link from 'next/link';

interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  avgReadingTime: number;
  popularCategories: { name: string; count: number; percentage: number }[];
  popularTags: { name: string; count: number }[];
  topArticles: { 
    title: string; 
    views: number; 
    likes: number; 
    shares: number; 
    date: string;
    category: string;
  }[];
  monthlyStats: {
    month: string;
    published: number;
    views: number;
    engagement: number;
  }[];
  authorStats: {
    name: string;
    articles: number;
    views: number;
    avgEngagement: number;
  }[];
}

export default function NewsAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('last30days');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // Sample analytics data
  const sampleAnalytics: AnalyticsData = {
    totalViews: 12548,
    totalLikes: 1876,
    totalShares: 432,
    totalComments: 289,
    avgReadingTime: 3.2,
    popularCategories: [
      { name: 'स्वास्थ्य सेवा', count: 45, percentage: 35 },
      { name: 'पुस्तकालय', count: 32, percentage: 25 },
      { name: 'कार्यक्रम', count: 28, percentage: 22 },
      { name: 'दान सेवा', count: 18, percentage: 14 },
      { name: 'उपलब्धियां', count: 5, percentage: 4 }
    ],
    popularTags: [
      { name: 'स्वास्थ्य', count: 67 },
      { name: 'रक्तदान', count: 45 },
      { name: 'पुस्तकालय', count: 38 },
      { name: 'शिविर', count: 34 },
      { name: 'सामुदायिक सेवा', count: 29 }
    ],
    topArticles: [
      {
        title: 'पुस्तकालय भवन निर्माण कार्य जून 2024 तक पूर्ण होने की संभावना',
        views: 2456,
        likes: 234,
        shares: 67,
        date: '2024-05-15',
        category: 'पुस्तकालय'
      },
      {
        title: 'मासिक रक्तदान शिविर में 45 रक्तदाताओं ने किया रक्तदान',
        views: 1890,
        likes: 189,
        shares: 45,
        date: '2024-05-10',
        category: 'स्वास्थ्य सेवा'
      },
      {
        title: 'निःशुल्क स्वास्थ्य जांच शिविर में 150+ लोगों की जांच',
        views: 1654,
        likes: 167,
        shares: 38,
        date: '2024-05-05',
        category: 'स्वास्थ्य सेवा'
      },
      {
        title: 'महिला सशक्तिकरण कार्यक्रम के तहत 30 महिलाओं को प्रशिक्षण',
        views: 1432,
        likes: 145,
        shares: 29,
        date: '2024-04-28',
        category: 'कार्यक्रम'
      },
      {
        title: 'पुस्तकालय में 200+ नई पुस्तकों का संग्रह जोड़ा गया',
        views: 1287,
        likes: 134,
        shares: 24,
        date: '2024-04-20',
        category: 'पुस्तकालय'
      }
    ],
    monthlyStats: [
      { month: 'जनवरी', published: 8, views: 3245, engagement: 287 },
      { month: 'फरवरी', published: 12, views: 4521, engagement: 398 },
      { month: 'मार्च', published: 15, views: 5896, engagement: 456 },
      { month: 'अप्रैल', published: 18, views: 6758, engagement: 523 },
      { month: 'मई', published: 14, views: 7234, engagement: 678 }
    ],
    authorStats: [
      { name: 'संस्था संवाददाता', articles: 25, views: 8945, avgEngagement: 4.2 },
      { name: 'स्वास्थ्य टीम', articles: 18, views: 6234, avgEngagement: 3.8 },
      { name: 'तकनीकी टीम', articles: 12, views: 4567, avgEngagement: 3.5 },
      { name: 'महिला सशक्तिकरण टीम', articles: 8, views: 2890, avgEngagement: 3.2 },
      { name: 'चिकित्सा टीम', articles: 6, views: 2345, avgEngagement: 3.9 }
    ]
  };

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData(sampleAnalytics);
      setLoading(false);
    }, 1000);
  }, [timeFilter]);

  const timeFilterOptions = [
    { value: 'last7days', label: 'पिछले 7 दिन' },
    { value: 'last30days', label: 'पिछले 30 दिन' },
    { value: 'last3months', label: 'पिछले 3 महीने' },
    { value: 'last6months', label: 'पिछले 6 महीने' },
    { value: 'lastyear', label: 'पिछला साल' }
  ];

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const exportAnalytics = () => {
    // Create CSV content
    const csvContent = `
News Analytics Report - ${new Date().toLocaleDateString('hi-IN')}

Overview:
Total Views,${analyticsData?.totalViews}
Total Likes,${analyticsData?.totalLikes}
Total Shares,${analyticsData?.totalShares}
Average Reading Time,${analyticsData?.avgReadingTime} minutes

Top Articles:
${analyticsData?.topArticles.map(article => 
  `"${article.title}",${article.views},${article.likes},${article.shares},${article.category}`
).join('\n')}

Popular Categories:
${analyticsData?.popularCategories.map(cat => 
  `${cat.name},${cat.count},${cat.percentage}%`
).join('\n')}
    `.trim();

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `news-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">एनालिटिक्स लोड हो रही है...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!analyticsData) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600">एनालिटिक्स डेटा उपलब्ध नहीं है</p>
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
                    <BarChart3 className="w-6 h-6 mr-2" />
                    समाचार एनालिटिक्स
                  </h1>
                  <p className="text-gray-600">
                    समाचार प्रदर्शन और उपयोगकर्ता जुड़ाव की विस्तृत रिपोर्ट
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="समय फिल्टर"
                >
                  {timeFilterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button onClick={exportAnalytics} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  रिपोर्ट डाउनलोड करें
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">कुल व्यूज</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalViews.toLocaleString()}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+12% इस महीने</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">कुल लाइक्स</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalLikes.toLocaleString()}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+8% इस महीने</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Share className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">कुल शेयर</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalShares.toLocaleString()}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+15% इस महीने</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">कुल कमेंट्स</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalComments.toLocaleString()}</p>
                    <div className="flex items-center mt-1">
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-600">-3% इस महीने</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">औसत पढ़ने का समय</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.avgReadingTime} मिनट</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+5% इस महीने</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Popular Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  लोकप्रिय श्रेणियां
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.popularCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.count} समाचार</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{category.percentage}%</p>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                            role="progressbar"
                            aria-valuenow={category.percentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${category.name} ${category.percentage}%`}
                            title={`${category.name} ${category.percentage}%`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hash className="w-5 h-5 mr-2" />
                  लोकप्रिय टैग्स
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.popularTags.map((tag, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">#{tag.name}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{tag.count}</p>
                        <p className="text-sm text-gray-500">उपयोग</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Articles */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                सबसे अच्छे प्रदर्शन वाले समाचार
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-600">समाचार शीर्षक</th>
                      <th className="text-center py-3 px-2 font-medium text-gray-600">व्यूज</th>
                      <th className="text-center py-3 px-2 font-medium text-gray-600">लाइक्स</th>
                      <th className="text-center py-3 px-2 font-medium text-gray-600">शेयर</th>
                      <th className="text-center py-3 px-2 font-medium text-gray-600">श्रेणी</th>
                      <th className="text-center py-3 px-2 font-medium text-gray-600">दिनांक</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.topArticles.map((article, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                              <span className="text-xs font-medium text-yellow-600">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-2">{article.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-4 px-2">
                          <div className="flex items-center justify-center">
                            <Eye className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="font-medium">{article.views.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-2">
                          <div className="flex items-center justify-center">
                            <Heart className="w-4 h-4 text-red-400 mr-1" />
                            <span className="font-medium">{article.likes}</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-2">
                          <div className="flex items-center justify-center">
                            <Share className="w-4 h-4 text-blue-400 mr-1" />
                            <span className="font-medium">{article.shares}</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-2">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                        </td>
                        <td className="text-center py-4 px-2 text-sm text-gray-500">
                          {new Date(article.date).toLocaleDateString('hi-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  मासिक प्रदर्शन
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.monthlyStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{stat.month}</p>
                        <p className="text-sm text-gray-500">{stat.published} समाचार प्रकाशित</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{stat.views.toLocaleString()} व्यूज</p>
                        <p className="text-sm text-gray-500">{stat.engagement} एंगेजमेंट</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Author Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  लेखक प्रदर्शन
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.authorStats.map((author, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{author.name}</p>
                        <p className="text-sm text-gray-500">{author.articles} समाचार</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{author.views.toLocaleString()} व्यूज</p>
                        <p className="text-sm text-gray-500">{author.avgEngagement}/5 एंगेजमेंट</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
