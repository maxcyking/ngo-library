"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Search, 
  Users,
  Calendar,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { 
  collection, 
  getDocs, 
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Event, EventRegistration } from '@/lib/types';

export default function EventRegistrationsPage() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  
  const { user } = useAuth();

  const statusLabels = {
    'all': 'सभी',
    'registered': 'पंजीकृत',
    'confirmed': 'पुष्ट',
    'attended': 'उपस्थित',
    'cancelled': 'रद्द',
    'no_show': 'गैर-हाजिर'
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch events
      const eventsQuery = query(collection(db, 'events'), orderBy('eventDate', 'desc'));
      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsData: Event[] = [];
      eventsSnapshot.forEach((doc) => {
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

      // Fetch registrations
      const registrationsQuery = query(collection(db, 'eventRegistrations'), orderBy('registrationDate', 'desc'));
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
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter registrations
  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.participantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.participantPhone.includes(searchQuery) ||
      registration.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
    const matchesEvent = eventFilter === 'all' || registration.eventId === eventFilter;
    
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'attended':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'registered':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'attended':
        return <UserCheck className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'no_show':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const updateRegistrationStatus = async (registrationId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'eventRegistrations', registrationId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      await fetchData();
    } catch (error) {
      console.error('Error updating registration status:', error);
    }
  };

  // Statistics
  const stats = {
    totalRegistrations: registrations.length,
    pendingRegistrations: registrations.filter(r => r.status === 'registered').length,
    confirmedRegistrations: registrations.filter(r => r.status === 'confirmed').length,
    attendedRegistrations: registrations.filter(r => r.status === 'attended').length,
    cancelledRegistrations: registrations.filter(r => r.status === 'cancelled').length
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly={true}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">पंजीकरण लोड हो रहे हैं...</p>
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
                <Link href="/admin/events">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    वापस
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Users className="w-6 h-6 mr-2" />
                    कार्यक्रम पंजीकरण
                  </h1>
                  <p className="text-gray-600">
                    कुल पंजीकरण: {stats.totalRegistrations} | पुष्ट: {stats.confirmedRegistrations}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  डाउनलोड (CSV)
                </Button>
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
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">कुल पंजीकरण</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalRegistrations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">प्रतीक्षारत</p>
                    <p className="text-xl font-bold text-yellow-600">{stats.pendingRegistrations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">पुष्ट</p>
                    <p className="text-xl font-bold text-green-600">{stats.confirmedRegistrations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">उपस्थित</p>
                    <p className="text-xl font-bold text-purple-600">{stats.attendedRegistrations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">रद्द</p>
                    <p className="text-xl font-bold text-red-600">{stats.cancelledRegistrations}</p>
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
                      placeholder="प्रतिभागी का नाम, ईमेल, फोन या कार्यक्रम से खोजें..."
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
                    aria-label="पंजीकरण स्थिति फिल्टर"
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
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="कार्यक्रम फिल्टर"
                  >
                    <option value="all">सभी कार्यक्रम</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registrations List */}
          <div className="space-y-4">
            {filteredRegistrations.map((registration) => (
              <Card key={registration.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {registration.participantName}
                            </h3>
                            <Badge className={getStatusColor(registration.status)}>
                              <span className="flex items-center space-x-1">
                                {getStatusIcon(registration.status)}
                                <span>{statusLabels[registration.status]}</span>
                              </span>
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <h4 className="font-medium text-blue-600 text-sm">
                              📅 {registration.eventTitle}
                            </h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              {registration.participantEmail}
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {registration.participantPhone}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              पंजीकरण: {registration.registrationDate.toLocaleDateString('hi-IN')}
                            </div>
                          </div>
                          
                          {registration.participantAge && (
                            <div className="mt-2 text-sm text-gray-500">
                              <span>आयु: {registration.participantAge} वर्ष</span>
                              {registration.participantGender && (
                                <span className="ml-4">लिंग: {
                                  registration.participantGender === 'male' ? 'पुरुष' : 
                                  registration.participantGender === 'female' ? 'महिला' : 'अन्य'
                                }</span>
                              )}
                            </div>
                          )}
                          
                          {registration.specialRequirements && (
                            <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                              <strong>विशेष आवश्यकताएं:</strong> {registration.specialRequirements}
                            </div>
                          )}
                          
                          {registration.emergencyContact && (
                            <div className="mt-2 text-sm text-gray-500">
                              <strong>आपातकालीन संपर्क:</strong> {registration.emergencyContact} 
                              {registration.emergencyPhone && (
                                <span className="ml-2">({registration.emergencyPhone})</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                      {registration.status === 'registered' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => updateRegistrationStatus(registration.id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            पुष्टि करें
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRegistrationStatus(registration.id, 'cancelled')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            रद्द करें
                          </Button>
                        </div>
                      )}
                      
                      {registration.status === 'confirmed' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => updateRegistrationStatus(registration.id, 'attended')}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            उपस्थित
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRegistrationStatus(registration.id, 'no_show')}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            गैर-हाजिर
                          </Button>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 text-center">
                        स्रोत: {registration.registrationSource === 'website' ? 'वेबसाइट' : 
                               registration.registrationSource === 'phone' ? 'फोन' : 'वॉक-इन'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRegistrations.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  कोई पंजीकरण नहीं मिला
                </h3>
                <p className="text-gray-600 mb-4">
                  आपकी खोज के अनुसार कोई पंजीकरण नहीं मिला।
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setEventFilter('all');
                }}>
                  सभी पंजीकरण दिखाएं
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
