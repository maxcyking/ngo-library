"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  imageCount: number;
  thumbnail: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "पुस्तकालय भवन निर्माण कार्य",
    category: "निर्माण कार्य",
    date: "जून 2024",
    imageCount: 15,
    thumbnail: "/gallery/library-construction.jpg",
    description: "35 लाख रुपए की लागत से नए पुस्तकालय भवन का निर्माण"
  },
  {
    id: "2",
    title: "मान मिलाप समारोह 2022",
    category: "कार्यक्रम",
    date: "अगस्त 2022",
    imageCount: 25,
    thumbnail: "/gallery/maan-milap.jpg",
    description: "द्वितीय वार्षिकोत्सव पर सामाजिक कार्यकर्ताओं का सम्मान"
  },
  {
    id: "3",
    title: "रक्तदान शिविर जुलाई 2022",
    category: "स्वास्थ्य सेवा",
    date: "जुलाई 2022",
    imageCount: 12,
    thumbnail: "/gallery/blood-donation.jpg",
    description: "50+ रक्तदाताओं ने रक्तदान कर जीवन दान का पुण्य कार्य"
  },
  {
    id: "4",
    title: "महिला सशक्तिकरण कार्यशाला",
    category: "सामाजिक कार्यक्रम",
    date: "मार्च 2022",
    imageCount: 18,
    thumbnail: "/gallery/women-empowerment.jpg",
    description: "महिलाओं के लिए कौशल विकास और जागरूकता कार्यक्रम"
  },
  {
    id: "5",
    title: "स्वास्थ्य जांच शिविर",
    category: "स्वास्थ्य सेवा",
    date: "फरवरी 2022",
    imageCount: 20,
    thumbnail: "/gallery/health-camp.jpg",
    description: "निःशुल्क स्वास्थ्य जांच में 200+ लोगों की जांच"
  },
  {
    id: "6",
    title: "वृक्षारोपण अभियान",
    category: "पर्यावरण",
    date: "जनवरी 2022",
    imageCount: 10,
    thumbnail: "/gallery/tree-plantation.jpg",
    description: "पर्यावरण संरक्षण के लिए 500+ पेड़ों का रोपण"
  }
];

export function GalleryPreview() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            📸 फोटो गैलरी
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            हमारे कार्यक्रमों और गतिविधियों की झलकियां
          </p>
        </div>

        {/* Featured Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryItems.map((item, index) => (
            <Card 
              key={item.id} 
              className={`overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`relative bg-gray-200 ${index === 0 ? 'h-64 md:h-full' : 'h-48'}`}>
                <img
                  src="/api/placeholder/600/400"
                  alt={item.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setSelectedImage(item.thumbnail)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="opacity-0 hover:opacity-100 transition-opacity duration-300"
                    onClick={() => setSelectedImage(item.thumbnail)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    देखें
                  </Button>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="text-xs">
                    {item.imageCount} तस्वीरें
                  </Badge>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="text-xs bg-white">
                    {item.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  {item.date}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/media">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              सभी तस्वीरें देखें
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl max-h-full">
              <img
                src="/api/placeholder/800/600"
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
      </div>
    </section>
  );
}