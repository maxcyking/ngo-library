"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Download, Users, Clock, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export function LibraryShowcase() {
  const libraryStats = [
    { icon: <BookOpen className="w-6 h-6" />, count: "2000+", label: "पुस्तकें उपलब्ध" },
    { icon: <Users className="w-6 h-6" />, count: "500+", label: "सक्रिय सदस्य" },
    { icon: <Download className="w-6 h-6" />, count: "1000+", label: "मासिक इश्यू" },
    { icon: <Star className="w-6 h-6" />, count: "4.9/5", label: "सदस्य रेटिंग" }
  ];

  const bookCategories = [
    { name: "धार्मिक साहित्य", count: 450, color: "bg-orange-100 text-orange-800" },
    { name: "शैक्षणिक पुस्तकें", count: 680, color: "bg-blue-100 text-blue-800" },
    { name: "उपन्यास", count: 320, color: "bg-purple-100 text-purple-800" },
    { name: "बाल साहित्य", count: 280, color: "bg-green-100 text-green-800" },
    { name: "विज्ञान", count: 180, color: "bg-red-100 text-red-800" },
    { name: "इतिहास", count: 90, color: "bg-yellow-100 text-yellow-800" }
  ];

  const featuredBooks = [
    {
      title: "श्रीमद्भगवद्गीता",
      author: "महर्षि वेदव्यास",
      category: "धार्मिक साहित्य",
      available: true,
      rating: 5,
      description: "भगवान श्रीकृष्ण द्वारा अर्जुन को दिया गया अमर उपदेश"
    },
    {
      title: "गणित - कक्षा 10",
      author: "NCERT",
      category: "शैक्षणिक पुस्तकें",
      available: true,
      rating: 4,
      description: "कक्षा 10 के लिए गणित की पाठ्यपुस्तक"
    },
    {
      title: "कामायनी",
      author: "जयशंकर प्रसाद",
      category: "कविता संग्रह",
      available: false,
      rating: 5,
      description: "हिंदी साहित्य का अमर महाकाव्य"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            📚 हमारा पुस्तकालय
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            2000+ पुस्तकों का विशाल संग्रह - निःशुल्क सदस्यता और आधुनिक सुविधाएं
          </p>
        </div>

        {/* Library Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {libraryStats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="text-blue-600 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.count}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Book Categories */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              📖 पुस्तक श्रेणियां
            </h3>
            <div className="space-y-4">
              {bookCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center">
                    <Badge className={`${category.color} mr-3`}>
                      {category.count}
                    </Badge>
                    <span className="font-medium text-gray-800">{category.name}</span>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(category.count / 680) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Books */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              ⭐ लोकप्रिय पुस्तकें
            </h3>
            <div className="space-y-4">
              {featuredBooks.map((book, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800 line-clamp-1">
                        {book.title}
                      </h4>
                      <Badge
                        variant={book.available ? "success" : "destructive"}
                        className="text-xs"
                      >
                        {book.available ? "उपलब्ध" : "इश्यू में"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      लेखक: {book.author}
                    </p>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {book.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[...Array(book.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({book.rating}/5)</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {book.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Library Services */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            🎯 पुस्तकालय सेवाएं
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">निःशुल्क सदस्यता</h4>
              <p className="text-sm text-gray-600">
                कोई शुल्क नहीं, केवल पहचान पत्र की आवश्यकता
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">डिजिटल कैटलॉग</h4>
              <p className="text-sm text-gray-600">
                ऑनलाइन पुस्तक खोज और उपलब्धता जांच
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">लचीला समय</h4>
              <p className="text-sm text-gray-600">
                सुबह 9:00 से शाम 6:00 तक खुला
              </p>
            </div>
          </div>
        </div>

        {/* New Library Building */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                🏗️ नया पुस्तकालय भवन आ रहा है!
              </h3>
              <p className="text-green-100 mb-4">
                35 लाख रुपए की लागत से बन रहा आधुनिक पुस्तकालय भवन जून 2024 में तैयार होगा।
              </p>
              <ul className="space-y-2 text-sm text-green-100 mb-6">
                <li>✓ 5000+ पुस्तकों की क्षमता</li>
                <li>✓ डिजिटल लाइब्रेरी सेक्शन</li>
                <li>✓ 100 व्यक्तियों का रीडिंग हॉल</li>
                <li>✓ सेमिनार हॉल और कंप्यूटर लैब</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" size="lg">
                  प्रगति देखें
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-green-600">
                  दान करें
                </Button>
              </div>
            </div>
            <div className="text-center">
              <img
                src="/api/placeholder/400/300"
                alt="नया पुस्तकालय भवन"
                className="rounded-lg shadow-lg w-full h-auto"
              />
              <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">75%</div>
                <div className="text-sm">निर्माण पूर्ण</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/library">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                पुस्तक सूची देखें
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                लाइब्रेरी कार्ड के लिए आवेदन करें
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}