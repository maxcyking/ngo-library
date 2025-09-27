"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Heart, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface StatItem {
  id: string;
  title: string;
  value: string;
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
}

export function QuickStats() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

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
          setStats(data.stats.filter((stat: StatItem) => stat.isActive));
        }
      } else {
        // Fallback to default stats if no data in database
        setStats([
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
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      // Use fallback stats on error
      setStats([
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
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'users': return <Users className="w-8 h-8" />;
      case 'books': return <BookOpen className="w-8 h-8" />;
      case 'heart': return <Heart className="w-8 h-8" />;
      case 'calendar': return <Calendar className="w-8 h-8" />;
      case 'trending': return <TrendingUp className="w-8 h-8" />;
      default: return <BarChart3 className="w-8 h-8" />;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'red': return 'text-red-600';
      case 'purple': return 'text-purple-600';
      case 'orange': return 'text-orange-600';
      case 'pink': return 'text-pink-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">आंकड़े लोड हो रहे हैं...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            हमारी उपलब्धियां
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            आंकड़ों में देखें कि हमने समाज सेवा के क्षेत्र में कैसे योगदान दिया है
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card
              key={stat.id}
              className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-md"
            >
              <CardContent className="p-8">
                <div className={`${getColorClass(stat.color)} mb-4 flex justify-center`}>
                  {getIconComponent(stat.icon)}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.title}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}