"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  X,
  User,
  CreditCard,
  Award
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  fatherName?: string;
  position: string;
  village: string;
  district: string;
  pincode?: string;
  aadharNo: string;
  panNo: string;
  dob: string;
  qualification: string;
  experience: string;
  email: string;
  phone: string;
  image?: string;
  description?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "आत्माराम बोरा",
    fatherName: "सावा राम",
    position: "प्रबंध निदेशक / संस्थापक",
    village: "धंधलावास, गुडामलानी",
    district: "बाड़मेर, राजस्थान",
    aadharNo: "7149 7431 6572",
    panNo: "ARSPR4150P",
    dob: "09/12/1982",
    qualification: "मास्टर ऑफ सोशल वर्क (MSW)",
    experience: "15 वर्ष",
    email: "amararambose9@gmail.com",
    phone: "9660689144",
    image: "/images/team/AMRA RAM.jpg",
    description: "संस्था के संस्थापक और प्रबंध निदेशक। समाज सेवा में 15 वर्षों का अनुभव।"
  },
  {
    id: "2",
    name: "कालू राम",
    fatherName: "निम्बा राम",
    position: "अध्यक्ष / निदेशक",
    village: "मालियों की ढाणी, नगर, गुडामलानी",
    district: "बाड़मेर, राजस्थान",
    pincode: "344031",
    aadharNo: "7591 0265 3730",
    panNo: "EALPK7991B",
    dob: "N/A",
    qualification: "10वीं पास",
    experience: "10 वर्ष",
    email: "krmali1922@gmail.com",
    phone: "9001367753",
    image: "/images/team/Kalu Ram.jpg",
    description: "संस्था के अध्यक्ष और निदेशक। समुदायिक विकास में 10 वर्षों का अनुभव।"
  },
  {
    id: "3",
    name: "बाबू लाल मेघवाल",
    fatherName: "गोरखा राम",
    position: "कोषाध्यक्ष",
    village: "एसडीओ ऑफिस के पीछे, धोरीमाना",
    district: "बाड़मेर, राजस्थान",
    pincode: "344704",
    aadharNo: "8867 0111 5999",
    panNo: "N/A",
    dob: "N/A",
    qualification: "N/A",
    experience: "N/A",
    email: "blnama1983@gmail.com",
    phone: "9928840923",
    image: "/images/team/BABU LAL MEGHWAL.jpg",
    description: "संस्था के कोषाध्यक्ष। वित्तीय प्रबंधन और लेखांकन में विशेषज्ञता।"
  },
  {
    id: "4",
    name: "नरेंद्र कुमार",
    fatherName: "पोकरा राम",
    position: "ट्रस्टी / बोर्ड सदस्य",
    village: "सीलगन, पोस्ट - भीमथल, धोरीमाना",
    district: "बाड़मेर, राजस्थान",
    aadharNo: "3535 1320 5682",
    panNo: "HGAPK0205C",
    dob: "25/07/1992",
    qualification: "8वीं पास",
    experience: "10 वर्ष",
    email: "nkumar71203@gmail.com",
    phone: "7568243494",
    description: "बोर्ड सदस्य और ट्रस्टी। सामुदायिक कार्यों में सक्रिय भागीदारी।"
  },
  {
    id: "5",
    name: "चंद्रशेखर भाटिया",
    fatherName: "जोगाराम",
    position: "ट्रस्टी / बोर्ड सदस्य",
    village: "सानापा मांजी, तहसील - सिंधरी",
    district: "बालोतरा, राजस्थान",
    aadharNo: "6635 3628 9177",
    panNo: "DZAPB2109H",
    dob: "20/05/2000",
    qualification: "B.A",
    experience: "8 वर्ष",
    email: "chandrashekharbhatiasanpa@gmail.com",
    phone: "91166 91911",
    description: "युवा बोर्ड सदस्य। शिक्षा और युवा विकास कार्यक्रमों में विशेषज्ञता।"
  },
  {
    id: "6",
    name: "दीपा राम",
    fatherName: "विंजा राम",
    position: "ट्रस्टी / बोर्ड सदस्य",
    village: "मांगता, तहसील - धोरीमाना",
    district: "बाड़मेर, राजस्थान",
    aadharNo: "8457 8523 1387",
    panNo: "DIOPR8585Q",
    dob: "15/03/1977",
    qualification: "10वीं पास",
    experience: "10 वर्ष",
    email: "meghwaldeeparam85@gmail.com",
    phone: "9772329565",
    description: "अनुभवी बोर्ड सदस्य। ग्रामीण विकास और सामाजिक कार्यों में योगदान।"
  },
  {
    id: "7",
    name: "परागा राम मेघवाल",
    fatherName: "देराज राम मेघवाल",
    position: "बोर्ड सदस्य",
    village: "नया कुंवा, मांगले की बेरी, आदेल",
    district: "बाड़मेर, राजस्थान",
    aadharNo: "7374 7867 9778",
    panNo: "DXPPM7018R",
    dob: "15/10/1997",
    qualification: "MA पब्लिक एडमिनिस्ट्रेशन",
    experience: "N/A",
    email: "paragaramgadhveer2014@gmail.com",
    phone: "9024510143",
    description: "शिक्षित युवा बोर्ड सदस्य। प्रशासनिक कार्यों में दक्षता।"
  },
  {
    id: "8",
    name: "जगदीश चंद",
    fatherName: "तुलसाराम",
    position: "बोर्ड सदस्य",
    village: "मांगता, तहसील - धोरीमाना",
    district: "बाड़मेर, राजस्थान",
    aadharNo: "4714 2163 8388",
    panNo: "BSAPC1519H",
    dob: "15/10/1993",
    qualification: "B.Ed., ITI, RSCIT",
    experience: "N/A",
    email: "jagdishbrijwal05@gmail.com",
    phone: "9680349688",
    description: "शिक्षा क्षेत्र में विशेषज्ञता। तकनीकी और शैक्षणिक योग्यता।"
  }
];

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  const getPositionColor = (position: string) => {
    if (position.includes('संस्थापक') || position.includes('प्रबंध निदेशक')) return 'bg-purple-100 text-purple-800';
    if (position.includes('अध्यक्ष') || position.includes('निदेशक')) return 'bg-blue-100 text-blue-800';
    if (position.includes('कोषाध्यक्ष')) return 'bg-green-100 text-green-800';
    if (position.includes('ट्रस्टी')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center">
              <Users className="w-12 h-12 mr-4" />
              हमारी टीम
            </h1>
            <p className="text-xl mb-8">
              समाज सेवा के लिए समर्पित हमारे अनुभवी और योग्य सदस्यगण
            </p>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              मैनेजमेंट टीम
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              हमारी टीम अनुभवी और समर्पित व्यक्तियों से मिलकर बनी है जो समाज सेवा के लिए प्रतिबद्ध हैं
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleMemberClick(member)}
              >
                <div className="relative h-48 bg-gray-200">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/300/200";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={getPositionColor(member.position)}>
                      {member.position.split('/')[0].trim()}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-800 text-center">
                    {member.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 text-center">
                    {member.position}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{member.village}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{member.qualification}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMemberClick(member);
                      }}
                    >
                      विस्तार से देखें
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto w-full">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    {selectedMember.image ? (
                      <img
                        src={selectedMember.image}
                        alt={selectedMember.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {selectedMember.name}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {selectedMember.position}
                    </p>
                    <Badge className={getPositionColor(selectedMember.position)}>
                      {selectedMember.position.split('/')[0].trim()}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={closeModal}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Member Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    व्यक्तिगत जानकारी
                  </h4>
                  <div className="space-y-3 text-sm">
                    {selectedMember.fatherName && (
                      <div>
                        <strong>पिता का नाम:</strong> {selectedMember.fatherName}
                      </div>
                    )}
                    {selectedMember.dob !== 'N/A' && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <strong>जन्म तिथि:</strong> {selectedMember.dob}
                      </div>
                    )}
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>पता:</strong><br />
                        {selectedMember.village}<br />
                        {selectedMember.district}
                        {selectedMember.pincode && ` - ${selectedMember.pincode}`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    संपर्क जानकारी
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <strong>फोन:</strong>
                      <a href={`tel:${selectedMember.phone}`} className="ml-2 text-blue-600 hover:underline">
                        {selectedMember.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <strong>ईमेल:</strong>
                      <a href={`mailto:${selectedMember.email}`} className="ml-2 text-blue-600 hover:underline break-all">
                        {selectedMember.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Educational & Professional */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    शैक्षणिक योग्यता
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>योग्यता:</strong> {selectedMember.qualification}
                    </div>
                    {selectedMember.experience !== 'N/A' && (
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        <strong>अनुभव:</strong> {selectedMember.experience}
                      </div>
                    )}
                  </div>
                </div>

                {/* Official Documents */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    दस्तावेज़ जानकारी
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>आधार नंबर:</strong> {selectedMember.aadharNo}
                    </div>
                    {selectedMember.panNo !== 'N/A' && (
                      <div>
                        <strong>PAN नंबर:</strong> {selectedMember.panNo}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedMember.description && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    विवरण
                  </h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {selectedMember.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6 pt-4 border-t">
                <Button
                  onClick={() => window.open(`tel:${selectedMember.phone}`)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  कॉल करें
                </Button>
                <Button
                  onClick={() => window.open(`mailto:${selectedMember.email}`)}
                  variant="outline"
                  className="flex-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  ईमेल भेजें
                </Button>
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="flex-1"
                >
                  बंद करें
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}