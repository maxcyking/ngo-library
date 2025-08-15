"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Heart, Calendar } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/constants";

interface StatItem {
  icon: React.ReactNode;
  count: string;
  label: string;
  color: string;
}

export function QuickStats() {
  const stats: StatItem[] = [
    {
      icon: <Users className="w-8 h-8" />,
      count: ACHIEVEMENTS.totalMembers,
      label: "सक्रिय सदस्य",
      color: "text-blue-600",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      count: ACHIEVEMENTS.booksInLibrary,
      label: "पुस्तकें उपलब्ध",
      color: "text-green-600",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      count: ACHIEVEMENTS.bloodDonors,
      label: "रक्तदाता",
      color: "text-red-600",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      count: ACHIEVEMENTS.eventsOrganized,
      label: "कार्यक्रम आयोजित",
      color: "text-purple-600",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            हमारी उपलब्धियां
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            आंकड़ों में देखें कि हमने समाज सेवा के क्षेत्र में कैसे योगदान दिया है
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-md"
            >
              <CardContent className="p-8">
                <div className={`${stat.color} mb-4 flex justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {stat.count}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}