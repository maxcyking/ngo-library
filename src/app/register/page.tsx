"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Badge import removed as it's not used
import { UserPlus, BookOpen, Heart, Users } from "lucide-react";

export default function RegisterPage() {
  const [activeForm, setActiveForm] = useState("membership");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipType: "basic",
    bloodGroup: "",
    donationType: "blood",
    amount: "",
    purpose: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("आपका आवेदन सफलतापूर्वक जमा हो गया है। हम जल्द ही आपसे संपर्क करेंगे।");
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      membershipType: "basic",
      bloodGroup: "",
      donationType: "blood",
      amount: "",
      purpose: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              📝 पंजीकरण फॉर्म
            </h1>
            <p className="text-xl mb-8">
              हमारे साथ जुड़ें और समाज सेवा के इस महान कार्य में भागीदार बनें
            </p>
          </div>
        </div>
      </section>

      {/* Registration Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button
                variant={activeForm === "membership" ? "default" : "outline"}
                onClick={() => setActiveForm("membership")}
                className="flex items-center"
              >
                <Users className="w-4 h-4 mr-2" />
                सदस्यता पंजीकरण
              </Button>
              <Button
                variant={activeForm === "library" ? "default" : "outline"}
                onClick={() => setActiveForm("library")}
                className="flex items-center"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                लाइब्रेरी कार्ड
              </Button>
              <Button
                variant={activeForm === "donation" ? "default" : "outline"}
                onClick={() => setActiveForm("donation")}
                className="flex items-center"
              >
                <Heart className="w-4 h-4 mr-2" />
                दान पंजीकरण
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl text-green-600">
                      {activeForm === "membership" && "🤝 सदस्यता पंजीकरण"}
                      {activeForm === "library" && "📚 लाइब्रेरी कार्ड आवेदन"}
                      {activeForm === "donation" && "❤️ दान पंजीकरण"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Common Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            पूरा नाम *
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
                          पूरा पता *
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="आपका पूरा पता"
                          required
                        />
                      </div>

                      {/* Membership Specific Fields */}
                      {activeForm === "membership" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            सदस्यता प्रकार *
                          </label>
                          <select
                            name="membershipType"
                            value={formData.membershipType}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          >
                            <option value="basic">सामान्य सदस्यता (निःशुल्क)</option>
                            <option value="premium">प्रीमियम सदस्यता (₹500/वर्ष)</option>
                            <option value="lifetime">आजीवन सदस्यता (₹5000)</option>
                          </select>
                        </div>
                      )}

                      {/* Library Specific Fields */}
                      {activeForm === "library" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              पहचान पत्र प्रकार *
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            >
                              <option value="">चुनें</option>
                              <option value="aadhar">आधार कार्ड</option>
                              <option value="voter">वोटर आईडी</option>
                              <option value="driving">ड्राइविंग लाइसेंस</option>
                              <option value="passport">पासपोर्ट</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              पहचान पत्र संख्या *
                            </label>
                            <Input
                              type="text"
                              placeholder="पहचान पत्र संख्या"
                              required
                            />
                          </div>
                        </div>
                      )}

                      {/* Donation Specific Fields */}
                      {activeForm === "donation" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              दान प्रकार *
                            </label>
                            <select
                              name="donationType"
                              value={formData.donationType}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            >
                              <option value="blood">रक्तदान</option>
                              <option value="body">देहदान</option>
                              <option value="financial">आर्थिक दान</option>
                            </select>
                          </div>

                          {formData.donationType === "blood" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                रक्त समूह *
                              </label>
                              <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                              >
                                <option value="">चुनें</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                              </select>
                            </div>
                          )}

                          {formData.donationType === "financial" && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  दान राशि *
                                </label>
                                <Input
                                  type="number"
                                  name="amount"
                                  value={formData.amount}
                                  onChange={handleInputChange}
                                  placeholder="राशि (रुपए में)"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  दान का उद्देश्य
                                </label>
                                <select
                                  name="purpose"
                                  value={formData.purpose}
                                  onChange={handleInputChange}
                                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                  <option value="">चुनें</option>
                                  <option value="library">पुस्तकालय विकास</option>
                                  <option value="health">स्वास्थ्य सेवा</option>
                                  <option value="education">शिक्षा सहायता</option>
                                  <option value="general">सामान्य कोष</option>
                                </select>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      <Button type="submit" className="w-full" size="lg">
                        <UserPlus className="w-4 h-4 mr-2" />
                        आवेदन जमा करें
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Information Sidebar */}
              <div className="space-y-6">
                {/* Benefits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-600">
                      🎯 लाभ और सुविधाएं
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeForm === "membership" && (
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• निःशुल्क पुस्तकालय सुविधा</li>
                        <li>• स्वास्थ्य शिविर में प्राथमिकता</li>
                        <li>• सभी कार्यक्रमों की जानकारी</li>
                        <li>• शिक्षा सहायता योजना</li>
                        <li>• सामुदायिक सेवाओं में भागीदारी</li>
                      </ul>
                    )}
                    {activeForm === "library" && (
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• 2000+ पुस्तकों तक पहुंच</li>
                        <li>• एक समय में 2 पुस्तकें</li>
                        <li>• 15 दिन की वापसी अवधि</li>
                        <li>• नई पुस्तकों की जानकारी</li>
                        <li>• डिजिटल कैटलॉग सुविधा</li>
                      </ul>
                    )}
                    {activeForm === "donation" && (
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• जीवन बचाने में योगदान</li>
                        <li>• समाज सेवा का अवसर</li>
                        <li>• नियमित स्वास्थ्य जांच</li>
                        <li>• दान प्रमाणपत्र</li>
                        <li>• कर छूट की सुविधा</li>
                      </ul>
                    )}
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">
                      📋 आवश्यक दस्तावेज
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• पहचान पत्र की फोटोकॉपी</li>
                      <li>• पासपोर्ट साइज फोटो (2)</li>
                      <li>• पता प्रमाण पत्र</li>
                      {activeForm === "donation" && formData.donationType === "blood" && (
                        <li>• स्वास्थ्य प्रमाणपत्र</li>
                      )}
                      {activeForm === "library" && (
                        <li>• शैक्षणिक योग्यता प्रमाण</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-600">
                      📞 सहायता संपर्क
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>फोन:</strong> +91 99518 00733</p>
                      <p><strong>ईमेल:</strong> arogyapustkalaya@gmail.com</p>
                      <p><strong>समय:</strong> सुबह 9:00 से शाम 6:00</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              📝 आवेदन प्रक्रिया
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">फॉर्म भरें</h3>
                <p className="text-sm text-gray-600">ऑनलाइन फॉर्म भरकर जमा करें</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">सत्यापन</h3>
                <p className="text-sm text-gray-600">हमारी टीम आपकी जानकारी सत्यापित करेगी</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">अनुमोदन</h3>
                <p className="text-sm text-gray-600">आवेदन स्वीकृत होने पर सूचना मिलेगी</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">4</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">सदस्यता</h3>
                <p className="text-sm text-gray-600">सदस्यता कार्ड प्राप्त करें</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}