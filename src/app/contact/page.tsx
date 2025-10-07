"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export default function ContactPage() {
  const { settings, loading } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("कृपया सभी आवश्यक फील्ड भरें।");
      return;
    }

    try {
      // Send email notifications
      const emailData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        submittedAt: new Date().toLocaleString('hi-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact-form',
          data: emailData
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert("आपका संदेश सफलतापूर्वक भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        alert("संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      alert("संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              📞 संपर्क करें
            </h1>
            <p className="text-xl mb-8">
              हमसे जुड़ें और समाज सेवा के इस महान कार्य में भागीदार बनें
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                संपर्क जानकारी
              </h2>
              
              <div className="space-y-6">
                {/* Address */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          पंजीकृत कार्यालय
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {settings.address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Phone */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <Phone className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          फोन नंबर
                        </h3>
                        <p className="text-gray-600">
                          {settings.phone}
                        </p>
                        {settings.whatsapp && settings.whatsapp !== settings.phone && (
                          <p className="text-gray-600 mt-1">
                            WhatsApp: {settings.whatsapp}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          24/7 आपातकालीन सेवा उपलब्ध
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Mail className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          ईमेल पता
                        </h3>
                        <p className="text-gray-600">
                          {settings.email}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          हम 24 घंटे में जवाब देने का प्रयास करते हैं
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timings */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-orange-100 p-3 rounded-full">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          कार्य समय
                        </h3>
                        <div className="text-gray-600 space-y-1">
                          <p><strong>कार्यालय समय:</strong> {settings.officeHours}</p>
                          <p><strong>पुस्तकालय समय:</strong> {settings.libraryHours}</p>
                          <p className="text-sm text-red-600 mt-2">
                            * सरकारी छुट्टियों में बंद
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      सोशल मीडिया
                    </h3>
                    <div className="space-y-3">
                      {settings.facebook && (
                        <div className="flex items-center space-x-3">
                          <span className="w-5 h-5 text-blue-600">📘</span>
                          <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                            Facebook
                          </a>
                        </div>
                      )}
                      {settings.instagram && (
                        <div className="flex items-center space-x-3">
                          <span className="w-5 h-5 text-pink-600">📷</span>
                          <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600">
                            Instagram
                          </a>
                        </div>
                      )}
                      {settings.youtube && (
                        <div className="flex items-center space-x-3">
                          <span className="w-5 h-5 text-red-600">📺</span>
                          <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600">
                            YouTube
                          </a>
                        </div>
                      )}
                      {settings.twitter && (
                        <div className="flex items-center space-x-3">
                          <span className="w-5 h-5 text-blue-400">🐦</span>
                          <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400">
                            Twitter
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                संदेश भेजें
              </h2>
              
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          नाम *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="आपका पूरा नाम"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          फोन नंबर *
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ईमेल पता
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        विषय *
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="संदेश का विषय"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        संदेश *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="यहाँ अपना संदेश लिखें..."
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      संदेश भेजें
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              बैंक विवरण
            </h2>
            
            {(settings.bankName || settings.accountNumber || settings.ifscCode || settings.upiId) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {settings.bankName && settings.accountNumber && (
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl text-green-600">
                        🏦 बैंक विवरण
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-gray-600">
                        <div>
                          <strong>बैंक का नाम:</strong><br />
                          {settings.bankName}
                        </div>
                        <div>
                          <strong>खाता संख्या:</strong><br />
                          <span className="font-mono text-lg">{settings.accountNumber}</span>
                        </div>
                        {settings.ifscCode && (
                          <div>
                            <strong>IFSC कोड:</strong><br />
                            <span className="font-mono text-lg">{settings.ifscCode}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {settings.upiId && (
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl text-blue-600">
                        📱 UPI विवरण
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-gray-600">
                        <div>
                          <strong>UPI ID:</strong><br />
                          <span className="font-mono text-lg">{settings.upiId}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          UPI के माध्यम से तुरंत दान करें
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                आर्थिक सहायता के लिए ऊपर दिए गए बैंक खातों में दान कर सकते हैं
              </p>
              <p className="text-sm text-gray-500">
                दान की रसीद के लिए कृपया हमसे संपर्क करें
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              हमारा स्थान
            </h2>
            
            <Card className="overflow-hidden">
              {settings.mapIframe ? (
                <div 
                  className="h-96 w-full"
                  dangerouslySetInnerHTML={{ __html: settings.mapIframe }}
                />
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg font-semibold">Google Map</p>
                    <p className="text-sm">
                      {settings.address}
                    </p>
                    <p className="text-xs mt-2">
                      * मैप जल्द ही उपलब्ध होगा
                    </p>
                  </div>
                </div>
              )}
            </Card>

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                हमारे कार्यालय पहुंचने के लिए दिशा-निर्देश चाहिए?
              </p>
              {settings.mapLink && (
                <a href={settings.mapLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Google Maps में देखें
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              🚨 आपातकालीन संपर्क
            </h2>
            <p className="text-xl mb-8">
              रक्त की तत्काल आवश्यकता या किसी आपातकाल में तुरंत संपर्क करें
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${settings.emergencyPhone || settings.phone}`}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                {settings.emergencyPhone || settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors duration-300 flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                ईमेल भेजें
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}