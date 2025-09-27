"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  Edit,
  Users,
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  User,
  AlertTriangle,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { 
  doc, 
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event, EventRegistration } from '@/lib/types';

export default function AdminEventDetailsPage() {
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

        // Fetch registrations for this event
        const registrationsQuery = query(
          collection(db, 'eventRegistrations'),
          where('eventId', '==', eventId),
          orderBy('registrationDate', 'desc')
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
    if (event.status === 'cancelled') return 'रद्द';
    if (event.status === 'draft') return 'प्रारूप';
    if (event.eventDate > now) return 'आगामी';
    if (event.endDate && event.endDate > now) return 'चल रहा';
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
      case 'प्रारूप':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Statistics for this event
  const stats = {
    totalRegistrations: registrations.length,
    confirmedRegistrations: registrations.filter(r => r.status === 'confirmed').length,
    attendedRegistrations: registrations.filter(r => r.status === 'attended').length,
    cancelledRegistrations: registrations.filter(r => r.status === 'cancelled').length,
    pendingRegistrations: registrations.filter(r => r.status === 'registered').length
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">कार्यक्रम लोड हो रहा है...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute adminOnly={true}>
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
              <Link href="/admin/events">
                <Button>
                  कार्यक्रम सूची पर वापस जाएं
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link href="/admin/events">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {event.title}
                    </h1>
                    <Badge className={getStatusColor(event)}>
                      {getEventStatus(event)}
                    </Badge>
                    {event.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        फीचर्ड
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600">
                    पंजीकरण: {stats.totalRegistrations} | पुष्ट: {stats.confirmedRegistrations}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link href={`/admin/events/${event.id}/registrations`}>
                  <Button variant="outline" className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    पंजीकरण प्रबंधन
                  </Button>
                </Link>
                <Link href={`/admin/events/${event.id}/edit`}>
                  <Button className="flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    संपादित करें
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle>कार्यक्रम विवरण</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {event.description}
                  </p>
                  
                  {event.longDescription && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">विस्तृत विवरण:</h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {event.longDescription}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium">तारीख</p>
                          <p className="text-sm">{event.eventDate.toLocaleDateString('hi-IN')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium">समय</p>
                          <p className="text-sm">{event.eventTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium">स्थान</p>
                          <p className="text-sm">{event.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium">संपर्क</p>
                          <p className="text-sm">{event.contactPerson}</p>
                          <p className="text-xs">{event.contactPhone}</p>
                        </div>
                      </div>
                      
                      {event.contactEmail && (
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-5 h-5 mr-3" />
                          <div>
                            <p className="font-medium">ईमेल</p>
                            <p className="text-sm">{event.contactEmail}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-600">
                        <Users className="w-5 h-5 mr-3" />
                        <div>
                          <p className="font-medium">प्रतिभागी</p>
                          <p className="text-sm">
                            {stats.totalRegistrations}/{event.maxParticipants || '∞'} पंजीकृत
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements and Agenda */}
              {(event.requirements && event.requirements.length > 0) || (event.agenda && event.agenda.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>आवश्यकताएं और एजेंडा</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {event.requirements && event.requirements.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">आवश्यकताएं:</h4>
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
                        <h4 className="font-semibold text-gray-800 mb-3">कार्यक्रम एजेंडा:</h4>
                        <ol className="space-y-2">
                          {event.agenda.map((item, index) => (
                            <li key={index} className="flex items-start text-gray-700">
                              <span className="text-blue-500 mr-2 mt-1 font-medium">{index + 1}.</span>
                              {item}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Recent Registrations */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>हाल के पंजीकरण</CardTitle>
                    <Link href={`/admin/events/${event.id}/registrations`}>
                      <Button size="sm" variant="outline">
                        सभी देखें
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {registrations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p>अभी तक कोई पंजीकरण नहीं हुआ है</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {registrations.slice(0, 5).map((registration) => (
                        <div
                          key={registration.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{registration.participantName}</p>
                              <p className="text-sm text-gray-600">{registration.participantPhone}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={
                              registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              registration.status === 'attended' ? 'bg-purple-100 text-purple-800' :
                              registration.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {registration.status === 'registered' ? 'पंजीकृत' :
                               registration.status === 'confirmed' ? 'पुष्ट' :
                               registration.status === 'attended' ? 'उपस्थित' :
                               registration.status === 'cancelled' ? 'रद्द' : 'गैर-हाजिर'}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {registration.registrationDate.toLocaleDateString('hi-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Event Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>आंकड़े</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats.totalRegistrations}</p>
                      <p className="text-xs text-gray-600">कुल पंजीकरण</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats.confirmedRegistrations}</p>
                      <p className="text-xs text-gray-600">पुष्ट</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{stats.attendedRegistrations}</p>
                      <p className="text-xs text-gray-600">उपस्थित</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{stats.pendingRegistrations}</p>
                      <p className="text-xs text-gray-600">प्रतीक्षारत</p>
                    </div>
                  </div>
                  
                  {event.maxParticipants && (
                    <div className="pt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>भरावट</span>
                        <span>{Math.round((stats.totalRegistrations / event.maxParticipants) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full" 
                          style={{ 
                            width: `${Math.min((stats.totalRegistrations / event.maxParticipants) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>त्वरित कार्य</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href={`/admin/events/${event.id}/edit`}>
                    <Button variant="outline" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      कार्यक्रम संपादित करें
                    </Button>
                  </Link>
                  
                  <Link href={`/admin/events/${event.id}/registrations`}>
                    <Button variant="outline" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      पंजीकरण प्रबंधन
                    </Button>
                  </Link>
                  
                  <Link href={`/events/${event.id}`} target="_blank">
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      उपयोगकर्ता दृश्य देखें
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Event Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>अतिरिक्त जानकारी</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">श्रेणी:</p>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                  
                  {event.targetAudience && (
                    <div>
                      <p className="font-medium text-gray-800">लक्षित दर्शक:</p>
                      <p className="text-gray-600">{event.targetAudience}</p>
                    </div>
                  )}
                  
                  {event.registrationFee && event.registrationFee > 0 && (
                    <div>
                      <p className="font-medium text-gray-800">पंजीकरण शुल्क:</p>
                      <p className="text-gray-600">₹{event.registrationFee}</p>
                    </div>
                  )}
                  
                  {event.registrationDeadline && (
                    <div>
                      <p className="font-medium text-gray-800">पंजीकरण की अंतिम तारीख:</p>
                      <p className="text-gray-600">{event.registrationDeadline.toLocaleDateString('hi-IN')}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium text-gray-800">बनाया गया:</p>
                    <p className="text-gray-600">{event.createdAt.toLocaleDateString('hi-IN')}</p>
                    <p className="text-xs text-gray-500">द्वारा: {event.createdBy}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-800">अंतिम अपडेट:</p>
                    <p className="text-gray-600">{event.updatedAt.toLocaleDateString('hi-IN')}</p>
                    <p className="text-xs text-gray-500">द्वारा: {event.updatedBy}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Organizers and Sponsors */}
              {((event.organizers && event.organizers.length > 0) || (event.sponsors && event.sponsors.length > 0)) && (
                <Card>
                  <CardHeader>
                    <CardTitle>आयोजक और प्रायोजक</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.organizers && event.organizers.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">आयोजक:</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.organizers.map((org, index) => (
                            <Badge key={index} variant="outline">
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
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
