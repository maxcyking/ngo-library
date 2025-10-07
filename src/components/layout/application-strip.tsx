"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAvailableSeats, TOTAL_LIBRARY_SEATS } from "@/lib/seatAvailability";

export function ApplicationStrip() {
  const [availableSeats, setAvailableSeats] = useState<number>(TOTAL_LIBRARY_SEATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const seats = await getAvailableSeats();
        setAvailableSeats(seats);
      } catch (error) {
        console.error('Error fetching available seats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
    
    // Refresh seat count every 30 seconds
    const interval = setInterval(fetchSeats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const occupiedSeats = TOTAL_LIBRARY_SEATS - availableSeats;
  const occupancyPercentage = (occupiedSeats / TOTAL_LIBRARY_SEATS) * 100;

  return (
    <div className="bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 text-white py-3 sticky top-20 z-30 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Seat Information */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5" />
              <span className="font-semibold">पुस्तकालय सदस्यता</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">
                  {loading ? (
                    <span className="animate-pulse">लोड हो रहा है...</span>
                  ) : (
                    <>
                      <span className="font-bold text-yellow-300">{availableSeats}</span>
                      <span className="text-blue-100">/{TOTAL_LIBRARY_SEATS} सीटें उपलब्ध</span>
                    </>
                  )}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-32 bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    occupancyPercentage > 90 ? 'bg-red-400' : 
                    occupancyPercentage > 70 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                  style={{ width: `${occupancyPercentage}%` }}
                ></div>
              </div>
              
              <span className="text-xs text-blue-100">
                {occupancyPercentage.toFixed(0)}% भरा
              </span>
            </div>
          </div>

          {/* Right Side - Application Button */}
          <div className="flex items-center space-x-3">
            {availableSeats === 0 ? (
              <div className="flex items-center space-x-2 bg-red-500 bg-opacity-20 px-4 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-300" />
                <span className="text-sm font-medium text-red-100">सीटें भर गई हैं</span>
              </div>
            ) : (
              <>
                <div className="hidden md:block text-sm text-blue-100">
                  जल्दी करें! केवल <span className="font-bold text-yellow-300">{availableSeats}</span> सीटें बची हैं
                </div>
                <Link href="/apply">
                  <Button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    आवेदन करें
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Seat Info */}
        <div className="md:hidden mt-2 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>
              {loading ? (
                <span className="animate-pulse">लोड हो रहा है...</span>
              ) : (
                <>
                  <span className="font-bold text-yellow-300">{availableSeats}</span>
                  <span className="text-blue-100">/{TOTAL_LIBRARY_SEATS} सीटें</span>
                </>
              )}
            </span>
          </div>
          <div className="w-24 bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                occupancyPercentage > 90 ? 'bg-red-400' : 
                occupancyPercentage > 70 ? 'bg-yellow-400' : 'bg-green-400'
              }`}
              style={{ width: `${occupancyPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}