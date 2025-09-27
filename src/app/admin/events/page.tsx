"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Eye,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  where 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Event, EventRegistration } from '@/lib/types';

export default function AdminEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const { user } = useAuth();

  const eventCategories = [
    'all', 'health_camp', 'blood_donation', 'workshop', 
    'seminar', 'cultural', 'inauguration', 'other'
  ];

  const categoryLabels = {
    'all': 'सभी',
    'health_camp': 'स्वास्थ्य शिविर',
    'blood_donation': 'रक्तदान शिविर',
    'workshop': 'कार्यशाला',
    'seminar': 'सेमिनार',
    'cultural': 'सांस्कृतिक',
    'inauguration': 'उद्घाटन',
    'other': 'अन्य'
  };

  const statusLabels = {
    'all': 'सभी',
    'draft': 'प्रारूप',
    'published': 'प्रकाशित',
    'ongoing': 'चल रहा',
    'completed': 'पूर्ण',
    'cancelled': 'रद्द'
  };

  // Fetch events from Firebase
  const fetchEvents = async () => {
    try {
      const q = query(collection(db, 'events'), orderBy('eventDate', 'desc'));
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

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const q = query(collection(db, 'eventRegistrations'), orderBy('registrationDate', 'desc'));
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

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || event.eventType === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Auto-update event status based on current date
  const updateEventStatus = async (event: Event) => {
    const now = new Date();
    let newStatus = event.status;
    
    if (event.eventDate > now && event.status === 'published') {
      // Event is upcoming
      newStatus = 'published';
    } else if (event.eventDate <= now && event.endDate && event.endDate > now && event.status === 'published') {
      // Event is ongoing
      newStatus = 'ongoing';
    } else if ((event.endDate && event.endDate <= now) || (event.eventDate <= now && !event.endDate)) {
      // Event is completed
      newStatus = 'completed';
    }
    
    if (newStatus !== event.status) {
      try {
        await updateDoc(doc(db, 'events', event.id), {
          status: newStatus,
          updatedAt: serverTimestamp(),
          updatedBy: user?.email || 'system'
        });
        await fetchEvents();
      } catch (error) {
        console.error('Error updating event status:', error);
      }
    }
  };

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

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('क्या आप वाकई इस कार्यक्रम को हटाना चाहते हैं?')) {
      try {
        await deleteDoc(doc(db, 'events', eventId));
        await fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const getRegistrationCount = (eventId: string) => {
    return registrations.filter(reg => reg.eventId === eventId && reg.status !== 'cancelled').length;
  };

  // Statistics
  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.eventDate) > new Date() && e.status === 'published').length,
    ongoingEvents: events.filter(e => e.status === 'ongoing').length,
    completedEvents: events.filter(e => e.status === 'completed').length,
    totalRegistrations: registrations.filter(r => r.status !== 'cancelled').length
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">कार्यक्रम लोड हो रहे हैं...</p>
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
                <Link href="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Calendar className="w-6 h-6 mr-2" />
                    कार्यक्रम प्रबंधन
                  </h1>
                  <p className="text-gray-600">
                    कुल कार्यक्रम: {stats.totalEvents} | आगामी: {stats.upcomingEvents} | पंजीकरण: {stats.totalRegistrations}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link href="/admin/events/registrations">
                  <Button variant="outline" className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    पंजीकरण देखें
                  </Button>
                </Link>
                <Link href="/admin/events/add">
                  <Button className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    नया कार्यक्रम जोड़ें
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">कुल कार्यक्रम</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">आगामी</p>
                    <p className="text-xl font-bold text-green-600">{stats.upcomingEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Settings className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">चल रहे</p>
                    <p className="text-xl font-bold text-yellow-600">{stats.ongoingEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">पूर्ण</p>
                    <p className="text-xl font-bold text-purple-600">{stats.completedEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">पंजीकरण</p>
                    <p className="text-xl font-bold text-indigo-600">{stats.totalRegistrations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="कार्यक्रम का नाम, विवरण या स्थान से खोजें..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="कार्यक्रम स्थिति फिल्टर"
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="कार्यक्रम श्रेणी फिल्टर"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <div className="space-y-6">
            {filteredEvents.map((event) => {
              const registrationCount = getRegistrationCount(event.id);
              const isUpcoming = new Date(event.eventDate) > new Date();
              const isExpired = new Date(event.eventDate) < new Date() && (!event.endDate || new Date(event.endDate) < new Date());
              
              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          {/* Event Image */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-8 h-8 text-blue-600" />
                            </div>
                          </div>
                          
                          {/* Event Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900 truncate">
                                {event.title}
                              </h3>
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
                            
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {event.description}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {event.eventDate.toLocaleDateString('hi-IN')}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {event.eventTime}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {event.location}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="flex items-center text-gray-500">
                                  <Users className="w-4 h-4 mr-1" />
                                  {registrationCount}/{event.maxParticipants || '∞'} पंजीकृत
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {categoryLabels[event.eventType]}
                                </Badge>
                              </div>
                              
                              {event.maxParticipants && (
                                <div className="w-32">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ 
                                        width: `${Math.min((registrationCount / event.maxParticipants) * 100, 100)}%` 
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <Link href={`/admin/events/${event.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              विवरण
                            </Button>
                          </Link>
                          <Link href={`/admin/events/${event.id}/edit`}>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-1" />
                              संपादित
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            हटाएं
                          </Button>
                        </div>
                        
                        <Link href={`/admin/events/${event.id}/registrations`}>
                          <Button size="sm" variant="ghost" className="w-full">
                            <Users className="w-4 h-4 mr-1" />
                            पंजीकरण देखें ({registrationCount})
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  कोई कार्यक्रम नहीं मिला
                </h3>
                <p className="text-gray-600 mb-4">
                  आपकी खोज के अनुसार कोई कार्यक्रम नहीं मिला।
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}>
                  सभी कार्यक्रम दिखाएं
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
