"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  message: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "राजेश कुमार शर्मा",
    role: "पुस्तकालय सदस्य",
    location: "गुडामलानी",
    message: "एरोग्या पुस्तकालय ने मेरे बच्चों की शिक्षा में बहुत योगदान दिया है। यहाँ की निःशुल्क सेवा वास्तव में सराहनीय है। पुस्तकों का संग्रह बहुत अच्छा है और स्टाफ भी बहुत सहयोगी है।",
    rating: 5,
    image: "/testimonials/rajesh-sharma.jpg"
  },
  {
    id: "2",
    name: "सुनीता देवी",
    role: "रक्तदाता",
    location: "बाड़मेर",
    message: "मैंने यहाँ कई बार रक्तदान किया है। संस्था की टीम बहुत professional है और सभी safety measures का पूरा ध्यान रखती है। रक्तदान के बाद मिलने वाली स्वास्थ्य जांच भी बहुत उपयोगी है।",
    rating: 5,
    image: "/testimonials/sunita-devi.jpg"
  },
  {
    id: "3",
    name: "मोहन लाल जी",
    role: "स्वास्थ्य शिविर लाभार्थी",
    location: "गुडामलानी",
    message: "स्वास्थ्य शिविर में मुझे मधुमेह का पता चला। डॉक्टरों ने बहुत अच्छी सलाह दी और निःशुल्क दवाएं भी मिलीं। इस संस्था का काम वास्तव में जीवन बचाने वाला है।",
    rating: 5,
    image: "/testimonials/mohan-lal.jpg"
  },
  {
    id: "4",
    name: "प्रीति शर्मा",
    role: "महिला सशक्तिकरण कार्यक्रम",
    location: "जोधपुर",
    message: "महिला सशक्तिकरण कार्यक्रम में भाग लेकर मैंने सिलाई-कढ़ाई सीखी। अब मैं घर बैठे अच्छी कमाई कर रही हूँ। यह संस्था महिलाओं के लिए वरदान है।",
    rating: 5,
    image: "/testimonials/preeti-sharma.jpg"
  },
  {
    id: "5",
    name: "अमित कुमार",
    role: "युवा स्वयंसेवक",
    location: "गुडामलानी",
    message: "इस संस्था के साथ जुड़कर मुझे समाज सेवा का अवसर मिला। यहाँ के कार्यक्रमों में भाग लेकर मैंने बहुत कुछ सीखा है। युवाओं के लिए यह एक बेहतरीन platform है।",
    rating: 5,
    image: "/testimonials/amit-kumar.jpg"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

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
                              {testimonial.role}
                            </p>
                            <p className="text-gray-500 text-sm">
                              📍 {testimonial.location}
                            </p>
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