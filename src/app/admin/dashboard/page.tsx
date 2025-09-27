"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  BookOpen, 
  Heart, 
  Calendar, 
  FileText, 
  BarChart3,
  Plus,
  Settings,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { title: 'कुल छात्र', value: '150+', icon: Users, color: 'bg-blue-500' },
    { title: 'पुस्तकें', value: '2000+', icon: BookOpen, color: 'bg-green-500' },
    { title: 'रक्तदाता', value: '75+', icon: Heart, color: 'bg-red-500' },
    { title: 'हीरो इमेज', value: '8', icon: ImageIcon, color: 'bg-purple-500' },
  ];

  const quickActions = [
    { title: 'छात्र जोड़ें', href: '/admin/members/add', icon: Users },
    { title: 'पुस्तक जोड़ें', href: '/admin/books/add', icon: BookOpen },
    { title: 'UI प्रबंधन', href: '/admin/ui', icon: Palette },
    { title: 'कार्यक्रम जोड़ें', href: '/admin/events/add', icon: Calendar },
  ];

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              एडमिन डैशबोर्ड
            </h1>
            <p className="text-gray-600">
              स्वागत है, {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`${stat.color} p-3 rounded-full text-white mr-4`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  त्वरित कार्य
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Button 
                        variant="outline" 
                        className="w-full h-20 flex flex-col items-center justify-center hover:bg-blue-50"
                      >
                        <action.icon className="w-6 h-6 mb-2" />
                        <span className="text-sm">{action.title}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Management Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  प्रबंधन
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/admin/members">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-3" />
                      छात्र प्रबंधन
                    </Button>
                  </Link>
                  <Link href="/admin/ui">
                    <Button variant="ghost" className="w-full justify-start">
                      <Palette className="w-4 h-4 mr-3" />
                      UI प्रबंधन
                    </Button>
                  </Link>
                  <Link href="/admin/books">
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="w-4 h-4 mr-3" />
                      पुस्तक प्रबंधन
                    </Button>
                  </Link>
                  <Link href="/admin/donations">
                    <Button variant="ghost" className="w-full justify-start">
                      <Heart className="w-4 h-4 mr-3" />
                      दान प्रबंधन
                    </Button>
                  </Link>
                  <Link href="/admin/events">
                    <Button variant="ghost" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-3" />
                      कार्यक्रम प्रबंधन
                    </Button>
                  </Link>
                  <Link href="/admin/news">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-3" />
                      समाचार प्रबंधन
                    </Button>
                  </Link>
                  <Link href="/admin/analytics">
                    <Button variant="ghost" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-3" />
                      रिपोर्ट्स
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>हाल की गतिविधि</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">नया छात्र जोड़ा गया</p>
                    <p className="text-xs text-gray-500">2 घंटे पहले</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">हीरो इमेज अपडेट की गई</p>
                    <p className="text-xs text-gray-500">3 घंटे पहले</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">पुस्तक अपडेट की गई</p>
                    <p className="text-xs text-gray-500">5 घंटे पहले</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">नया कार्यक्रम जोड़ा गया</p>
                    <p className="text-xs text-gray-500">1 दिन पहले</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}