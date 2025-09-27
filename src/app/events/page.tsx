"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Phone, Star, AlertTriangle, CheckCircle } from "lucide-react";
import Link from 'next/link';
import { 
  collection, 
  getDocs, 
  query,
  orderBy,
  where 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event, EventRegistration } from '@/lib/types';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedCategory, setSelectedCategory] = useState("सभी");
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["सभी", "स्वास्थ्य सेवा", "रक्तदान", "सामाजिक कार्यक्रम", "शिक्षा", "उद्घाटन समारोह", "महिला सशक्तिकरण"];

  // Fetch events from Firebase
  const fetchEvents = async () => {
    try {
      const q = query(
        collection(db, 'events'), 
        where('status', 'in', ['published', 'ongoing', 'completed']),
        orderBy('eventDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const eventsData: Event[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        eventsData.push({ 
          id: doc.id, 
          ...data,
          eventDate: data.eventDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate() || null,
          registrationDeadline: data.registrationDeadline?.toDate() || null,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Event);
      });
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Fetch registrations to get current participant counts
  const fetchRegistrations = async () => {
    try {
      const q = query(
        collection(db, 'eventRegistrations'),
        where('status', 'in', ['registered', 'confirmed', 'attended'])
      );
      const querySnapshot = await getDocs(q);
      const registrationsData: EventRegistration[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        registrationsData.push({ 
          id: doc.id, 
          ...data,
          registrationDate: data.registrationDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as EventRegistration);
      });
      setRegistrations(registrationsData);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchRegistrations()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getRegistrationCount = (eventId: string) => {
    return registrations.filter(reg => reg.eventId === eventId).length;
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const eventStart = new Date(event.eventDate);
    const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
    
    if (event.status === 'cancelled') return 'रद्द';
    if (eventStart > now) return 'आगामी';
    if (eventStart <= now && eventEnd >= now) return 'चल रहा';
    return 'समाप्त';
  };

  const getStatusColor = (event: Event) => {
    const status = getEventStatus(event);
    switch (status) {
      case 'आगामी':
        return 'bg-blue-100 text-blue-800';
      case 'चल रहा':
        return 'bg-green-100 text-green-800';
      case 'समाप्त':
        return 'bg-gray-100 text-gray-800';
      case 'रद्द':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isEventExpired = (event: Event) => {
    const now = new Date();
    const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.eventDate);
    return eventEnd < now;
  };

  const isRegistrationOpen = (event: Event) => {
    if (!event.isRegistrationOpen) return false;
    if (event.registrationDeadline && new Date() > event.registrationDeadline) return false;
    if (event.maxParticipants && getRegistrationCount(event.id) >= event.maxParticipants) return false;
    return !isEventExpired(event);
  };

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter(event => {
    const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.eventDate);
    return eventEnd >= now && event.status !== 'cancelled';
  });

  const pastEvents = events.filter(event => {
    const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.eventDate);
    return eventEnd < now || event.status === 'completed';
  });

  const filteredUpcomingEvents = upcomingEvents.filter(event => 
    selectedCategory === "सभी" || event.category === selectedCategory
  );

  const filteredPastEvents = pastEvents.filter(event => 
    selectedCategory === "सभी" || event.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              📅 कार्यक्रम और इवेंट्स
            </h1>
            <p className="text-xl mb-8">
              हमारे आगामी कार्यक्रमों में भाग लें और समाज सेवा में योगदान दें
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button
                variant={activeTab === "upcoming" ? "default" : "outline"}
                onClick={() => setActiveTab("upcoming")}
                className="flex items-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                आगामी कार्यक्रम
              </Button>
              <Button
                variant={activeTab === "past" ? "default" : "outline"}
                onClick={() => setActiveTab("past")}
                className="flex items-center"
              >
                <Clock className="w-4 h-4 mr-2" />
                पिछले कार्यक्रम
              </Button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">कार्यक्रम लोड हो रहे हैं...</p>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {!loading && activeTab === "upcoming" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                🎯 आगामी कार्यक्रम
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredUpcomingEvents.map((event) => {
                  const registrationCount = getRegistrationCount(event.id);
                  const registrationOpen = isRegistrationOpen(event);
                  
                  return (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 relative">
                        {event.featuredImage ? (
                          <img
                            src={event.featuredImage}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="w-16 h-16 text-blue-400" />
                          </div>
                        )}
                        {event.isFeatured && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-yellow-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              फीचर्ड
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {event.category}
                          </Badge>
                          <div className="flex space-x-2">
                            <Badge className={getStatusColor(event)}>
                              {getEventStatus(event)}
                            </Badge>
                            <Badge 
                              className={registrationOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                              {registrationOpen ? "पंजीकरण खुला" : "पंजीकरण बंद"}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-800">
                          {event.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {event.description}
                          </p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {event.eventDate.toLocaleDateString('hi-IN')} | {event.eventTime}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Users className="w-4 h-4 mr-2" />
                              {registrationCount}/{event.maxParticipants || '∞'} पंजीकृत
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              {event.contactPerson} - {event.contactPhone}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          {event.maxParticipants && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ 
                                  width: `${Math.min((registrationCount / event.maxParticipants) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                          )}

                          <div className="flex space-x-2 pt-2">
                            <Link href={`/events/${event.id}`} className="flex-1">
                              <Button variant="outline" className="w-full">
                                विवरण देखें
                              </Button>
                            </Link>
                            
                            {registrationOpen ? (
                              <Link href={`/events/${event.id}/register`} className="flex-1">
                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                  पंजीकरण करें
                                </Button>
                              </Link>
                            ) : (
                              <Button className="flex-1" disabled>
                                {isEventExpired(event) ? "समाप्त" : "पंजीकरण बंद"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredUpcomingEvents.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    कोई आगामी कार्यक्रम नहीं
                  </h3>
                  <p className="text-gray-600">
                    इस श्रेणी में अभी कोई कार्यक्रम निर्धारित नहीं है
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Past Events */}
      {!loading && activeTab === "past" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                📚 पिछले कार्यक्रम
              </h2>

              <div className="space-y-8">
                {filteredPastEvents.map((event) => {
                  const registrationCount = getRegistrationCount(event.id);
                  
                  return (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                          {event.featuredImage ? (
                            <img
                              src={event.featuredImage}
                              alt={event.title}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-48 md:h-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                              <Calendar className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2 p-6">
                          <div className="flex items-center gap-4 mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {event.category}
                            </Badge>
                            <Badge className={getStatusColor(event)}>
                              {getEventStatus(event)}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {event.eventDate.toLocaleDateString('hi-IN')}
                            </span>
                            {event.isFeatured && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 mr-1" />
                                फीचर्ड
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-3">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {event.description}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="w-4 h-4 mr-2" />
                              {registrationCount} प्रतिभागी
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              {event.eventTime}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              {event.contactPerson}
                            </div>
                          </div>

                          {/* Event Summary */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">कार्यक्रम सारांश:</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">प्रतिभागी:</span>
                                <span className="ml-2 font-medium">{registrationCount}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">स्थिति:</span>
                                <Badge className={`${getStatusColor(event)} ml-2 text-xs`}>
                                  सफलतापूर्वक संपन्न
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-3 mt-4">
                            <Link href={`/events/${event.id}`}>
                              <Button variant="outline" size="sm">
                                पूरा विवरण देखें
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filteredPastEvents.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    कोई पिछला कार्यक्रम नहीं
                  </h3>
                  <p className="text-gray-600">
                    इस श्रेणी में अभी कोई पिछला कार्यक्रम नहीं है
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Event Registration Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              📝 कार्यक्रम पंजीकरण जानकारी
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">
                    📋 पंजीकरण नियम
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• सभी कार्यक्रम निःशुल्क हैं</li>
                    <li>• पंजीकरण अनिवार्य है</li>
                    <li>• पहचान पत्र साथ लाना आवश्यक</li>
                    <li>• समय पर पहुंचना अनिवार्य</li>
                    <li>• रक्तदान के लिए स्वास्थ्य प्रमाणपत्र</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">
                    📞 पंजीकरण संपर्क
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-gray-600">
                    <div>
                      <strong>श्री आत्माराम बोरा (अध्यक्ष)</strong><br />
                      📞 +91 96600 89144
                    </div>
                    <div>
                      <strong>श्री बाबूराम शर्मा (उपाध्यक्ष)</strong><br />
                      📞 +91 99288 00933
                    </div>
                    <div>
                      <strong>ईमेल:</strong><br />
                      ✉️ arogyapustkalaya@gmail.com
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              हमारे कार्यक्रमों में भाग लें
            </h2>
            <p className="text-xl mb-8">
              समाज सेवा के इस महान कार्य में आपका योगदान अमूल्य है
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                आगामी कार्यक्रम देखें
              </Button>
              <Button size="lg" variant="secondary">
                व्हाट्सऐप ग्रुप ज्वाइन करें
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}