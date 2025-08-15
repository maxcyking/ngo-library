"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Search, Phone, User, Droplets } from "lucide-react";

// Sample donation data - यह बाद में database से आएगा
const bloodDonors = [
  {
    id: "1",
    name: "राजेश कुमार शर्मा",
    bloodGroup: "O+",
    phone: "+91 98765 43210",
    location: "गुडामलानी",
    lastDonation: "15 दिसंबर 2023",
    totalDonations: 5
  },
  {
    id: "2",
    name: "सुनीता देवी",
    bloodGroup: "A+",
    phone: "+91 98765 43211",
    location: "बाड़मेर",
    lastDonation: "10 नवंबर 2023",
    totalDonations: 3
  },
  {
    id: "3",
    name: "मोहन लाल जी",
    bloodGroup: "B+",
    phone: "+91 98765 43212",
    location: "गुडामलानी",
    lastDonation: "5 अक्टूबर 2023",
    totalDonations: 8
  },
  {
    id: "4",
    name: "प्रीति शर्मा",
    bloodGroup: "AB+",
    phone: "+91 98765 43213",
    location: "जोधपुर",
    lastDonation: "20 सितंबर 2023",
    totalDonations: 2
  },
  {
    id: "5",
    name: "अमित कुमार",
    bloodGroup: "O-",
    phone: "+91 98765 43214",
    location: "गुडामलानी",
    lastDonation: "1 सितंबर 2023",
    totalDonations: 12
  }
];

const bodyDonors = [
  {
    id: "1",
    name: "श्री रामचंद्र जी",
    age: 65,
    location: "गुडामलानी",
    registrationDate: "जनवरी 2023"
  },
  {
    id: "2",
    name: "श्रीमती सुशीला देवी",
    age: 58,
    location: "बाड़मेर",
    registrationDate: "मार्च 2023"
  }
];

const financialDonors = [
  {
    id: "1",
    name: "श्री आत्माराम बोरा",
    amount: "₹50,000",
    purpose: "पुस्तकालय भवन निर्माण",
    date: "जून 2023",
    image: "/donors/atmaram-bora.jpg"
  },
  {
    id: "2",
    name: "श्रीमती मीना देवी",
    amount: "₹25,000",
    purpose: "शिक्षा सहायता कोष",
    date: "मई 2023",
    image: "/donors/meena-devi.jpg"
  },
  {
    id: "3",
    name: "श्री बाबूराम शर्मा",
    amount: "₹15,000",
    purpose: "स्वास्थ्य शिविर",
    date: "अप्रैल 2023",
    image: "/donors/baburam-sharma.jpg"
  }
];

