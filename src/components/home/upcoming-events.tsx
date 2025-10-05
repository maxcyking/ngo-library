"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, ArrowRight, CalendarX } from "lucide-react";
import Link from "next/link";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  maxParticipants: number;
  registrationDeadline: string;
  isActive: boolean;
  isFeatured: boolean;
  isUrgent: boolean;
  registrationFee: number;
  contactPerson: string;
  contactPhone: string;
  requirements: string[];
  benefits: string[];
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  registeredCount?: number;
}

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = () => {
      try {
        // Get current date for filtering upcoming events
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const eventsQuery = query(
          collection(db, 'events'),
          where('isActive', '==', true),
          where('date', '>=', today.toISOString().split('T')[0]),
          orderBy('date', 'asc'),
          limit(6)
        );

        const unsubscribe = onSnapshot(
          eventsQuery, 
          async (snapshot) => {
            const eventsData = await Promise.all(
              snapshot.docs.map(async (doc) => {
                const eventData = { id: doc.id, ...doc.data() } as Event;
                
                // Fetch registration count for this event
                try {
                  const registrationsQuery = query(
                    collection(db, 'event-registrations'),
                    where('eventId', '==', doc.id)
                  );
                  const registrationsSnapshot = await getDocs(registrationsQuery);
                  eventData.registeredCount = registrationsSnapshot.size;
                } catch (error) {
                  console.error('Error fetching registration count:', error);
                  eventData.registeredCount = 0;
                }
                
                return eventData;
              })
            );

            setEvents(eventsData);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching events:', error);
            // Set fallback sample data for demo purposes when database is not accessible
            setEvents([
              {
                id: 'sample-1',
                title: 'मासिक स्वास्थ्य जांच शिविर',
                description: 'निःशुल्क स्वास्थ्य जांच, रक्तचाप, मधुमेह और सामान्य चिकित्सा परामर्श',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
                startTime: '09:00',
                endTime: '14:00',
                location: 'संस्था परिसर, गुडामलानी',
                category: 'स्वास्थ्य सेवा',
                maxParticipants: 100,
                registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isActive: true,
                isFeatured: false,
                isUrgent: false,
                registrationFee: 0,
                contactPerson: ' आत्माराम बोरा',
                contactPhone: '+91 9024635808',
                requirements: [],
                benefits: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                registeredCount: 45
              },
              {
                id: 'sample-2',
                title: 'रक्तदान महादान शिविर',
                description: 'जीवन बचाने के लिए रक्तदान करें। सभी रक्तदाताओं का स्वागत है।',
                date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
                startTime: '08:00',
                endTime: '13:00',
                location: 'सामुदायिक भवन, गुडामलानी',
                category: 'रक्तदान',
                maxParticipants: 50,
                registrationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isActive: true,
                isFeatured: true,
                isUrgent: true,
                registrationFee: 0,
                contactPerson: ' बाबूराम शर्मा',
                contactPhone: '+91 99288 00933',
                requirements: [],
                benefits: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                registeredCount: 28
              }
            ]);
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error('Error setting up events listener:', error);
        setLoading(false);
      }
    };

    const unsubscribe = fetchUpcomingEvents();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

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

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'दोपहर' : 'सुबह';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'स्वास्थ्य सेवा':
      case 'health':
        return 'bg-green-100 text-green-800';
      case 'रक्तदान':
      case 'blood donation':
        return 'bg-red-100 text-red-800';
      case 'शिक्षा':
      case 'education':
        return 'bg-blue-100 text-blue-800';
      case 'सामाजिक सेवा':
      case 'social service':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">कार्यक्रम लोड हो रहे हैं...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">कोई आगामी कार्यक्रम नहीं</h3>
            <p className="text-gray-500 mb-6">
              फिलहाल कोई कार्यक्रम निर्धारित नहीं है। नए कार्यक्रमों की जानकारी के लिए जुड़े रहें।
            </p>
            <Link href="/events">
              <Button variant="outline">
                सभी कार्यक्रम देखें
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {events.map((event, index) => {
              const daysUntil = getDaysUntilEvent(event.date);
              const progressPercentage = event.maxParticipants > 0 
                ? ((event.registeredCount || 0) / event.maxParticipants) * 100 
                : 0;
            
            return (
              <Card 
                key={event.id} 
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  event.isUrgent ? 'ring-2 ring-red-400 ring-opacity-50' : ''
                } ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`text-xs ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </Badge>
                    {event.isUrgent && (
                      <Badge variant="destructive" className="text-xs animate-pulse">
                        तत्काल आवश्यकता
                      </Badge>
                    )}
                    {event.isFeatured && (
                      <Badge className="text-xs bg-yellow-100 text-yellow-800">
                        विशेष
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
                      <span>
                        {formatTime(event.startTime)}
                        {event.endTime && ` से ${formatTime(event.endTime)}`}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-purple-500" />
                      <span>
                        {event.registeredCount || 0}/{event.maxParticipants} पंजीकृत
                      </span>
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
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/events/${event.id}`} className="flex-1">
                      <Button 
                        className={`w-full ${
                          event.isUrgent 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {progressPercentage >= 100 ? 'प्रतीक्षा सूची' : 'पंजीकरण करें'}
                      </Button>
                    </Link>
                    <Link href={`/events/${event.id}`}>
                      <Button variant="outline" size="sm">
                        विवरण
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}

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
                  <strong> आत्माराम बोरा (अध्यक्ष)</strong><br />
                  📞 +91 9024635808
                </div>
                <div>
                  <strong> बाबूराम शर्मा (उपाध्यक्ष)</strong><br />
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