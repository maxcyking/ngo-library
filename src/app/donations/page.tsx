"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Search, Phone, User, Droplets } from "lucide-react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  phone: string;
  location: string;
  lastDonation: string;
  totalDonations: number;
  isActive: boolean;
}

interface BodyDonor {
  id: string;
  name: string;
  age: number;
  location: string;
  registrationDate: string;
  isActive: boolean;
}

interface FinancialDonor {
  id: string;
  name: string;
  amount: number;
  purpose: string;
  date: string;
  image?: string;
  isActive: boolean;
}

const bloodGroups = ["सभी", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DonationsPage() {
  const [activeTab, setActiveTab] = useState("blood");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("सभी");
  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>([]);
  const [bodyDonors, setBodyDonors] = useState<BodyDonor[]>([]);
  const [financialDonors, setFinancialDonors] = useState<FinancialDonor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      
      // Fetch active blood donors
      const bloodQuery = query(
        collection(db, "bloodDonors"), 
        where("isActive", "==", true),
        orderBy("name")
      );
      const bloodSnapshot = await getDocs(bloodQuery);
      const bloodData = bloodSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BloodDonor[];
      setBloodDonors(bloodData);

      // Fetch active body donors
      const bodyQuery = query(
        collection(db, "bodyDonors"), 
        where("isActive", "==", true),
        orderBy("name")
      );
      const bodySnapshot = await getDocs(bodyQuery);
      const bodyData = bodySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BodyDonor[];
      setBodyDonors(bodyData);

      // Fetch active financial donors
      const financialQuery = query(
        collection(db, "financialDonors"), 
        where("isActive", "==", true),
        orderBy("date", "desc")
      );
      const financialSnapshot = await getDocs(financialQuery);
      const financialData = financialSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FinancialDonor[];
      setFinancialDonors(financialData);

    } catch (error) {
      console.error("Error fetching donors:", error);
    } finally {
      setLoading(false);
    }
  };

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
              <div className="bg-white bg-opacity-20 p-4 rounded-lg text-black">
                <div className="text-2xl font-bold">{bloodDonors.length}+</div>
                <div className="text-sm">रक्तदाता</div>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg text-black">
                <div className="text-2xl font-bold">{bodyDonors.length}+</div>
                <div className="text-sm">देहदाता</div>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg text-black">
                <div className="text-2xl font-bold">{financialDonors.length}+</div>
                <div className="text-sm">भामाशाह</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Registration Details & Motivational Message */}
      <section className="py-8 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Side - Organization Details */}
              <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-orange-300">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">🏛️</div>
                  <h3 className="text-2xl font-bold text-orange-600 mb-2">एरोज्ञा</h3>
                  <p className="text-xl font-semibold text-gray-700">पुस्तकालय एवं सेवा संस्था</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
                    <p className="text-sm font-semibold text-blue-700 mb-1">एरोज्ञा पुस्तकालय एवं सेवा समिति बाडमेर सोसाइटी रजि. नं.:</p>
                    <p className="text-lg font-black text-blue-900">COOP/2020/BMR/202370</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
                    <p className="text-sm font-semibold text-green-700 mb-1">एरोज्ञा सेवा संस्था सार्वजनिक चैरिटेबल ट्रस्ट रजि. नं.:</p>
                    <p className="text-lg font-black text-green-900">202303092400011</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200">
                    <p className="text-sm font-semibold text-purple-700 mb-1">एरोज्ञा सेवा संस्था फाउंडेशन <br /> सेक्शन 8 रजिस्ट्रेशन- <br /> CIN NO.:</p>
                    <p className="text-lg font-black text-purple-900">U88900RJ2025NPL106455</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Motivational Messages */}
              <div className="bg-gradient-to-br from-red-500 to-orange-600 p-6 rounded-xl shadow-2xl text-white flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">✍️</div>
                  <p className="text-2xl md:text-3xl font-black leading-relaxed italic drop-shadow-lg mb-6">
                    "कलम की ताकत दुनिया की सबसे बड़ी ताकत है!"
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-6 rounded-xl border-2 border-white border-opacity-40">
                  <p className="text-xl md:text-2xl font-bold text-center leading-relaxed drop-shadow-lg text-orange-400">
                    "एक रोटी कम खाओ लेकिन बच्चों को जरूर पढ़ाओ!!"
                  </p>
                </div>
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">डेटा लोड हो रहा है...</p>
          </div>
        </div>
      )}

      {/* Blood Donation Section */}
      {!loading && activeTab === "blood" && (
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
      {!loading && activeTab === "body" && (
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
      {!loading && activeTab === "financial" && (
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
                          {donor.image ? (
                            <Image
                              src={donor.image}
                              alt={donor.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">🏆</span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {donor.name}
                        </h3>
                        <Badge variant="secondary" className="mb-2">
                          ₹{donor.amount.toLocaleString()}
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
                        एरोज्ञा पुस्तकालय एवं सेवा संस्था<br />
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