"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, User, LogIn, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PUBLIC_NAVIGATION } from "@/lib/constants";
import { useSettings } from "@/contexts/SettingsContext";
import { ApplicationStrip } from "@/components/layout/application-strip";

interface HeaderProps {
  userRole?: 'guest' | 'user' | 'admin';
}

export function Header({ userRole = 'guest' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings, loading } = useSettings();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Yellow Top Strip with Donate Button */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 py-2 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-sm md:text-base font-bold text-gray-900 flex items-center">
              <span className="mr-2">❤️</span>
              <span className="hidden md:inline">"एक रोटी कम खाओ लेकिन बच्चों को जरूर पढ़ाओ!"</span>
              <span className="md:hidden">शिक्षा दान करें</span>
            </div>
            <Link href="/donate">
              <Button 
                size="sm" 
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse"
              >
                <Heart className="w-4 h-4 mr-2" />
                दान करें
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <header className="bg-white shadow-md sticky top-10 z-40">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <div className="text-sm text-gray-600">
              📞 {settings.phone} | ✉️ {settings.email}
            </div>
            <div className="flex items-center space-x-4">
              {userRole === 'guest' ? (
                <Link href="/login">
                  <Button variant="outline" size="sm" className="text-sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    लॉगिन
                  </Button>
                </Link>
              ) : (
                <Link href={userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard'}>
                  <Button variant="outline" size="sm" className="text-sm">
                    <User className="w-4 h-4 mr-2" />
                    डैशबोर्ड
                  </Button>
                </Link>
              )}
            </div>
          </div>

        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            {settings.logo ? (
              <img 
                src={settings.logo} 
                alt={settings.siteName}
                className="w-12 h-12 object-contain rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🕉️</span>
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-green-800">{settings.siteName}</h1>
              <p className="text-xs text-gray-600">{settings.tagline}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {PUBLIC_NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {PUBLIC_NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
    
    {/* Application Strip */}
    <ApplicationStrip />
    </>
  );
}