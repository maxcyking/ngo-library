"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  location: string;
  message: string;
  rating: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date | { seconds: number; nanoseconds: number };
}

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'testimonials'),
      where('isActive', '==', true),
      orderBy('isFeatured', 'desc'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Testimonial[];
      
      setTestimonials(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">प्रशंसापत्र लोड हो रहे हैं...</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            💬 लोगों की आवाज़
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            हमारी सेवाओं से जुड़े लोगों के अनुभव और विचार
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <Card className="mx-4 hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="text-center">
                        {/* Quote Icon */}
                        <div className="mb-6">
                          <Quote className="w-12 h-12 text-green-500 mx-auto opacity-50" />
                        </div>

                        {/* Rating */}
                        <div className="flex justify-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>

                        {/* Message */}
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed italic">
                          &ldquo;{testimonial.message}&rdquo;
                        </p>

                        {/* Profile */}
                        <div className="flex items-center justify-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            <img
                              src="/api/placeholder/64/64"
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-800 text-lg">
                              {testimonial.name}
                            </h4>
                            <p className="text-green-600 font-medium">
                              {testimonial.designation}
                            </p>
                            {testimonial.location && (
                              <p className="text-gray-500 text-sm">
                                📍 {testimonial.location}
                              </p>
                            )}
                            {testimonial.isFeatured && (
                              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-1">
                                फीचर्ड
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-green-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">500+</div>
            <div className="text-gray-600">संतुष्ट सदस्य</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">4.9/5</div>
            <div className="text-gray-600">औसत रेटिंग</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">95%</div>
            <div className="text-gray-600">सिफारिश दर</div>
          </div>
        </div>
      </div>
    </section>
  );
}