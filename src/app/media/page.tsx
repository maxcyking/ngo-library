"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Image as ImageIcon, Video, Eye, X } from "lucide-react";
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  date: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date | { seconds: number; nanoseconds: number };
}

// Dummy data for fallback
const dummyMediaItems = [
  {
    id: "1",
    title: "पुस्तकालय भवन निर्माण कार्य",
    type: "image",
    category: "निर्माण कार्य",
    date: "जून 2024",
    description: "35 लाख रुपए की लागत से नए पुस्तकालय भवन का निर्माण कार्य",
    thumbnail: "/api/placeholder/400/300",
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ]
  },
  {
    id: "2",
    title: "मान मिलाप समारोह 2022",
    type: "image",
    category: "कार्यक्रम",
    date: "अगस्त 2022",
    description: "द्वितीय वार्षिकोत्सव पर सामाजिक कार्यकर्ताओं का सम्मान समारोह",
    thumbnail: "/api/placeholder/400/300",
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ]
  },
  {
    id: "3",
    title: "रक्तदान शिविर जुलाई 2022",
    type: "image",
    category: "स्वास्थ्य सेवा",
    date: "जुलाई 2022",
    description: "50+ रक्तदाताओं ने रक्तदान कर जीवन दान का पुण्य कार्य किया",
    thumbnail: "/api/placeholder/400/300",
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ]
  },
  {
    id: "4",
    title: "स्वास्थ्य जांच शिविर",
    type: "image",
    category: "स्वास्थ्य सेवा",
    date: "मई 2022",
    description: "निःशुल्क स्वास्थ्य जांच शिविर में 200+ लोगों की जांच",
    thumbnail: "/api/placeholder/400/300",
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ]
  },
  {
    id: "5",
    title: "महिला जागरूकता कार्यक्रम",
    type: "image",
    category: "सामाजिक कार्यक्रम",
    date: "मार्च 2022",
    description: "महिला सशक्तिकरण और जागरूकता कार्यक्रम का आयोजन",
    thumbnail: "/api/placeholder/400/300",
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ]
  },
  {
    id: "6",
    title: "शिक्षा सामग्री वितरण",
    type: "image",
    category: "शिक्षा",
    date: "फरवरी 2022",
    description: "गरीब बच्चों को निःशुल्क शिक्षा सामग्री का वितरण",
    thumbnail: "/api/placeholder/400/300",
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ]
  }
];

const dummyNewsItems = [
  {
    id: "1",
    title: "पुस्तकालय भवन निर्माण कार्य जून 2024 तक पूर्ण",
    date: "15 मई 2024",
    category: "निर्माण अपडेट",
    excerpt: "35 लाख रुपए की लागत से बन रहे नए पुस्तकालय भवन का निर्माण कार्य तेजी से प्रगति पर है।",
    image: "/api/placeholder/400/250"
  },
  {
    id: "2",
    title: "मासिक रक्तदान शिविर का सफल आयोजन",
    date: "10 मई 2024",
    category: "स्वास्थ्य सेवा",
    excerpt: "इस महीने के रक्तदान शिविर में 45 रक्तदाताओं ने भाग लिया और रक्तदान किया।",
    image: "/api/placeholder/400/250"
  },
  {
    id: "3",
    title: "निःशुल्क स्वास्थ्य जांच शिविर का आयोजन",
    date: "5 मई 2024",
    category: "स्वास्थ्य सेवा",
    excerpt: "गांव में आयोजित स्वास्थ्य जांच शिविर में 150+ लोगों की निःशुल्क जांच की गई।",
    image: "/api/placeholder/400/250"
  }
];

const categories = [
  "सभी",
  "गैलरी (Gallery)",
  "समाचार (News)"
];

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState("gallery");
  const [selectedCategory, setSelectedCategory] = useState("सभी");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'media'),
        where('isActive', '==', true),
        where('category', '==', 'गैलरी (Gallery)'), // Only fetch gallery images
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MediaItem[];
      
      setMediaItems(items);
    } catch (error) {
      console.error('Error fetching media:', error);
      setMediaItems(dummyMediaItems as any);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = mediaItems; // No category filter needed, only gallery images

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              📸 मीडिया गैलरी
            </h1>
            <p className="text-xl mb-8">
              हमारे कार्यक्रम, गतिविधियां और उपलब्धियों की तस्वीरें और समाचार
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant={activeTab === "gallery" ? "default" : "outline"}
                onClick={() => setActiveTab("gallery")}
                className="flex items-center"
              >
                <ImageIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                फोटो गैलरी
              </Button>
              <Button
                variant={activeTab === "news" ? "default" : "outline"}
                onClick={() => setActiveTab("news")}
                className="flex items-center"
              >
                <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                समाचार
              </Button>
              <Button
                variant={activeTab === "videos" ? "default" : "outline"}
                onClick={() => setActiveTab("videos")}
                className="flex items-center"
              >
                <Video className="w-4 h-4 mr-2" aria-hidden="true" />
                वीडियो
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      {activeTab === "gallery" && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">लोड हो रहा है...</p>
                </div>
              )}

              {/* Instagram Style Gallery Grid */}
              {!loading && filteredMedia.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
                      onClick={() => setSelectedImage(item.imageUrl)}
                    >
                      <img
                        src={item.imageUrl || item.thumbnailUrl}
                        alt={item.title || 'Gallery image'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
                          <Eye className="w-8 h-8 mx-auto mb-2" />
                          {item.description && (
                            <p className="text-sm font-medium line-clamp-2">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredMedia.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    गैलरी खाली है
                  </h3>
                  <p className="text-gray-600">
                    अभी तक कोई तस्वीर अपलोड नहीं की गई है
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* News Section */}
      {activeTab === "news" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                📰 नवीनतम समाचार
              </h2>

              <div className="space-y-8">
                {dummyNewsItems.map((news) => (
                  <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-2 p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {news.category}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {news.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          {news.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {news.excerpt}
                        </p>
                        <Button variant="outline" size="sm">
                          पूरा पढ़ें
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Videos Section */}
      {activeTab === "videos" && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                🎥 वीडियो गैलरी
              </h2>
              
              <Card className="p-12">
                <div className="text-center text-gray-500">
                  <Video className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">वीडियो जल्द आ रहे हैं</h3>
                  <p>हमारे कार्यक्रमों और गतिविधियों के वीडियो जल्द ही यहाँ उपलब्ध होंगे।</p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Gallery Image"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <Button
            variant="secondary"
            className="absolute top-4 right-4"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </Button>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              हमारे कार्यक्रमों में भाग लें
            </h2>
            <p className="text-xl mb-8">
              आगामी कार्यक्रमों की जानकारी के लिए हमसे जुड़े रहें
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                व्हाट्सऐप ग्रुप ज्वाइन करें
              </Button>
              <Button size="lg" variant="secondary">
                फेसबुक पेज फॉलो करें
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}