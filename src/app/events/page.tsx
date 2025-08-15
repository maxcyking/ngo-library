"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Phone } from "lucide-react";

// Sample events data - यह बाद में database से आएगा
const upcomingEvents = [
  {
    id: "1",
    title: "मासिक स्वास्थ्य जांच शिविर",
    date: "2024-06-15",
    time: "सुबह 9:00 से दोपहर 2:00 तक",
    location: "संस्था परिसर, गुडामलानी",
    description: "निःशुल्क स्वास्थ्य जांच, रक्तचाप, मधुमेह और सामान्य चिकित्सा परामर्श",
    maxParticipants: 100,
    registeredParticipants: 45,
    contactPerson: "श्री आत्माराम बोरा",
    contactPhone: "+91 96600 89144",
    image: "/events/health-camp.jpg",
    category: "स्वास्थ्य सेवा",
    isRegistrationOpen: true
  },
  {
    id: "2",
    title: "रक्तदान महादान शिविर",
    date: "2024-06-20",
    time: "सुबह 8:00 से दोपहर 1:00 तक",
    location: "सामुदायिक भवन, गुडामलानी",
    description: "जीवन बचाने के लिए रक्तदान करें। सभी रक्तदाताओं का स्वागत है।",
    maxParticipants: 50,
    registeredParticipants: 28,
    contactPerson: "श्री बाबूराम शर्मा",
    contactPhone: "+91 99288 00933",
    image: "/events/blood-donation.jpg",
    category: "रक्तदान",
    isRegistrationOpen: true
  },
  {
    id: "3",
    title: "महिला सशक्तिकरण कार्यशाला",
    date: "2024-06-25",
    time: "सुबह 10:00 से शाम 4:00 तक",
    location: "संस्था परिसर, गुडामलानी",
    description: "महिलाओं के लिए कौशल विकास, स्वरोजगार और अधिकारों की जानकारी",
    maxParticipants: 30,
    registeredParticipants: 18,
    contactPerson: "श्रीमती मीना देवी",
    contactPhone: "+91 99518 00733",
    image: "/events/women-empowerment.jpg",
    category: "सामाजिक कार्यक्रम",
    isRegistrationOpen: true
  },
  {
    id: "4",
    title: "पुस्तकालय भवन उद्घाटन समारोह",
    date: "2024-07-01",
    time: "सुबह 11:00 से दोपहर 1:00 तक",
    location: "नया पुस्तकालय भवन, गुडामलानी",
    description: "35 लाख रुपए की लागत से निर्मित नए पुस्तकालय भवन का भव्य उद्घाटन",
    maxParticipants: 200,
    registeredParticipants: 85,
    contactPerson: "श्री आत्माराम बोरा",
    contactPhone: "+91 96600 89144",
    image: "/events/library-inauguration.jpg",
    category: "उद्घाटन समारोह",
    isRegistrationOpen: true
  }
];

const pastEvents = [
  {
    id: "5",
    title: "मान मिलाप समारोह 2022",
    date: "2022-08-15",
    location: "संस्था परिसर, गुडामलानी",
    description: "द्वितीय वार्षिकोत्सव पर सामाजिक कार्यकर्ताओं का सम्मान समारोह",
    participants: 150,
    image: "/events/maan-milap-2022.jpg",
    category: "वार्षिकोत्सव",
    highlights: [
      "50+ सामाजिक कार्यकर्ताओं का सम्मान",
      "सांस्कृतिक कार्यक्रम का आयोजन",
      "भामाशाहों को प्रशंसा पत्र वितरण"
    ]
  },
  {
    id: "6",
    title: "रक्तदान शिविर जुलाई 2022",
    date: "2022-07-20",
    location: "सामुदायिक भवन, गुडामलानी",
    description: "50+ रक्तदाताओं ने रक्तदान कर जीवन दान का पुण्य कार्य किया",
    participants: 52,
    image: "/events/blood-camp-july-2022.jpg",
    category: "रक्तदान",
    highlights: [
      "52 यूनिट रक्त संग्रह",
      "नए रक्तदाताओं का पंजीकरण",
      "स्वास्थ्य जांच सुविधा"
    ]
  }
];

const categories = ["सभी", "स्वास्थ्य सेवा", "रक्तदान", "सामाजिक कार्यक्रम", "शिक्षा", "उद्घाटन समारोह"];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedCategory, setSelectedCategory] = useState("सभी");

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

      {/* Upcoming Events */}
      {activeTab === "upcoming" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                🎯 आगामी कार्यक्रम
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredUpcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 bg-gray-200">
                      <img
                        src="/api/placeholder/400/200"
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {event.category}
                        </Badge>
                        <Badge 
                          variant={event.isRegistrationOpen ? "success" : "destructive"}
                          className="text-xs"
                        >
                          {event.isRegistrationOpen ? "पंजीकरण खुला" : "पंजीकरण बंद"}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-gray-600 text-sm">
                          {event.description}
                        </p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(event.date).toLocaleDateString('hi-IN')} | {event.time}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {event.registeredParticipants}/{event.maxParticipants} पंजीकृत
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {event.contactPerson} - {event.contactPhone}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(event.registeredParticipants / event.maxParticipants) * 100}%` 
                            }}
                          ></div>
                        </div>

                        <Button 
                          className="w-full mt-4" 
                          disabled={!event.isRegistrationOpen}
                        >
                          {event.isRegistrationOpen ? "पंजीकरण करें" : "पंजीकरण बंद"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
      {activeTab === "past" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                📚 पिछले कार्यक्रम
              </h2>

              <div className="space-y-8">
                {filteredPastEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <img
                          src="/api/placeholder/400/300"
                          alt={event.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-2 p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {event.category}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(event.date).toLocaleDateString('hi-IN')}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {event.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {event.participants} प्रतिभागी
                          </div>
                        </div>

                        {event.highlights && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">मुख्य विशेषताएं:</h4>
                            <ul className="space-y-1">
                              {event.highlights.map((highlight, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start">
                                  <span className="text-green-500 mr-2">✓</span>
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
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