"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BarChart3,
  Edit,
  Save,
  TrendingUp,
  Users,
  BookOpen,
  Heart,
  Calendar
} from 'lucide-react';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface StatItem {
  id: string;
  title: string;
  value: string;
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
}

const defaultStats: StatItem[] = [
  {
    id: 'members',
    title: 'सक्रिय सदस्य',
    value: '500+',
    icon: 'users',
    color: 'blue',
    description: 'पंजीकृत सदस्यों की संख्या',
    isActive: true
  },
  {
    id: 'books',
    title: 'पुस्तकें उपलब्ध',
    value: '2000+',
    icon: 'books',
    color: 'green',
    description: 'पुस्तकालय में उपलब्ध पुस्तकों की संख्या',
    isActive: true
  },
  {
    id: 'blood_donors',
    title: 'रक्तदाता',
    value: '150+',
    icon: 'heart',
    color: 'red',
    description: 'पंजीकृत रक्तदाताओं की संख्या',
    isActive: true
  },
  {
    id: 'events',
    title: 'कार्यक्रम आयोजित',
    value: '50+',
    icon: 'calendar',
    color: 'purple',
    description: 'अब तक आयोजित कार्यक्रमों की संख्या',
    isActive: true
  },
  {
    id: 'students_helped',
    title: 'छात्रों की सहायता',
    value: '1000+',
    icon: 'trending',
    color: 'orange',
    description: 'शिक्षा सहायता प्राप्त छात्रों की संख्या',
    isActive: true
  },
  {
    id: 'health_camps',
    title: 'स्वास्थ्य शिविर',
    value: '25+',
    icon: 'heart',
    color: 'pink',
    description: 'आयोजित स्वास्थ्य शिविरों की संख्या',
    isActive: true
  }
];

export default function StatsManagementPage() {
  const [stats, setStats] = useState<StatItem[]>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const docRef = doc(db, 'settings', 'quick-stats');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'settings', 'quick-stats');
      await setDoc(docRef, {
        stats: stats,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'admin'
      });

      alert('आंकड़े सफलतापूर्वक सेव हो गए');
      setEditingId(null);
    } catch (error) {
      console.error('Error saving stats:', error);
      alert('आंकड़े सेव करने में त्रुटि हुई');
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (id: string, field: keyof StatItem, value: string | number | boolean) => {
    setStats(prev => prev.map(stat =>
      stat.id === id ? { ...stat, [field]: value } : stat
    ));
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'users': return <Users className="w-6 h-6" />;
      case 'books': return <BookOpen className="w-6 h-6" />;
      case 'heart': return <Heart className="w-6 h-6" />;
      case 'calendar': return <Calendar className="w-6 h-6" />;
      case 'trending': return <TrendingUp className="w-6 h-6" />;
      default: return <BarChart3 className="w-6 h-6" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'green': return 'bg-green-100 text-green-600 border-green-200';
      case 'red': return 'bg-red-100 text-red-600 border-red-200';
      case 'purple': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'orange': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'pink': return 'bg-pink-100 text-pink-600 border-pink-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">लोड हो रहा है...</p>
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
            <div className="flex items-center justify-between py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  आंकड़े प्रबंधन
                </h1>
                <p className="text-gray-600">
                  होम पेज पर दिखाए जाने वाले आंकड़ों का प्रबंधन करें
                </p>
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    सेव हो रहा है...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    सभी बदलाव सेव करें
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Instructions */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">निर्देश:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• आंकड़ों को एडिट करने के लिए कार्ड पर क्लिक करें</li>
                  <li>• संख्याओं में &apos;+&apos; का उपयोग करें (जैसे: 500+, 2000+)</li>
                  <li>• रंग और आइकन बदलने के लिए ड्रॉपडाउन का उपयोग करें</li>
                  <li>• बदलाव सेव करना न भूलें</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <Card
                key={stat.id}
                className={`cursor-pointer transition-all duration-200 ${editingId === stat.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                  } ${!stat.isActive ? 'opacity-50' : ''}`}
                onClick={() => setEditingId(editingId === stat.id ? null : stat.id)}
              >
                <CardContent className="p-6">
                  {editingId === stat.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">एडिट मोड</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(null);
                          }}
                        >
                          रद्द करें
                        </Button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          शीर्षक
                        </label>
                        <Input
                          value={stat.title}
                          onChange={(e) => updateStat(stat.id, 'title', e.target.value)}
                          placeholder="आंकड़े का शीर्षक"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          मान
                        </label>
                        <Input
                          value={stat.value}
                          onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                          placeholder="जैसे: 500+, 2000+"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          विवरण
                        </label>
                        <Input
                          value={stat.description}
                          onChange={(e) => updateStat(stat.id, 'description', e.target.value)}
                          placeholder="आंकड़े का विवरण"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            आइकन
                          </label>
                          <select
                            value={stat.icon}
                            onChange={(e) => updateStat(stat.id, 'icon', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="users">👥 Users</option>
                            <option value="books">📚 Books</option>
                            <option value="heart">❤️ Heart</option>
                            <option value="calendar">📅 Calendar</option>
                            <option value="trending">📈 Trending</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            रंग
                          </label>
                          <select
                            value={stat.color}
                            onChange={(e) => updateStat(stat.id, 'color', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="blue">🔵 नीला</option>
                            <option value="green">🟢 हरा</option>
                            <option value="red">🔴 लाल</option>
                            <option value="purple">🟣 बैंगनी</option>
                            <option value="orange">🟠 नारंगी</option>
                            <option value="pink">🩷 गुलाबी</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`active-${stat.id}`}
                          checked={stat.isActive}
                          onChange={(e) => updateStat(stat.id, 'isActive', e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor={`active-${stat.id}`} className="ml-2 text-sm font-medium text-gray-700">
                          सक्रिय (वेबसाइट पर दिखाएं)
                        </label>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${getColorClasses(stat.color)}`}>
                        {getIconComponent(stat.icon)}
                      </div>
                      <div className="text-3xl font-bold text-gray-800 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-lg font-semibold text-gray-700 mb-2">
                        {stat.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.description}
                      </div>
                      <div className="mt-4 flex items-center justify-center">
                        <Edit className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">एडिट करने के लिए क्लिक करें</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Preview Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>वेबसाइट पर प्रीव्यू</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {stats.filter(stat => stat.isActive).map((stat) => (
                    <div key={stat.id} className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${getColorClasses(stat.color)}`}>
                        {getIconComponent(stat.icon)}
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {stat.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}