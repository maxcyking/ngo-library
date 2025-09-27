"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Calendar, 
  MapPin,
  Clock,
  Phone,
  Mail,
  Share2,
  ArrowLeft,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { 
  doc, 
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/lib/types';

export default function RegistrationSuccessPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  
  const eventId = params.id as string;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        
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

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `${event?.title} - ${event?.description}`,
        url: window.location.origin + `/events/${eventId}`
      });
    } else {
      // Fallback: Copy to clipboard
      const url = window.location.origin + `/events/${eventId}`;
      navigator.clipboard.writeText(url);
      alert('कार्यक्रम लिंक कॉपी हो गया!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">जानकारी लोड हो रही है...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              कार्यक्रम नहीं मिला
            </h2>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              🎉 पंजीकरण सफल!
            </h1>
            <p className="text-xl mb-8">
              आपका पंजीकरण सफलतापूर्वक पूर्ण हो गया है
            </p>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Success Message */}
            <Card className="mb-8">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    धन्यवाद!
                  </h2>
                  <p className="text-gray-600">
                    आपका पंजीकरण सफलतापूर्वक हो गया है। हमारी टीम जल्द ही आपसे संपर्क करेगी।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-800">कार्यक्रम की तारीख</p>
                    <p className="text-sm text-gray-600">
                      {event.eventDate.toLocaleDateString('hi-IN')}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-800">समय</p>
                    <p className="text-sm text-gray-600">{event.eventTime}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-800">स्थान</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="secondary">{event.category}</Badge>
                  <Badge className="bg-green-100 text-green-800">पंजीकृत</Badge>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {event.description}
                </p>

                {event.requirements && event.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">कृपया इन चीजों को साथ लाना न भूलें:</h4>
                    <ul className="space-y-1">
                      {event.requirements.map((req, index) => (
                        <li key={index} className="flex items-start text-gray-700 text-sm">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>संपर्क जानकारी</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-3" />
                  <div>
                    <p className="font-medium">{event.contactPerson}</p>
                    <p className="text-sm text-gray-600">{event.contactPhone}</p>
                  </div>
                </div>
                
                {event.contactEmail && (
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-4 h-4 mr-3" />
                    <p className="text-sm">{event.contactEmail}</p>
                  </div>
                )}
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 कोई प्रश्न या समस्या के लिए उपरोक्त नंबर पर संपर्क करें
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>आगे क्या करना है?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">पुष्टि प्रतीक्षा</p>
                      <p className="text-sm text-gray-600">हमारी टीम आपके पंजीकरण की पुष्टि करेगी</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">SMS/कॉल प्राप्त करें</p>
                      <p className="text-sm text-gray-600">कार्यक्रम से पहले आपको रिमाइंडर मिलेगा</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">कार्यक्रम में भाग लें</p>
                      <p className="text-sm text-gray-600">समय पर पहुंचें और आवश्यक दस्तावेज़ साथ लाएं</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/events">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  अन्य कार्यक्रम देखें
                </Button>
              </Link>
              
              <Button 
                onClick={shareEvent}
                variant="outline" 
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                मित्रों को साझा करें
              </Button>
              
              <Link href="/">
                <Button className="w-full">
                  होम पेज पर जाएं
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
