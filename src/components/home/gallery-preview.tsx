"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
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

export function GalleryPreview() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'media'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(6)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MediaItem[];
      
      setMediaItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">गैलरी लोड हो रही है...</p>
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">कोई मीडिया आइटम उपलब्ध नहीं है</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mediaItems.map((item, index) => (
              <Card 
                key={item.id} 
                className={`overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className={`relative bg-gray-200 ${index === 0 ? 'h-64 md:h-full' : 'h-48'}`}>
                  <img
                    src={item.imageUrl || "/api/placeholder/600/400"}
                    alt={item.title}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setSelectedImage(item.imageUrl)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="opacity-0 hover:opacity-100 transition-opacity duration-300"
                      onClick={() => setSelectedImage(item.imageUrl)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      देखें
                    </Button>
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
                  {item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span key={tagIndex} className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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