const bloodGroups = ["सभी", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DonationsPage() {
  const [activeTab, setActiveTab] = useState("blood");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("सभी");

  const filteredBloodDonors = bloodDonors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBloodGroup = selectedBloodGroup === "सभी" || donor.bloodGroup === selectedBloodGroup;
    return matchesSearch && matchesBloodGroup;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ❤️ दान सूची
            </h1>
            <p className="text-xl mb-8">
              रक्तदान, देहदान और आर्थिक सहायता - जीवन दान का महान कार्य
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm">रक्तदाता</div>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <div className="text-2xl font-bold">25+</div>
                <div className="text-sm">देहदाता</div>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm">भामाशाह</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant={activeTab === "blood" ? "default" : "outline"}
                onClick={() => setActiveTab("blood")}
                className="flex items-center"
              >
                <Droplets className="w-4 h-4 mr-2" />
                रक्तदान सूची
              </Button>
              <Button
                variant={activeTab === "body" ? "default" : "outline"}
                onClick={() => setActiveTab("body")}
                className="flex items-center"
              >
                <Heart className="w-4 h-4 mr-2" />
                देहदान सूची
              </Button>
              <Button
                variant={activeTab === "financial" ? "default" : "outline"}
                onClick={() => setActiveTab("financial")}
                className="flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                भामाशाह सूची
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Donation Section */}
      {activeTab === "blood" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  🩸 रक्तदाता सूची
                </h2>
                <p className="text-lg text-gray-600">
                  आपातकाल में रक्त की आवश्यकता हो तो संपर्क करें
                </p>
              </div>

              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="नाम या स्थान से खोजें..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="blood-group-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    ब्लड ग्रुप फिल्टर
                  </label>
                  <select
                    id="blood-group-filter"
                    value={selectedBloodGroup}
                    onChange={(e) => setSelectedBloodGroup(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group === "सभी" ? "सभी ब्लड ग्रुप" : `ब्लड ग्रुप ${group}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Blood Donors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBloodDonors.map((donor) => (
                  <Card key={donor.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {donor.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{donor.location}</p>
                        </div>
                        <Badge variant="destructive" className="text-lg font-bold">
                          {donor.bloodGroup}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {donor.phone}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>अंतिम दान:</strong> {donor.lastDonation}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>कुल दान:</strong> {donor.totalDonations} बार
                        </div>
                        <Button className="w-full mt-4" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          संपर्क करें
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredBloodDonors.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🩸</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    कोई रक्तदाता नहीं मिला
                  </h3>
                  <p className="text-gray-600">
                    कृपया अपनी खोज बदलकर पुनः प्रयास करें
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Body Donation Section */}
      {activeTab === "body" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  🙏 देहदाता सूची
                </h2>
                <p className="text-lg text-gray-600">
                  महान आत्माओं का सम्मान - जिन्होंने देहदान का संकल्प लिया है
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bodyDonors.map((donor) => (
                  <Card key={donor.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl">🙏</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {donor.name}
                        </h3>
                        <p className="text-gray-600 mb-2">आयु: {donor.age} वर्ष</p>
                        <p className="text-gray-600 mb-2">स्थान: {donor.location}</p>
                        <p className="text-sm text-gray-500">
                          पंजीकरण: {donor.registrationDate}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-green-600">
                      देहदान के लिए पंजीकरण
                    </h3>
                    <p className="text-gray-600 mb-4">
                      यदि आप भी देहदान का महान कार्य करना चाहते हैं, तो कृपया हमसे संपर्क करें।
                    </p>
                    <Button>
                      पंजीकरण के लिए संपर्क करें
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Financial Donors Section */}
      {activeTab === "financial" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  🏆 भामाशाह सूची
                </h2>
                <p className="text-lg text-gray-600">
                  आर्थिक सहायता प्रदान करने वाले महान दानवीरों का सम्मान
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {financialDonors.map((donor) => (
                  <Card key={donor.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                          <Image
                            src="/api/placeholder/80/80"
                            alt={donor.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {donor.name}
                        </h3>
                        <Badge variant="success" className="mb-2">
                          {donor.amount}
                        </Badge>
                        <p className="text-sm text-gray-600 mb-2">
                          {donor.purpose}
                        </p>
                        <p className="text-xs text-gray-500">
                          दान दिनांक: {donor.date}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-blue-600">
                      आर्थिक सहायता करें
                    </h3>
                    <p className="text-gray-600 mb-4">
                      आपकी आर्थिक सहायता से हम और भी बेहतर सेवाएं प्रदान कर सकेंगे।
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <strong>बैंक:</strong> Punjab National Bank<br />
                        <strong>खाता नं:</strong> 9657001000035037<br />
                        <strong>IFSC:</strong> PUNB0965700
                      </div>
                      <div>
                        <strong>खाता नाम:</strong><br />
                        एरोग्या पुस्तकालय एवं सेवा संस्था<br />
                        <strong>शाखा:</strong> गुडामलानी
                      </div>
                    </div>
                    <Button>
                      दान करने के लिए संपर्क करें
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              आप भी बनें दानवीर
            </h2>
            <p className="text-xl mb-8">
              रक्तदान, देहदान या आर्थिक सहायता - हर प्रकार का योगदान समाज के लिए अमूल्य है
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                रक्तदाता बनें
              </Button>
              <Button size="lg" variant="secondary">
                देहदान पंजीकरण
              </Button>
              <Button size="lg" variant="secondary">
                आर्थिक सहायता करें
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}