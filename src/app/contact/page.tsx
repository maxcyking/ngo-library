"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Facebook, Globe } from "lucide-react";
import { CONTACT_INFO, BANK_DETAILS } from "@/lib/constants";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("आपका संदेश भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
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
                          {CONTACT_INFO.address}
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
                          {CONTACT_INFO.phone}
                        </p>
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
                          {CONTACT_INFO.email}
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
                          <p><strong>सोमवार - शनिवार:</strong> सुबह 9:00 से शाम 6:00 तक</p>
                          <p><strong>रविवार:</strong> सुबह 10:00 से शाम 4:00 तक</p>
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
                      <div className="flex items-center space-x-3">
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-600">{CONTACT_INFO.facebook}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-green-600" />
                        <span className="text-gray-600">{CONTACT_INFO.website}</span>
                      </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">
                    🏦 बचत खाता
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-gray-600">
                    <div>
                      <strong>बैंक का नाम:</strong><br />
                      {BANK_DETAILS.primary.bankName}
                    </div>
                    <div>
                      <strong>खाता धारक:</strong><br />
                      {BANK_DETAILS.primary.accountName}
                    </div>
                    <div>
                      <strong>खाता संख्या:</strong><br />
                      <span className="font-mono text-lg">{BANK_DETAILS.primary.savingAccount}</span>
                    </div>
                    <div>
                      <strong>IFSC कोड:</strong><br />
                      <span className="font-mono text-lg">{BANK_DETAILS.primary.ifscCode}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">
                    🏢 चालू खाता
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-gray-600">
                    <div>
                      <strong>बैंक का नाम:</strong><br />
                      {BANK_DETAILS.primary.bankName}
                    </div>
                    <div>
                      <strong>खाता धारक:</strong><br />
                      {BANK_DETAILS.primary.accountName}
                    </div>
                    <div>
                      <strong>खाता संख्या:</strong><br />
                      <span className="font-mono text-lg">{BANK_DETAILS.primary.currentAccount}</span>
                    </div>
                    <div>
                      <strong>IFSC कोड:</strong><br />
                      <span className="font-mono text-lg">{BANK_DETAILS.primary.ifscCode}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

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
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Google Map</p>
                  <p className="text-sm">
                    गुडामलानी, बाड़मेर, राजस्थान - 344031
                  </p>
                  <p className="text-xs mt-2">
                    * वास्तविक मैप integration बाद में जोड़ा जाएगा
                  </p>
                </div>
              </div>
            </Card>

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                हमारे कार्यालय पहुंचने के लिए दिशा-निर्देश चाहिए?
              </p>
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Google Maps में देखें
              </Button>
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
                href={`tel:${CONTACT_INFO.phone}`}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
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