"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  registeredCount: number;
  maxParticipants: number;
  isUrgent?: boolean;
}

const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "मासिक स्वास्थ्य जांच शिविर",
    date: "2024-06-15",
    time: "सुबह 9:00 से दोपहर 2:00",
    location: "संस्था परिसर, गुडामलानी",
    category: "स्वास्थ्य सेवा",
    description: "निःशुल्क स्वास्थ्य जांच, रक्तचाप, मधुमेह और सामान्य चिकित्सा परामर्श",
    registeredCount: 45,
    maxParticipants: 100,
    isUrgent: false
  },
  {
    id: "2",
    title: "रक्तदान महादान शिविर",
    date: "2024-06-20",
    time: "सुबह 8:00 से दोपहर 1:00",
    location: "सामुदायिक भवन, गुडामलानी",
    category: "रक्तदान",
    description: "जीवन बचाने के लिए रक्तदान करें। सभी रक्तदाताओं का स्वागत है।",
    registeredCount: 28,
    maxParticipants: 50,
    isUrgent: true
  },
  {
    id: "3",
    title: "पुस्तकालय भवन उद्घाटन समारोह",
    date: "2024-07-01",
    time: "सुबह 11:00 से दोपहर 1:00",
    location: "नया पुस्तकालय भवन, गुडामलानी",
    category: "उद्घाटन समारोह",
    description: "35 लाख रुपए की लागत से निर्मित नए पुस्तकालय भवन का भव्य उद्घाटन",
    registeredCount: 85,
    maxParticipants: 200,
    isUrgent: false
  }
];

export function UpcomingEvents() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysUntilEvent = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            📅 आगामी कार्यक्रम
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            हमारे आने वाले कार्यक्रमों में भाग लें और समाज सेवा में योगदान दें
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {upcomingEvents.map((event, index) => {
            const daysUntil = getDaysUntilEvent(event.date);
            const progressPercentage = (event.registeredCount / event.maxParticipants) * 100;
            
            return (
              <Card 
                key={event.id} 
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  event.isUrgent ? 'ring-2 ring-red-400 ring-opacity-50' : ''
                } ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      variant={event.category === "रक्तदान" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {event.category}
                    </Badge>
                    {event.isUrgent && (
                      <Badge variant="destructive" className="text-xs animate-pulse">
                        तत्काल आवश्यकता
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{formatDate(event.date)}</span>
                      {daysUntil <= 7 && (
                        <Badge variant="warning" className="ml-2 text-xs">
                          {daysUntil === 0 ? 'आज' : `${daysUntil} दिन बाकी`}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-green-500" />
                      <span>{event.time}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-purple-500" />
                      <span>{event.registeredCount}/{event.maxParticipants} पंजीकृत</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>पंजीकरण प्रगति</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progressPercentage > 80 ? 'bg-red-500' : 
                          progressPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${
                      event.isUrgent 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {progressPercentage >= 100 ? 'प्रतीक्षा सूची में जोड़ें' : 'पंजीकरण करें'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Registration CTA */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🚀 त्वरित पंजीकरण
            </h3>
            <p className="text-gray-600 mb-6">
              किसी भी कार्यक्रम में भाग लेने के लिए पहले पंजीकरण कराना आवश्यक है
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  सभी कार्यक्रम देखें
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
                  सदस्यता के लिए पंजीकरण
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact for Events */}
        <div className="mt-8 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-0">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                📞 कार्यक्रम संबंधी जानकारी
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>श्री आत्माराम बोरा (अध्यक्ष)</strong><br />
                  📞 +91 96600 89144
                </div>
                <div>
                  <strong>श्री बाबूराम शर्मा (उपाध्यक्ष)</strong><br />
                  📞 +91 99288 00933
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                कार्यक्रम से संबंधित किसी भी जानकारी के लिए संपर्क करें
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}