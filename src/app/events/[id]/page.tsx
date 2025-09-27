"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin,
  Clock,
  Users,
  Phone,
  Mail,
  Star,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Share2,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { 
  doc, 
  getDoc,
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event, EventRegistration } from '@/lib/types';

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  
  const eventId = params.id as string;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch event details
        const eventDoc = await getDoc(doc(db, 'events', eventId));
        if (eventDoc.exists()) {
          const data = eventDoc.data();
          setEvent({
            id: eventDoc.id,
            ...data,
            eventDate: data.eventDate?.toDate() || new Date(),
            endDate: data.endDate?.toDate() || null,
            registrationDeadline: data.registrationDeadline?.toDate() || null,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } as Event);
        }

        // Fetch registrations count
        const registrationsQuery = query(
          collection(db, 'eventRegistrations'),
          where('eventId', '==', eventId),
          where('status', 'in', ['registered', 'confirmed', 'attended'])
        );
        const registrationsSnapshot = await getDocs(registrationsQuery);
        const registrationsData: EventRegistration[] = [];
        registrationsSnapshot.forEach((doc) => {
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
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

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
    if (event.maxParticipants && registrations.length >= event.maxParticipants) return false;
    return !isEventExpired(event);
  };

  const getDaysRemaining = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.eventDate);
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">कार्यक्रम विवरण लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              कार्यक्रम नहीं मिला
            </h2>
            <p className="text-gray-600 mb-4">
              यह कार्यक्रम उपलब्ध नहीं है या हटा दिया गया है।
            </p>
            <Link href="/events">
              <Button>
                कार्यक्रम सूची पर वापस जाएं
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const registrationCount = registrations.length;
  const daysRemaining = getDaysRemaining(event);
  const registrationOpen = isRegistrationOpen(event);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative">
        {event.featuredImage ? (
          <div className="h-96 bg-cover bg-center relative" style={{ backgroundImage: `url(${event.featuredImage})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        ) : (
          <div className="h-96 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        )}
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Link href="/events">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस
                  </Button>
                </Link>
                <Badge className={getStatusColor(event)}>
                  {getEventStatus(event)}
                </Badge>
                {event.isFeatured && (
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    फीचर्ड
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {event.eventDate.toLocaleDateString('hi-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {event.eventTime}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {event.location}
                </div>
              </div>
              
              {daysRemaining > 0 && !isEventExpired(event) && (
                <div className="mt-4 p-3 bg-blue-600/80 rounded-lg inline-block">
                  <p className="text-sm font-medium">
                    ⏰ {daysRemaining === 1 ? 'कल' : `${daysRemaining} दिन बाकी`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Event Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>कार्यक्रम विवरण</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {event.description}
                    </p>
                    
                    {event.longDescription && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-800 mb-2">विस्तृत जानकारी:</h4>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {event.longDescription}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Requirements and Agenda */}
                {((event.requirements && event.requirements.length > 0) || (event.agenda && event.agenda.length > 0)) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>आवश्यकताएं और कार्यक्रम</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {event.requirements && event.requirements.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                            आवश्यकताएं:
                          </h4>
                          <ul className="space-y-2">
                            {event.requirements.map((req, index) => (
                              <li key={index} className="flex items-start text-gray-700">
                                <span className="text-blue-500 mr-2 mt-1">•</span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {event.agenda && event.agenda.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-green-600" />
                            कार्यक्रम एजेंडा:
                          </h4>
                          <ol className="space-y-2">
                            {event.agenda.map((item, index) => (
                              <li key={index} className="flex items-start text-gray-700">
                                <span className="text-green-500 mr-2 mt-1 font-medium">{index + 1}.</span>
                                {item}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Organizers and Sponsors */}
                {((event.organizers && event.organizers.length > 0) || (event.sponsors && event.sponsors.length > 0)) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>आयोजक और सहयोगी</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {event.organizers && event.organizers.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">आयोजक:</h4>
                          <div className="flex flex-wrap gap-2">
                            {event.organizers.map((org, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-50">
                                {org}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.sponsors && event.sponsors.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">प्रायोजक:</h4>
                          <div className="flex flex-wrap gap-2">
                            {event.sponsors.map((sponsor, index) => (
                              <Badge key={index} variant="outline" className="bg-yellow-50">
                                {sponsor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Registration Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserPlus className="w-5 h-5 mr-2" />
                      पंजीकरण
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {registrationCount}
                      </div>
                      <p className="text-sm text-gray-600">
                        {event.maxParticipants ? `/${event.maxParticipants}` : ''} पंजीकृत प्रतिभागी
                      </p>
                      
                      {event.maxParticipants && (
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                          <div 
                            className="bg-blue-600 h-3 rounded-full" 
                            style={{ 
                              width: `${Math.min((registrationCount / event.maxParticipants) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      )}
                    </div>

                    {registrationOpen ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center text-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">पंजीकरण खुला है!</span>
                          </div>
                        </div>
                        
                        <Link href={`/events/${event.id}/register`}>
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            <UserPlus className="w-4 h-4 mr-2" />
                            अभी पंजीकरण करें
                          </Button>
                        </Link>
                        
                        {event.registrationDeadline && (
                          <p className="text-xs text-gray-500 text-center">
                            पंजीकरण की अंतिम तारीख: {event.registrationDeadline.toLocaleDateString('hi-IN')}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center text-red-700">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">
                              {isEventExpired(event) ? 'कार्यक्रम समाप्त हो गया' : 'पंजीकरण बंद है'}
                            </span>
                          </div>
                        </div>
                        
                        <Button className="w-full" disabled>
                          पंजीकरण उपलब्ध नहीं
                        </Button>
                      </div>
                    )}

                    {event.registrationFee && event.registrationFee > 0 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">पंजीकरण शुल्क</p>
                          <p className="text-lg font-bold text-yellow-700">₹{event.registrationFee}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Event Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>कार्यक्रम जानकारी</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-medium">तारीख और समय</span>
                      </div>
                      <p className="text-sm text-gray-700 ml-6">
                        {event.eventDate.toLocaleDateString('hi-IN', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-gray-700 ml-6">{event.eventTime}</p>
                      {event.endDate && (
                        <p className="text-sm text-gray-500 ml-6">
                          समाप्ति: {event.endDate.toLocaleDateString('hi-IN')} {event.endTime}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="font-medium">स्थान</span>
                      </div>
                      <p className="text-sm text-gray-700 ml-6">{event.location}</p>
                    </div>

                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Phone className="w-4 h-4 mr-2" />
                        <span className="font-medium">संपर्क</span>
                      </div>
                      <p className="text-sm text-gray-700 ml-6">{event.contactPerson}</p>
                      <p className="text-sm text-gray-700 ml-6">{event.contactPhone}</p>
                      {event.contactEmail && (
                        <p className="text-sm text-gray-700 ml-6">{event.contactEmail}</p>
                      )}
                    </div>

                    {event.targetAudience && (
                      <div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="font-medium">लक्षित दर्शक</span>
                        </div>
                        <p className="text-sm text-gray-700 ml-6">{event.targetAudience}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <Badge variant="outline">{event.category}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Share Event */}
                <Card>
                  <CardHeader>
                    <CardTitle>कार्यक्रम साझा करें</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      व्हाट्सऐप पर साझा करें
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Heart className="w-4 h-4 mr-2" />
                      मित्रों को बताएं
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {registrationOpen && (
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                अभी पंजीकरण करें!
              </h2>
              <p className="text-xl mb-8">
                इस महत्वपूर्ण कार्यक्रम में भाग लेने का मौका न चूकें
              </p>
              <Link href={`/events/${event.id}/register`}>
                <Button size="lg" variant="secondary" className="px-8 py-3">
                  <UserPlus className="w-5 h-5 mr-2" />
                  पंजीकरण करें
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
