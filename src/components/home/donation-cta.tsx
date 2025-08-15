"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Droplets, HandHeart, CreditCard, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";

export function DonationCTA() {
  const donationTypes = [
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "रक्तदान करें",
      subtitle: "जीवन बचाएं",
      description: "आपका एक यूनिट रक्त 3 जिंदगियां बचा सकता है",
      urgency: "तत्काल आवश्यकता",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      link: "/donations",
      stats: "150+ सक्रिय रक्तदाता"
    },
    {
      icon: <HandHeart className="w-8 h-8" />,
      title: "देहदान पंजीकरण",
      subtitle: "महादान",
      description: "मृत्यु के बाद अंगदान कर अनेक जीवन दान करें",
      urgency: "नोबल कॉज़",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      link: "/donations",
      stats: "25+ पंजीकृत देहदाता"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "आर्थिक सहायता",
      subtitle: "भामाशाह बनें",
      description: "संस्था के विकास में आर्थिक योगदान दें",
      urgency: "पुस्तकालय भवन के लिए",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      link: "/donations",
      stats: "₹35 लाख का लक्ष्य"
    }
  ];

  const emergencyContact = {
    title: "आपातकालीन रक्त की आवश्यकता?",
    subtitle: "24/7 उपलब्ध सेवा",
    phone: "+91 99518 00733",
    description: "तुरंत संपर्क करें - हम आपकी मदद करेंगे"
  };

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 via-purple-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            ❤️ दान करें, जीवन बचाएं
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            आपका छोटा सा योगदान किसी के लिए नई जिंदगी का कारण बन सकता है
          </p>
        </div>

        {/* Emergency Contact Banner */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <div className="flex items-center justify-center md:justify-start mb-2">
                    <div className="animate-pulse bg-white rounded-full p-2 mr-3">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold">{emergencyContact.title}</h3>
                  </div>
                  <p className="text-red-100 mb-2">{emergencyContact.subtitle}</p>
                  <p className="text-sm text-red-100">{emergencyContact.description}</p>
                </div>
                <div className="text-center">
                  <a href={`tel:${emergencyContact.phone}`}>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="bg-white text-red-600 hover:bg-gray-100 font-bold"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      {emergencyContact.phone}
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donation Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {donationTypes.map((donation, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0"
            >
              <div className={`${donation.color} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 opacity-10 transform rotate-12 translate-x-4 -translate-y-4">
                  <div className="text-8xl">
                    {donation.icon}
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center mb-3">
                    {donation.icon}
                    <div className="ml-3">
                      <h3 className="text-xl font-bold">{donation.title}</h3>
                      <p className="text-sm opacity-90">{donation.subtitle}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-0 mb-3">
                    {donation.urgency}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {donation.description}
                </p>
                <div className="text-sm text-gray-500 mb-4 font-medium">
                  📊 {donation.stats}
                </div>
                <Link href={donation.link}>
                  <Button 
                    className={`w-full ${donation.color} ${donation.hoverColor} text-white border-0`}
                  >
                    अभी योगदान करें
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Impact Statistics */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            🎯 आपके दान का प्रभाव
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">यूनिट रक्त संग्रह</div>
              <div className="text-xs text-gray-500 mt-1">1500+ जीवन बचाए गए</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
              <div className="text-sm text-gray-600">देहदान पंजीकरण</div>
              <div className="text-xs text-gray-500 mt-1">अनगिनत जीवन दान</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">₹10L+</div>
              <div className="text-sm text-gray-600">आर्थिक सहायता</div>
              <div className="text-xs text-gray-500 mt-1">विकास कार्यों में उपयोग</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-sm text-gray-600">प्रत्यक्ष लाभार्थी</div>
              <div className="text-xs text-gray-500 mt-1">परिवारों की मदद</div>
            </div>
          </div>
        </div>

        {/* Bank Details Quick Access */}
        <div className="mt-8 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-green-50 border-0">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                💳 त्वरित आर्थिक सहायता
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>बैंक:</strong> Punjab National Bank<br />
                  <strong>खाता:</strong> 9657001000035037
                </div>
                <div>
                  <strong>IFSC:</strong> PUNB0965700<br />
                  <strong>नाम:</strong> एरोग्या पुस्तकालय एवं सेवा संस्था
                </div>
              </div>
              <Link href="/contact">
                <Button variant="outline" className="mt-4">
                  पूरी बैंक जानकारी देखें
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}