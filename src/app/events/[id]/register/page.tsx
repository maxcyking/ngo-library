"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  UserPlus,
  User,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Clock,
  Users,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { 
  doc, 
  getDoc,
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event, EventRegistration } from '@/lib/types';

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  
  const eventId = params.id as string;
  
  const [formData, setFormData] = useState({
    participantName: '',
    participantEmail: '',
    participantPhone: '',
    participantAge: '',
    participantGender: '',
    emergencyContact: '',
    emergencyPhone: '',
    specialRequirements: ''
  });

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

        // Get current registration count
        const registrationsQuery = query(
          collection(db, 'eventRegistrations'),
          where('eventId', '==', eventId),
          where('status', 'in', ['registered', 'confirmed', 'attended'])
        );
        const registrationsSnapshot = await getDocs(registrationsQuery);
        setRegistrationCount(registrationsSnapshot.size);
        
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isRegistrationOpen = (event: Event) => {
    if (!event.isRegistrationOpen) return false;
    if (event.registrationDeadline && new Date() > event.registrationDeadline) return false;
    if (event.maxParticipants && registrationCount >= event.maxParticipants) return false;
    
    const now = new Date();
    const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.eventDate);
    return eventEnd >= now;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;
    
    if (!isRegistrationOpen(event)) {
      alert('इस कार्यक्रम के लिए पंजीकरण बंद है।');
      return;
    }

    setSubmitting(true);

    try {
      // Create registration record
      const registrationData: Omit<EventRegistration, 'id'> = {
        eventId: event.id,
        eventTitle: event.title,
        participantName: formData.participantName,
        participantEmail: formData.participantEmail,
        participantPhone: formData.participantPhone,
        participantAge: formData.participantAge ? parseInt(formData.participantAge) : undefined,
        participantGender: formData.participantGender as 'male' | 'female' | 'other' || undefined,
        emergencyContact: formData.emergencyContact || undefined,
        emergencyPhone: formData.emergencyPhone || undefined,
        specialRequirements: formData.specialRequirements || undefined,
        registrationDate: new Date(),
        status: 'registered',
        paymentStatus: event.registrationFee && event.registrationFee > 0 ? 'pending' : undefined,
        registrationSource: 'website',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'eventRegistrations'), {
        ...registrationData,
        registrationDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update event's current participants count
      await updateDoc(doc(db, 'events', event.id), {
        currentParticipants: registrationCount + 1,
        updatedAt: serverTimestamp()
      });

      // Redirect to success page
      router.push(`/events/${event.id}/registration-success`);
      
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setSubmitting(false);
    }
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

  if (!isRegistrationOpen(event)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              पंजीकरण बंद है
            </h2>
            <p className="text-gray-600 mb-4">
              इस कार्यक्रम के लिए पंजीकरण अब उपलब्ध नहीं है।
            </p>
            <div className="space-y-2">
              <Link href={`/events/${event.id}`}>
                <Button variant="outline" className="w-full">
                  कार्यक्रम विवरण देखें
                </Button>
              </Link>
              <Link href="/events">
                <Button className="w-full">
                  अन्य कार्यक्रम देखें
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href={`/events/${event.id}`}>
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                वापस
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <UserPlus className="w-6 h-6 mr-2" />
                कार्यक्रम पंजीकरण
              </h1>
              <p className="text-gray-600">
                {event.title} के लिए पंजीकरण
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>पंजीकरण फॉर्म</CardTitle>
                  <p className="text-sm text-gray-600">
                    कृपया सभी आवश्यक जानकारी सही-सही भरें
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      व्यक्तिगत जानकारी
                    </h3>
                    
                    <div>
                      <Label htmlFor="participantName">पूरा नाम *</Label>
                      <Input
                        id="participantName"
                        name="participantName"
                        value={formData.participantName}
                        onChange={handleInputChange}
                        placeholder="आपका पूरा नाम दर्ज करें"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="participantEmail">ईमेल पता *</Label>
                        <Input
                          id="participantEmail"
                          name="participantEmail"
                          type="email"
                          value={formData.participantEmail}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="participantPhone">मोबाइल नंबर *</Label>
                        <Input
                          id="participantPhone"
                          name="participantPhone"
                          type="tel"
                          value={formData.participantPhone}
                          onChange={handleInputChange}
                          placeholder="+91 99999 99999"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="participantAge">आयु</Label>
                        <Input
                          id="participantAge"
                          name="participantAge"
                          type="number"
                          value={formData.participantAge}
                          onChange={handleInputChange}
                          placeholder="25"
                          min="1"
                          max="120"
                        />
                      </div>
                      <div>
                        <Label htmlFor="participantGender">लिंग</Label>
                        <select
                          id="participantGender"
                          name="participantGender"
                          value={formData.participantGender}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-label="लिंग चुनें"
                        >
                          <option value="">चुनें</option>
                          <option value="male">पुरुष</option>
                          <option value="female">महिला</option>
                          <option value="other">अन्य</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      आपातकालीन संपर्क (वैकल्पिक)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergencyContact">आपातकालीन संपर्क व्यक्ति</Label>
                        <Input
                          id="emergencyContact"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                          placeholder="परिवारजन का नाम"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone">आपातकालीन फोन नंबर</Label>
                        <Input
                          id="emergencyPhone"
                          name="emergencyPhone"
                          type="tel"
                          value={formData.emergencyPhone}
                          onChange={handleInputChange}
                          placeholder="+91 99999 99999"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  <div>
                    <Label htmlFor="specialRequirements">विशेष आवश्यकताएं या टिप्पणी</Label>
                    <Textarea
                      id="specialRequirements"
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleInputChange}
                      placeholder="कोई विशेष आवश्यकता या जानकारी जो आप साझा करना चाहते हैं..."
                      rows={3}
                    />
                  </div>

                  {/* Terms and Conditions */}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">नियम और शर्तें:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• कार्यक्रम में समय पर पहुंचना अनिवार्य है</li>
                      <li>• पहचान पत्र साथ लाना आवश्यक है</li>
                      <li>• कार्यक्रम के नियमों का पालन करना होगा</li>
                      <li>• संस्था किसी भी नुकसान के लिए जिम्मेदार नहीं होगी</li>
                      {event.registrationFee && event.registrationFee > 0 && (
                        <li>• पंजीकरण शुल्क वापसी योग्य नहीं है</li>
                      )}
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        पंजीकरण हो रहा है...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        पंजीकरण पूर्ण करें
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Event Summary Sidebar */}
          <div className="space-y-6">
            
            {/* Event Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">कार्यक्रम विवरण</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    {event.isFeatured && <Star className="w-4 h-4 mr-1 text-yellow-500" />}
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.eventDate.toLocaleDateString('hi-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.eventTime}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {registrationCount}/{event.maxParticipants || '∞'} पंजीकृत
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <Badge variant="outline">{event.category}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Registration Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">पंजीकरण स्थिति</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {registrationCount}
                  </div>
                  <p className="text-sm text-gray-600">
                    {event.maxParticipants ? `/${event.maxParticipants}` : ''} पंजीकृत
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

                {event.registrationFee && event.registrationFee > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600">पंजीकरण शुल्क</p>
                    <p className="text-xl font-bold text-yellow-700">₹{event.registrationFee}</p>
                  </div>
                )}

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">पंजीकरण खुला है!</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">संपर्क जानकारी</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm">{event.contactPerson}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{event.contactPhone}</span>
                </div>
                {event.contactEmail && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{event.contactEmail}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
